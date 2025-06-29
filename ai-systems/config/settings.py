"""
Common settings and configuration for all AI systems
"""

import os
from pathlib import Path

# Base paths
AI_SYSTEMS_ROOT = Path(__file__).parent.parent
MODELS_DIR = AI_SYSTEMS_ROOT / "models"
GENERATED_AUDIO_DIR = AI_SYSTEMS_ROOT / "generated_audio"
LOGS_DIR = AI_SYSTEMS_ROOT / "logs"

# Create directories if they don't exist
MODELS_DIR.mkdir(exist_ok=True)
GENERATED_AUDIO_DIR.mkdir(exist_ok=True)
LOGS_DIR.mkdir(exist_ok=True)

# API Settings
TTS_API_HOST = "localhost"
TTS_API_PORT = 8000
CONVERSATION_API_HOST = "localhost"
CONVERSATION_API_PORT = 8001

# TTS Settings
TTS_SAMPLE_RATE = 24000
TTS_DEFAULT_SPEAKER = "kavya"
TTS_AVAILABLE_SPEAKERS = ["kavya", "agastya", "maitri", "vinaya"]

# Conversation AI Settings
CONVERSATION_MODEL_REPO = "SandLogicTechnologies/LLama3-Gaja-Hindi-8B-GGUF"
CONVERSATION_MODEL_FILE = "*llama3-gaja-hindi-8b-v0.1.Q5_K_M.gguf"
CONVERSATION_MAX_CONTEXT = 4096
CONVERSATION_MAX_TOKENS = 256

# GPU Settings
USE_GPU = True
GPU_MEMORY_FRACTION = 0.8

# Logging
LOG_LEVEL = "INFO"