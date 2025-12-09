#!/bin/bash

# Neuro Learn - Start Script
# Starts both backend and frontend servers

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/Frontend"

echo -e "${BLUE}🚀 Starting Neuro Learn Platform...${NC}\n"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down servers...${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    wait $BACKEND_PID 2>/dev/null || true
    wait $FRONTEND_PID 2>/dev/null || true
    echo -e "${GREEN}✅ Servers stopped${NC}"
    exit 0
}

# Trap Ctrl+C and call cleanup
trap cleanup SIGINT SIGTERM

# Check if ports are already in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo -e "${RED}⚠️  Port $port is already in use${NC}"
        return 1
    fi
    return 0
}

# Start Backend
echo -e "${BLUE}📦 Starting Backend Server...${NC}"
if ! check_port 8030; then
    echo -e "${YELLOW}   Backend port 8030 is in use. Skipping backend start.${NC}"
    BACKEND_PID=""
else
    cd "$BACKEND_DIR"
    
    # Check if virtual environment exists
    if [ -d ".venv" ]; then
        source .venv/bin/activate
    elif [ -d "venv" ]; then
        source venv/bin/activate
    fi
    
    # Start backend in background
    python3 -m uvicorn app.main:app --host 127.0.0.1 --port 8030 --reload > backend.log 2>&1 &
    BACKEND_PID=$!
    echo -e "${GREEN}   ✅ Backend started (PID: $BACKEND_PID) on http://127.0.0.1:8030${NC}"
    sleep 2
fi

# Start Frontend
echo -e "\n${BLUE}🎨 Starting Frontend Server...${NC}"
if ! check_port 8080; then
    echo -e "${YELLOW}   Frontend port 8080 is in use. Skipping frontend start.${NC}"
    FRONTEND_PID=""
else
    cd "$FRONTEND_DIR"
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}   Installing frontend dependencies...${NC}"
        npm install
    fi
    
    # Start frontend in background
    npm run dev > frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo -e "${GREEN}   ✅ Frontend started (PID: $FRONTEND_PID) on http://localhost:8080${NC}"
    sleep 3
fi

# Display status
echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Neuro Learn Platform is Running!${NC}\n"
echo -e "${BLUE}📍 Backend:${NC}  http://127.0.0.1:8030"
echo -e "${BLUE}📍 Frontend:${NC} http://localhost:8080"
echo -e "${BLUE}📍 API Docs:${NC} http://127.0.0.1:8030/docs\n"
echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Wait for both processes
if [ ! -z "$BACKEND_PID" ] && [ ! -z "$FRONTEND_PID" ]; then
    wait $BACKEND_PID $FRONTEND_PID
elif [ ! -z "$BACKEND_PID" ]; then
    wait $BACKEND_PID
elif [ ! -z "$FRONTEND_PID" ]; then
    wait $FRONTEND_PID
fi

