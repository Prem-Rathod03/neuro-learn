# 🚀 Starting Neuro Learn Platform

## Quick Start

### Option 1: Bash Script (Recommended for macOS/Linux)
```bash
./start.sh
```

### Option 2: Python Script (Cross-platform)
```bash
python3 start.py
# or
./start.py
```

### Option 3: Manual Start

**Backend:**
```bash
cd backend
source .venv/bin/activate  # or: source venv/bin/activate
python3 -m uvicorn app.main:app --host 127.0.0.1 --port 8030 --reload
```

**Frontend:**
```bash
cd Frontend
npm install  # First time only
npm run dev
```

## What the Scripts Do

1. ✅ Check if ports 8030 (backend) and 8080 (frontend) are available
2. ✅ Start backend server on http://127.0.0.1:8030
3. ✅ Start frontend server on http://localhost:8080
4. ✅ Display status and URLs
5. ✅ Handle cleanup on Ctrl+C

## Access Points

- **Frontend:** http://localhost:8080
- **Backend API:** http://127.0.0.1:8030
- **API Documentation:** http://127.0.0.1:8030/docs

## Stopping the Servers

Press `Ctrl+C` in the terminal where the script is running. Both servers will be stopped automatically.

## Logs

- Backend logs: `backend/backend.log`
- Frontend logs: `Frontend/frontend.log`

## Troubleshooting

### Port Already in Use
If you see "Port XXXX is already in use":
- Stop the existing server on that port
- Or kill the process: `lsof -ti:8030 | xargs kill` (backend) or `lsof -ti:8080 | xargs kill` (frontend)

### Backend Not Starting
- Make sure virtual environment is set up: `cd backend && python3 -m venv .venv`
- Install dependencies: `pip install -r requirements.txt`

### Frontend Not Starting
- Install dependencies: `cd Frontend && npm install`
- Check Node.js version: `node --version` (should be 16+)

## Notes

- The scripts automatically detect and use virtual environments
- Backend runs with `--reload` for auto-restart on code changes
- Frontend runs in development mode with hot-reload
- Both servers run in the background and output to log files

