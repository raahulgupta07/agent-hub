import { json } from '@sveltejs/kit';
import { readConfig, writeConfig } from '$lib/server/store.js';

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
  const next = writeConfig({
    agents: Array.isArray(body.agents) ? body.agents : cur.agents,
    ads: Array.isArray(body.ads) ? body.ads : cur.ads,
    tickerItems: Array.isArray(body.tickerItems) ? body.tickerItems : cur.tickerItems,
    categories: Array.isArray(body.categories) ? body.categories : cur.categories
  });
  return json(next);
}
