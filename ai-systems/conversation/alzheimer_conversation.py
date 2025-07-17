"""
Alzheimer's Companion Conversation AI System
Uses Llama-3-Nanda-10B-Chat for empathetic, memory-aware conversations
"""

import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
import json
import os
from pathlib import Path
from datetime import datetime
from typing import Optional, List, Dict, Any
import threading
from http.server import HTTPServer
import uuid
import sys

# Import shared utilities and config
sys.path.append(str(Path(__file__).parent.parent))
from config.settings import *
from utils.api_utils import BaseAPIHandler, get_gpu_info, optimize_for_gpu


class AlzheimerConversationAI:
    """Conversation AI specialized for Alzheimer's patients"""
    
    def __init__(self, model_path: Optional[str] = None, use_quantization: bool = True):
        """Initialize the conversation AI system"""
        self.model_path = model_path or "MBZUAI/Llama-3-Nanda-10B-Chat"
        self.use_quantization = use_quantization
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.model = None
        self.tokenizer = None
        
        # Conversation context storage
        self.conversations = {}
        self.patient_profiles = {}
        
        print("Initializing Alzheimer's Conversation AI...")
        print(f"Using device: {self.device}")
        optimize_for_gpu()
        self._load_model()
        self._load_conversation_templates()
        print("✓ Conversation AI ready!")
    
    def _load_model(self):
        """Load model with RTX 3050 4GB optimized settings"""
        print(f"Loading {self.model_path} model...")
        
        try:
            # Set custom cache directory
            import os
            custom_cache_dir = "F:\\Models\\HuggingFace"
            os.makedirs(custom_cache_dir, exist_ok=True)
            
            # Configure environment
            os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"
            os.environ["HF_HOME"] = custom_cache_dir
            os.environ["TRANSFORMERS_CACHE"] = os.path.join(custom_cache_dir, "transformers")
            os.environ["HF_DATASETS_CACHE"] = os.path.join(custom_cache_dir, "datasets")
            
            print(f"📁 Model cache directory: {custom_cache_dir}")
            
            # Hugging Face authentication
            from huggingface_hub import login
            
            # Get token
            hf_token = os.getenv('HF_TOKEN')
            if not hf_token:
                print("\n📋 Please enter your Hugging Face token:")
                hf_token = input("\nEnter your HF Token: ").strip()
            
            if not hf_token:
                raise ValueError("Token is required for this gated model")
            
            # Login to Hugging Face
            login(token=hf_token)
            print("✓ Logged in to Hugging Face")
            
            # Load tokenizer first
            print("Loading tokenizer...")
            self.tokenizer = AutoTokenizer.from_pretrained(
                self.model_path,
                trust_remote_code=True,
                token=hf_token,
                cache_dir=custom_cache_dir,
                local_files_only=True
            )
            print("✓ Tokenizer loaded successfully")
            
            # RTX 3050 4GB specific optimization
            if torch.cuda.is_available():
                gpu_memory = torch.cuda.get_device_properties(0).total_memory / (1024**3)
                print(f"🔧 GPU: RTX 3050 with {gpu_memory:.1f} GB VRAM")
                print("🚀 Using RTX 3050 optimized loading strategy...")
                
                # Use 8-bit quantization with CPU offloading (more stable than 4-bit)
                quantization_config = BitsAndBytesConfig(
                    load_in_8bit=True,
                    llm_int8_enable_fp32_cpu_offload=True,  # Enable CPU offload
                    llm_int8_threshold=6.0
                )
                
                # Conservative memory allocation for RTX 3050
                max_memory = {
                    0: "3.2GB",    # Conservative GPU usage (80% of 4GB)
                    "cpu": "12GB"  # Allow generous CPU usage
                }
                
                print("📦 Loading with 8-bit quantization and CPU-GPU hybrid...")
                self.model = AutoModelForCausalLM.from_pretrained(
                    self.model_path,
                    quantization_config=quantization_config,
                    device_map="auto",
                    max_memory=max_memory,
                    trust_remote_code=True,
                    torch_dtype=torch.float16,
                    token=hf_token,
                    cache_dir=custom_cache_dir,
                    local_files_only=True,
                    low_cpu_mem_usage=True,
                    offload_folder="temp_offload"
                )
                print("✓ Model loaded with RTX 3050 optimized settings")
                
            else:
                print("🖥️  No GPU detected. Using CPU-only mode...")
                self.model = AutoModelForCausalLM.from_pretrained(
                    self.model_path,
                    device_map="cpu",
                    trust_remote_code=True,
                    torch_dtype=torch.float32,
                    token=hf_token,
                    cache_dir=custom_cache_dir,
                    local_files_only=True,
                    low_cpu_mem_usage=True
                )
                print("✓ Model loaded on CPU")
            
            print("✓ Nanda model loaded successfully")
            print(f"✓ Model device: {self.device}")
            print(f"✓ Models cached in: {custom_cache_dir}")
            
            # Check final device distribution
            self.check_model_device_distribution()
            
        except Exception as e:
            print(f"❌ Error loading conversation model: {e}")
            print("\n🔄 Trying fallback strategy...")
            
            # Fallback: CPU-only loading
            try:
                print("Loading in CPU-only mode as fallback...")
                self.model = AutoModelForCausalLM.from_pretrained(
                    self.model_path,
                    device_map="cpu",
                    trust_remote_code=True,
                    torch_dtype=torch.float32,
                    token=hf_token,
                    cache_dir=custom_cache_dir,
                    local_files_only=True,
                    low_cpu_mem_usage=True
                )
                print("✓ Fallback: Model loaded on CPU only")
            except Exception as fallback_error:
                print(f"❌ Fallback also failed: {fallback_error}")
                raise RuntimeError("Failed to load model on both GPU and CPU")

    def _load_conversation_templates(self):
        """Load conversation templates for different scenarios"""
        self.templates = {
            "system_prompt": """You are a caring, patient, and empathetic AI companion specifically designed to help people with Alzheimer's disease and dementia. Your role is to:

1. Provide emotional support and companionship
2. Help with memory recall through gentle prompting
3. Maintain a calm, reassuring presence
4. Speak slowly and clearly
5. Repeat information when needed
6. Validate feelings and experiences
7. Redirect gently when conversations become confused
8. Use simple, familiar language
9. Reference personal memories and family when appropriate
10. Always be kind, patient, and understanding

Respond in the same language the user speaks (English or Hindi). Keep responses warm, short, and easy to understand. Focus on being a comforting presence.""",
            
            "memory_prompts": [
                "Tell me about a happy memory from your childhood.",
                "What was your wedding day like?",
                "Can you describe your favorite family tradition?",
                "What did you enjoy doing with your children when they were young?",
                "What was your favorite job or work experience?",
                "Do you remember your favorite song from when you were young?",
                "Tell me about your parents - what were they like?",
                "What's a funny story from your past that always makes you smile?"
            ],
            
            "comfort_responses": [
                "I'm here with you, and you're safe.",
                "It's okay to feel confused sometimes. We'll figure it out together.",
                "You're doing great. Take your time.",
                "I understand this might be difficult. You're not alone.",
                "Let's talk about something that makes you happy.",
                "Your feelings are completely valid.",
                "I'm here to listen to you.",
                "We can take this conversation at your own pace."
            ]
        }
    
    def _format_prompt(self, messages: List[Dict[str, str]]) -> str:
        """Format messages using Nanda's chat template"""
        formatted_prompt = "<|begin_of_text|>"
        
        for message in messages:
            role = message["role"]
            content = message["content"]
            
            if role == "system":
                formatted_prompt += f"<|start_header_id|>system<|end_header_id|>{content}<|eot_id|>"
            elif role == "user":
                formatted_prompt += f"<|start_header_id|>user<|end_header_id|>{content}<|eot_id|>"
            elif role == "assistant":
                formatted_prompt += f"<|start_header_id|>assistant<|end_header_id|>{content}<|eot_id|>"
        
        # Add assistant header for response
        formatted_prompt += "<|start_header_id|>assistant<|end_header_id|>"
        
        return formatted_prompt
    
    def create_patient_profile(self, patient_id: str, profile_data: dict) -> dict:
        """Create or update patient profile"""
        try:
            # Validate required fields
            if not patient_id:
                raise ValueError("Patient ID is required")
            
            # Ensure age is properly handled
            if 'age' in profile_data and profile_data['age'] is not None:
                profile_data['age'] = int(profile_data['age'])  # This line is causing the error
            
            # Store profile
            self.patient_profiles[patient_id] = {
                'patient_id': patient_id,
                'name': profile_data.get('name', 'Patient'),
                'age': profile_data.get('age', 0),  # Default age to avoid None
                'family_members': profile_data.get('family_members', []),
                'important_memories': profile_data.get('important_memories', []),
                'preferences': profile_data.get('preferences', {}),
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat()
            }
            
            print(f"✓ Created profile for patient: {patient_id}")
            return {
                'success': True,
                'message': 'Patient profile created successfully',
                'patient_id': patient_id
            }
            
        except Exception as e:
            print(f"❌ Error creating patient profile: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def start_conversation(self, patient_id: str) -> tuple:
        """Start a new conversation session"""
        conversation_id = str(uuid.uuid4())
        
        # Get patient profile if available
        patient_profile = self.patient_profiles.get(patient_id, {})
        patient_name = patient_profile.get("name", "friend")
        
        # Initialize conversation context
        self.conversations[conversation_id] = {
            "patient_id": patient_id,
            "messages": [],
            "context": patient_profile,
            "started_at": datetime.now().isoformat(),
            "last_activity": datetime.now().isoformat()
        }
        
        # Create personalized greeting
        greeting_options = [
            f"Hello {patient_name}! I'm so happy to see you today. How are you feeling?",
            f"Good day, {patient_name}! I hope you're having a wonderful day. What would you like to talk about?",
            f"Hi there, {patient_name}! It's lovely to spend time with you. How has your day been?"
        ]
        
        import random
        greeting = random.choice(greeting_options)
        
        return conversation_id, greeting
    
    def continue_conversation(
        self, 
        conversation_id: str, 
        user_message: str,
        include_memory_context: bool = True
    ) -> str:
        """Continue an existing conversation"""
        
        if conversation_id not in self.conversations:
            raise ValueError("Conversation not found")
        
        conversation = self.conversations[conversation_id]
        
        # Add user message to conversation history
        conversation["messages"].append({
            "role": "user",
            "content": user_message,
            "timestamp": datetime.now().isoformat()
        })
        
        # Build conversation context
        messages = self._build_conversation_messages(conversation, include_memory_context)
        
        try:
            # Generate response using Nanda model
            ai_response = self._generate_response(messages)
            
            # Add AI response to conversation history
            conversation["messages"].append({
                "role": "assistant", 
                "content": ai_response,
                "timestamp": datetime.now().isoformat()
            })
            
            conversation["last_activity"] = datetime.now().isoformat()
            
            return ai_response
            
        except Exception as e:
            print(f"Error generating response: {e}")
            import random
            return random.choice(self.templates["comfort_responses"])
    
    def _generate_response(self, messages: List[Dict[str, str]]) -> str:
        """Generate response using Nanda model"""
        # Format prompt
        formatted_prompt = self._format_prompt(messages)
        
        # Tokenize
        inputs = self.tokenizer(formatted_prompt, return_tensors="pt")
        if torch.cuda.is_available():
            inputs = {k: v.to(self.device) for k, v in inputs.items()}
        
        input_length = inputs['input_ids'].shape[-1]
        
        # Generate response
        with torch.no_grad():
            generate_ids = self.model.generate(
                **inputs,
                max_length=input_length + 150,  # Limit response length
                min_length=input_length + 20,   # Ensure minimum response
                temperature=0.3,                # Lower temperature for consistency
                top_p=0.9,
                repetition_penalty=1.1,
                do_sample=True,
                pad_token_id=self.tokenizer.eos_token_id,
                eos_token_id=self.tokenizer.eos_token_id
            )
        
        # Decode response
        full_response = self.tokenizer.batch_decode(
            generate_ids, 
            skip_special_tokens=True, 
            clean_up_tokenization_spaces=True
        )[0]
        
        # Extract only the assistant's response
        if "assistant<|end_header_id|>" in full_response:
            ai_response = full_response.split("assistant<|end_header_id|>")[-1].strip()
        else:
            ai_response = full_response[len(formatted_prompt):].strip()
        
        # Clean up response
        ai_response = ai_response.replace("<|eot_id|>", "").strip()
        
        return ai_response if ai_response else "I'm here to listen. Please tell me more."
    
    def _build_conversation_messages(self, conversation: Dict, include_memory_context: bool) -> List[Dict]:
        """Build message array for Nanda model"""
        patient_profile = conversation["context"]
        patient_name = patient_profile.get("name", "friend")
        
        # System message with patient context
        system_content = self.templates["system_prompt"]
        
        if include_memory_context and patient_profile:
            context_info = f"\n\nPatient Information:\n"
            context_info += f"- Name: {patient_name}\n"
            
            if patient_profile.get("family_members"):
                family_list = ", ".join(patient_profile["family_members"])
                context_info += f"- Family: {family_list}\n"
            
            if patient_profile.get("important_memories"):
                context_info += f"- Important memories: {', '.join(patient_profile['important_memories'][:3])}\n"
            
            system_content += context_info
        
        messages = [{"role": "system", "content": system_content}]
        
        # Add recent conversation history (last 6 messages to manage context length)
        recent_messages = conversation["messages"][-6:]
        for msg in recent_messages:
            messages.append({
                "role": msg["role"],
                "content": msg["content"]
            })
        
        return messages
    
    def get_memory_prompt(self) -> str:
        """Get a random memory-triggering prompt"""
        import random
        return random.choice(self.templates["memory_prompts"])
    
    def get_comfort_response(self) -> str:
        """Get a comforting response for difficult moments"""
        import random
        return random.choice(self.templates["comfort_responses"])
    
    def analyze_conversation_mood(self, conversation_id: str) -> Dict[str, Any]:
        """Analyze the mood and tone of the conversation"""
        if conversation_id not in self.conversations:
            return {"error": "Conversation not found"}
        
        conversation = self.conversations[conversation_id]
        recent_messages = conversation["messages"][-5:]
        
        # Simple mood analysis based on keywords
        positive_keywords = ["happy", "good", "wonderful", "love", "joy", "smile", "yes", "great", "fine", "okay"]
        negative_keywords = ["sad", "confused", "worried", "scared", "no", "don't", "can't", "lost", "forget", "help"]
        
        positive_score = 0
        negative_score = 0
        
        for msg in recent_messages:
            if msg["role"] == "user":
                content_lower = msg["content"].lower()
                positive_score += sum(1 for word in positive_keywords if word in content_lower)
                negative_score += sum(1 for word in negative_keywords if word in content_lower)
        
        # Determine overall mood
        if positive_score > negative_score:
            mood = "positive"
        elif negative_score > positive_score:
            mood = "needs_support"
        else:
            mood = "neutral"
        
        return {
            "mood": mood,
            "positive_indicators": positive_score,
            "support_indicators": negative_score,
            "suggestion": self._get_mood_suggestion(mood)
        }
    
    def _get_mood_suggestion(self, mood: str) -> str:
        """Get suggestions based on detected mood"""
        suggestions = {
            "positive": "Continue the conversation, maybe ask about happy memories",
            "needs_support": "Provide comfort and reassurance, use calming responses",
            "neutral": "Try a memory prompt or ask about their day"
        }
        return suggestions.get(mood, "Continue normal conversation")
    
    def _download_model_files_individually(self, repo_id: str, cache_dir: str, token: str):
        """Download each model file one by one to prevent conflicts"""
        from huggingface_hub import list_repo_files, hf_hub_download
        import time
        
        print("📋 Downloading files individually...")
        
        try:
            # Get list of model files
            files = list_repo_files(repo_id, token=token)
            
            # Filter for important model files (download largest files first)
            model_files = [f for f in files if f.endswith(('.bin', '.safetensors'))]
            config_files = [f for f in files if f.endswith(('.json', '.txt'))]
            
            # Sort model files by size (download smaller files first for progress)
            all_files = config_files + model_files
            
            print(f"Found {len(all_files)} files to download")
            
            for i, filename in enumerate(all_files, 1):
                print(f"\n📥 [{i}/{len(all_files)}] Downloading: {filename}")
                
                try:
                    hf_hub_download(
                        repo_id=repo_id,
                        filename=filename,
                        cache_dir=cache_dir,
                        token=token,
                        resume_download=True,
                        force_download=False  # Don't re-download if exists
                    )
                    print(f"✓ Downloaded: {filename}")
                    
                    # Small delay to prevent server overload
                    time.sleep(1)
                    
                except Exception as e:
                    print(f"⚠️  Error downloading {filename}: {e}")
                    continue
            
            print("✓ Individual file download completed")
            
        except Exception as e:
            print(f"Error in individual download: {e}")
            raise

    def check_model_device_distribution(self):
        """Check where model layers are loaded"""
        print("\n🔍 Model Device Distribution:")
        
        if hasattr(self.model, 'hf_device_map'):
            device_map = self.model.hf_device_map
            gpu_layers = sum(1 for device in device_map.values() if device == 0 or device == 'cuda:0')
            cpu_layers = sum(1 for device in device_map.values() if device == 'cpu')
            disk_layers = sum(1 for device in device_map.values() if 'disk' in str(device))
            
            print(f"GPU layers: {gpu_layers}")
            print(f"CPU layers: {cpu_layers}")
            print(f"Disk layers: {disk_layers}")
            print(f"Total layers: {len(device_map)}")
            
            # Show some mappings
            for i, (layer, device) in enumerate(list(device_map.items())[:5]):
                print(f"  {layer}: {device}")
            if len(device_map) > 5:
                print(f"  ... and {len(device_map) - 5} more layers")
        else:
            print("No device map found - likely CPU-only mode")
        
        # Check GPU memory usage
        if torch.cuda.is_available():
            try:
                gpu_memory_allocated = torch.cuda.memory_allocated(0) / (1024**3)
                gpu_memory_reserved = torch.cuda.memory_reserved(0) / (1024**3)
                gpu_memory_total = torch.cuda.get_device_properties(0).total_memory / (1024**3)
                
                print(f"\n🔧 GPU Memory Usage:")
                print(f"Allocated: {gpu_memory_allocated:.2f} GB")
                print(f"Reserved: {gpu_memory_reserved:.2f} GB")
                print(f"Total: {gpu_memory_total:.2f} GB")
                print(f"Usage: {(gpu_memory_allocated/gpu_memory_total)*100:.1f}%")
            except:
                print("Could not get GPU memory info")


class ConversationAPIHandler(BaseAPIHandler):
    """HTTP request handler for Conversation AI API"""
    
    def do_POST(self):
        """Handle POST requests"""
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            request_data = json.loads(post_data.decode('utf-8'))
            
            endpoint = self.path
            
            if endpoint == '/start_conversation':
                self._handle_start_conversation(request_data)
            elif endpoint == '/continue_conversation':
                self._handle_continue_conversation(request_data)
            elif endpoint == '/create_profile':
                self._handle_create_profile(request_data)
            elif endpoint == '/analyze_mood':
                self._handle_analyze_mood(request_data)
            elif endpoint == '/memory_prompt':
                self._handle_memory_prompt(request_data)
            else:
                self.send_error_response(404, "Endpoint not found")
                
        except Exception as e:
            print(f"Error handling request: {e}")
            self.send_error_response(500, f"Internal server error: {str(e)}")
    
    def _handle_start_conversation(self, request_data):
        """Handle start conversation request"""
        patient_id = request_data.get('patient_id')
        if not patient_id:
            self.send_error_response(400, "patient_id is required")
            return
        
        conversation_id, greeting = conversation_ai.start_conversation(patient_id)
        
        response = {
            "success": True,
            "conversation_id": conversation_id,
            "greeting": greeting,
            "timestamp": datetime.now().isoformat()
        }
        
        self.send_json_response(response)
    
    def _handle_continue_conversation(self, request_data):
        """Handle continue conversation request"""
        conversation_id = request_data.get('conversation_id')
        user_message = request_data.get('message', '').strip()
        
        if not conversation_id or not user_message:
            self.send_error_response(400, "conversation_id and message are required")
            return
        
        ai_response = conversation_ai.continue_conversation(conversation_id, user_message)
        
        response = {
            "success": True,
            "response": ai_response,
            "timestamp": datetime.now().isoformat()
        }
        
        self.send_json_response(response)
    
    def _handle_create_profile(self, request_data):
        """Handle create patient profile request"""
        patient_id = request_data.get('patient_id')
        profile_data = request_data.get('profile_data', {})
        
        if not patient_id:
            self.send_error_response(400, "patient_id is required")
            return
        
        success = conversation_ai.create_patient_profile(patient_id, profile_data)
        
        response = {
            "success": success,
            "message": "Patient profile created successfully"
        }
        
        self.send_json_response(response)
    
    def _handle_analyze_mood(self, request_data):
        """Handle mood analysis request"""
        conversation_id = request_data.get('conversation_id')
        
        if not conversation_id:
            self.send_error_response(400, "conversation_id is required")
            return
        
        mood_analysis = conversation_ai.analyze_conversation_mood(conversation_id)
        
        response = {
            "success": True,
            "mood_analysis": mood_analysis
        }
        
        self.send_json_response(response)
    
    def _handle_memory_prompt(self, request_data):
        """Handle memory prompt request"""
        memory_prompt = conversation_ai.get_memory_prompt()
        
        response = {
            "success": True,
            "memory_prompt": memory_prompt
        }
        
        self.send_json_response(response)
    
    def do_GET(self):
        """Handle GET requests"""
        if self.path == '/health':
            response = {
                "status": "healthy",
                "service": "Alzheimer's Conversation AI",
                "model": "Llama-3-Nanda-10B-Chat",
                "gpu_info": get_gpu_info()
            }
            self.send_json_response(response)
        else:
            self.send_error_response(404, "Not found")


# Global conversation AI instance
conversation_ai = None

def initialize_conversation_ai():
    """Initialize conversation AI system"""
    global conversation_ai
    print("Initializing Conversation AI system...")
    conversation_ai = AlzheimerConversationAI()
    print("✓ Conversation AI system initialized")

def start_server():
    """Start the conversation AI server"""
    server_address = (CONVERSATION_API_HOST, CONVERSATION_API_PORT)
    httpd = HTTPServer(server_address, ConversationAPIHandler)
    
    print(f"Conversation AI Server running on http://{CONVERSATION_API_HOST}:{CONVERSATION_API_PORT}")
    print("Endpoints:")
    print("  POST /start_conversation - Start new conversation")
    print("  POST /continue_conversation - Continue conversation")
    print("  POST /create_profile - Create patient profile")
    print("  POST /analyze_mood - Analyze conversation mood")
    print("  POST /memory_prompt - Get memory prompt")
    print("  GET /health - Health check")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down conversation AI server...")
        httpd.shutdown()

if __name__ == "__main__":
    # Initialize conversation AI
    init_thread = threading.Thread(target=initialize_conversation_ai)
    init_thread.start()
    init_thread.join()
    
    # Start server
    start_server()