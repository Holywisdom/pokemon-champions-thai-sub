#!/usr/bin/env node
/**
 * Optional: fetch extended PokéAPI data and merge into generated JSON.
 * Run with: npm run fetch
 *
 * This script enriches the curated meta list with additional details
 * from PokéAPI (sprites, additional moves, abilities, etc.) and writes
 * them to src/data/generated/.
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT_DIR = resolve(ROOT, 'src/data/generated');

const API = 'https://pokeapi.co/api/v2';

/** ---- helpers ---- */
async function fetchJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
  return r.json();
}

async function ensureDir(p) {
  if (!existsSync(p)) await mkdir(p, { recursive: true });
}

/** Sleep to be nice to the API */
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/** ---- main ---- */
async function main() {
  console.log('→ Fetching PokéAPI data...');
  await ensureDir(OUT_DIR);

  const args = process.argv.slice(2);
  const full = args.includes('--full');

  // Read curated meta list slugs
  const metaModule = await import(resolve(ROOT, 'src/data/meta.ts')).catch(async () => {
    // ts cannot be loaded directly, parse it instead
    const fs = await import('node:fs/promises');
    const src = await fs.readFile(resolve(ROOT, 'src/data/meta.ts'), 'utf-8');
    const slugMatches = [...src.matchAll(/slug:\s*'([a-z0-9-]+)'/g)];
    return { META_POKEMON: slugMatches.map((m) => ({ slug: m[1] })) };
  });

  const slugs = (metaModule.META_POKEMON || []).map((p) => p.slug);
  console.log(`→ Found ${slugs.length} curated Pokemon`);

  const enriched = [];
  for (const slug of slugs) {
    try {
      const pokemon = await fetchJSON(`${API}/pokemon/${slug}`);
      const species = await fetchJSON(pokemon.species.url);
      enriched.push({
        slug,
        sprite_default: pokemon.sprites?.other?.['official-artwork']?.front_default,
        sprite_shiny: pokemon.sprites?.other?.['official-artwork']?.front_shiny,
        height: pokemon.height,
        weight: pokemon.weight,
        genus: species.genera?.find((g) => g.language.name === 'en')?.genus,
        flavorText: species.flavor_text_entries
          ?.filter((f) => f.language.name === 'en')
          ?.slice(0, 3)
          ?.map((f) => f.flavor_text.replace(/[\f\n]/g, ' ')),
      });
      console.log(`  ✓ ${slug}`);
      await sleep(120); // be polite
    } catch (e) {
      console.error(`  ✗ ${slug}: ${e.message}`);
    }
  }

  await writeFile(
    resolve(OUT_DIR, 'pokemon-enriched.json'),
    JSON.stringify(enriched, null, 2),
    'utf-8'
  );
  console.log(`→ Wrote ${enriched.length} enriched entries`);

  if (full) {
    console.log('→ Fetching all moves (this takes a while)...');
    const moveList = await fetchJSON(`${API}/move?limit=1000`);
    const moves = [];
    for (const m of moveList.results) {
      try {
        const data = await fetchJSON(m.url);
        moves.push({
          slug: data.name,
          name: data.names.find((n) => n.language.name === 'en')?.name,
          type: data.type?.name,
          power: data.power,
          accuracy: data.accuracy,
          pp: data.pp,
          priority: data.priority,
          damageClass: data.damage_class?.name,
          effect: data.effect_entries?.find((e) => e.language.name === 'en')?.short_effect,
        });
        await sleep(80);
      } catch (e) {
        // skip
      }
    }
    await writeFile(
      resolve(OUT_DIR, 'moves-full.json'),
      JSON.stringify(moves, null, 2),
      'utf-8'
    );
    console.log(`→ Wrote ${moves.length} moves`);
  }

  console.log('\n✓ Done!');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
