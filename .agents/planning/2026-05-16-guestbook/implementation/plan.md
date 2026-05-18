# Implementation Plan: Guestbook for exoad.net

## Checklist

- [ ] Step 1: Cloudflare infra setup (D1 database, Turnstile site, wrangler config)
- [ ] Step 2: D1 schema and seed data
- [ ] Step 3: Pages Functions — submit endpoint with Turnstile verification + rate limiting
- [ ] Step 4: Pages Functions — list endpoint with pagination
- [ ] Step 5: Pages Functions — admin auth (login/logout/session middleware)
- [ ] Step 6: Pages Functions — admin endpoints (pending, approve, reject, delete, ban)
- [ ] Step 7: React — GuestbookPage (form + entries list)
- [ ] Step 8: React — GuestbookAdminPage (login + dashboard)
- [ ] Step 9: React — GuestbookCTA on HomePage
- [ ] Step 10: Routing and integration testing

---

---

## Step 1: Cloudflare Infra Setup (via Cloudflare MCP agent)

**Objective**: Create D1 database, Turnstile site, and configure wrangler.toml with bindings.

This step should be delegated to an agent with Cloudflare MCP access. See prompt below.

**Demo**: `wrangler d1 list` shows guestbook-db. Turnstile site key and secret key exist. wrangler.toml has correct bindings.

### Agent Prompt for Cloudflare MCP

```
I need you to set up the following Cloudflare resources for my Pages project at ~/Code/me:

1. Create a D1 database named "guestbook-db"
2. Create a Turnstile site for domain exoad.net (widget mode: managed, no pre-clearance)
3. Add the following to my existing wrangler.toml (or create one if it doesn't exist):
   - D1 binding: binding_name="DB", database_name="guestbook-db"
   - vars: TURNSTILE_SITE_KEY = <the site key from step 2>
4. Set these secrets via wrangler secret put:
   - ADMIN_PASSWORD = jY@A%Zb3L@3e%B
   - TURNSTILE_SECRET_KEY = <the secret key from step 2>
5. Run "wrangler d1 execute guestbook-db --file=functions/schema.sql" after I create the schema file in Step 2 — just confirm you can do this later.

The project is already deployed on Cloudflare Pages at exoad.net.
```

---

## Step 2: D1 Schema

**Objective**: Create the SQL schema file.

Create `functions/schema.sql`:
```sql
CREATE TABLE IF NOT EXISTS entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  approved INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_approved ON entries(approved);
CREATE INDEX IF NOT EXISTS idx_created_at ON entries(created_at);
CREATE TABLE IF NOT EXISTS bans (
  ip TEXT PRIMARY KEY,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);\u000d\u000a```\u000d\u000aRun via Cloudflare MCP agent or manually: `wrangler d1 execute guestbook-db --file=functions/schema.sql`.

**Demo**: Tables exist in D1, verified by querying with wrangler.

---

## Step 3: Submit Endpoint

**Objective**: POST /api/guestbook/submit — validates input, checks rate limit, verifies Turnstile, inserts pending entry.

Create `functions/api/guestbook/submit.js`. Implementation guidance:
- Parse JSON body: {name, message, turnstileToken}
- Validate: name required (max100), message required (max1000)
- Rate limit check against KV key `rate_limit:{ip}` — if count >5 in last hour return429
- Verify Turnstile token via fetch to siteverify API with TURNSTILE_SECRET_KEY env var and CF-Connecting-IP header
- Check bans table — if IP is banned return403
- INSERT INTO entries(name,message) VALUES(?,?) — approved defaults to0(pending)
- Return200 {success:true}

Reference MyGB worker.js for HMAC session pattern and Turnstile verification code.

**Demo**: curl POST returns success. Entry appears in D1 with approved=0. Rate limit blocks after5 submissions. Banned IP gets403.

---

## Step 4: List Endpoint

**Objective**: GET /api/guestbook/list — returns paginated approved entries.

Create `functions/api/guestbook/list.js`. Implementation guidance:
- Parse query params: page (default1), limit (default50)
- Query: SELECT id,name,message,created_at FROM entries WHERE approved=1 ORDER BY created_at DESC LIMIT ? OFFSET ?
- Count total: SELECT COUNT(*) as total FROM entries WHERE approved=1
- Return JSON: {entries:[], totalPages, currentPage}

