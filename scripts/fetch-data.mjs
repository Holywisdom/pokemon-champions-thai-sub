#!/usr/bin/env node
/**
 * Fetch PokéAPI data for the meta Pokemon list:
 *   - Each Pokemon's full learnset (filtered to recent gens)
 *   - Each referenced move's stats (type, power, accuracy, pp, priority, damage_class, effect)
 *
 * Output: src/data/generated/learnsets.json
 *
 * Usage: npm run fetch
 */

import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT_DIR = resolve(ROOT, 'src/data/generated');

const API = 'https://pokeapi.co/api/v2';

// PokéAPI version groups to include (most recent first)
const PREFERRED_VERSION_GROUPS = [
  'scarlet-violet',
  'sword-shield',
  'sun-moon',
  'ultra-sun-ultra-moon',
];

async function fetchJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
  return r.json();
}

async function ensureDir(p) {
  if (!existsSync(p)) await mkdir(p, { recursive: true });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Build the meta list from roster.json + variant-id-map.json.
 * Returns [{ slug, id, apiSlug }, …] where:
 *   - `slug` is the pokebase canonical slug (also used as the output key)
 *   - `id` is the PokéAPI numeric ID
 *   - `apiSlug` is the PokéAPI slug used in URLs (may differ from `slug`,
 *      e.g. `aegislash` → `aegislash-shield`)
 */
async function getMetaList() {
  const roster = JSON.parse(await readFile(resolve(ROOT, 'src/data/roster.json'), 'utf-8'));
  const variantMap = JSON.parse(
    await readFile(resolve(ROOT, 'src/data/variant-id-map.json'), 'utf-8')
  );
  const list = roster.slugs.map((slug) => ({
    slug,
    id: variantMap.map[slug]?.id,
    apiSlug: variantMap.map[slug]?.apiSlug ?? slug,
  }));
  const missing = list.filter((m) => !m.id);
  if (missing.length) {
    throw new Error(`Missing PokéAPI ID for: ${missing.map((m) => m.slug).join(', ')}`);
  }
  return list;
}

/** Extract learnset filtered to most recent generation, deduplicated. */
function extractLearnset(pokemonData) {
  const result = new Map(); // moveName -> { methods: [{method, level, group}] }

  for (const moveEntry of pokemonData.moves) {
    const name = moveEntry.move.name;
    // Pick the most recent version_group's learn details
    let chosen = null;
    let chosenIdx = Infinity;
    for (const vgd of moveEntry.version_group_details) {
      const idx = PREFERRED_VERSION_GROUPS.indexOf(vgd.version_group.name);
      if (idx !== -1 && idx < chosenIdx) {
        chosenIdx = idx;
        chosen = vgd;
      }
    }
    if (!chosen) continue;

    if (!result.has(name)) {
      result.set(name, { methods: [] });
    }
    result.get(name).methods.push({
      method: chosen.move_learn_method.name,
      level: chosen.level_learned_at,
      versionGroup: chosen.version_group.name,
    });
  }

  return [...result.entries()].map(([name, data]) => ({ name, ...data }));
}

/** Fetch full move data with caching. */
const moveCache = new Map();
async function fetchMove(name) {
  if (moveCache.has(name)) return moveCache.get(name);
  const data = await fetchJSON(`${API}/move/${name}`);
  const compact = {
    name: data.name,
    type: data.type?.name,
    damageClass: data.damage_class?.name,
    power: data.power,
    accuracy: data.accuracy,
    pp: data.pp,
    priority: data.priority,
    target: data.target?.name,
    effect: data.effect_entries?.find((e) => e.language.name === 'en')?.short_effect ?? '',
    flavorText:
      data.flavor_text_entries
        ?.filter((f) => f.language.name === 'en')
        ?.sort((a, b) =>
          PREFERRED_VERSION_GROUPS.indexOf(a.version_group.name) -
          PREFERRED_VERSION_GROUPS.indexOf(b.version_group.name)
        )?.[0]?.flavor_text?.replace(/[\f\n]/g, ' ') ?? '',
  };
  moveCache.set(name, compact);
  return compact;
}

async function main() {
  console.log('→ Fetching learnsets from PokéAPI...');
  await ensureDir(OUT_DIR);

  const metaList = await getMetaList();
  console.log(`→ ${metaList.length} Pokemon in meta list`);

  const learnsets = {};
  const allMoveNames = new Set();

  // 1. Pull each Pokemon's learnset.
  //    Output is keyed by pokebase `slug`, but the PokéAPI call uses `apiSlug`
  //    (e.g. `aegislash` → `aegislash-shield`).
  for (let i = 0; i < metaList.length; i++) {
    const { slug, apiSlug } = metaList[i];
    try {
      const data = await fetchJSON(`${API}/pokemon/${apiSlug}`);
      const learnset = extractLearnset(data);
      learnsets[slug] = learnset;
      learnset.forEach((m) => allMoveNames.add(m.name));
      const tag = apiSlug === slug ? slug : `${slug} (api: ${apiSlug})`;
      console.log(`  [${i + 1}/${metaList.length}] ${tag} → ${learnset.length} moves`);
      await sleep(80); // polite
    } catch (e) {
      console.error(`  ✗ ${slug} (api: ${apiSlug}): ${e.message}`);
      learnsets[slug] = [];
    }
  }

  // 2. Pull each unique move's data
  console.log(`\n→ Fetching ${allMoveNames.size} unique moves...`);
  const moves = {};
  const moveList = [...allMoveNames];
  for (let i = 0; i < moveList.length; i++) {
    const name = moveList[i];
    try {
      const data = await fetchMove(name);
      moves[name] = data;
      if ((i + 1) % 25 === 0) {
        console.log(`  ${i + 1}/${moveList.length} fetched...`);
      }
      await sleep(50);
    } catch (e) {
      console.error(`  ✗ ${name}: ${e.message}`);
    }
  }

  // 3. Write output
  const output = {
    generated: new Date().toISOString(),
    versionGroups: PREFERRED_VERSION_GROUPS,
    pokemonCount: metaList.length,
    moveCount: Object.keys(moves).length,
    learnsets,
    moves,
  };
  await writeFile(
    resolve(OUT_DIR, 'learnsets.json'),
    JSON.stringify(output, null, 2),
    'utf-8'
  );
  console.log(
    `\n✓ Wrote learnsets.json — ${metaList.length} Pokemon, ${Object.keys(moves).length} moves`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
