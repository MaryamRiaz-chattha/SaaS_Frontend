# Session Security Implementation

## Overview

This document describes the comprehensive security implementation to prevent multiple concurrent logins on the same browser. The system ensures that only one user account can be active at a time within a single browser session.

## The Security Issue

**Problem**: Without session management, users could:
1. Login to Account A in one tab
2. Login to Account B in another tab
3. Both sessions would overwrite each other's data in localStorage
4. This causes:
   - Session confusion (actions performed on wrong account)
   - Data leakage (information from one account visible to another)
   - Security vulnerabilities (potential session hijacking)

## Solution Architecture

### 1. Session ID Generation
Each login generates a unique session ID that tracks the current active session.

```typescript
// Format: session_<timestamp>_<random_string>
const sessionId = generateSessionId()
```

### 2. Active User Tracking
The system maintains an `active_user_id` in localStorage that identifies which user owns the current session.

### 3. Session Validation
On every app initialization and periodically during use, the system validates:
- Authentication token exists
- User data exists
- Session ID exists
- Active user ID matches the current user

### 4. Multi-Tab Synchronization
Using the `storage` event listener, all tabs detect when another tab logs in with a different account and automatically log out.

## Implementation Components

### Core Files Modified

1. **`/src/lib/auth.ts`**
   - Added session ID generation and management
   - Added active user ID tracking
   - Added session validation logic
   - Updated `isAuthenticated()` to validate sessions
   - Updated `logout()` to clear session data

2. **`/src/lib/hooks/auth/useAuth.ts`**
   - Added session imports
   - Modified initialization to validate existing sessions
   - Modified `login()` to check for session conflicts
   - Modified `login()` to generate new session IDs
   - Modified `logout()` to clear session data
   - Added automatic logout on session conflict

3. **`/src/lib/hooks/auth/useGoogleAuth.ts`**
   - Added session management to Google OAuth flow
   - Added conflict detection for Google login
   - Added session ID generation on successful Google auth

4. **`/src/app/auth/login/page.tsx`**
   - Added session conflict detection
   - Added warning dialog for account switching
   - Added session ID generation for URL-based auth
   - Added session regeneration for missing session data

5. **`/src/components/SessionMonitor.tsx`** (NEW)
   - Monitors session validity every 5 seconds
   - Listens for storage changes across tabs
   - Automatically logs out on session conflict
   - Shows user-friendly notifications

6. **`/src/components/auth/SessionConflictDialog.tsx`** (NEW)
   - Warning dialog for account switching
   - Shows current and new account emails
   - Allows users to confirm or cancel account switch

7. **`/src/app/dashboard/layout.tsx`**
   - Integrated SessionMonitor component
   - Ensures continuous session monitoring in dashboard

## How It Works

### Login Flow

```
User attempts login
  ↓
Check for existing session
  ↓
Is existing session for different user? ─── No ──→ Proceed with login
  ↓ Yes                                              ↓
Show warning dialog                             Generate new session ID
  ↓                                                   ↓
User confirms? ─── No ──→ Cancel login         Store session data
  ↓ Yes                                              ↓
Force logout existing session                  Complete login
  ↓
Proceed with login
```

### Session Validation Flow

```
App loads or periodic check
  ↓
Validate session
  ↓
  ├─ Token exists? ─── No ──→ Invalid session
  ├─ User data exists? ─── No ──→ Invalid session
  ├─ Session ID exists? ─── No ──→ Invalid session
  ├─ Active user ID exists? ─── No ──→ Invalid session
  └─ Active user matches current user? ─── No ──→ Invalid session
  ↓ All Yes
Valid session
```

### Multi-Tab Conflict Detection

```
Tab 1: User A logged in
  ↓
Tab 2: User B logs in
  ↓
localStorage updated with User B's session
  ↓
storage event fired
  ↓
Tab 1 detects storage change
  ↓
Tab 1 validates session
  ↓
Session validation fails (user mismatch)
  ↓
Tab 1 shows "Session Conflict" notification
  ↓
Tab 1 automatically logs out after 1.5s
  ↓
Tab 1 redirects to login page
```

## Storage Keys

The system uses the following localStorage keys:

| Key | Purpose | Example Value |
|-----|---------|---------------|
| `auth_token` | JWT authentication token | `eyJhbGc...` |
| `user_data` | Current user information | `{"id":"123","email":"user@example.com",...}` |
| `session_id` | Unique session identifier | `session_1728400000000_abc123` |
| `active_user_id` | ID of the active user | `123` |

## Security Features

### 1. Automatic Session Termination
When a different user logs in, all existing sessions are automatically terminated.

### 2. Cross-Tab Synchronization
All tabs/windows detect session changes and respond accordingly.

### 3. Periodic Validation
Sessions are validated every 5 seconds to detect conflicts quickly.

### 4. User Warnings
Clear warnings are shown before switching accounts to prevent accidental logouts.

### 5. Complete Cleanup
On logout, all session-related data is thoroughly cleared from localStorage.

## User Experience

