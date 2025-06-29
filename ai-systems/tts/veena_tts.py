"""
Veena TTS System with Built-in API Server
"""

import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
from snac import SNAC
import soundfile as sf
from pathlib import Path
from typing import Optional, List
import numpy as np
import json
import uuid
from datetime import datetime
from http.server import HTTPServer
import io
import base64
import threading

# Import shared utilities and config
import sys
sys.path.append(str(Path(__file__).parent.parent))
from config.settings import *
from utils.api_utils import BaseAPIHandler, get_gpu_info, optimize_for_gpu


class VeenaTTS:
    """Veena Text-to-Speech System"""
    
    # Control token IDs (fixed for Veena)
    START_OF_SPEECH_TOKEN = 128257
    END_OF_SPEECH_TOKEN = 128258
    START_OF_HUMAN_TOKEN = 128259
    END_OF_HUMAN_TOKEN = 128260
    START_OF_AI_TOKEN = 128261
    END_OF_AI_TOKEN = 128262
    AUDIO_CODE_BASE_OFFSET = 128266
    
    def __init__(self, use_quantization: bool = True, device: str = "auto"):
        """Initialize Veena TTS system"""
        self.model_name = "maya-research/veena"
        self.use_quantization = use_quantization
        self.device = device
        
        print("Initializing Veena TTS system...")
        optimize_for_gpu()
        self._load_model()
        self._load_snac()
        print("✓ Veena TTS system ready!")
    
    def _load_model(self):
        """Load the Veena model and tokenizer"""
        print("Loading Veena model...")
        
        if torch.cuda.is_available() and self.device == "auto":
            device_map = "cuda"
        else:
            device_map = self.device
        
        if self.use_quantization and torch.cuda.is_available():
            quantization_config = BitsAndBytesConfig(
                load_in_4bit=True,
                bnb_4bit_quant_type="nf4",
                bnb_4bit_compute_dtype=torch.bfloat16,
                bnb_4bit_use_double_quant=True,
            )
            
            self.model = AutoModelForCausalLM.from_pretrained(
                self.model_name,
                quantization_config=quantization_config,
                device_map=device_map,
                trust_remote_code=True,
            )
        else:
            self.model = AutoModelForCausalLM.from_pretrained(
                self.model_name,
                device_map=device_map,
                trust_remote_code=True,
            )
        
        self.tokenizer = AutoTokenizer.from_pretrained(
            self.model_name, 
            trust_remote_code=True
        )
        
        print("✓ Veena model loaded")
    
    def _load_snac(self):
        """Load SNAC audio decoder"""
        print("Loading SNAC decoder...")
        self.snac_model = SNAC.from_pretrained("hubertsiuzdak/snac_24khz").eval()
        
        if torch.cuda.is_available():
            self.snac_model = self.snac_model.cuda()
        
        print("✓ SNAC decoder loaded")
    
    def generate_speech(
        self, 
        text: str, 
        speaker: str = TTS_DEFAULT_SPEAKER, 
        temperature: float = 0.4, 
        top_p: float = 0.9
    ) -> np.ndarray:
        """Generate speech from text"""
        if speaker not in TTS_AVAILABLE_SPEAKERS:
            raise ValueError(f"Speaker must be one of {TTS_AVAILABLE_SPEAKERS}")
        
        print(f"Generating speech with speaker '{speaker}'...")
        
        # Prepare input with speaker token
        prompt = f"<spk_{speaker}> {text}"
        prompt_tokens = self.tokenizer.encode(prompt, add_special_tokens=False)
        
        # Construct full sequence
        input_tokens = [
            self.START_OF_HUMAN_TOKEN,
            *prompt_tokens,
            self.END_OF_HUMAN_TOKEN,
            self.START_OF_AI_TOKEN,
            self.START_OF_SPEECH_TOKEN
        ]
        
        input_ids = torch.tensor([input_tokens], device=self.model.device)
        max_tokens = min(int(len(text) * 1.3) * 7 + 21, 700)
        
        # Generate audio tokens
        with torch.no_grad():
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
            
            output = self.model.generate(
                input_ids,
                max_new_tokens=max_tokens,
                do_sample=True,
                temperature=temperature,
                top_p=top_p,
                repetition_penalty=1.05,
                pad_token_id=self.tokenizer.pad_token_id,
                eos_token_id=[self.END_OF_SPEECH_TOKEN, self.END_OF_AI_TOKEN]
            )
            
            if torch.cuda.is_available():
                torch.cuda.empty_cache()
        
        # Extract SNAC tokens
        generated_ids = output[0][len(input_tokens):].tolist()
        snac_tokens = [
            token_id for token_id in generated_ids
            if self.AUDIO_CODE_BASE_OFFSET <= token_id < (self.AUDIO_CODE_BASE_OFFSET + 7 * 4096)
        ]
        
        if not snac_tokens:
            raise ValueError("No audio tokens generated")
        
        # Decode audio
        audio = self._decode_snac_tokens(snac_tokens)
        print("✓ Speech generated successfully")
        
        return audio
    
    def _decode_snac_tokens(self, snac_tokens: List[int]) -> np.ndarray:
        """De-interleave and decode SNAC tokens to audio"""
        if not snac_tokens or len(snac_tokens) % 7 != 0:
            raise ValueError("Invalid SNAC tokens")
        
        # De-interleave tokens into 3 hierarchical levels
        codes_lvl = [[] for _ in range(3)]
        llm_codebook_offsets = [self.AUDIO_CODE_BASE_OFFSET + i * 4096 for i in range(7)]
        
        for i in range(0, len(snac_tokens), 7):
            codes_lvl[0].append(snac_tokens[i] - llm_codebook_offsets[0])
            codes_lvl[1].append(snac_tokens[i+1] - llm_codebook_offsets[1])
            codes_lvl[1].append(snac_tokens[i+4] - llm_codebook_offsets[4])
            codes_lvl[2].append(snac_tokens[i+2] - llm_codebook_offsets[2])
            codes_lvl[2].append(snac_tokens[i+3] - llm_codebook_offsets[3])
            codes_lvl[2].append(snac_tokens[i+5] - llm_codebook_offsets[5])
            codes_lvl[2].append(snac_tokens[i+6] - llm_codebook_offsets[6])
        
        # Convert to tensors for SNAC decoder
        hierarchical_codes = []
        snac_device = next(self.snac_model.parameters()).device
        
        for lvl_codes in codes_lvl:
            tensor = torch.tensor(lvl_codes, dtype=torch.int32, device=snac_device).unsqueeze(0)
            hierarchical_codes.append(tensor)
        
        # Decode with SNAC
        with torch.no_grad():
            audio_hat = self.snac_model.decode(hierarchical_codes)
        
        return audio_hat.squeeze().clamp(-1, 1).cpu().numpy()
    
    def text_to_speech(
        self, 
        text: str, 
        output_path: Optional[str] = None, 
        speaker: str = TTS_DEFAULT_SPEAKER,
        return_base64: bool = False
    ) -> dict:
        """Convert text to speech and return response"""
        audio = self.generate_speech(text, speaker)
        duration = len(audio) / TTS_SAMPLE_RATE
        
        response = {
            "success": True,
            "duration": duration,
            "sample_rate": TTS_SAMPLE_RATE,
            "speaker": speaker,
            "text_length": len(text)
        }
        
        if return_base64:
            buffer = io.BytesIO()
            sf.write(buffer, audio, TTS_SAMPLE_RATE, format='WAV')
            buffer.seek(0)
            audio_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
            response["audio_base64"] = audio_base64
        
        if output_path:
            Path(output_path).parent.mkdir(parents=True, exist_ok=True)
            sf.write(output_path, audio, TTS_SAMPLE_RATE)
            response["file_path"] = output_path
        
        return response


