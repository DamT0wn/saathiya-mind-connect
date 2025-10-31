# Visual User Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         APP START                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
                  ┌──────────────┐
                  │  User Visits │
                  │     App      │
                  └──────┬───────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  Authenticated?      │
              └──────┬───────────────┘
                     │
          ┌──────────┴──────────┐
          │                     │
          NO                   YES
          │                     │
          ▼                     ▼
   ┌─────────────┐    ┌─────────────────────┐
   │ Show        │    │ Check localStorage: │
   │ Sign In     │    │ hasSeenWelcome?     │
   │ Button      │    └──────────┬──────────┘
   └─────┬───────┘               │
         │              ┌─────────┴─────────┐
         │              NO                 YES
         │              │                   │
         ▼              ▼                   ▼
   ┌─────────────┐  ┌──────────────────┐  ┌─────────────────────┐
   │ User Clicks │  │  WELCOME DIALOG  │  │ Check localStorage: │
   │ Sign In     │  │                  │  │ hasCompletedMood?   │
   └─────┬───────┘  │ "Welcome to      │  └──────────┬──────────┘
         │          │  Saathi!"        │             │
         │          │                  │    ┌────────┴────────┐
         ▼          │ [x] I agree to   │    NO              YES
   ┌─────────────┐ │     Privacy &    │    │                │
   │ Firebase    │ │     Terms        │    ▼                ▼
   │ Auth Flow   │ │                  │  ┌─────────────┐  ┌──────────────┐
   │ (Google/    │ │ [Continue]       │  │ MOOD CHECK- │  │ HOME SCREEN  │
   │  Email)     │ │  (disabled until │  │ IN DIALOG   │  │              │
   └─────┬───────┘ │   checkbox)      │  │             │  │ ┌──────────┐ │
         │          └────────┬─────────┘  │ "How are    │  │ │ Hero     │ │
         │                   │            │  you feeling│  │ │ Section  │ │
         │                   ▼            │  today?"    │  │ └──────────┘ │
         │          ┌─────────────────┐   │             │  │              │
         │          │ User Checks Box │   │ [6 Moods]   │  │ ┌──────────┐ │
         │          │ & Clicks        │   │ Happy  Sad  │  │ │ Features │ │
         │          │ Continue        │   │ Calm Stress │  │ └──────────┘ │
         │          └────────┬────────┘   │ Excited     │  │              │
         │                   │            │ Neutral     │  │   FLOATING:  │
         └───────────────────┤            │             │  │ ┌──────────┐ │
                             │            │ [Continue]  │  │ │  START   │ │
                             │            │  (disabled) │  │ │ CHATTING │ │
                             ▼            └──────┬──────┘  │ │  BUTTON  │ │
                    ┌─────────────────┐          │         │ └────┬─────┘ │
                    │ localStorage:   │          ▼         └──────┼───────┘
                    │ hasSeenWelcome  │  ┌────────────────┐       │
                    │ = true          │  │ User Selects   │       │
                    └────────┬────────┘  │ a Mood         │       │
                             │           └────────┬───────┘       │
                             ▼                    │               │
                    ┌─────────────────┐           ▼               │
                    │ Show MOOD       │  ┌────────────────┐       │
                    │ CHECK-IN        │  │ localStorage:  │       │
                    │ DIALOG          │  │ lastMoodCheckIn│       │
                    └─────────────────┘  │ moodHistory    │       │
                                         │ hasCompleted   │       │
                                         │ MoodCheckIn    │       │
                                         │ = true         │       │
                                         └────────┬───────┘       │
                                                  │               │
                                                  ▼               │
                                         ┌────────────────┐       │
                                         │  HOME SCREEN   │       │
                                         │  (Unlocked)    │       │
                                         └────────────────┘       │
                                                                  │
                                                  ┌───────────────┘
                                                  │
                                                  ▼
                                         ┌────────────────┐
                                         │  Navigate to   │
                                         │  /ai-chat      │
                                         └────────┬───────┘
                                                  │
                                                  ▼
                                         ┌────────────────┐
                                         │  AI CHAT       │
                                         │  INTERFACE     │
                                         └────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                      SETTINGS FLOW                              │
└─────────────────────────────────────────────────────────────────┘

User clicks ⚙️ Settings Icon (anywhere in app)
         │
         ▼
┌─────────────────────────────┐
│    SETTINGS PAGE            │
│                             │
│  ┌───────────────────────┐  │
│  │ APPEARANCE            │  │
│  │ [Theme: Light ▼]      │  │
│  │   - Light Mode        │  │
│  │   - Dark Mode         │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │ ACCOUNT               │  │
│  │                       │  │
│  │ If Logged In:         │  │
│  │ Email: user@mail.com  │  │
│  │ [Sign Out]            │  │
│  │                       │  │
│  │ If Logged Out:        │  │
│  │ [Sign In]             │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │ PRIVACY & LEGAL       │  │
│  │ [Privacy Policy]      │  │
│  │ [Terms & Conditions]  │  │
│  └───────────────────────┘  │
└─────────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                    REFRESH BEHAVIOR                             │
└─────────────────────────────────────────────────────────────────┘

User presses F5 / Ctrl+R
         │
         ▼
