"""
Shared API utilities for all AI systems
"""

import json
import torch
from datetime import datetime
from http.server import BaseHTTPRequestHandler
from typing import Dict, Any


class BaseAPIHandler(BaseHTTPRequestHandler):
    """Base API handler with common functionality"""
    
    def send_json_response(self, data: Dict[str, Any], status_code: int = 200):
        """Send JSON response"""
        response_json = json.dumps(data, indent=2, ensure_ascii=False)
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Content-length', len(response_json.encode('utf-8')))
        self.end_headers()
        self.wfile.write(response_json.encode('utf-8'))
    
    def send_error_response(self, code: int, message: str):
        """Send error response"""
        error_response = {
            "error": message,
            "timestamp": datetime.now().isoformat(),
            "status_code": code
        }
        self.send_json_response(error_response, code)
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def log_message(self, format, *args):
        """Override to reduce logging noise"""
        pass


def get_gpu_info() -> Dict[str, Any]:
    """Get GPU information for system status"""
    if torch.cuda.is_available():
        return {
            "cuda_available": True,
            "device_count": torch.cuda.device_count(),
            "device_name": torch.cuda.get_device_name(0),
            "memory_allocated": f"{torch.cuda.memory_allocated(0) / 1e9:.2f} GB",
            "memory_cached": f"{torch.cuda.memory_reserved(0) / 1e9:.2f} GB",
            "cuda_version": torch.version.cuda
        }
    else:
        return {"cuda_available": False}


def optimize_for_gpu():
    """Enable GPU optimizations"""
    if torch.cuda.is_available():
        torch.backends.cudnn.benchmark = True
        torch.backends.cuda.matmul.allow_tf32 = True
        torch.backends.cudnn.allow_tf32 = True
        print("✓ GPU optimizations enabled")
    else:
        print("⚠️  GPU not available, running on CPU")