class TTSRequestHandler(BaseAPIHandler):
    """HTTP request handler for TTS API"""
    
    def do_POST(self):
        """Handle POST requests"""
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            request_data = json.loads(post_data.decode('utf-8'))
            
            # Extract parameters
            text = request_data.get('text', '').strip()
            if not text:
                self.send_error_response(400, "Text parameter is required")
                return
            
            speaker = request_data.get('speaker', TTS_DEFAULT_SPEAKER)
            return_base64 = request_data.get('return_base64', True)
            save_file = request_data.get('save_file', False)
            
            # Validate speaker
            if speaker not in TTS_AVAILABLE_SPEAKERS:
                self.send_error_response(400, f"Invalid speaker. Supported: {TTS_AVAILABLE_SPEAKERS}")
                return
            
            # Generate speech
            output_path = None
            if save_file:
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                audio_id = str(uuid.uuid4())[:8]
                output_path = GENERATED_AUDIO_DIR / f"tts_{speaker}_{timestamp}_{audio_id}.wav"
            
            response = tts_instance.text_to_speech(
                text=text,
                speaker=speaker,
                output_path=str(output_path) if output_path else None,
                return_base64=return_base64
            )
            
            self.send_json_response(response)
            
        except Exception as e:
            print(f"Error handling request: {e}")
            self.send_error_response(500, f"Internal server error: {str(e)}")
    
    def do_GET(self):
        """Handle GET requests"""
        if self.path == '/health':
            response = {
                "status": "healthy",
                "service": "Veena TTS",
                "supported_speakers": TTS_AVAILABLE_SPEAKERS,
                "gpu_info": get_gpu_info()
            }
            self.send_json_response(response)
        else:
            self.send_error_response(404, "Not found")


# Global TTS instance
tts_instance = None

def initialize_tts():
    """Initialize TTS instance"""
    global tts_instance
    print("Initializing TTS system...")
    tts_instance = VeenaTTS()
    print("✓ TTS system initialized")

def start_server():
    """Start the TTS server"""
    server_address = (TTS_API_HOST, TTS_API_PORT)
    httpd = HTTPServer(server_address, TTSRequestHandler)
    
    print(f"TTS Server running on http://{TTS_API_HOST}:{TTS_API_PORT}")
    print("Endpoints:")
    print("  POST / - Generate TTS")
    print("  GET /health - Health check")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down TTS server...")
        httpd.shutdown()

if __name__ == "__main__":
    # Initialize TTS
    init_thread = threading.Thread(target=initialize_tts)
    init_thread.start()
    init_thread.join()
    
    # Start server
    start_server()