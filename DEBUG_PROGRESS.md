# Debug: Progress Not Showing in Dashboard

## Quick Debug Steps

### 1. Check Browser Console
Open browser console (F12) and look for:
```
Module M2: X/30 (Y%)
```

### 2. Check localStorage
In browser console, run:
```javascript
// Get your user email
const user = JSON.parse(localStorage.getItem('neuropath_user'));
console.log('User email:', user?.email);

// Check saved progress for M2
const progressKey = `progress_${user?.email}_M2`;
const saved = localStorage.getItem(progressKey);
console.log('Saved progress:', saved);

// Parse it
if (saved) {
  const data = JSON.parse(saved);
  console.log('Completed IDs:', data.completedIds);
  console.log('Count:', data.completedIds.length);
}
```

### 3. Check Dashboard Code
The Dashboard should:
1. Get user.email from AuthContext
2. Call getAllModuleProgress(user.email, totalActivities)
3. Use the returned completed count

### 4. Common Issues
- **Email mismatch**: localStorage key uses different email than AuthContext
- **Module ID mismatch**: Using "M2" vs "module-2"
- **Timing issue**: Dashboard loads before progress is saved
- **localStorage not persisting**: Browser settings blocking localStorage

