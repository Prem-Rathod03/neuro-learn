#!/usr/bin/env python3
"""
Neuro Learn - Start Script (Python version)
Starts both backend and frontend servers
"""

import os
import sys
import subprocess
import signal
import time
import socket
from pathlib import Path

# Colors for terminal output
class Colors:
    GREEN = '\033[0;32m'
    BLUE = '\033[0;34m'
    YELLOW = '\033[1;33m'
    RED = '\033[0;31m'
    NC = '\033[0m'  # No Color

def check_port(port):
    """Check if a port is already in use"""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('127.0.0.1', port))
    sock.close()
    return result != 0  # True if port is available

def find_virtual_env(backend_dir):
    """Find Python virtual environment"""
    venv_paths = [
        backend_dir / '.venv',
        backend_dir / 'venv',
    ]
    for venv_path in venv_paths:
        if venv_path.exists():
            return venv_path
    return None

def start_backend(backend_dir):
    """Start the backend server"""
    print(f"{Colors.BLUE}📦 Starting Backend Server...{Colors.NC}")
    
    if not check_port(8030):
        print(f"{Colors.YELLOW}   ⚠️  Port 8030 is already in use. Skipping backend start.{Colors.NC}")
        return None
    
    os.chdir(backend_dir)
    
    # Find and activate virtual environment
    venv = find_virtual_env(Path(backend_dir))
    python_cmd = 'python3'
    
    if venv:
        if sys.platform == 'win32':
            python_cmd = str(venv / 'Scripts' / 'python.exe')
        else:
            python_cmd = str(venv / 'bin' / 'python3')
    
    # Start backend
    try:
        process = subprocess.Popen(
            [python_cmd, '-m', 'uvicorn', 'app.main:app', 
             '--host', '127.0.0.1', '--port', '8030', '--reload'],
            stdout=open(backend_dir / 'backend.log', 'w'),
            stderr=subprocess.STDOUT,
            cwd=backend_dir
        )
        print(f"{Colors.GREEN}   ✅ Backend started (PID: {process.pid}) on http://127.0.0.1:8030{Colors.NC}")
        time.sleep(2)
        return process
    except Exception as e:
        print(f"{Colors.RED}   ❌ Failed to start backend: {e}{Colors.NC}")
        return None

def start_frontend(frontend_dir):
    """Start the frontend server"""
    print(f"\n{Colors.BLUE}🎨 Starting Frontend Server...{Colors.NC}")
    
    if not check_port(8080):
        print(f"{Colors.YELLOW}   ⚠️  Port 8080 is already in use. Skipping frontend start.{Colors.NC}")
        return None
    
    os.chdir(frontend_dir)
    
    # Check if node_modules exists
    if not (Path(frontend_dir) / 'node_modules').exists():
        print(f"{Colors.YELLOW}   Installing frontend dependencies...{Colors.NC}")
        subprocess.run(['npm', 'install'], check=False)
    
    # Start frontend
    try:
        process = subprocess.Popen(
            ['npm', 'run', 'dev'],
            stdout=open(Path(frontend_dir) / 'frontend.log', 'w'),
            stderr=subprocess.STDOUT,
            cwd=frontend_dir
        )
        print(f"{Colors.GREEN}   ✅ Frontend started (PID: {process.pid}) on http://localhost:8080{Colors.NC}")
        time.sleep(3)
        return process
    except Exception as e:
        print(f"{Colors.RED}   ❌ Failed to start frontend: {e}{Colors.NC}")
        return None

def cleanup(backend_process, frontend_process):
    """Cleanup function to stop both servers"""
    print(f"\n{Colors.YELLOW}🛑 Shutting down servers...{Colors.NC}")
    
    if backend_process:
        backend_process.terminate()
        try:
            backend_process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            backend_process.kill()
    
    if frontend_process:
        frontend_process.terminate()
        try:
            frontend_process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            frontend_process.kill()
    
    print(f"{Colors.GREEN}✅ Servers stopped{Colors.NC}")

def main():
    """Main function"""
    script_dir = Path(__file__).parent.absolute()
    backend_dir = script_dir / 'backend'
    frontend_dir = script_dir / 'Frontend'
    
    print(f"{Colors.BLUE}🚀 Starting Neuro Learn Platform...{Colors.NC}\n")
    
    # Validate directories
    if not backend_dir.exists():
        print(f"{Colors.RED}❌ Backend directory not found: {backend_dir}{Colors.NC}")
        sys.exit(1)
    
    if not frontend_dir.exists():
        print(f"{Colors.RED}❌ Frontend directory not found: {frontend_dir}{Colors.NC}")
        sys.exit(1)
    
    backend_process = None
    frontend_process = None
    
    try:
        # Start servers
        backend_process = start_backend(backend_dir)
        frontend_process = start_frontend(frontend_dir)
        
        # Display status
        print(f"\n{Colors.GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━{Colors.NC}")
        print(f"{Colors.GREEN}✅ Neuro Learn Platform is Running!{Colors.NC}\n")
        print(f"{Colors.BLUE}📍 Backend:{Colors.NC}  http://127.0.0.1:8030")
        print(f"{Colors.BLUE}📍 Frontend:{Colors.NC} http://localhost:8080")
        print(f"{Colors.BLUE}📍 API Docs:{Colors.NC} http://127.0.0.1:8030/docs\n")
        print(f"{Colors.YELLOW}Press Ctrl+C to stop both servers{Colors.NC}")
        print(f"{Colors.GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━{Colors.NC}\n")
        
        # Wait for processes
        processes = [p for p in [backend_process, frontend_process] if p]
        if processes:
            while any(p.poll() is None for p in processes):
                time.sleep(1)
    
    except KeyboardInterrupt:
        pass
    finally:
        cleanup(backend_process, frontend_process)

if __name__ == '__main__':
    main()

