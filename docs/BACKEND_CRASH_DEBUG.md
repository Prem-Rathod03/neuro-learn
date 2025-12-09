# Backend Crash Debugging Guide

## Current Status
✅ **Backend is running** - Process active on port 8030
✅ **No syntax errors** - Code imports successfully
✅ **API endpoints working** - `/api/activity/submit` returns success
✅ **SubmitRequest model valid** - New fields accepted

---

## Potential Issues Fixed

### 1. Pydantic v2 Compatibility
**Issue:** `payload.dict()` is deprecated in Pydantic v2
**Fix:** Updated to use `model_dump()` with fallback

```python
# Before (might crash in Pydantic v2):
doc = payload.dict()

# After (works in both v1 and v2):
doc = payload.model_dump() if hasattr(payload, 'model_dump') else payload.dict()
```

---

## How to Check if Backend Crashed

### 1. Check if Backend is Running
```bash
ps aux | grep uvicorn
# Should show a Python process running uvicorn
```

### 2. Check Backend Logs
```bash
cd backend
tail -50 backend.log
# Look for ERROR, Exception, or Traceback
```

### 3. Test API Endpoint
```bash
curl http://127.0.0.1:8030/api/activity/next?moduleId=M1
# Should return JSON activity data
```

### 4. Check for Port Conflicts
```bash
lsof -i :8030
# Should show uvicorn process
```

---

## Common Crash Causes

### 1. **Syntax Error in Code**
- **Symptom:** Backend won't start
- **Check:** `python3 -c "from app.main import app"`
- **Fix:** Check for typos, missing imports

### 2. **Pydantic Validation Error**
- **Symptom:** 422 Unprocessable Entity
- **Check:** Request payload matches SubmitRequest model
- **Fix:** Ensure all required fields are present

### 3. **MongoDB Connection Error**
- **Symptom:** 500 Internal Server Error
- **Check:** MongoDB is running
- **Fix:** Start MongoDB or check connection string

### 4. **Import Error**
- **Symptom:** ModuleNotFoundError
- **Check:** All imports are correct
- **Fix:** Install missing packages

### 5. **Port Already in Use**
- **Symptom:** `[Errno 48] Address already in use`
- **Check:** Another process on port 8030
- **Fix:** Kill old process or use different port

---

## Restart Backend

### If Backend Crashed:
```bash
cd backend

# Kill existing process
pkill -f "uvicorn app.main"

# Restart
python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8030 > backend.log 2>&1 &
```

### Check if Restarted Successfully:
```bash
sleep 3
curl http://127.0.0.1:8030/api/activity/next?moduleId=M1
# Should return activity data
```

---

## Debug Steps

### Step 1: Check Backend Status
```bash
ps aux | grep uvicorn
```

### Step 2: Check Recent Logs
```bash
tail -50 backend/backend.log | grep -i error
```

### Step 3: Test Import
```bash
cd backend
python3 -c "from app.routes.activity import SubmitRequest; print('OK')"
```

### Step 4: Test API
```bash
curl http://127.0.0.1:8030/api/activity/next?moduleId=M1
```

### Step 5: Check MongoDB
```bash
# If MongoDB is local
mongosh neurolearn --eval "db.stats()"
```

---

## If Backend Keeps Crashing

### Check for:
1. **Missing dependencies**
   ```bash
   pip3 install -r requirements.txt
   ```

2. **Python version**
   ```bash
   python3 --version  # Should be 3.9+
   ```

3. **Environment variables**
   ```bash
   cat backend/.env
   # Check MONGODB_URI, etc.
   ```

4. **File permissions**
   ```bash
   ls -la backend/app/
   # Files should be readable
   ```

---

## Current Fix Applied

✅ **Fixed Pydantic compatibility** - Uses `model_dump()` with fallback
✅ **Backend is running** - Process active
✅ **API working** - Endpoints responding

If you're still seeing crashes, check:
1. Browser console for frontend errors
2. Backend logs for Python errors
3. Network tab for failed API calls

---

**The backend should now be stable with the Well-Being Layer changes!** 🎯

