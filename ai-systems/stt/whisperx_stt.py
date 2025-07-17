"""
WhisperX STT System for Alzheimer's Companion
Provides accurate speech-to-text with speaker diarization and timestamps
"""

import whisperx
import torch
import numpy as np
import soundfile as sf
import io
import json
import uuid
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict, List, Any, Union
from http.server import HTTPServer
import threading
import base64
import tempfile
import os

# Import shared utilities and config
import sys
sys.path.append(str(Path(__file__).parent.parent))
from config.settings import *
from utils.api_utils import BaseAPIHandler, get_gpu_info, optimize_for_gpu


class WhisperXSTT:
    """WhisperX Speech-to-Text System optimized for Alzheimer's patients"""
    
    def __init__(
        self, 
        model_size: str = "base",
        device: str = "auto",
        compute_type: str = "float16",
        language: str = "auto"
    ):
        """
        Initialize WhisperX STT system
        
        Args:
            model_size: Whisper model size ("tiny", "base", "small", "medium", "large-v2", "large-v3")
            device: Device to use ("cuda", "cpu", "auto")
            compute_type: Computation type ("float16", "int8", "float32")
            language: Language code ("en", "hi", "auto" for auto-detection)
        """
        self.model_size = model_size
        self.device = self._get_device(device)
        self.compute_type = compute_type if self.device == "cuda" else "float32"
        self.language = language
        
        # Model components
        self.whisper_model = None
        self.align_model = None
        self.diarize_model = None
        
        # Configuration for Alzheimer's patients
        self.patient_optimizations = {
            "chunk_length": 30,          # 30-second chunks for better processing
            "min_silence_duration": 1.0,  # Longer silence detection
            "speech_pad_ms": 500,        # Padding around speech segments
            "max_new_tokens": 128,       # Limit response length
            "patience": 2.0,             # More patience for slower speech
            "temperature": 0.1           # Lower temperature for consistency
        }
        
        # Transcription history
        self.transcription_history = {}
        
        print("Initializing WhisperX STT System...")
        print(f"Model: {self.model_size}")
        print(f"Device: {self.device}")
        print(f"Compute type: {self.compute_type}")
        
        self._initialize_models()
        print("✓ WhisperX STT ready!")
    
    def _get_device(self, device: str) -> str:
        """Determine the best device to use"""
        if device == "auto":
            return "cuda" if torch.cuda.is_available() else "cpu"
        return device
    
    def _initialize_models(self):
        """Initialize WhisperX models"""
        try:
            print("Loading WhisperX transcription model...")
            
            # Load main Whisper model
            self.whisper_model = whisperx.load_model(
                self.model_size, 
                self.device, 
                compute_type=self.compute_type,
                language=self.language if self.language != "auto" else None
            )
            print(f"✓ Loaded {self.model_size} Whisper model")
            
            # Load alignment model (for word-level timestamps)
            if self.language in ["en", "auto"]:  # English alignment
                print("Loading alignment model for English...")
                self.align_model, self.align_metadata = whisperx.load_align_model(
                    language_code="en", 
                    device=self.device
                )
                print("✓ Alignment model loaded")
            
            # Initialize diarization model (speaker separation)
            print("Loading speaker diarization model...")
            try:
                self.diarize_model = whisperx.DiarizationPipeline(
                    use_auth_token=os.getenv('HF_TOKEN'),
                    device=self.device
                )
                print("✓ Diarization model loaded")
            except Exception as e:
                print(f"⚠️  Diarization model not available: {e}")
                self.diarize_model = None
            
        except Exception as e:
            print(f"❌ Error initializing WhisperX models: {e}")
            raise
    
    def transcribe_audio_file(
        self, 
        audio_path: str,
        patient_id: Optional[str] = None,
        enable_diarization: bool = True,
        enable_alignment: bool = True
    ) -> Dict[str, Any]:
        """
        Transcribe audio file with advanced features
        
        Args:
            audio_path: Path to audio file
            patient_id: Optional patient ID for context
            enable_diarization: Enable speaker separation
            enable_alignment: Enable word-level timestamps
            
        Returns:
            Transcription result with metadata
        """
        try:
            transcription_id = str(uuid.uuid4())
            start_time = datetime.now()
            
            print(f"🎤 Transcribing audio file: {audio_path}")
            
            # Load and preprocess audio
            audio_data, sample_rate = sf.read(audio_path)
            
            # Ensure mono audio
            if len(audio_data.shape) > 1:
                audio_data = np.mean(audio_data, axis=1)
            
            # Basic transcription
            print("📝 Running speech recognition...")
            result = self.whisper_model.transcribe(
                audio_data,
                batch_size=16,
                chunk_length=self.patient_optimizations["chunk_length"],
                print_progress=True
            )
            
            # Word-level alignment (if enabled and model available)
            if enable_alignment and self.align_model:
                print("🔗 Aligning words with timestamps...")
                result = whisperx.align(
                    result["segments"], 
                    self.align_model, 
                    self.align_metadata, 
                    audio_data, 
                    self.device, 
                    return_char_alignments=False
                )
            
            # Speaker diarization (if enabled and model available)
            if enable_diarization and self.diarize_model:
                print("👥 Running speaker diarization...")
                diarize_segments = self.diarize_model(audio_data)
                result = whisperx.assign_word_speakers(diarize_segments, result)
            
            # Process and enhance results for Alzheimer's patients
            processed_result = self._process_transcription_for_patients(
                result, 
                audio_path,
                patient_id
            )
            
            # Store transcription
            transcription_record = {
                "transcription_id": transcription_id,
                "patient_id": patient_id,
                "audio_file": audio_path,
                "timestamp": start_time.isoformat(),
                "processing_time": (datetime.now() - start_time).total_seconds(),
                "result": processed_result,
                "settings": {
                    "model_size": self.model_size,
                    "language": self.language,
                    "diarization_enabled": enable_diarization,
                    "alignment_enabled": enable_alignment
                }
            }
            
            self.transcription_history[transcription_id] = transcription_record
            
            print(f"✓ Transcription completed in {transcription_record['processing_time']:.2f}s")
            return transcription_record
            
        except Exception as e:
            print(f"❌ Error transcribing audio: {e}")
            raise
    
    def transcribe_audio_bytes(
        self, 
        audio_bytes: bytes,
        format: str = "wav",
        patient_id: Optional[str] = None,
        enable_diarization: bool = True,
        enable_alignment: bool = True
    ) -> Dict[str, Any]:
        """
        Transcribe audio from bytes data
        
        Args:
            audio_bytes: Audio data as bytes
            format: Audio format ("wav", "mp3", "m4a", etc.)
            patient_id: Optional patient ID
            enable_diarization: Enable speaker separation
            enable_alignment: Enable word-level timestamps
            
        Returns:
            Transcription result
        """
        try:
            # Create temporary file
            with tempfile.NamedTemporaryFile(suffix=f".{format}", delete=False) as temp_file:
                temp_file.write(audio_bytes)
                temp_path = temp_file.name
            
            # Transcribe
            result = self.transcribe_audio_file(
                temp_path,
                patient_id=patient_id,
                enable_diarization=enable_diarization,
                enable_alignment=enable_alignment
            )
            
            # Clean up temporary file
            os.unlink(temp_path)
            
            return result
            
        except Exception as e:
            print(f"❌ Error transcribing audio bytes: {e}")
            raise
    
    def _process_transcription_for_patients(
        self, 
        whisper_result: Dict,
        audio_path: str,
        patient_id: Optional[str]
    ) -> Dict[str, Any]:
        """Process transcription results with Alzheimer's patient optimizations"""
        
        # Extract segments
        segments = whisper_result.get("segments", [])
        
        # Combine all text
        full_text = " ".join([seg.get("text", "").strip() for seg in segments])
        
        # Analyze speech patterns (helpful for Alzheimer's assessment)
        speech_analysis = self._analyze_speech_patterns(segments)
        
        # Clean and format text for better readability
        cleaned_text = self._clean_text_for_patients(full_text)
        
        # Extract key phrases and emotions
        key_phrases = self._extract_key_phrases(cleaned_text)
        emotional_indicators = self._detect_emotional_indicators(cleaned_text)
        
        # Create structured result
        processed_result = {
            "full_text": cleaned_text,
            "original_text": full_text,
            "segments": segments,
            "speech_analysis": speech_analysis,
            "key_phrases": key_phrases,
            "emotional_indicators": emotional_indicators,
            "language_detected": whisper_result.get("language", "unknown"),
            "confidence_score": self._calculate_confidence(segments),
            "word_count": len(cleaned_text.split()),
            "duration": max([seg.get("end", 0) for seg in segments]) if segments else 0
        }
        
        return processed_result
    
    def _analyze_speech_patterns(self, segments: List[Dict]) -> Dict[str, Any]:
        """Analyze speech patterns for Alzheimer's assessment"""
        if not segments:
            return {}
        
        # Calculate speaking rate (words per minute)
        total_words = sum(len(seg.get("text", "").split()) for seg in segments)
        total_duration = max([seg.get("end", 0) for seg in segments])
        speaking_rate = (total_words / total_duration * 60) if total_duration > 0 else 0
        
        # Calculate pause analysis
        pauses = []
        for i in range(1, len(segments)):
            pause_duration = segments[i].get("start", 0) - segments[i-1].get("end", 0)
            if pause_duration > 0.5:  # Significant pause
                pauses.append(pause_duration)
        
        avg_pause_duration = np.mean(pauses) if pauses else 0
        
        # Repetition detection
        words = [word.lower() for seg in segments for word in seg.get("text", "").split()]
        word_repetitions = len(words) - len(set(words))
        
        return {
            "speaking_rate_wpm": round(speaking_rate, 2),
            "average_pause_duration": round(avg_pause_duration, 2),
            "number_of_pauses": len(pauses),
            "word_repetitions": word_repetitions,
            "speech_continuity": "smooth" if avg_pause_duration < 2.0 else "hesitant"
        }
    
    def _clean_text_for_patients(self, text: str) -> str:
        """Clean and format text for better readability"""
        import re
        
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Fix common transcription issues
        text = text.replace(' i ', ' I ')
        text = text.replace("i'm", "I'm")
        text = text.replace("i've", "I've")
        text = text.replace("i'll", "I'll")
        
        # Capitalize first letter of sentences
        sentences = text.split('. ')
        sentences = [s.capitalize() for s in sentences]
        text = '. '.join(sentences)
        
        return text.strip()
    
    def _extract_key_phrases(self, text: str) -> List[str]:
        """Extract key phrases that might be important for Alzheimer's patients"""
        key_patterns = [
            r'\b(?:my name is|i am|i\'m called)\s+(\w+)',
            r'\b(?:my family|my children|my spouse|my husband|my wife)',
            r'\b(?:i remember|i forgot|i can\'t remember)',
            r'\b(?:confused|worried|scared|happy|sad)',
            r'\b(?:home|house|where am i)',
            r'\b(?:help|need help|don\'t understand)'
        ]
        
        key_phrases = []
        for pattern in key_patterns:
            matches = re.findall(pattern, text.lower())
            if matches:
                key_phrases.extend(matches)
        
        return key_phrases
    
    def _detect_emotional_indicators(self, text: str) -> Dict[str, List[str]]:
        """Detect emotional indicators in speech"""
        emotions = {
            "confusion": ["confused", "don't understand", "where am i", "what's happening"],
            "anxiety": ["worried", "scared", "nervous", "afraid"],
            "sadness": ["sad", "upset", "crying", "depressed"],
            "happiness": ["happy", "good", "wonderful", "joy", "smile"],
            "frustration": ["frustrated", "angry", "annoyed", "can't do"]
        }
        
        detected = {}
        text_lower = text.lower()
        
        for emotion, indicators in emotions.items():
            found_indicators = [ind for ind in indicators if ind in text_lower]
            if found_indicators:
                detected[emotion] = found_indicators
        
        return detected
    
    def _calculate_confidence(self, segments: List[Dict]) -> float:
        """Calculate overall confidence score"""
        if not segments:
            return 0.0
        
        # WhisperX doesn't always provide confidence scores, so we estimate
        avg_confidence = 0.85  # Default good confidence for WhisperX
        
        # Adjust based on segment characteristics
        for seg in segments:
            # Longer segments typically have better accuracy
            if seg.get("end", 0) - seg.get("start", 0) < 2.0:
                avg_confidence -= 0.05
        
        return max(0.0, min(1.0, avg_confidence))
    
    def get_transcription_history(self, patient_id: Optional[str] = None) -> List[Dict]:
        """Get transcription history for a patient or all"""
        if patient_id:
            return [
                record for record in self.transcription_history.values() 
                if record.get("patient_id") == patient_id
            ]
        return list(self.transcription_history.values())
    
    def get_supported_languages(self) -> List[str]:
        """Get list of supported languages"""
        return [
            "en", "hi", "es", "fr", "de", "it", "pt", "ru", "ja", "ko", 
            "zh", "ar", "tr", "pl", "nl", "sv", "da", "no", "fi"
        ]
    
    def get_model_info(self) -> Dict[str, Any]:
        """Get information about loaded models"""
        return {
            "whisper_model_size": self.model_size,
            "device": self.device,
            "compute_type": self.compute_type,
            "language": self.language,
            "alignment_available": self.align_model is not None,
            "diarization_available": self.diarize_model is not None,
            "patient_optimizations": self.patient_optimizations
        }


