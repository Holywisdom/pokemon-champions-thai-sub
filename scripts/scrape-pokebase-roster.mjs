#!/usr/bin/env node
/**
 * Scrape pokebase.app's speed-tier page (which renders every Pokemon Champions
 * mon in static HTML) to produce a canonical, machine-readable roster list.
 *
 * Output: src/data/roster.json
 *
 * Usage: node scripts/scrape-pokebase-roster.mjs
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT = resolve(ROOT, 'src/data/roster.json');

const SPEED_TIER_URL = 'https://pokebase.app/pokemon-champions/speed-tiers';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36';

const html = await fetch(SPEED_TIER_URL, { headers: { 'User-Agent': UA } }).then((r) => {
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.text();
});

// Extract every /pokemon-champions/pokemon/<slug> link, dedupe, preserve order.
const slugRe = /\/pokemon-champions\/pokemon\/([a-z0-9-]+)/g;
const seen = new Set();
const slugs = [];
for (const m of html.matchAll(slugRe)) {
  const s = m[1];
  if (!seen.has(s)) { seen.add(s); slugs.push(s); }
}

if (slugs.length < 200) {
  throw new Error(`Expected 200+ slugs; got ${slugs.length}. Page structure may have changed.`);
}

if (!existsSync(dirname(OUT))) await mkdir(dirname(OUT), { recursive: true });
await writeFile(OUT, JSON.stringify({ source: SPEED_TIER_URL, fetchedAt: new Date().toISOString(), count: slugs.length, slugs }, null, 2));
console.log(`Wrote ${slugs.length} slugs to ${OUT}`);