### Scenario 1: User tries to login with different account
1. User is currently logged in as `user1@example.com`
2. User enters credentials for `user2@example.com`
3. Warning dialog appears:
   ```
   ⚠️ Account Switch Detected
   
   You are currently logged in as user1@example.com.
   You are attempting to login as user2@example.com.
   
   Logging in with a different account will terminate your current session.
   All unsaved work will be lost.
   
   Do you want to continue?
   
   [Cancel] [Yes, Switch Account]
   ```
4. If user confirms:
   - Existing session is terminated
   - New session is created
   - User is logged in with new account

### Scenario 2: User logs in on different tab
1. Tab 1: User is logged in as `user1@example.com`
2. Tab 2: User logs in as `user2@example.com`
3. Tab 1 detects the change within 5 seconds
4. Tab 1 shows notification:
   ```
   Session Conflict Detected
   Another account has logged in. You will be logged out.
   ```
5. Tab 1 automatically logs out and redirects to login

### Scenario 3: User opens app in new tab
1. New tab opens
2. Session validation runs
3. If session is valid, user remains logged in
4. If session is invalid (e.g., another user logged in), user is logged out

## Console Logging

The system provides detailed console logging for debugging:

- `🆔` Session ID generation
- `⚠️` Session conflicts detected
- `🔒` Forced logouts
- `✅` Successful authentication with session tracking
- `🔍` Session monitor initialization
- `📢` Storage change detection
- `🔓` Logout operations

## Testing

To test the implementation:

### Test 1: Same-tab login conflict
1. Login with Account A
2. Try to login with Account B in the same tab
3. **Expected**: Warning dialog appears
4. Confirm the switch
5. **Expected**: Account A is logged out, Account B is logged in

### Test 2: Multi-tab login conflict
1. Open Tab 1 and login with Account A
2. Open Tab 2 and login with Account B
3. **Expected**: Tab 1 shows "Session Conflict" notification and logs out

### Test 3: Session persistence
1. Login with an account
2. Refresh the page
3. **Expected**: User remains logged in
4. Open in new tab
5. **Expected**: User remains logged in in both tabs

### Test 4: Invalid session recovery
1. Login with an account
2. Manually delete `session_id` from localStorage in DevTools
3. Refresh or wait 5 seconds
4. **Expected**: User is logged out automatically

## Migration Guide

### For Existing Users
Existing users who were logged in before this implementation will have their sessions automatically migrated:

1. On first load, the system detects missing session data
2. If `auth_token` and `user_data` exist, new session data is generated:
   - New session ID is created
   - Active user ID is set from user data
3. User continues their session without interruption

## Security Considerations

### What This Protects Against
- ✅ Multiple concurrent logins in same browser
- ✅ Session confusion between accounts
- ✅ Data leakage between accounts
- ✅ Accidental account switching

### What This Does NOT Protect Against
- ❌ Multiple logins from different browsers/devices (this is typically allowed)
- ❌ Token theft (requires additional security measures like HTTPS, secure storage)
- ❌ XSS attacks (requires proper input sanitization and CSP headers)
- ❌ CSRF attacks (requires CSRF tokens)

### Recommendations
For production deployment, also implement:
1. **HTTPS only** for all connections
2. **HttpOnly cookies** instead of localStorage for tokens (more secure)
3. **CSRF protection** for all state-changing operations
4. **Session expiry** with automatic token refresh
5. **Backend session validation** to prevent token reuse
6. **IP-based session tracking** for additional security
7. **Device fingerprinting** to detect suspicious activity

## Troubleshooting

### Issue: User keeps getting logged out
**Possible causes**:
- Multiple tabs/windows with different accounts
- Session data corruption
- Browser extensions interfering with localStorage

**Solution**:
- Clear browser cache and localStorage
- Close all tabs and login again
- Disable browser extensions temporarily

### Issue: Warning dialog appears incorrectly
**Possible cause**: Stale user data in localStorage

**Solution**:
- Check DevTools → Application → Local Storage
- Verify `user_data` is valid JSON
- Clear and re-login if corrupted

### Issue: Session monitor not working
**Possible causes**:
- Component not mounted
- Browser doesn't support storage events

**Solution**:
- Verify `SessionMonitor` is in dashboard layout
- Check browser console for errors
- Ensure using modern browser with localStorage support

## Future Enhancements

Potential improvements for future versions:

1. **Backend Session Registry**
   - Store active sessions in backend database
   - Validate sessions on every API call
   - Support session revocation from backend

2. **Session Timeout**
   - Implement automatic logout after inactivity
   - Show countdown before timeout
   - Allow session extension

3. **Device Management**
   - Show list of active devices
   - Allow users to remotely log out devices
   - Send notifications on new device login

4. **Advanced Session Policies**
   - Allow/disallow multiple simultaneous sessions
   - Limit number of active sessions per user
   - Enforce single-session mode for sensitive accounts

5. **Session Analytics**
   - Track session duration
   - Monitor session conflicts
   - Alert on suspicious session activity

## Conclusion

This implementation provides robust protection against multiple concurrent logins within the same browser, significantly improving security and user experience. The system is transparent to legitimate users while preventing common session-related security issues.
