# Research: Existing Guestbook Solutions

## MyGB (verfasor/MyGB)

**GitHub**: https://github.com/verfasor/MyGB
**License**: AGPL v3

A complete guestbook implementation using Cloudflare Workers + D1 + Turnstile. Very close match to our requirements.

### Architecture
- Single `worker.js` file handles everything: API, HTML rendering, admin panel
- D1 SQLite database for entries and settings
- Vanilla JS frontend (no framework) with embeddable widget
- HMAC-signed session cookies for admin auth (SHA-256)
- Turnstile integration for spam prevention

### Database Schema (relevant parts)
```sql
CREATE TABLE IF NOT EXISTS entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  site TEXT,           -- optional website URL (we don't need this)
  email TEXT,          -- optional email (we don't need this)
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  approved INTEGER NOT NULL DEFAULT 0   -- pending=0, approved=1
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT            -- dynamic config like site title, icon URL etc.
);
```

### Key Patterns We Can Reuse

1. **Admin auth flow**: Password → SHA-256 hash comparison → HMAC-signed session cookie with expiry. No external dependencies.
2. **Turnstile verification**: POST token to `https://challenges.cloudflare.com/turnstile/v0/siteverify` with secret key.
3. **Entry approval workflow**: Default `approved = 0`, admin panel shows pending queue with approve/reject buttons.
4. **Rate limiting**: Not explicitly in MyGB but can be added via Worker's built-in rate limiting or a simple IP-based counter in KV.

### What We'll Adapt vs Build Fresh

| Aspect | MyGB approach | Our adaptation |
|---|---|---|
| Frontend | Vanilla JS embedded widget | React component integrated into existing Vite SPA |
| Routing | Single worker handles all routes | Pages Functions file-based routing (`functions/api/`) |
| Admin UI | Server-rendered HTML from worker | React admin page at `/guestbook/admin` calling same API |
| Styling | Custom CSS in worker strings | Tailwind Gruvbox theme from existing site |
| Fields | name, message, site, email | name, message only |

## Connections

- [[../idea-honing.md]]
