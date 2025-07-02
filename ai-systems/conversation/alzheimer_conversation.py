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
        """Load the Llama-3-Nanda-10B-Chat model"""
        print(f"Loading {self.model_path} model...")
        
        try:
            # Set custom cache directory
            import os
            custom_cache_dir = "F:\\Models\\HuggingFace"  # Change to your preferred location
            os.makedirs(custom_cache_dir, exist_ok=True)
            
            # Set environment variables
            os.environ["HF_HOME"] = custom_cache_dir
            os.environ["TRANSFORMERS_CACHE"] = os.path.join(custom_cache_dir, "transformers")
            os.environ["HF_DATASETS_CACHE"] = os.path.join(custom_cache_dir, "datasets")
            
            print(f"📁 Model cache directory: {custom_cache_dir}")
            
            # Hugging Face authentication
            from huggingface_hub import login
            
            # Get token from environment or prompt user
            hf_token = os.getenv('HF_TOKEN')
            if not hf_token:
                print("\n📋 Please enter your Hugging Face token:")
                print("1. Make sure you have been granted access to MBZUAI/Llama-3-Nanda-10B-Chat")
                print("2. Go to: https://huggingface.co/settings/tokens")
                print("3. Create a new token with 'Read' permissions")
                print("4. Copy and paste it below")
                hf_token = input("\nEnter your HF Token: ").strip()
            
            if not hf_token:
                raise ValueError("Token is required for this gated model")
            
            # Login to Hugging Face
            login(token=hf_token)
            print("✓ Logged in to Hugging Face")
            
            # Load tokenizer with explicit token and cache directory
            print("Loading tokenizer...")
            self.tokenizer = AutoTokenizer.from_pretrained(
                self.model_path,
                trust_remote_code=True,
                token=hf_token,
                cache_dir=custom_cache_dir  # Explicit cache directory
            )
            print("✓ Tokenizer loaded successfully")
            
            # Set up quantization for better memory usage
            print("Loading model...")
            if self.use_quantization and torch.cuda.is_available():
                quantization_config = BitsAndBytesConfig(
                    load_in_4bit=True,
                    bnb_4bit_quant_type="nf4",
                    bnb_4bit_compute_dtype=torch.bfloat16,
                    bnb_4bit_use_double_quant=True,
                )
                
                self.model = AutoModelForCausalLM.from_pretrained(
                    self.model_path,
                    quantization_config=quantization_config,
                    device_map="auto",
                    trust_remote_code=True,
                    torch_dtype=torch.bfloat16,
                    token=hf_token,
                    cache_dir=custom_cache_dir  # Explicit cache directory
                )
            else:
                self.model = AutoModelForCausalLM.from_pretrained(
                    self.model_path,
                    device_map="auto" if torch.cuda.is_available() else None,
                    trust_remote_code=True,
                    torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
                    token=hf_token,
                    cache_dir=custom_cache_dir  # Explicit cache directory
                )
            
            print("✓ Nanda model loaded successfully")
            print(f"✓ Model device: {self.device}")
            print(f"✓ Using quantization: {self.use_quantization}")
            print(f"✓ Models cached in: {custom_cache_dir}")
            
        except Exception as e:
            print(f"❌ Error loading conversation model: {e}")
            print("💡 Troubleshooting steps:")
            print("💡 1. Verify access at: https://huggingface.co/MBZUAI/Llama-3-Nanda-10B-Chat")
            print("💡 2. Check your token has 'Read' permissions")
            print("💡 3. Try creating a new token")
            print("💡 4. Make sure you're using the latest transformers version")
            raise
    
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
    
    def create_patient_profile(self, patient_id: str, profile_data: Dict[str, Any]):
        """Create or update patient profile with personal information"""
        self.patient_profiles[patient_id] = {
            "name": profile_data.get("name", ""),
            "age": profile_data.get("age", ""),
            "family_members": profile_data.get("family_members", []),
            "important_memories": profile_data.get("important_memories", []),
            "preferences": profile_data.get("preferences", {}),
            "medical_info": profile_data.get("medical_info", {}),
            "created_at": datetime.now().isoformat()
        }
        
        print(f"✓ Patient profile created for {profile_data.get('name', patient_id)}")
        return True
    
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
    
    def _download_files_sequentially(self, repo_id: str, cache_dir: str, token: str):
        """Download model files one by one for better control"""
        from huggingface_hub import list_repo_files, hf_hub_download
        import time
        
        print("📋 Getting list of model files...")
        
        # Get list of all files in the repo
        try:
            files = list_repo_files(repo_id, token=token)
            print(f"Found {len(files)} files to download")
        except Exception as e:
            print(f"Error listing files: {e}")
            return False
        
        # Download each file individually
        for i, filename in enumerate(files, 1):
            print(f"📥 Downloading file {i}/{len(files)}: {filename}")
            
            try:
                hf_hub_download(
                    repo_id=repo_id,
                    filename=filename,
                    cache_dir=cache_dir,
                    token=token,
                    resume_download=True
                )
                print(f"✓ Downloaded: {filename}")
                
                # Small delay between downloads to prevent overwhelming the server
                time.sleep(0.5)
                
            except Exception as e:
                print(f"⚠️  Failed to download {filename}: {e}")
                print("Continuing with next file...")
                continue
        
        print("✓ Sequential download completed")
        return True


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