import { readFileSync, writeFileSync, existsSync, mkdirSync, renameSync } from 'node:fs';
import { dirname } from 'node:path';
import {
  defaultAgents,
  defaultAds,
  defaultTicker,
  defaultCategories,
  defaultGroups
} from '$lib/defaults.js';

// File-backed JSON store. Path is configurable so Docker can point it at a
// mounted volume (DATA_FILE=/data/data.json); local dev falls back to ./.data.
const DATA_FILE = process.env.DATA_FILE || './.data/data.json';

function seed() {
  return {
    agents: defaultAgents(),
    ads: defaultAds(),
    tickerItems: defaultTicker(),
    categories: defaultCategories(),
    groups: defaultGroups()
  };
}

function normalize(cfg, fallback) {
  return {
    agents: Array.isArray(cfg?.agents) ? cfg.agents : fallback.agents,
    ads: Array.isArray(cfg?.ads) ? cfg.ads : fallback.ads,
    tickerItems: Array.isArray(cfg?.tickerItems) ? cfg.tickerItems : fallback.tickerItems,
    categories: Array.isArray(cfg?.categories) ? cfg.categories : fallback.categories,
    groups: Array.isArray(cfg?.groups) ? cfg.groups : fallback.groups
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
        categories: defaultCategories(),
        groups: defaultGroups()
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
  const next = normalize(cfg, { agents: [], ads: [], tickerItems: [], categories: [], groups: [] });
  try {
    mkdirSync(dirname(DATA_FILE), { recursive: true });
    // Atomic write: write to a temp file then rename, so a crash mid-write can't
    // leave a truncated/corrupt data.json.
    const tmp = DATA_FILE + '.tmp';
    writeFileSync(tmp, JSON.stringify(next, null, 2));
    renameSync(tmp, DATA_FILE);
  } catch (e) {
    console.error('[store] write failed:', e.message);
  }
  return next;
}
