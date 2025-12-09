# Debug: "Loading activity" Issue

## Quick Fix - Use Mock Data Directly

The issue is that the API call might be hanging. Here's what to check:

### 1. Check Browser Console (F12)
Open browser DevTools (F12) → Console tab
Look for:
- "Attempting to fetch activity from API..."
- "Getting fallback activity..."
- Any red error messages

### 2. Check if Backend is Running
```bash
# In backend directory
cd "/Users/premrathod/Documents/Neuro Learn/backend"
uvicorn app.main:app --reload --port 8030
```

### 3. Test API Directly
Open browser and go to: `http://127.0.0.1:8030/api/activity/next`
- If it loads → Backend is working
- If it hangs/errors → Backend issue

### 4. Temporary Fix: Use Mock Data Only

If you want to skip the API and use mock data immediately, the code should already do this after 1 second timeout. But if it's still hanging, check:

1. Is the timeout working? (Check console for "Request timeout")
2. Is the fallback being called? (Check console for "Falling back to mock data...")
3. Is the activity being set? (Check console for "Setting activity: M1_L1_Q1")

### 5. Force Mock Data (Quick Test)

To test if mock data works, temporarily comment out the API call in `loadNext()`:

```typescript
// Skip API, use mock data directly
const fallbackActivity = getFallbackActivity();
if (fallbackActivity) {
  setActivityAndReset(fallbackActivity);
  return;
}
```

This will tell us if the issue is:
- API hanging (if mock data works)
- Mock data not loading (if this also fails)
- Component rendering issue (if state isn't updating)

