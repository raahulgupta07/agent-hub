import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { defaultAgents, defaultAds, defaultTicker, defaultCategories } from '$lib/defaults.js';

// File-backed JSON store. Path is configurable so Docker can point it at a
// mounted volume (DATA_FILE=/data/data.json); local dev falls back to ./.data.
const DATA_FILE = process.env.DATA_FILE || './.data/data.json';

function seed() {
  return {
    agents: defaultAgents(),
    ads: defaultAds(),
    tickerItems: defaultTicker(),
    categories: defaultCategories()
  };
}

function normalize(cfg, fallback) {
  return {
    agents: Array.isArray(cfg?.agents) ? cfg.agents : fallback.agents,
    ads: Array.isArray(cfg?.ads) ? cfg.ads : fallback.ads,
    tickerItems: Array.isArray(cfg?.tickerItems) ? cfg.tickerItems : fallback.tickerItems,
    categories: Array.isArray(cfg?.categories) ? cfg.categories : fallback.categories
  };
}

export function readConfig() {
  try {
    if (existsSync(DATA_FILE)) {
      const cfg = JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
      // Migrate older files missing categories.
      return normalize(cfg, {
        agents: [],
        ads: [],
        tickerItems: [],
        categories: defaultCategories()
      });
    }
  } catch (e) {
    console.error('[store] read failed, reseeding:', e.message);
  }
  const s = seed();
  writeConfig(s);
  return s;
}

export function writeConfig(cfg) {
  const next = normalize(cfg, { agents: [], ads: [], tickerItems: [], categories: [] });
  try {
    mkdirSync(dirname(DATA_FILE), { recursive: true });
    writeFileSync(DATA_FILE, JSON.stringify(next, null, 2));
  } catch (e) {
    console.error('[store] write failed:', e.message);
  }
  return next;
}
