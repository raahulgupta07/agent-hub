# City Agents Hub

Internal agent directory — a searchable, category-filtered launcher for a city
government's AI agents, with a lightweight admin console. Rebuilt in **SvelteKit 2
+ Svelte 5 (runes)** from a Claude Design source.

## Routes

| Route     | What it is                                                                 |
| --------- | -------------------------------------------------------------------------- |
| `/`       | Public directory — search, ⌘K command palette, group tabs, category pills, agent card grid (pin/unpin), scrolling ticker, sponsored ad carousel, pinned list |
| `/login`  | Admin sign-in (mock — any submit enters the console)                       |
| `/admin`  | Console with three tabs: Agent Cards (CRUD), Ticker Announcements (CRUD), Ad Carousel (edit) |

## Auth (super admin)

Credentials live in `.env` (never committed) and are read at runtime:

```
ADMIN_EMAIL=admin@city.gov
ADMIN_PASSWORD=change-me
SESSION_SECRET=<long random string>   # openssl rand -base64 48
```

Login (`/login`) checks these, sets a signed httpOnly `sameSite=lax` session
cookie (8h). `hooks.server.js` guards `/admin` (redirect to `/login`) and every
write to `/api/config` (401). `/logout` clears the cookie. Copy `.env.example`
→ `.env` and set your own values.

## Data & persistence

Shared content (agents, ads, ticker, **categories**) is stored server-side in a
JSON file — `DATA_FILE` (Docker: `/data/data.json` on a mounted volume, so it
survives rebuilds). API: `GET /api/config` (public read) · `PUT /api/config`
(auth-only write). **Pins** stay per-visitor in `localStorage`.

Fresh install starts **empty** — no agent cards, no ticker; the admin adds
everything. 6 default categories + 3 ad slots are seeded so filters/sidebar render.

## Categories & groups

- **Categories** — managed on the admin *Categories* tab (add/remove, name +
  any CSS color incl. `oklch(...)`). They drive the filter pills and card dots.
- **Group tabs** on the directory (e.g. "City GPT", "City Agents") are set
  per-agent via the *Group* field — type a new group name and a new tab appears.

## Keyboard

`⌘K` / `/` open palette · `↑` `↓` navigate · `↵` open · `esc` close

## Dev

```bash
cp .env.example .env   # then edit credentials + SESSION_SECRET
npm install
npm run dev            # http://localhost:5173
npm run build          # production build (adapter-node)
npm start              # node build

# Docker (host port 8100 -> container 3000):
docker compose up -d --build
```

## Structure

```
src/
├─ app.html / app.css        # fonts + design tokens (CSS vars)
├─ lib/
│  ├─ tokens.js              # categories + OKLCH category colors
│  ├─ defaults.js            # seed data
│  ├─ store.svelte.js        # $state store + localStorage sync
│  └─ components/            # Ticker, AgentCard, AgentGrid pieces, AdCarousel,
│                            #   PinnedList, CommandPalette, CategoryPills,
│                            #   GroupTabs, IconSlot
└─ routes/                   # /, /login, /admin
```

Icons are rendered as colored initial tiles (`IconSlot.svelte`) keyed to each
agent's category color — no image assets required.
