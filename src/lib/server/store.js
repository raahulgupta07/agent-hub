import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  renameSync,
  copyFileSync
} from 'node:fs';
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

const BAK_FILE = DATA_FILE + '.bak';

function readFrom(path) {
  const cfg = JSON.parse(readFileSync(path, 'utf-8'));
  // Migrate older files missing keys.
  return normalize(cfg, {
    agents: [],
    ads: [],
    tickerItems: [],
    categories: defaultCategories(),
    groups: defaultGroups()
  });
}

export function readConfig() {
  if (existsSync(DATA_FILE)) {
    try {
      return readFrom(DATA_FILE);
    } catch (e) {
      console.error('[store] main file unreadable:', e.message);
      // Fall back to the last good backup rather than wiping data.
      if (existsSync(BAK_FILE)) {
        try {
          console.error('[store] recovering from .bak');
          return readFrom(BAK_FILE);
        } catch (e2) {
          console.error('[store] backup also unreadable:', e2.message);
        }
      }
    }
  }
  const s = seed();
  writeConfig(s);
  return s;
}

export function writeConfig(cfg) {
  const next = normalize(cfg, { agents: [], ads: [], tickerItems: [], categories: [], groups: [] });
  try {
    mkdirSync(dirname(DATA_FILE), { recursive: true });
    // Keep the last known-good version as a backup before overwriting.
    if (existsSync(DATA_FILE)) {
      try {
        copyFileSync(DATA_FILE, BAK_FILE);
      } catch (e) {
        /* non-fatal */
      }
    }
    // Atomic write: temp file then rename, so a crash mid-write can't leave a
    // truncated/corrupt data.json.
    const tmp = DATA_FILE + '.tmp';
    writeFileSync(tmp, JSON.stringify(next, null, 2));
    renameSync(tmp, DATA_FILE);
  } catch (e) {
    console.error('[store] write failed:', e.message);
  }
  return next;
}
