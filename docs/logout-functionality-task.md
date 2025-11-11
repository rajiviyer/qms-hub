# Logout Functionality Implementation Task

**Status**: 🔴 Not Started  
**Created**: 2024-12-19  
**Priority**: Medium  
**Estimated Effort**: 2-3 hours

## Overview

Implement logout functionality in the QMS Hub UI to allow users to securely sign out of their sessions.

## Requirements

### Frontend Requirements
- [ ] Add logout function to UserContext that:
  - Clears authentication cookies (`access_token`, `user_email`, `user_name`)
  - Resets user state to default/empty
  - Redirects user to `/sign-in` page
- [ ] Add logout button to Header component (`/frontend/app/landing/components/Header.tsx`)
- [ ] Ensure logout button is clearly visible and accessible
- [ ] Test logout flow: click logout → cookies cleared → redirect to sign-in → protected routes blocked

### Backend Requirements (Optional - Recommended for Security)
- [ ] Create `POST /api/logout` endpoint in `/backend/app/route.py`
- [ ] Create `logout_user` controller function in `/backend/app/controllers/user_controller.py`
- [ ] Invalidate/clear refresh token in database when user logs out
- [ ] Return success response

### UI/UX Requirements
- [ ] Logout button should have appropriate icon (e.g., `HiOutlinePower` or `HiOutlineArrowRightOnRectangle`)
- [ ] Button should match existing design patterns
- [ ] Optional: Show user name/email in header before logout button
- [ ] Optional: Add confirmation dialog before logout (if needed)

## Implementation Plan

### Phase 1: Frontend Core Functionality
1. Update `UserContext.tsx`:
   - Add `logout` function to context
   - Update `UserContextType` interface to include `logout`
   - Import `deleteCookie` from `cookies-next`
   - Import `useRouter` from `next/navigation` for redirect

2. Update `Header.tsx`:
   - Import `useUserContext` hook
   - Add logout button with icon
   - Wire up click handler to call logout function

### Phase 2: Backend Integration (Optional)
3. Create logout controller:
   - Function to identify user from token/email
   - Clear/invalidate refresh token in database

4. Create logout route:
   - `POST /api/logout` endpoint
   - Call logout controller
   - Return success response

5. Update frontend:
   - Optionally call backend logout endpoint before clearing cookies

### Phase 3: Testing & Polish
6. Test logout flow end-to-end
7. Verify middleware blocks access after logout
8. Check cookie cleanup
9. Verify user state reset

## Technical Details

### Files to Modify
- `/frontend/app/_context/UserContext.tsx` - Add logout function
- `/frontend/app/landing/components/Header.tsx` - Add logout button
- `/frontend/app/landing/components/SideBar.tsx` - Optional: Uncomment logout menu item

### Files to Create (Backend - Optional)
- Controller function in `/backend/app/controllers/user_controller.py`
- Route in `/backend/app/route.py`

### Cookies to Clear
- `access_token` (main authentication token)
- `user_email` (set by middleware)
- `user_name` (set by middleware)
- `refresh_token` (if stored in future)

### Dependencies
- `cookies-next` - Already used in project (`deleteCookie` function)
- `next/navigation` - Already used (`useRouter` hook)
- React icons - Already used (`HiOutlinePower` or similar)

## Testing Checklist
- [ ] Logout button appears in Header
- [ ] Clicking logout clears all cookies
- [ ] User context resets to empty state
- [ ] Redirect to `/sign-in` works
- [ ] Middleware blocks access to `/landing/*` after logout
- [ ] Middleware blocks access to `/create-car/*` after logout
- [ ] User can sign in again after logout
- [ ] (If backend implemented) Backend endpoint invalidates refresh token

## Notes
- Sidebar component has commented-out logout menu item (lines 37-42) - can be used as alternative/additional location
- Current authentication uses JWT tokens stored in cookies
- Middleware at `/frontend/middleware.ts` protects routes based on `access_token` cookie
- UserContext manages user state (email, name, organization)

## Status History
- 2024-12-19: Task created - Analysis completed, ready for implementation

## Related Documentation
- See analysis notes in conversation for detailed technical breakdown
- `/docs/technical-architecture.md` - Authentication flow details
- `/docs/user-guide.md` - User documentation (to be updated after implementation)