**Demo**: curl GET returns paginated list. Only approved entries appear. Pagination works with page param.

---

## Step 5: Admin Auth

**Objective**: POST /api/admin/login and session middleware for all admin routes.

Create `functions/api/admin/login.js` and shared middleware in `functions/_middleware.js` or inline helper.
Implementation guidance:
-Login endpoint compares SHA256 hash of password against env ADMIN_PASSWORD using Web Crypto API (timing-safe comparison)
-On match create HMAC-signed session token set as HttpOnly Secure SameSite Lax cookie gb_session with7day expiry
-Middleware parses cookie verifies HMAC signature returns401 if invalid403 if expired
-SESSION_SECRET can be derived from ADMIN_PASSWORD or set separately via env var
Reference MyGB worker js checkPassword verifySession sign functions for exact crypto patterns 
**Demo**: curl POST login with correct password gets200 + Set-Cookie header Subsequent admin requests with cookie succeed Without cookie get401 
---
## Step 6 Admin Endpoints 
**Objective**: All remaining admin API endpoints behind session auth 
Create files under functions api admin : pending js approve js delete js ban js bans js Each requires valid session via middleware Pending GET returns entries where approved0 Approve PATCH updates approved to1or2 Delete DELETE removes row Ban POST inserts into bans table Bans GET lists banned IPs Also add ban check to submit endpoint from Step3 **Demo**: Full admin flow works via curl login view pending approve entry see it appear in public list reject entry stays hidden delete removes permanently ban blocks future submissions --- ## Step7 React GuestbookPage **Objective**: Public guestbook page at guestbook route Create src pages GuestbookPage tsx Layout centered column maxw2xl matching Gruvbox theme Form section Name input text Message textarea Turnstile widget div class cfturnstile datasitekey from env Submit button disabled while submitting Entries section Fetch from api guestbook list on mount and page change Each entry card shows name date message Pagination Prev Next buttons State management useState for form fields entries loading error Handle Turnstile callback onsubmit passes token to fetch POST api guestbook submit Show success message after submission Show validation errors inline **Demo**: Page renders form and existing entries Submit creates pending entry not visible until approved Pagination works --- ## Step8 React GuestbookAdminPage **Objective**: Admin dashboard at guestbook admin route Create src pages GuestBookAdminPage tsx Two states based on authenticated boolean Unauthenticated Password input centered styled like Gruvbox On submit calls api admin login sets authenticated true Authenticated Dashboard with three sections Pending Queue table showing unapproved entries Approve Reject buttons per row Approved Entries table showing live entries Delete button per row Banned IPs input field Ban button list of current bans Logout button clears cookie resets state Fetch pending and bans on mount poll every30seconds **Demo**: Login with password see dashboard Approve entry it disappears from pending appears in public Reject removes it Delete cleans up Ban adds IP blocked IP cannot submit --- ## Step9 Homepage CTA **Objective**: Add Sign the guestbook teaser to homepage Edit src pages HomePage tsx ContentSections function Add new section after Writing before Projects Matching existing pattern Section label WRITING style heading Link card Want to say hi Sign the guestbook arrow icon Links to guestbook Uses same hover opacity transition as other sections Demo CTA appears on homepage between Writing and Projects sections Click navigates to guestbook --- ## Step10 Routing Integration Testing Objective Wire everything together add routes test endtoend Add routes in App tsx Route path guest book element GuestBookPage Route path guest book admin element GuestBookAdminPage Test full flow locally wrangler dev Submit form sees success Admin approves sees entry on public page Verify rate limiting blocks after5 Verify banned IP gets403 Verify pagination works Build npm run build deploy push Deploy Cloudflare Pages auto deploys on git push Demo Full endtoend flow works locally and deployed All10 checklist items verified 
## Connections

- [[../rough-idea.md]]
- [[../idea-honing.md]]
- [[../design/detailed-design.md]]
- [[../research/existing-solutions.md]]
- [[../research/cloudflare-integration.md]]
- [[../research/react-integration.md]]