class STTAPIHandler(BaseAPIHandler):
    """HTTP request handler for STT API"""
    
    def do_POST(self):
        """Handle POST requests"""
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            endpoint = self.path
            
            if endpoint == '/transcribe_file':
                self._handle_transcribe_file(post_data)
            elif endpoint == '/transcribe_audio':
                self._handle_transcribe_audio(post_data)
            elif endpoint == '/get_history':
                request_data = json.loads(post_data.decode('utf-8'))
                self._handle_get_history(request_data)
            else:
                self.send_error_response(404, "Endpoint not found")
                
        except Exception as e:
            print(f"Error handling request: {e}")
            self.send_error_response(500, f"Internal server error: {str(e)}")
    
    def _handle_transcribe_file(self, post_data):
        """Handle file transcription request"""
        try:
            # Parse multipart form data (simplified)
            boundary = self.headers['Content-Type'].split('boundary=')[1]
            # In production, use a proper multipart parser
            
            # For now, expect JSON with base64 encoded audio
            request_data = json.loads(post_data.decode('utf-8'))
            
            audio_base64 = request_data.get('audio_data')
            audio_format = request_data.get('format', 'wav')
            patient_id = request_data.get('patient_id')
            enable_diarization = request_data.get('enable_diarization', True)
            enable_alignment = request_data.get('enable_alignment', True)
            
            if not audio_base64:
                self.send_error_response(400, "audio_data is required")
                return
            
            # Decode audio
            audio_bytes = base64.b64decode(audio_base64)
            
            # Transcribe
            result = stt_engine.transcribe_audio_bytes(
                audio_bytes,
                format=audio_format,
                patient_id=patient_id,
                enable_diarization=enable_diarization,
                enable_alignment=enable_alignment
            )
            
            response = {
                "success": True,
                "transcription_id": result["transcription_id"],
                "result": result["result"],
                "processing_time": result["processing_time"]
            }
            
            self.send_json_response(response)
            
        except Exception as e:
            self.send_error_response(500, f"Transcription error: {str(e)}")
    
    def _handle_transcribe_audio(self, post_data):
        """Handle audio transcription request"""
        # Similar to _handle_transcribe_file but for different input format
        self._handle_transcribe_file(post_data)
    
    def _handle_get_history(self, request_data):
        """Handle transcription history request"""
        patient_id = request_data.get('patient_id')
        
        history = stt_engine.get_transcription_history(patient_id)
        
        response = {
            "success": True,
            "history": history,
            "count": len(history)
        }
        
        self.send_json_response(response)
    
    def do_GET(self):
        """Handle GET requests"""
        if self.path == '/health':
            response = {
                "status": "healthy",
                "service": "WhisperX STT",
                "model_info": stt_engine.get_model_info(),
                "supported_languages": stt_engine.get_supported_languages(),
                "gpu_info": get_gpu_info()
            }
            self.send_json_response(response)
        elif self.path == '/languages':
            response = {
                "supported_languages": stt_engine.get_supported_languages()
            }
            self.send_json_response(response)
        else:
            self.send_error_response(404, "Not found")


