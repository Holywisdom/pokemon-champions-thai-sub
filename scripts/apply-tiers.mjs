#!/usr/bin/env node
/**
 * Apply curated tier assignments from .tier-draft.json to src/data/meta.ts.
 *
 * Reads `.tier-draft.json` (produced by draft-tiers.mjs / curated by hand)
 * and replaces `tier: 'Untiered'` with the new tier value for each slug,
 * scoped to the entry block matched by the slug.
 *
 * Skips entries that map to 'Untiered' (already Untiered, no-op).
 */
import { readFile, writeFile } from 'node:fs/promises';

const draft = JSON.parse(await readFile('.tier-draft.json', 'utf-8'));
let meta = await readFile('src/data/meta.ts', 'utf-8');

let appliedCount = 0;
const skipped = [];

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

for (const [slug, tier] of Object.entries(draft.tiers)) {
  if (tier === 'Untiered') continue;
  const slugRe = escapeRe(slug);
  // Match within the same entry block: from `slug: 'x',` up to the first
  // `tier: 'Untiered'` that follows. [\s\S]*? is non-greedy so we stop at
  // the nearest tier field, which is the one belonging to this entry.
  const re = new RegExp(`(slug:\\s*'${slugRe}',[\\s\\S]*?tier:\\s*)'Untiered'`);
  if (!re.test(meta)) {
    skipped.push({ slug, tier, reason: 'tier:Untiered not found' });
    continue;
  }
  meta = meta.replace(re, `$1'${tier}'`);
  appliedCount++;
}

await writeFile('src/data/meta.ts', meta);
console.log(`Applied ${appliedCount} tier changes. Skipped: ${skipped.length}`);
if (skipped.length) console.log(JSON.stringify(skipped, null, 2));
