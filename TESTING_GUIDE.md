# Quick Testing Guide

## How to Test the New Features

### 1. Testing Welcome Dialog + Mood Check-In Flow

**Steps:**
1. Start the development server: `npm run dev`
2. Navigate to the login page
3. Sign in with your account
4. **Expected:** Welcome dialog appears immediately
   - ✅ Cannot close by clicking outside
   - ✅ Cannot close with ESC key
   - ✅ Continue button is disabled
5. Check the "I agree to Privacy Policy and Terms" checkbox
   - ✅ Continue button becomes enabled
6. Click "Continue to Saathi"
   - ✅ Welcome dialog closes
   - ✅ Mood Check-In dialog appears
7. Select any mood (e.g., Happy)
   - ✅ Selected mood card is highlighted with a ring
8. Click "Continue"
   - ✅ Dialog closes
   - ✅ Home screen appears
   - ✅ "Start Chatting" button visible in bottom-right

### 2. Testing Logout on Refresh

**Steps:**
1. After completing the flow above (logged in on home screen)
2. Press F5 or Ctrl+R to refresh the page
3. **Expected:** 
   - ✅ User is automatically logged out
   - ✅ Redirected to login page (or not authenticated state)
4. Sign in again
5. **Expected:**
   - ✅ Welcome dialog appears again
   - ✅ Must complete full flow again

### 3. Testing "Start Chatting" Button

**Steps:**
1. On the home page (after completing onboarding)
2. Locate the floating "Start Chatting" button (bottom-right)
3. Click the button
4. **Expected:**
   - ✅ Navigates to `/ai-chat` page
   - ✅ AI chat interface loads
5. Use browser back button to return to home
6. Button should still be visible and functional

### 4. Testing Theme Toggle

**Steps:**
1. Click the Settings icon (⚙️) in the navigation bar
2. Navigate to Settings page
3. In the "Appearance" section, find the "Theme Mode" dropdown
4. Change from "Light Mode" to "Dark Mode"
5. **Expected:**
   - ✅ Entire app switches to dark theme immediately
   - ✅ All colors, backgrounds, and text adjust
   - ✅ Theme preference is saved
6. Navigate to other pages (home, AI chat, etc.)
   - ✅ Theme persists across all pages
7. Switch back to "Light Mode"
   - ✅ App returns to light theme

### 5. Testing Sign In/Sign Out

**Steps:**

**When Logged Out:**
1. Go to Settings page
2. **Expected:**
   - ✅ "Sign In" button is visible
   - ✅ No user email shown
3. Click "Sign In"
   - ✅ Redirects to login page

**When Logged In:**
1. Complete sign-in and onboarding
2. Go to Settings page
3. **Expected:**
   - ✅ User email is displayed
   - ✅ "Sign Out" button is visible (red/destructive)
4. Click "Sign Out"
   - ✅ Success toast notification
   - ✅ Redirected to login page
   - ✅ All session data cleared
5. Sign in again
   - ✅ Welcome dialog appears (fresh start)

### 6. Testing Mobile Responsiveness

**Steps:**
1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select a mobile device (e.g., iPhone 12)
4. Test all features:
   - ✅ Welcome dialog fits screen
   - ✅ Mood check-in cards are clickable
   - ✅ Navigation menu works
   - ✅ "Start Chatting" button is accessible
   - ✅ Settings page is readable
   - ✅ Theme toggle works on mobile

### 7. Testing Keyboard Accessibility

**Steps:**
1. Use Tab key to navigate through elements
2. On Welcome Dialog:
   - ✅ Can tab to checkbox
   - ✅ Can tab to Privacy/Terms links
   - ✅ Can tab to Continue button
   - ✅ Press Enter when terms checked → proceeds
3. On Mood Check-In:
   - ✅ Can tab between mood cards
   - ✅ Press Enter or Space to select
   - ✅ Can tab to Continue button
   - ✅ Press Enter to proceed
4. On Settings:
   - ✅ Can navigate theme dropdown with keyboard
   - ✅ Can activate buttons with Enter/Space

### 8. Testing Data Persistence

**Steps:**
1. Complete onboarding and select a mood
2. Open browser DevTools → Application → Local Storage
3. **Expected to see:**
   - ✅ `hasSeenWelcome: "true"`
   - ✅ `hasCompletedMoodCheckIn: "true"`
   - ✅ `lastMoodCheckIn: {"mood":"happy","timestamp":"..."}`
   - ✅ `moodHistory: [{"mood":"happy","timestamp":"..."}]`
   - ✅ `theme: "light"` or `"dark"`
4. Check Session Storage
   - ✅ `pageWasRefreshed: "true"`
5. Click Sign Out
6. Check Local Storage again
   - ✅ `hasSeenWelcome` removed
   - ✅ `hasCompletedMoodCheckIn` removed
   - ✅ Session Storage cleared

## Common Issues & Solutions

### Issue: Welcome dialog doesn't appear on login
**Solution:** Clear localStorage and try again. Make sure you're actually signing in (not just visiting the page).

### Issue: Theme doesn't persist after refresh
**Note:** Theme should NOT persist after refresh because the user is logged out. This is expected behavior.

### Issue: "Start Chatting" button not visible
**Solution:** Make sure you've completed the Welcome + Mood Check-In flow first.

### Issue: Can close dialogs with ESC
**Fix:** This should be prevented. If it happens, check that `onEscapeKeyDown` is set properly.

## Quick Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Clear all localStorage (in browser console)
localStorage.clear()

# Clear all sessionStorage (in browser console)
sessionStorage.clear()
```

## Browser Console Tests

Run these in the browser console to test specific features:

```javascript
// Check if user has seen welcome
localStorage.getItem('hasSeenWelcome')

// Check mood history
JSON.parse(localStorage.getItem('moodHistory') || '[]')

// Check current theme
localStorage.getItem('theme')

// Manually reset onboarding (to test again)
localStorage.removeItem('hasSeenWelcome')
localStorage.removeItem('hasCompletedMoodCheckIn')
// Then sign in again

// Check if page was refreshed
sessionStorage.getItem('pageWasRefreshed')
```

## Test Coverage Checklist

- [ ] Welcome dialog flow works
- [ ] Mood check-in flow works
- [ ] Logout on refresh works
- [ ] "Start Chatting" button navigates correctly
- [ ] Theme toggle changes theme
- [ ] Theme persists (until logout)
- [ ] Sign In button works (when logged out)
- [ ] Sign Out button works (when logged in)
- [ ] Settings page is accessible
- [ ] Mobile view works for all features
- [ ] Keyboard navigation works
- [ ] Dark mode looks good
- [ ] Light mode looks good
- [ ] Privacy/Terms links open in new tab
- [ ] Data stored correctly in localStorage
- [ ] Session cleared on logout
- [ ] Can repeat onboarding after logout

---

**All features implemented! Test thoroughly before deployment.**