┌─────────────────────────┐
│ AuthContext detects     │
│ pageWasRefreshed flag   │
│ in sessionStorage       │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Clear all data:         │
│ - hasSeenWelcome        │
│ - hasCompletedMood      │
│ - sessionStorage        │
│ - Firebase signOut()    │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ User redirected to      │
│ unauthenticated state   │
│ (Must sign in again)    │
└─────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                    THEME SWITCHING                              │
└─────────────────────────────────────────────────────────────────┘

User in Settings → Changes Theme Dropdown
         │
         ▼
┌─────────────────────────┐
│ ThemeContext updates    │
│ theme state             │
└────────┬────────────────┘
         │
         ├──────────────────────────┐
         │                          │
         ▼                          ▼
┌──────────────────┐    ┌──────────────────┐
│ Add/remove       │    │ Save to          │
│ 'dark' class     │    │ localStorage     │
│ on <html>        │    │ key: 'theme'     │
└────────┬─────────┘    └──────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Entire app re-renders    │
│ with new theme colors    │
│ (CSS variables update)   │
└──────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                    DATA FLOW                                    │
└─────────────────────────────────────────────────────────────────┘

User Actions → Component State → Context → localStorage
                                          ↓
                                    sessionStorage

Example: Mood Selection
┌──────────────┐    ┌─────────────────┐    ┌──────────────┐
│ User clicks  │───→│ MoodCheckIn     │───→│ localStorage │
│ "Happy"      │    │ Dialog updates  │    │ saves:       │
│ mood card    │    │ selectedMood    │    │ - lastMood   │
└──────────────┘    └─────────────────┘    │ - moodHistory│
                                            └──────────────┘

Example: Theme Change
┌──────────────┐    ┌─────────────────┐    ┌──────────────┐
│ User selects │───→│ ThemeContext    │───→│ localStorage │
│ "Dark Mode"  │    │ setTheme('dark')│    │ theme='dark' │
└──────────────┘    └─────────────────┘    └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Document     │
                    │ <html>       │
                    │ class='dark' │
                    └──────────────┘
```

## Component Hierarchy

```
App (ThemeProvider, AuthProvider, ChatProvider)
│
├─── BrowserRouter
│    │
│    ├─── Route: / (Index)
│    │    ├─── Navigation
│    │    ├─── HeroSection
│    │    ├─── MoodTracker
│    │    ├─── Features
│    │    ├─── PrivacySection
│    │    ├─── Footer
│    │    ├─── Start Chatting Button (Fixed Position)
│    │    ├─── WelcomeDialog (Conditional)
│    │    └─── MoodCheckInDialog (Conditional)
│    │
│    ├─── Route: /login (Login)
│    │
│    ├─── Route: /settings (Settings)
│    │    ├─── Navigation
│    │    ├─── SettingsPanel
│    │    │    ├─── Theme Selector
│    │    │    ├─── Sign In/Out Buttons
│    │    │    └─── Privacy Links
│    │    └─── Footer
│    │
│    ├─── Route: /ai-chat (AIEmpathyEngine)
│    │    ├─── Navigation
│    │    ├─── ChatInterface
│    │    └─── Other features...
│    │
│    └─── Other routes...
│
├─── Toaster (Toast notifications)
└─── Sonner (Alternative toasts)
```

## State Management Overview

```
Global State:
├─── ThemeContext
│    ├─── theme: 'light' | 'dark'
│    ├─── setTheme(theme)
│    └─── toggleTheme()
│
├─── AuthContext
│    ├─── currentUser: User | null
│    ├─── loading: boolean
│    ├─── signInWithGoogle()
│    ├─── signInWithEmail()
│    ├─── logout()
│    └─── ... other auth methods
│
└─── ChatContext
     └─── Chat-related state

Local Storage:
├─── theme
├─── hasSeenWelcome
├─── hasCompletedMoodCheckIn
├─── lastMoodCheckIn
└─── moodHistory

Session Storage:
└─── pageWasRefreshed
```

## Event Flow Examples

### Sign In Flow
```
Click "Sign In" Button
  ↓
Firebase Auth Modal
  ↓
User Authenticates
  ↓
AuthContext.currentUser updates
  ↓
Index.tsx useEffect triggers
  ↓
Check localStorage.hasSeenWelcome
  ↓
Show WelcomeDialog (if needed)
  ↓
User accepts → set hasSeenWelcome
  ↓
Show MoodCheckInDialog
  ↓
User selects mood → set hasCompletedMoodCheckIn
  ↓
Home Screen unlocked
```

### Theme Switch Flow
```
User in Settings
  ↓
Clicks Theme Dropdown
  ↓
Selects "Dark Mode"
  ↓
ThemeContext.setTheme('dark')
  ↓
useEffect in ThemeContext
  ↓
document.documentElement.classList.add('dark')
  ↓
localStorage.setItem('theme', 'dark')
  ↓
CSS variables update
  ↓
Entire app re-renders with dark theme
```

### Refresh Flow
```
User presses F5
  ↓
Page reloads
  ↓
AuthProvider useEffect runs
  ↓
Check sessionStorage.pageWasRefreshed
  ↓
Flag exists → logout user
  ↓
Clear localStorage flags
  ↓
signOut(auth)
  ↓
User sees unauthenticated state
```

This visual guide helps understand how all the pieces fit together!
