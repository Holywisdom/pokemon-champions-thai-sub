// Build a mapping from pokebase slugs (src/data/roster.json) to PokéAPI IDs.
// Strategy: try each slug as-is against PokéAPI /pokemon/{slug}; on 404, fall
// back to the manual OVERRIDES map below. Extend OVERRIDES when re-running
// surfaces new failures.
//
// Output: src/data/variant-id-map.json
//   { count, failures: string[], map: { [pokebaseSlug]: { id, apiSlug } } }

import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const ROSTER = resolve(ROOT, 'src/data/roster.json');
const OUT = resolve(ROOT, 'src/data/variant-id-map.json');

const API = 'https://pokeapi.co/api/v2/pokemon';

// Manual overrides for pokebase slugs that PokéAPI names differently.
// Pokebase often uses a bare species slug to refer to a specific default form;
// PokéAPI's /pokemon/{slug} requires the explicit form suffix.
// Extend this map as resolution failures surface.
const OVERRIDES = {
  'floette-eternal': 'floette-eternal-flower',
  // Bare species slugs → PokéAPI default-form slugs.
  aegislash: 'aegislash-shield',
  basculegion: 'basculegion-male',
  gourgeist: 'gourgeist-average',
  lycanroc: 'lycanroc-midday',
  maushold: 'maushold-family-of-four',
  meowstic: 'meowstic-male',
  mimikyu: 'mimikyu-disguised',
  morpeko: 'morpeko-full-belly',
  palafin: 'palafin-zero',
  // Pokebase uses '-paldea' shorthand; PokéAPI requires the full '-paldea-combat-breed'.
  'tauros-paldea': 'tauros-paldea-combat-breed',
};

const { slugs } = JSON.parse(await readFile(ROSTER, 'utf-8'));

async function resolveOne(slug) {
  const candidates = [OVERRIDES[slug] ?? slug];
  for (const candidate of candidates) {
    const r = await fetch(`${API}/${candidate}`);
    if (r.ok) {
      const data = await r.json();
      return { slug, id: data.id, apiSlug: candidate };
    }
  }
  return { slug, id: null, error: 'not-found' };
}

const result = {};
const failures = [];
for (const slug of slugs) {
  const r = await resolveOne(slug);
  if (r.id === null) failures.push(slug);
  else result[slug] = { id: r.id, apiSlug: r.apiSlug };
  await new Promise((r) => setTimeout(r, 50)); // rate-limit
}

await writeFile(
  OUT,
  JSON.stringify({ count: Object.keys(result).length, failures, map: result }, null, 2),
);
console.log(`Resolved ${Object.keys(result).length}/${slugs.length}; failures: ${failures.length}`);
if (failures.length) console.log('Failures:', failures);
