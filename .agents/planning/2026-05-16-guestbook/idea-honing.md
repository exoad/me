# Idea Honing: Guestbook

## Q1: What should visitors be able to do in the guestbook?

Should visitors just leave a short message (like a name + comment), or do you want richer interactions like replies, reactions, or threaded conversations? Also: should signing require any identity (name, email) or can people post anonymously?

### Answer

Simple approach: name + message. No replies, no threads, no reactions. Keep it minimal like a classic web guestbook.

## Q2: Where should the data live?

Your site is currently a static SPA with no backend. Guestbook entries need to be stored somewhere and fetched dynamically. Options:

1. **Third-party service** (e.g., Giscus/GitHub Discussions, Disqus, Cusdis) — zero infra, but depends on external platform
2. **Serverless function + DB** (e.g., Cloudflare Workers + D1, Vercel KV, Supabase) — you own the data, small free tier usually enough for a personal site
3. **Self-hosted on your existing server** (the bibo inference box) — full control but more setup/maintenance
4. **Something else?**

What's your preference?

### Answer

Serverless function + DB (option 2). Prefers Cloudflare Workers + D1 for the free tier and data ownership. If Cloudflare MCP or infra setup is needed, draft a prompt for another agent to handle that part.

## Q3: Spam and moderation

A guestbook open to the internet will get spam. How do you want to handle this?

1. **No moderation** — anyone can post anything, deal with it manually later
2. **Basic rate limiting** — e.g., one entry per IP per hour via the Worker
3. **Honeypot/captcha** — hidden field trick or simple captcha (like Turnstile, which is Cloudflare's free captcha)
4. **Manual approval** — entries go into a pending state, you approve them before they show up
5. **Combo** — rate limit + Turnstile on submit, no manual approval needed

### Answer

Combo approach (option 5): rate limiting + Cloudflare Turnstile on submit. No manual approval needed — entries go live immediately after passing verification.

## Q4: Guestbook page design and placement

Where should the guestbook live on the site? And what should it look like?

1. **Dedicated /guestbook route** — its own page, linked from nav or footer
2. **Section on the homepage** — below projects/writing, as a "Leave a note" section at the bottom
3. **Both** — dedicated page with a teaser/shortcut from homepage

The visual style: should it match the existing Gruvbox minimal aesthetic? Any specific layout preferences (e.g., chronological list of entries with a form at top or bottom)?

### Answer

Hybrid approach: homepage has a "Sign the guestbook" call-to-action that links to the dedicated /guestbook route. The dedicated page shows the full entry history + submission form. Visual style consistent with Gruvbox minimalism — centered layout, traditional chronological list of entries.

## Q5: Entry fields and constraints

What fields should each guestbook entry have? And any constraints?

1. **Name** (required) — free text or limited length?
2. **Message** (required) — character limit? (e.g., 500 chars)
3. **Optional fields** — email, website URL, location? Classic guestbooks often had these.
4. **Timestamp** — auto-generated on submit
5. **Anything else?**

### Answer

Just name (required) and message (required). Timestamp auto-generated on submission. No optional fields — keep it minimal.

## Q6: How many entries to show?

Should the guestbook page show all entries ever submitted, or paginate them? If paginated, how many per page? Also: should entries be ordered newest-first or oldest-first?

### Answer

Simple pagination: 50 entries per page, newest-first ordering. No infinite scroll — simpler to implement and sufficient for expected volume.

## Q7: Deployment and domain

Your site is currently deployed somewhere (exoad.net). How is it hosted? This affects how the Cloudflare Worker gets set up:

1. **Already on Cloudflare Pages** — Workers + D1 integrate natively, minimal config
2. **Vercel / Netlify / other** — would need a separate Cloudflare Worker deployment or use that platform's equivalent (Vercel Edge Functions + KV, etc.)
3. **Not sure / self-hosted**

Also: do you already have a Cloudflare account with exoad.net's DNS managed there?

### Answer

Already on Cloudflare Pages. Workers + D1 integrate natively — minimal config needed.

## Q8: Moderation and admin controls (revised from Q3)

The user wants a two-layer moderation approach:

1. **Frontline automated filtering**: rate limiting + Turnstile to block bots/spam at submission time
2. **Manual review queue**: all entries go into a "pending" state by default, not live immediately. The user reviews and approves/rejects them manually.
3. **Admin tooling**: ability to ban IPs/users, delete entries, approve/reject from a simple admin interface
4. **No fully automated approval** — even with rate limiting and Turnstile, human review is required before an entry goes public.

This means we need:
- An admin page or dashboard (could be a hidden route like /guestbook/admin)
- Authentication for the admin (simple password/token? Cloudflare Access?)
- Entry status field in DB: pending → approved | rejected | deleted
- Ban list (IP-based) stored in D1 or KV

### Answer

Two-layer moderation: automated frontline (rate limit + Turnstile) catches bots, then all entries go into a manual review queue. Admin approves/rejects before public visibility. Need admin dashboard with ban list and entry management.

## Q9: Admin authentication

The admin dashboard needs to be protected so only you can access it. Options:

1. **Simple shared secret** — a password/token in the URL or form that the Worker checks against an env var. Simplest, no external dependencies.
2. **Cloudflare Access** — free for small teams, integrates natively with Cloudflare Pages, provides email-based OTP login. More polished but requires Cloudflare Zero Trust setup.
3. **GitHub OAuth via Worker** — restrict to your GitHub username only.
4. **Something else?**

Which approach feels right?

### Answer

Simple shared secret (option 1). Admin password stored as Worker env var. Password: `jY@A%Zb3L@3e%B`.

## Connections

- [[rough-idea.md]]
