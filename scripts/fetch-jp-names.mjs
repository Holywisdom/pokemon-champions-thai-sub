#!/usr/bin/env node
/**
 * One-shot: fetch JP (katakana) names for every slug in META_POKEMON.
 * Output: .jp-names.json at repo root.
 *
 * Reads slug list from .all-slugs.json (produced by an inline extraction)
 * and looks up each via /pokemon/{apiSlug} -> species -> names.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const API = 'https://pokeapi.co/api/v2';
const OUT = resolve(ROOT, '.jp-names.json');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
  return r.json();
}

async function main() {
  const slugs = JSON.parse(await readFile(resolve(ROOT, '.all-slugs.json'), 'utf-8'));
  const variantMap = JSON.parse(
    await readFile(resolve(ROOT, 'src/data/variant-id-map.json'), 'utf-8')
  ).map;

  // floette-eternal isn't in variant map; hardcode
  // PokéAPI: floette-eternal id 10061
  const fallback = { 'floette-eternal': { id: 10061, apiSlug: 'floette-eternal' } };

  // Resume from existing file if present
  const result = existsSync(OUT) ? JSON.parse(await readFile(OUT, 'utf-8')) : {};

  let i = 0;
  for (const slug of slugs) {
    i++;
    if (result[slug] && !result[slug].error && result[slug].jp_kata) {
      continue;
    }
    const entry = variantMap[slug] ?? fallback[slug];
    if (!entry) {
      result[slug] = { error: 'no variant map entry' };
      console.log(`[${i}/${slugs.length}] ${slug}: NO MAP`);
      continue;
    }
    try {
      const pkm = await fetchJSON(`${API}/pokemon/${entry.apiSlug}`);
      const species = await fetchJSON(pkm.species.url);
      const jpHrkt = species.names.find((n) => n.language.name === 'ja-hrkt')?.name;
      const jp = species.names.find((n) => n.language.name === 'ja')?.name;
      const jpRoma = species.names.find((n) => n.language.name === 'ja-roma')?.name;
      const en = species.names.find((n) => n.language.name === 'en')?.name ?? pkm.name;
      result[slug] = {
        en,
        jp_kata: jpHrkt ?? null,
        jp: jp ?? null,
        jp_roma: jpRoma ?? null,
        speciesName: species.name,
      };
      console.log(`[${i}/${slugs.length}] ${slug}: ${jpHrkt}`);
    } catch (e) {
      result[slug] = { error: e.message };
      console.log(`[${i}/${slugs.length}] ${slug}: ERROR ${e.message}`);
    }
    // Save every 25 entries
    if (i % 25 === 0) {
      await writeFile(OUT, JSON.stringify(result, null, 2));
    }
    await sleep(40);
  }
  await writeFile(OUT, JSON.stringify(result, null, 2));
  console.log(`Wrote ${OUT}`);
}

await main();