# Global STT engine instance
stt_engine = None

def initialize_stt_engine():
    """Initialize STT engine"""
    global stt_engine
    print("Initializing WhisperX STT system...")
    
    # Optimize model size based on GPU memory
    if torch.cuda.is_available():
        gpu_memory = torch.cuda.get_device_properties(0).total_memory / (1024**3)
        if gpu_memory >= 8:
            model_size = "large-v3"
        elif gpu_memory >= 6:
            model_size = "medium"
        elif gpu_memory >= 4:
            model_size = "small"
        else:
            model_size = "base"
    else:
        model_size = "base"
    
    stt_engine = WhisperXSTT(
        model_size=model_size,
        device="auto",
        language="auto"  # Auto-detect English/Hindi
    )
    print("✓ WhisperX STT system initialized")

def start_server():
    """Start the STT server"""
    server_address = (STT_API_HOST, STT_API_PORT)
    httpd = HTTPServer(server_address, STTAPIHandler)
    
    print(f"WhisperX STT Server running on http://{STT_API_HOST}:{STT_API_PORT}")
    print("Endpoints:")
    print("  POST /transcribe_file - Transcribe audio file")
    print("  POST /transcribe_audio - Transcribe audio data")
    print("  POST /get_history - Get transcription history")
    print("  GET /health - Health check")
    print("  GET /languages - Get supported languages")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down STT server...")
        httpd.shutdown()

if __name__ == "__main__":
    # Initialize STT engine
    init_thread = threading.Thread(target=initialize_stt_engine)
    init_thread.start()
    init_thread.join()
    
    # Start server
    start_server()