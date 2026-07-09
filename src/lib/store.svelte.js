import { browser } from '$app/environment';

// Reactive app state (Svelte 5 runes). Agents/ads/ticker/categories are the
// shared config loaded from the server (JSON file store); pins are a per-visitor
// preference kept in localStorage.
export const store = $state({
  agents: [],
  ads: [],
  tickerItems: [],
  categories: [],
  pinned: []
});

// Seed from the server load() payload. Called once from the root layout during
// component init (server render + client hydration).
export function hydrate(data) {
  store.agents = data.agents ?? [];
  store.ads = data.ads ?? [];
  store.tickerItems = data.tickerItems ?? [];
  store.categories = data.categories ?? [];
  if (browser) {
    try {
      const p = JSON.parse(localStorage.getItem('cah_pinned'));
      if (Array.isArray(p)) store.pinned = p;
    } catch (e) {
      /* ignore */
    }
  }
}

// Resolve a category name to its configured color (reactive — reads store).
export function catColor(name) {
  const c = store.categories.find((x) => x.name === name);
  return c?.color || '#C1502D';
}

// Push the current shared config to the server (fire-and-forget).
async function persist() {
  if (!browser) return;
  try {
    await fetch('/api/config', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        agents: store.agents,
        ads: store.ads,
        tickerItems: store.tickerItems,
        categories: store.categories
      })
    });
  } catch (e) {
    console.error('[store] persist failed:', e.message);
  }
}

function savePinned() {
  if (!browser) return;
  try {
    localStorage.setItem('cah_pinned', JSON.stringify(store.pinned));
  } catch (e) {
    /* ignore */
  }
}

// --- agents ---
export function addAgent() {
  const id = 'a' + Date.now();
  store.agents.push({
    id,
    name: 'New Agent',
    description: 'Short description',
    url: 'https://',
    category: store.categories[0]?.name || 'Uncategorized',
    group: 'City Agents'
  });
  persist();
}

export function removeAgent(id) {
  store.agents = store.agents.filter((a) => a.id !== id);
  persist();
}

export function updateAgent(id, field, value) {
  const a = store.agents.find((x) => x.id === id);
  if (a) {
    a[field] = value;
    persist();
  }
}

// --- categories ---
export function addCategory() {
  store.categories.push({
    id: 'c' + Date.now(),
    name: 'New Category',
    color: 'oklch(62% 0.13 220)'
  });
  persist();
}

export function removeCategory(id) {
  store.categories = store.categories.filter((c) => c.id !== id);
  persist();
}

export function updateCategory(id, field, value) {
  const c = store.categories.find((x) => x.id === id);
  if (c) {
    c[field] = value;
    persist();
  }
}

// --- pinned (per-visitor, localStorage) ---
export function togglePin(id) {
  store.pinned = store.pinned.includes(id)
    ? store.pinned.filter((p) => p !== id)
    : [...store.pinned, id];
  savePinned();
}

export function isPinned(id) {
  return store.pinned.includes(id);
}

// --- ads ---
export function updateAd(id, field, value) {
  const a = store.ads.find((x) => x.id === id);
  if (a) {
    a[field] = value;
    persist();
  }
}

// --- ticker ---
export function addTicker() {
  store.tickerItems.push({ id: 't' + Date.now(), text: 'New announcement' });
  persist();
}

export function removeTicker(id) {
  store.tickerItems = store.tickerItems.filter((t) => t.id !== id);
  persist();
}

export function updateTicker(id, value) {
  const t = store.tickerItems.find((x) => x.id === id);
  if (t) {
    t.text = value;
    persist();
  }
}
