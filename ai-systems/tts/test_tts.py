"""
Test client for TTS API
"""

import requests
import json
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.append(str(Path(__file__).parent.parent))
from config.settings import TTS_API_HOST, TTS_API_PORT

def test_tts_api():
    """Test the TTS API"""
    url = f"http://{TTS_API_HOST}:{TTS_API_PORT}/"
    
    # Test request
    request_data = {
        "text": "Good morning! How are you feeling today?",
        "speaker": "kavya",
        "return_base64": True,
        "save_file": True
    }
    
    print("Sending TTS request...")
    response = requests.post(url, json=request_data)
    
    if response.status_code == 200:
        result = response.json()
        print("✓ TTS generation successful!")
        print(f"Duration: {result['duration']:.2f}s")
        print(f"Speaker: {result['speaker']}")
        print(f"Audio base64 length: {len(result['audio_base64'])}")
        
        if 'file_path' in result:
            print(f"✓ Audio saved to: {result['file_path']}")
    else:
        print(f"✗ Error: {response.status_code}")
        print(response.text)

if __name__ == "__main__":
    test_tts_api()