import { json } from '@sveltejs/kit';
import { readConfig, writeConfig } from '$lib/server/store.js';
import { normalizeAgentUrl } from '$lib/ssoUrl.js';
import { sanitizeUrl } from '$lib/url.js';

export function GET() {
  return json(readConfig());
}

// Replace the whole config document. Admin sends the full agents/ads/ticker
// arrays; any omitted array keeps its current value.
export async function PUT({ request }) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return json({ error: 'invalid json' }, { status: 400 });
  }
  const cur = readConfig();
  // Server-side safety net: convert any pasted Keycloak authorize URL to the
  // reusable SSO-start endpoint even if the client didn't.
  const agents = Array.isArray(body.agents)
    ? body.agents.map((a) => (a && a.url ? { ...a, url: sanitizeUrl(normalizeAgentUrl(a.url)) } : a))
    : cur.agents;
  const ads = Array.isArray(body.ads)
    ? body.ads.map((a) => (a && a.url ? { ...a, url: sanitizeUrl(a.url) } : a))
    : cur.ads;
  const next = writeConfig({
    agents,
    ads,
    tickerItems: Array.isArray(body.tickerItems) ? body.tickerItems : cur.tickerItems,
    categories: Array.isArray(body.categories) ? body.categories : cur.categories,
    groups: Array.isArray(body.groups) ? body.groups : cur.groups
  });
  return json(next);
}
