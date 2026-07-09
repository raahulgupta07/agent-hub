# City Agents Hub

Internal agent directory — a searchable, category-filtered launcher for an
organization's AI agents, with a lightweight admin console. Built with
**SvelteKit 2 + Svelte 5 (runes)**, served by **adapter-node**, deployed with
**Docker**.

- **Public directory** (`/`) — search, ⌘K command palette, group tabs, category
  filters, agent card grid with per-visitor pins, scrolling ticker, ad carousel.
- **Admin console** (`/admin`) — manage Agents, Groups, Categories, Ticker, Ads.
  Super-admin login via `.env`.

---

## 1. Install

### Option A — Docker (recommended)

```bash
git clone git@github.com:raahulgupta07/agent-hub.git
cd agent-hub

# create the env file and set your own values
cp .env.example .env
# edit .env:  ADMIN_EMAIL, ADMIN_PASSWORD, and a strong SESSION_SECRET
#   openssl rand -base64 48   # to generate SESSION_SECRET

docker compose up -d --build
```

Open **http://localhost:8100** (public) · **http://localhost:8100/admin** (login).

Host port is `8100` (maps to container `3000`) — change the `ports:` line in
`docker-compose.yml` if needed.

### Option B — Local dev (no Docker)

```bash
cp .env.example .env        # set DATA_FILE=./.data/data.json for local
npm install
npm run dev                 # http://localhost:5173
```

---

## 2. Configuration (`.env`)

| Var | Purpose |
| --- | --- |
| `ADMIN_EMAIL` | Super-admin login email |
| `ADMIN_PASSWORD` | Super-admin password |
| `SESSION_SECRET` | Signs session cookies — long random string |
| `DATA_FILE` | Path to the JSON store (Docker: `/data/data.json`) |
| `BODY_SIZE_LIMIT` | Max request body (logo uploads) — `10485760` (10 MB) |
| `PROTOCOL_HEADER` / `HOST_HEADER` / `ADDRESS_HEADER` | Set only behind a TLS proxy (see Deploy) |
| `ORIGIN` | Optional: pin the public origin instead of the headers above |

`.env` is **git-ignored** — never commit it. `.env.example` is the template.

---

## 3. Where data is stored

Everything (agents, **logos**, colors, URLs, categories, groups, ads, ticker) is
a single JSON file:

```
container : /data/data.json          (env DATA_FILE)
host      : ./data/data.json         (Docker volume in docker-compose.yml)
local dev : ./.data/data.json
```

- **Logos** are stored inline on each agent as a base64 PNG **`iconData`** field
  (background-removed, 256px). No separate image folder, no database.
- **Pins** are the only exception — kept per-visitor in the browser's
  `localStorage`, not in `data.json`.
- The `./data` volume survives `docker compose down/up --build`.

**Backup / migrate an install** = copy `data.json` (state) + `.env` (secrets).

---

## 4. Manage (admin console)

Sign in at `/admin` with the `.env` credentials. All edits **autosave** (header
shows *Saving… / All changes saved / Save failed*).

- **Agent Cards** — add/remove agents; edit Name, Group (dropdown), Category
  (dropdown), Redirect URL, Description. Upload a **logo** per agent (auto
  background removal; toggle "Remove bg" off for already-transparent PNGs;
  Clear logo reverts to the colored initial tile).
- **Groups** — create/rename/remove the directory's top tab-row headers.
- **Categories** — create/remove; set name + any CSS color (hex or `oklch(...)`).
  Drives the filter pills and card dots.
- **Ticker** — add/remove scrolling announcements.
- **Ad Carousel** — edit the 3 sidebar ad slots (headline, description, link).

### SSO / OIDC cards
Paste a full OIDC **authorize** URL (`…/openid-connect/auth?…`) into an agent's
**Redirect URL** — it's auto-converted to the reusable
`<origin>/oauth/<provider>/login` endpoint (authorize URLs carry a one-time
`state`/`nonce` and only work once; the login endpoint mints a fresh flow every
click). Conversion runs on both the client and the server.

### Keyboard (public page)
`⌘K` / `/` open palette · `↑` `↓` navigate · `↵` open · `esc` close

---

## 5. Deploy behind TLS (reverse proxy)

Behind a proxy such as Nginx Proxy Manager, add to `.env`:

```
PROTOCOL_HEADER=x-forwarded-proto
HOST_HEADER=x-forwarded-host
ADDRESS_HEADER=x-forwarded-for        # only when a proxy actually sets it
BODY_SIZE_LIMIT=10485760
# ORIGIN=https://hub.example.com      # or pin the origin directly
```

- Proxy must **share the app's Docker network** and forward to the
  **container name + internal port** (`city-agents-hub:3000`) — not an IP/host
  port — with **`proxy_buffering off`**.
- These headers let the app see real https/host/client-IP, so the session
  cookie is issued `Secure` and login rate-limiting sees the real IP.

Do **not** set `ADDRESS_HEADER` without a proxy (breaks client-IP resolution).

### Security posture
Signed httpOnly `sameSite=lax` session cookie · `/admin` + config-write guards ·
login rate-limit (8 fails / 15 min per IP) · URL sanitization (blocks
`javascript:` etc.) · atomic + debounced JSON writes · body-size cap.

---

## 6. Operations

```bash
docker compose logs -f              # tail logs
docker compose restart              # restart (clears in-memory login throttle)
docker compose down                 # stop
docker compose up -d --build        # rebuild after code changes

cat ./data/data.json                # inspect current content
```

Change the admin password/secret → edit `.env` → `docker compose up -d`.

---

## 7. Push changes to GitHub

Repo: `git@github.com:raahulgupta07/agent-hub.git` (branch `main`, SSH).

```bash
git add -A
git commit -m "your message"
git push origin main
```

`.env` and `./data` are git-ignored, so secrets and runtime data never leave the
box. First-time clone on a new machine needs an SSH key added to GitHub.

---

## Project structure

```
src/
├─ app.html / app.css              # fonts + design tokens (CSS vars)
├─ hooks.server.js                 # auth guards (/admin, config writes)
├─ lib/
│  ├─ defaults.js                  # seed content
│  ├─ ssoUrl.js                    # OIDC authorize -> login converter
│  ├─ url.js                       # URL scheme sanitizer
│  ├─ logo.js                      # in-browser logo bg-removal/trim/square
│  ├─ store.svelte.js              # client $state store + debounced persist
│  ├─ server/
│  │  ├─ store.js                  # JSON file read/atomic-write
│  │  ├─ auth.js                   # HMAC session cookie
│  │  └─ loginThrottle.js          # per-IP login rate limit
│  └─ components/                  # Ticker, AgentCard, AdCarousel, CommandPalette, …
└─ routes/
   ├─ +layout.server.js            # loads shared config
   ├─ +page.svelte                 # public directory
   ├─ login/                       # form action + throttle
   ├─ logout/                      # clears cookie
   ├─ admin/                       # console (5 tabs)
   └─ api/config/                  # GET (public) / PUT (auth) config
```
