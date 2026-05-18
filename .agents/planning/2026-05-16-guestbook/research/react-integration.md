# Research: React Integration with Cloudflare Pages Functions

## Approach

The existing site is a React + Vite SPA. We'll add:

1. **API functions** in `/functions/api/` — Cloudflare Pages Functions handle all backend logic
2. **React pages** that call these API endpoints via `fetch()`
3. **No separate Worker deployment needed** — Pages Functions deploy alongside the static site

## Route Plan

| Frontend Route | API Endpoint | Purpose |
|---|---|---|
| `/guestbook` | `GET /api/guestbook/entries?page=1` | List approved entries (paginated) |
| `/guestbook` | `POST /api/guestbook/entries` | Submit new entry (pending approval) |
| `/guestbook/admin` | `POST /api/admin/login` | Admin login |
| `/guestbook/admin` | `GET /api/admin/pending` | List pending entries for review |
| `/guestbook/admin` | `PATCH /api/admin/entries/:id` | Approve/reject an entry |

## Component Tree

```
App.tsx
├── HomePage.tsx
│   └── GuestbookCTA (new) — "Sign the guestbook" link → /guestbook
├── GuestbookPage.tsx (new)
│   ├── GuestbookForm — name + message fields + Turnstile widget
│   └── GuestbookEntries — paginated list of approved entries
└── GuestbookAdminPage.tsx (new)
    ├── LoginForm — password input, hidden until authenticated
    └── PendingQueue — approve/reject buttons per entry
```

## Data Flow

```
User submits form → POST /api/guestbook/entries → Worker validates Turnstile →
  inserts into D1 with approved=0 → returns success message
  
Admin logs in → POST /api/admin/login → Worker verifies password →
  sets session cookie → redirects to admin dashboard
  
Admin approves entry → PATCH /api/admin/entries/:id {approved: 1} →
  Worker updates DB row
  
Public page loads → GET /api/guestbook/entries?page=1&limit=50 →
  Worker queries approved=1 rows with pagination → returns JSON array
```

## Styling Consistency

All new components use the existing Tailwind Gruvbox theme:
- Background: `bg-bg0`
- Text: `text-fg0`, `text-fg3`, etc.
- Borders: `border-bg2`
- Accent colors from Gruvbox palette (yellow, green, blue, red)
- Font: Inter/sans-serif throughout (no serif)

## Connections

- [[../idea-honing.md]]
