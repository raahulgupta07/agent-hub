# CLAUDE.md — City Agents Hub

Guidance for AI coding sessions in this repo. Keep it current when architecture changes.

## What this is
Internal agent directory + admin console. Public page lists agent "cards" that link out;
admin manages the content. Rebuilt from a Claude Design `.dc.html` mockup.

## Stack
- **SvelteKit 2 + Svelte 5 runes** (`$state`/`$derived`/`$props`/`$effect`), `adapter-node`.
- **No database.** All shared content is one JSON file (see Data).
- **Docker**: `docker compose up -d --build`, host port **8100** → container 3000.

## Run / build / verify
```bash
npm run dev            # vite dev on :5173
npm run build          # adapter-node build
docker compose up -d --build
```
⚠️ `curl`/`ls`/`find` output can be mangled by a shell proxy in this environment —
verify HTTP with `node -e "fetch(...)"`, not curl.

## Data model (single source of truth)
File: `DATA_FILE` (Docker `/data/data.json`, host `./data/data.json`, dev `./.data/data.json`).
```
{ agents:[{id,name,description,url,category,group,iconData}],
  ads:[{id,headline,description,url}],
  tickerItems:[{id,text}],
  categories:[{id,name,color}],
  groups:[{id,name}] }
```
- `iconData` = uploaded logo as base64 PNG data-URL (bg-removed, 256px). No image folder.
- **Pins** are NOT here — per-visitor in browser `localStorage` (`cah_pinned`).
- Server reads/writes atomically (temp file + rename). Seeded from `src/lib/defaults.js`.

## Flow
`+layout.server.js` load() → `readConfig()` → passed to client `store.svelte.js` `hydrate(data)`.
Admin mutations update `store` then **debounced** PUT `/api/config` (500ms + beforeunload flush).
`GET /api/config` is public (directory reads it); `PUT` requires auth.

## Auth
- Credentials in `.env`: `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SESSION_SECRET`.
- `src/lib/server/auth.js` = HMAC-signed stateless cookie `cah_session` (httpOnly, sameSite=lax, 8h).
- `src/hooks.server.js` guards `/admin` (→ 303 /login) and `PUT /api/config` (→ 401).
- `login/+page.server.js` form action + per-IP throttle (`loginThrottle.js`, 8/15min).
- CSRF: `kit.csrf.checkOrigin=false` (origin varies by host); safe because sameSite=lax cookie
  blocks cross-site writes.

## Key conventions / gotchas
- vite.config imports `sveltekit` from `@sveltejs/kit/vite` (NOT `@sveltejs/vite-plugin-svelte`).
- Categories & groups are **dynamic** (admin-managed, in config). `catColor(name)` in the store
  resolves category → color reactively. Don't hardcode category lists.
- Card/ad URLs run through `sanitizeUrl` (blocks `javascript:`/`data:`/etc.) + agent URLs through
  `normalizeAgentUrl` (OIDC authorize URL → `/oauth/<provider>/login`). Applied client AND server.
- Public UI is intentionally stable — admin config changes must not alter the front-end layout.
- Keep secrets/city-specific values OUT of the repo. `.env` and `./data` are git-ignored.

## Deploy (TLS/proxy)
Set `PROTOCOL_HEADER=x-forwarded-proto`, `HOST_HEADER=x-forwarded-host`,
`ADDRESS_HEADER=x-forwarded-for` (only with a proxy), `BODY_SIZE_LIMIT=10485760` in `.env`.
Proxy shares docker net, forwards to `city-agents-hub:3000`, `proxy_buffering off`.

## Git
Remote `git@github.com:raahulgupta07/agent-hub.git`, branch `main` (SSH).
Commit + `git push origin main`. Never commit `.env` or `data/`.

## Robustness (done)
- Logo validation server-side: `src/lib/icon.js` `sanitizeIconData` (raster-only,
  ≤600 KB, rejects SVG/external), applied in `PUT /api/config`.
- `data.json` written atomically (tmp+rename) with a `.bak` copy; `readConfig`
  auto-recovers from `.bak` if the main file is corrupt.
- `GET /api/health` → `{ok:true}`; Dockerfile HEALTHCHECK hits it.

## Landmines
- adapter-node `getClientAddress()` THROWS if `ADDRESS_HEADER` is set but the
  header is absent (direct hit / proxy not forwarding XFF) → 500 on POST /login.
  Login wraps it in try/catch; only enable `ADDRESS_HEADER` when the proxy sends it.
- `PROTOCOL_HEADER`/`HOST_HEADER` are safe when absent; only `ADDRESS_HEADER` throws.

## Known TODO (not blockers)
Multi-admin concurrency is last-write-wins (single-admin tool); `.bak` gives recovery.
