# Research: Cloudflare Pages Functions + D1 Integration

## Pages Functions Routing

Cloudflare Pages uses file-based routing from a `/functions` directory at the project root:

```
functions/
  api/
    guestbook/
      entries.js     → /api/guestbook/entries (GET list, POST create)
      [id].js        → /api/guestbook/:id (PATCH approve/reject, DELETE)
    admin/
      login.js       → /api/admin/login
      logout.js      → /api/admin/logout
```

Each file exports an `onRequest(context)` function. The `context` object provides:
- `context.env` — environment bindings (D1 database, secrets)
- `context.request` — incoming Request object
- `context.params` — route parameters from filename patterns like `[id]`

## D1 Binding Pattern

```js
export async function onRequest(context) {
  const { env } = context;
  
  // Query approved entries with pagination
  const { results } = await env.DB.prepare(
    "SELECT * FROM entries WHERE approved = 1 ORDER BY created_at DESC LIMIT ? OFFSET ?"
  ).bind(50, offset).all();
  
  return Response.json(results);
}
```

## Turnstile Integration

Two parts:

**Client-side** (in React component):
```html
<div class="cf-turnstile" data-sitekey="{SITE_KEY}"></div>
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
```
The widget injects a token into the form as `cf-turnstile-response`.

**Server-side verification** (in Worker):
```js
const token = formData.get("cf-turnstile-response");
const ip = request.headers.get("CF-Connecting-IP");

const result = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
  method: "POST",
  body: JSON.stringify({
    secret: env.TURNSTILE_SECRET_KEY,
    response: token,
    remoteip: ip,
  }),
}).then(r => r.json());

if (!result.success) {
  return Response.json({ error: "Verification failed" }, { status: 400 });
}
```

## Admin Auth Pattern (from MyGB)

Simple password-based auth using HMAC-signed session cookies:

1. Admin submits password to `/api/admin/login`
2. Worker compares SHA-256 hash against env var `ADMIN_PASSWORD`
3. If match, creates HMAC-signed session token set as HttpOnly cookie
4. Subsequent admin API calls check cookie validity via middleware

This avoids any external auth services and works entirely within the Worker.

## Wrangler Configuration

```toml
name = "exoad-guestbook"
compatibility_date = "2025-05-16"

[[d1_databases]]
binding = "DB"
database_name = "guestbook-db"
database_id = "" # filled by wrangler after creation

[vars]
TURNSTILE_SITE_KEY = "" # public key for client-side widget

# Secrets set via wrangler secret put:
# ADMIN_PASSWORD - the admin login password  
# TURNSTILE_SECRET_KEY - server-side verification key
```

## Connections

- [[../idea-honing.md]]
