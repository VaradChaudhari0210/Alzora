"""
Document Understanding System for Alzheimer's Companion
Uses BLIP-2, FFmpeg, and Face Recognition for comprehensive document analysis
"""

import torch
from transformers import Blip2Processor, Blip2ForConditionalGeneration, BitsAndBytesConfig
import face_recognition
import cv2
import ffmpeg
import numpy as np
from PIL import Image
import json
import uuid
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict, List, Any, Union
import base64
import io
import tempfile
import os
from http.server import HTTPServer
import threading

# Import shared utilities and config
import sys
sys.path.append(str(Path(__file__).parent.parent))
from config.settings import *
from utils.api_utils import BaseAPIHandler, get_gpu_info, optimize_for_gpu


class DocumentProcessor:
    """Comprehensive document understanding system for Alzheimer's patients"""
    
    def __init__(self, device: str = "auto"):
        """
        Initialize document processor
        
        Args:
            device: Device to use ("cuda", "cpu", "auto")
        """
        self.device = self._get_device(device)
        
        # Model components
        self.blip2_processor = None
        self.blip2_model = None
        
        # Face recognition database
        self.known_faces = {}  # {person_name: [face_encodings]}
        self.face_database_path = "data/face_database.json"
        
        # Processing history
        self.processing_history = {}
        
        print("Initializing Document Understanding System...")
        print(f"Device: {self.device}")
        
        self._initialize_models()
        self._load_face_database()
        print("✓ Document Understanding System ready!")
    
    def _get_device(self, device: str) -> str:
        """Determine the best device to use"""
        if device == "auto":
            return "cuda" if torch.cuda.is_available() else "cpu"
        return device
    
    def _initialize_models(self):
        """Initialize BLIP-2 model"""
        try:
            print("Loading BLIP-2 model...")
            
            # Set custom cache directory
            custom_cache_dir = "F:\\Models\\HuggingFace"
            os.makedirs(custom_cache_dir, exist_ok=True)
            
            # Configure environment
            os.environ["HF_HOME"] = custom_cache_dir
            os.environ["TRANSFORMERS_CACHE"] = os.path.join(custom_cache_dir, "transformers")
            
            # Use BLIP-2 OPT 2.7B (good balance for RTX 3050)
            model_name = "Salesforce/blip2-opt-2.7b"
            
            self.blip2_processor = Blip2Processor.from_pretrained(
                model_name,
                cache_dir=custom_cache_dir
            )
            
            # Load with quantization for RTX 3050 4GB
            if self.device == "cuda":
                quantization_config = BitsAndBytesConfig(
                    load_in_8bit=True,
                    llm_int8_enable_fp32_cpu_offload=True
                )
                
                self.blip2_model = Blip2ForConditionalGeneration.from_pretrained(
                    model_name,
                    quantization_config=quantization_config,
                    device_map="auto",
                    cache_dir=custom_cache_dir,
                    torch_dtype=torch.float16
                )
            else:
                self.blip2_model = Blip2ForConditionalGeneration.from_pretrained(
                    model_name,
                    device_map="cpu",
                    cache_dir=custom_cache_dir,
                    torch_dtype=torch.float32
                )
            
            print("✓ BLIP-2 model loaded successfully")
            
        except Exception as e:
            print(f"❌ Error loading BLIP-2 model: {e}")
            raise
    
    def _load_face_database(self):
        """Load known faces database"""
        try:
            if os.path.exists(self.face_database_path):
                with open(self.face_database_path, 'r') as f:
                    face_data = json.load(f)
                
                # Convert stored encodings back to numpy arrays
                for person_name, encodings_list in face_data.items():
                    self.known_faces[person_name] = [
                        np.array(encoding) for encoding in encodings_list
                    ]
                
                print(f"✓ Loaded face database with {len(self.known_faces)} people")
            else:
                print("No existing face database found. Starting fresh.")
                os.makedirs(os.path.dirname(self.face_database_path), exist_ok=True)
                
        except Exception as e:
            print(f"⚠️  Error loading face database: {e}")
            self.known_faces = {}
    
    def _save_face_database(self):
        """Save known faces database"""
        try:
            # Convert numpy arrays to lists for JSON serialization
            face_data = {}
            for person_name, encodings_list in self.known_faces.items():
                face_data[person_name] = [
                    encoding.tolist() for encoding in encodings_list
                ]
            
            os.makedirs(os.path.dirname(self.face_database_path), exist_ok=True)
            with open(self.face_database_path, 'w') as f:
                json.dump(face_data, f)
            
            print("✓ Face database saved")
            
        except Exception as e:
            print(f"❌ Error saving face database: {e}")
    
    def analyze_image(
        self, 
        image_path: str,
        questions: Optional[List[str]] = None,
        detect_faces: bool = True,
        patient_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Analyze image with BLIP-2 and face recognition
        
        Args:
            image_path: Path to image file
            questions: Optional specific questions about the image
            detect_faces: Whether to detect and identify faces
            patient_id: Optional patient ID for context
            
        Returns:
            Analysis results
        """
        try:
            analysis_id = str(uuid.uuid4())
            start_time = datetime.now()
            
            print(f"🖼️  Analyzing image: {image_path}")
            
            # Load image
            image = Image.open(image_path).convert('RGB')
            
            # Basic image captioning
            print("📝 Generating image caption...")
            inputs = self.blip2_processor(image, return_tensors="pt")
            if self.device == "cuda":
                inputs = {k: v.cuda() for k, v in inputs.items()}
            
            with torch.no_grad():
                generated_ids = self.blip2_model.generate(**inputs, max_length=50)
            
            caption = self.blip2_processor.decode(
                generated_ids[0], 
                skip_special_tokens=True
            ).strip()
            
            # Answer specific questions if provided
            qa_results = []
            if questions:
                print("❓ Answering specific questions...")
                for question in questions:
                    inputs = self.blip2_processor(
                        image, 
                        question, 
                        return_tensors="pt"
                    )
                    if self.device == "cuda":
                        inputs = {k: v.cuda() for k, v in inputs.items()}
                    
                    with torch.no_grad():
                        generated_ids = self.blip2_model.generate(**inputs, max_length=20)
                    
                    answer = self.blip2_processor.decode(
                        generated_ids[0], 
                        skip_special_tokens=True
                    ).strip()
                    
                    qa_results.append({
                        "question": question,
                        "answer": answer
                    })
            
            # Face detection and recognition
            face_results = []
            if detect_faces:
                print("👥 Detecting and recognizing faces...")
                face_results = self._analyze_faces_in_image(image_path)
            
            # Create comprehensive analysis
            analysis_result = {
                "caption": caption,
                "qa_results": qa_results,
                "face_results": face_results,
                "image_metadata": self._get_image_metadata(image_path),
                "alzheimer_insights": self._generate_alzheimer_insights(
                    caption, qa_results, face_results
                )
            }
            
            # Store analysis
            analysis_record = {
                "analysis_id": analysis_id,
                "patient_id": patient_id,
                "file_path": image_path,
                "file_type": "image",
                "timestamp": start_time.isoformat(),
                "processing_time": (datetime.now() - start_time).total_seconds(),
                "result": analysis_result
            }
            
            self.processing_history[analysis_id] = analysis_record
            
            print(f"✓ Image analysis completed in {analysis_record['processing_time']:.2f}s")
            return analysis_record
            
        except Exception as e:
            print(f"❌ Error analyzing image: {e}")
            raise
    
    def analyze_video(
        self, 
        video_path: str,
        extract_frames_count: int = 10,
        analyze_audio: bool = True,
        detect_faces: bool = True,
        patient_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Analyze video with FFmpeg frame extraction and BLIP-2
        
        Args:
            video_path: Path to video file
            extract_frames_count: Number of frames to extract for analysis
            analyze_audio: Whether to extract and transcribe audio
            detect_faces: Whether to detect faces in frames
            patient_id: Optional patient ID
            
        Returns:
            Video analysis results
        """
        try:
            analysis_id = str(uuid.uuid4())
            start_time = datetime.now()
            
            print(f"🎥 Analyzing video: {video_path}")
            
            # Get video metadata
            video_info = self._get_video_metadata(video_path)
            duration = video_info.get('duration', 0)
            
            # Extract key frames using FFmpeg
            print("🎞️  Extracting key frames...")
            frame_paths = self._extract_video_frames(
                video_path, 
                frame_count=extract_frames_count,
                duration=duration
            )
            
            # Analyze each frame
            frame_analyses = []
            for i, frame_path in enumerate(frame_paths):
                print(f"📸 Analyzing frame {i+1}/{len(frame_paths)}")
                
                frame_analysis = self.analyze_image(
                    frame_path,
                    questions=[
                        "What is happening in this scene?",
                        "Who is in this image?",
                        "What is the mood or emotion shown?"
                    ],
                    detect_faces=detect_faces,
                    patient_id=patient_id
                )
                
                frame_analyses.append({
                    "frame_number": i + 1,
                    "timestamp": (duration / extract_frames_count) * i,
                    "analysis": frame_analysis["result"]
                })
                
                # Clean up temporary frame
                os.unlink(frame_path)
            
            # Extract and analyze audio if requested
            audio_analysis = None
            if analyze_audio:
                print("🎵 Extracting and analyzing audio...")
                audio_analysis = self._extract_and_analyze_audio(video_path)
            
            # Create video summary
            video_summary = self._create_video_summary(frame_analyses, audio_analysis)
            
            # Create comprehensive analysis
            analysis_result = {
                "video_metadata": video_info,
                "frame_analyses": frame_analyses,
                "audio_analysis": audio_analysis,
                "video_summary": video_summary,
                "alzheimer_insights": self._generate_video_alzheimer_insights(
                    frame_analyses, audio_analysis
                )
            }
            
            # Store analysis
            analysis_record = {
                "analysis_id": analysis_id,
                "patient_id": patient_id,
                "file_path": video_path,
                "file_type": "video",
                "timestamp": start_time.isoformat(),
                "processing_time": (datetime.now() - start_time).total_seconds(),
                "result": analysis_result
            }
            
            self.processing_history[analysis_id] = analysis_record
            
            print(f"✓ Video analysis completed in {analysis_record['processing_time']:.2f}s")
            return analysis_record
            
        except Exception as e:
            print(f"❌ Error analyzing video: {e}")
            raise
    
    def _analyze_faces_in_image(self, image_path: str) -> List[Dict[str, Any]]:
        """Detect and recognize faces in image"""
        try:
            # Load image for face recognition
            image = face_recognition.load_image_from_file(image_path)
            
            # Find face locations and encodings
            face_locations = face_recognition.face_locations(image)
            face_encodings = face_recognition.face_encodings(image, face_locations)
            
            face_results = []
            
            for i, (face_location, face_encoding) in enumerate(zip(face_locations, face_encodings)):
                # Try to match with known faces
                name = "Unknown"
                confidence = 0.0
                
                for person_name, known_encodings in self.known_faces.items():
                    # Compare with all known encodings for this person
                    matches = face_recognition.compare_faces(known_encodings, face_encoding)
                    face_distances = face_recognition.face_distance(known_encodings, face_encoding)
                    
                    if any(matches):
                        # Use the best match
                        best_match_index = np.argmin(face_distances)
                        if matches[best_match_index]:
                            name = person_name
                            confidence = 1.0 - face_distances[best_match_index]
                            break
                
                # Face location (top, right, bottom, left)
                top, right, bottom, left = face_location
                
                face_results.append({
                    "face_id": i + 1,
                    "name": name,
                    "confidence": round(confidence, 3),
                    "location": {
                        "top": top,
                        "right": right,
                        "bottom": bottom,
                        "left": left
                    },
                    "is_known": name != "Unknown"
                })
            
            return face_results
            
        except Exception as e:
            print(f"Error in face recognition: {e}")
            return []
    
    def add_known_face(self, image_path: str, person_name: str) -> Dict[str, Any]:
        """Add a new face to the known faces database"""
        try:
            print(f"👤 Adding face for {person_name}")
            
            # Load image and extract face encoding
            image = face_recognition.load_image_from_file(image_path)
            face_encodings = face_recognition.face_encodings(image)
            
            if not face_encodings:
                return {
                    "success": False,
                    "error": "No face detected in the image"
                }
            
            if len(face_encodings) > 1:
                print(f"⚠️  Multiple faces detected. Using the first one.")
            
            face_encoding = face_encodings[0]
            
            # Add to known faces
            if person_name not in self.known_faces:
                self.known_faces[person_name] = []
            
            self.known_faces[person_name].append(face_encoding)
            
            # Save database
            self._save_face_database()
            
            print(f"✓ Added face for {person_name}")
            return {
                "success": True,
                "message": f"Face added for {person_name}",
                "total_faces": len(self.known_faces[person_name])
            }
            
        except Exception as e:
            print(f"❌ Error adding face: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def _extract_video_frames(self, video_path: str, frame_count: int, duration: float) -> List[str]:
        """Extract frames from video using FFmpeg"""
        try:
            frame_paths = []
            
            # Create temporary directory for frames
            temp_dir = tempfile.mkdtemp()
            
            # Calculate frame extraction interval
            interval = max(1, duration / frame_count)
            
            for i in range(frame_count):
                timestamp = i * interval
                frame_path = os.path.join(temp_dir, f"frame_{i:03d}.jpg")
                
                # Extract frame at specific timestamp
                (
                    ffmpeg
                    .input(video_path, ss=timestamp)
                    .output(frame_path, vframes=1, format='image2', vcodec='mjpeg')
                    .overwrite_output()
                    .run(quiet=True)
                )
                
                if os.path.exists(frame_path):
                    frame_paths.append(frame_path)
            
            return frame_paths
            
        except Exception as e:
            print(f"Error extracting video frames: {e}")
            return []
    
    def _extract_and_analyze_audio(self, video_path: str) -> Optional[Dict[str, Any]]:
        """Extract audio from video and analyze"""
        try:
            # Create temporary audio file
            temp_audio = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
            temp_audio.close()
            
            # Extract audio using FFmpeg
            (
                ffmpeg
                .input(video_path)
                .output(temp_audio.name, acodec='pcm_s16le', ac=1, ar='16000')
                .overwrite_output()
                .run(quiet=True)
            )
            
            # Use WhisperX STT for transcription (if available)
            # For now, return basic audio info
            audio_info = {
                "has_audio": True,
                "audio_file": temp_audio.name,
                "transcription": "Audio transcription would be handled by STT system"
            }
            
            # Clean up
            os.unlink(temp_audio.name)
            
            return audio_info
            
        except Exception as e:
            print(f"Error extracting audio: {e}")
            return {"has_audio": False, "error": str(e)}
    
    def _get_image_metadata(self, image_path: str) -> Dict[str, Any]:
        """Get image metadata"""
        try:
            image = Image.open(image_path)
            return {
                "format": image.format,
                "size": image.size,
                "mode": image.mode,
                "file_size": os.path.getsize(image_path)
            }
        except:
            return {}
    
    def _get_video_metadata(self, video_path: str) -> Dict[str, Any]:
        """Get video metadata using FFmpeg"""
        try:
            probe = ffmpeg.probe(video_path)
            video_stream = next((stream for stream in probe['streams'] if stream['codec_type'] == 'video'), None)
            
            if video_stream:
                duration = float(probe['format']['duration'])
                return {
                    "duration": duration,
                    "width": video_stream['width'],
                    "height": video_stream['height'],
                    "fps": eval(video_stream['r_frame_rate']),
                    "codec": video_stream['codec_name'],
                    "file_size": int(probe['format']['size'])
                }
        except:
            pass
        
        return {}
    
    def _generate_alzheimer_insights(self, caption: str, qa_results: List, face_results: List) -> Dict[str, Any]:
        """Generate insights specific to Alzheimer's patients"""
        insights = {
            "family_members_detected": len([f for f in face_results if f["is_known"]]),
            "unknown_faces": len([f for f in face_results if not f["is_known"]]),
            "emotional_context": self._extract_emotions_from_text(caption),
            "memory_triggers": self._identify_memory_triggers(caption, qa_results),
            "social_context": "family_gathering" if len(face_results) > 1 else "individual"
        }
        
        return insights
    
    def _generate_video_alzheimer_insights(self, frame_analyses: List, audio_analysis: Optional[Dict]) -> Dict[str, Any]:
        """Generate video insights for Alzheimer's patients"""
        # Aggregate insights from all frames
        total_known_faces = sum(
            analysis["analysis"]["alzheimer_insights"]["family_members_detected"] 
            for analysis in frame_analyses
        )
        
        return {
            "video_type": "family_video" if total_known_faces > 0 else "general_video",
            "family_presence": total_known_faces > 0,
            "scene_changes": len(frame_analyses),
            "has_conversation": audio_analysis and audio_analysis.get("has_audio", False)
        }
    
    def _create_video_summary(self, frame_analyses: List, audio_analysis: Optional[Dict]) -> str:
        """Create a summary of the video content"""
        if not frame_analyses:
            return "Unable to analyze video content"
        
        # Extract key themes from frame captions
        captions = [analysis["analysis"]["caption"] for analysis in frame_analyses]
        
        # Simple summary (in production, use more sophisticated summarization)
        if len(captions) > 0:
            return f"Video showing: {captions[0]}. Contains {len(frame_analyses)} key scenes."
        
        return "Video content analyzed"
    
    def _extract_emotions_from_text(self, text: str) -> List[str]:
        """Extract emotional indicators from text"""
        emotion_keywords = {
            "happy": ["happy", "smile", "joy", "celebration", "laugh"],
            "sad": ["sad", "cry", "tears", "upset"],
            "excited": ["excited", "fun", "play", "active"],
            "calm": ["peaceful", "quiet", "rest", "relax"]
        }
        
        detected_emotions = []
        text_lower = text.lower()
        
        for emotion, keywords in emotion_keywords.items():
            if any(keyword in text_lower for keyword in keywords):
                detected_emotions.append(emotion)
        
        return detected_emotions
    
    def _identify_memory_triggers(self, caption: str, qa_results: List) -> List[str]:
        """Identify potential memory triggers"""
        triggers = []
        
        # Common memory trigger patterns
        trigger_patterns = [
            "birthday", "wedding", "family", "children", "grandchildren",
            "home", "garden", "cooking", "celebration", "holiday"
        ]
        
        text_to_analyze = caption.lower()
        for qa in qa_results:
            text_to_analyze += " " + qa["answer"].lower()
        
        for pattern in trigger_patterns:
            if pattern in text_to_analyze:
                triggers.append(pattern)
        
        return triggers
    
    def get_known_faces(self) -> Dict[str, int]:
        """Get list of known faces and their counts"""
        return {
            name: len(encodings) 
            for name, encodings in self.known_faces.items()
        }
    
    def get_processing_history(self, patient_id: Optional[str] = None) -> List[Dict]:
        """Get processing history"""
        if patient_id:
            return [
                record for record in self.processing_history.values()
                if record.get("patient_id") == patient_id
            ]
        return list(self.processing_history.values())


# Global document processor instance
document_processor = None

def initialize_document_processor():
    """Initialize document processor"""
    global document_processor
    print("Initializing Document Understanding System...")
    
    document_processor = DocumentProcessor(device="auto")
    print("✓ Document Understanding System initialized")

if __name__ == "__main__":
    # Initialize processor
    init_thread = threading.Thread(target=initialize_document_processor)
    init_thread.start()
    init_thread.join()
    
    print("Document Understanding System ready for testing!")