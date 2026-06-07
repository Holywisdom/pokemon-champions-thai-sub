// One-shot generator: produces TS source for new META_POKEMON entries
// for every slug in roster.json that isn't already present in meta.ts.
//
// Output: .meta-entries-generated.ts (temp file, manually append to meta.ts)
//
// Run: node scripts/generate-meta-entries.mjs
import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const API = 'https://pokeapi.co/api/v2';

const roster = JSON.parse(await readFile(resolve(ROOT, 'src/data/roster.json'), 'utf-8'));
const variantMap = JSON.parse(await readFile(resolve(ROOT, 'src/data/variant-id-map.json'), 'utf-8'));
const metaSrc = await readFile(resolve(ROOT, 'src/data/meta.ts'), 'utf-8');

// Existing slugs already in META_POKEMON
const existing = new Set([...metaSrc.matchAll(/slug:\s*'([a-z0-9-]+)'/g)].map((m) => m[1]));

const need = roster.slugs.filter((s) => !existing.has(s));
console.log(`Existing entries: ${existing.size}`);
console.log(`Roster slugs: ${roster.slugs.length}`);
console.log(`Generating ${need.length} new entries`);

function statName(s) {
  return {
    hp: 'hp',
    attack: 'atk',
    defense: 'def',
    'special-attack': 'spa',
    'special-defense': 'spd',
    speed: 'spe',
  }[s];
}

function titleCase(s) {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

// Convert PokéAPI canonical slug (e.g. 'charizard-mega-y', 'arcanine-hisui',
// 'tauros-paldea-aqua-breed') into the display name convention this repo uses
// (e.g. 'Mega Charizard Y', 'Hisuian Arcanine', 'Tauros - Paldea Aqua Breed').
function toDisplayName(apiSlug) {
  const parts = apiSlug.split('-');

  // Mega forms: 'aggron-mega' -> 'Mega Aggron'; 'charizard-mega-x' -> 'Mega Charizard X'
  const megaIdx = parts.indexOf('mega');
  if (megaIdx > 0) {
    const base = parts.slice(0, megaIdx).map(titleCase).join(' ');
    const suffix = parts.slice(megaIdx + 1).map((p) => p.toUpperCase()).join(' ');
    return suffix ? `Mega ${base} ${suffix}` : `Mega ${base}`;
  }

  // Regional forms
  const REGIONS = { alola: 'Alolan', galar: 'Galarian', hisui: 'Hisuian', paldea: 'Paldean' };
  const lastPart = parts[parts.length - 1];
  if (REGIONS[lastPart]) {
    const base = parts.slice(0, -1).map(titleCase).join(' ');
    return `${REGIONS[lastPart]} ${base}`;
  }

  // Default: title-case + space-join
  return parts.map(titleCase).join(' ').replace(/^Mr$/i, 'Mr.');
}

function typeId(t) {
  // PokéAPI type names match our TypeId set already (lowercase)
  return t;
}

// Format ability names: 'sand-veil' -> 'Sand Veil', 'multi-type' -> 'Multi Type'
function formatAbilityName(apiName) {
  return apiName
    .split('-')
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ');
}

// Escape single quotes inside strings emitted into TS single-quoted literals
function escSq(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

const entries = [];
let i = 0;
for (const slug of need) {
  i += 1;
  const variant = variantMap.map[slug];
  if (!variant) {
    console.warn(`! No variant-id-map entry for slug: ${slug} — skipping`);
    continue;
  }
  const { apiSlug } = variant;
  const url = `${API}/pokemon/${apiSlug}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`! [${i}/${need.length}] ${slug} (${apiSlug}) — HTTP ${res.status}`);
    continue;
  }
  const data = await res.json();
  const stats = Object.fromEntries(
    data.stats.map((s) => [statName(s.stat.name), s.base_stat])
  );
  const types = data.types
    .sort((a, b) => a.slot - b.slot)
    .map((t) => typeId(t.type.name));
  const abilities = data.abilities
    .filter((a) => !a.is_hidden)
    .sort((a, b) => a.slot - b.slot)
    .map((a) => formatAbilityName(a.ability.name));
  const hidden = data.abilities.find((a) => a.is_hidden);
  const nameEn = toDisplayName(data.name);

  entries.push({
    id: data.id,
    slug,
    nameEn,
    types,
    baseStats: stats,
    abilities,
    hiddenAbility: hidden ? formatAbilityName(hidden.ability.name) : undefined,
    tier: 'Untiered',
  });

  if (i % 25 === 0) {
    console.log(`  [${i}/${need.length}] processed (last: ${slug} -> ${nameEn})`);
  }

  // Be polite to PokéAPI
  await new Promise((r) => setTimeout(r, 50));
}

// Emit as TS source block for manual append to meta.ts
const tsBlock = entries
  .map((e) => {
    const lines = [
      `  {`,
      `    id: ${e.id},`,
      `    slug: '${escSq(e.slug)}',`,
      `    nameEn: '${escSq(e.nameEn)}',`,
      `    types: [${e.types.map((t) => `'${t}'`).join(', ')}],`,
      `    baseStats: { hp: ${e.baseStats.hp}, atk: ${e.baseStats.atk}, def: ${e.baseStats.def}, spa: ${e.baseStats.spa}, spd: ${e.baseStats.spd}, spe: ${e.baseStats.spe} },`,
      `    abilities: [${e.abilities.map((a) => `'${escSq(a)}'`).join(', ')}],`,
      e.hiddenAbility ? `    hiddenAbility: '${escSq(e.hiddenAbility)}',` : null,
      `    tier: 'Untiered',`,
      `  },`,
    ].filter(Boolean);
    return lines.join('\n');
  })
  .join('\n');

await writeFile(resolve(ROOT, '.meta-entries-generated.ts'), tsBlock + '\n');
console.log(`\nWrote .meta-entries-generated.ts (${entries.length} entries)`);
