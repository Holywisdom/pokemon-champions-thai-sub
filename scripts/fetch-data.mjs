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

/** Parse meta.ts to extract slugs (works without TypeScript runtime). */
async function getMetaSlugs() {
  const src = await readFile(resolve(ROOT, 'src/data/meta.ts'), 'utf-8');
  const slugs = [...src.matchAll(/^\s+slug:\s*'([a-z0-9-]+)',?$/gm)].map((m) => m[1]);
  return [...new Set(slugs)];
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

  const slugs = await getMetaSlugs();
  console.log(`→ ${slugs.length} Pokemon in meta list`);

  const learnsets = {};
  const allMoveNames = new Set();

  // 1. Pull each Pokemon's learnset
  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    try {
      const data = await fetchJSON(`${API}/pokemon/${slug}`);
      const learnset = extractLearnset(data);
      learnsets[slug] = learnset;
      learnset.forEach((m) => allMoveNames.add(m.name));
      console.log(`  [${i + 1}/${slugs.length}] ${slug} → ${learnset.length} moves`);
      await sleep(80); // polite
    } catch (e) {
      console.error(`  ✗ ${slug}: ${e.message}`);
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
    pokemonCount: slugs.length,
    moveCount: Object.keys(moves).length,
    learnsets,
    moves,
  };
  await writeFile(
    resolve(OUT_DIR, 'learnsets.json'),
    JSON.stringify(output, null, 2),
    'utf-8'
  );
  console.log(`\n✓ Wrote learnsets.json — ${slugs.length} Pokemon, ${Object.keys(moves).length} moves`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
