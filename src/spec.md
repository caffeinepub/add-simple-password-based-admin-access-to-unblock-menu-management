# Specification

## Summary
**Goal:** Add a simple password-based admin unlock so authorized users can access the admin dashboard and manage menu items.

**Planned changes:**
- Replace the current “Admin Token” gate on `/admin` with an “Admin Password” entry screen and clear English copy.
- Accept the exact password `admin 9828`; on success, store it in session storage under the existing key `caffeineAdminToken` and grant admin access for the current session.
- After password submission, automatically recreate/refresh the backend actor and re-run the admin check so the admin dashboard loads without manual URL changes.
- Enforce admin authorization for all admin-only backend methods (menu category/item CRUD, reordering, analytics) using the session-provided secret.

**User-visible outcome:** Visiting `/admin` shows an Admin Password prompt; entering `admin 9828` unlocks the admin dashboard for the session, while incorrect passwords show an error and do not grant access.
