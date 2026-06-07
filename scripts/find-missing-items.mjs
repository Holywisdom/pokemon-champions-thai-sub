/**
 * Identify Mega Stones needed by the PC roster Mega forms + any items
 * referenced by META that aren't in items.ts.
 *
 * Strategy:
 *   1) Read all Mega slugs from roster.json
 *   2) Map each Mega slug → expected Mega Stone slug (PokéAPI canonical or PC-original)
 *   3) Compare against existing items.ts slugs
 *   4) Audit `commonItems` (display names) and `sets[].item` (display names) against
 *      existing nameEn values — strip parenthetical annotations the lookup helper
 *      also strips (so display+annotation like 'Gengarite (Mega Stone)' resolves)
 *   5) Emit .missing-items.json
 *
 * Run: node scripts/find-missing-items.mjs
 */

import { readFile, writeFile } from 'node:fs/promises';

const roster = JSON.parse(await readFile('src/data/roster.json', 'utf-8'));
const itemsFile = await readFile('src/data/items.ts', 'utf-8');
const metaFile = await readFile('src/data/meta.ts', 'utf-8');

// Existing item slugs
const existingSlugs = new Set();
for (const m of itemsFile.matchAll(/slug:\s*'([^']+)'/g)) existingSlugs.add(m[1]);

// Existing item display names (nameEn)
const existingNames = new Set();
for (const m of itemsFile.matchAll(/nameEn:\s*'([^']+)'/g)) existingNames.add(m[1]);

// PokéAPI canonical Mega Stones (snapshot: 2026-06-07 from
// /api/v2/item-category/mega-stones)
const PA_MEGA_STONES = new Set([
  'gengarite', 'gardevoirite', 'ampharosite', 'venusaurite', 'charizardite-x',
  'blastoisinite', 'mewtwonite-x', 'mewtwonite-y', 'blazikenite', 'medichamite',
  'houndoominite', 'aggronite', 'banettite', 'tyranitarite', 'scizorite',
  'pinsirite', 'aerodactylite', 'lucarionite', 'abomasite', 'kangaskhanite',
  'gyaradosite', 'absolite', 'charizardite-y', 'alakazite', 'heracronite',
  'mawilite', 'manectite', 'garchompite', 'latiasite', 'latiosite',
  'swampertite', 'sceptilite', 'sablenite', 'altarianite', 'galladite',
  'audinite', 'metagrossite', 'sharpedonite', 'slowbronite', 'steelixite',
  'pidgeotite', 'glalitite', 'diancite', 'cameruptite', 'lopunnite',
  'salamencite', 'beedrillite',
]);

// Mega slug → Mega Stone slug. Default = `<base>ite` (or `<base>ite-x/y`).
const STONE_OVERRIDES = {
  // PokéAPI canonical naming
  'gengar-mega': 'gengarite',
  'alakazam-mega': 'alakazite',
  'heracross-mega': 'heracronite',
  'mawile-mega': 'mawilite',
  'manectric-mega': 'manectite',
  'sableye-mega': 'sablenite',
  'audino-mega': 'audinite',
  'lopunny-mega': 'lopunnite',
  'aggron-mega': 'aggronite',
  'banette-mega': 'banettite',
  'beedrill-mega': 'beedrillite',
  'altaria-mega': 'altarianite',
  'absol-mega': 'absolite',
  'medicham-mega': 'medichamite',
  'houndoom-mega': 'houndoominite',
  'sharpedo-mega': 'sharpedonite',
  'slowbro-mega': 'slowbronite',
  'pidgeot-mega': 'pidgeotite',
  'glalie-mega': 'glalitite',
  'camerupt-mega': 'cameruptite',
  'blastoise-mega': 'blastoisinite',
  'lucario-mega': 'lucarionite',
  'gallade-mega': 'galladite',
  'abomasnow-mega': 'abomasite',
  // PC-original Mega forms with no canonical PokéAPI stone
  'greninja-mega': 'greninjite',
  'delphox-mega': 'delphoxite',
  'meowstic-mega': 'meowsticite',
  'froslass-mega': 'froslassite',
  'starmie-mega': 'starmite',
  'hawlucha-mega': 'hawluchite',
  'skarmory-mega': 'skarmorite',
  'excadrill-mega': 'excadrillite',
  'floette-mega': 'floettite',
  'glimmora-mega': 'glimmorite',
  'dragonite-mega': 'dragonitite',
  'chandelure-mega': 'chandelurite',
  'meganium-mega': 'meganiumite',
  'feraligatr-mega': 'feraligatrite',
  'emboar-mega': 'emboarite',
  'scovillain-mega': 'scovillainite',
  'clefable-mega': 'clefabite',
  'victreebel-mega': 'victreebelite',
  'chimecho-mega': 'chimechite',
  'golurk-mega': 'golurkite',
  'chesnaught-mega': 'chesnaughtite',
  'drampa-mega': 'drampite',
  'crabominable-mega': 'crabominite',
};

function megaStoneSlug(megaSlug) {
  if (STONE_OVERRIDES[megaSlug]) return STONE_OVERRIDES[megaSlug];
  const m = megaSlug.match(/^(.+?)-mega(?:-([xy]))?$/);
  if (!m) return null;
  const [, base, xy] = m;
  let stone = base + 'ite';
  if (xy) stone += `-${xy}`;
  return stone;
}

const megaForms = roster.slugs.filter((s) => /-mega(-[xy])?$/.test(s));
const expected = megaForms.map((megaSlug) => {
  const stoneSlug = megaStoneSlug(megaSlug);
  return {
    megaSlug,
    stoneSlug,
    inPokeApi: PA_MEGA_STONES.has(stoneSlug),
    inItemsTs: existingSlugs.has(stoneSlug),
  };
});

const missingFromItems = expected.filter((e) => !e.inItemsTs);
const pcOnly = expected.filter((e) => !e.inPokeApi);

// Audit display-name references in META.
// Mirror the lookup logic: strip parentheticals before checking existence.
function stripAnnotations(name) {
  return name.replace(/\s*\(.*?\)\s*/g, '').trim();
}

const referencedNames = new Set();
for (const m of metaFile.matchAll(/item:\s*'([^']+)'/g)) referencedNames.add(m[1]);
for (const m of metaFile.matchAll(/commonItems:\s*\[([^\]]+)\]/g)) {
  for (const i of m[1].matchAll(/'([^']+)'/g)) referencedNames.add(i[1]);
}

const missingNameRefs = [];
for (const n of referencedNames) {
  const cleaned = stripAnnotations(n);
  if (!existingNames.has(cleaned)) {
    missingNameRefs.push({ raw: n, cleaned });
  }
}
// dedupe by cleaned name
const seenCleaned = new Set();
const uniqMissing = missingNameRefs.filter((r) => {
  if (seenCleaned.has(r.cleaned)) return false;
  seenCleaned.add(r.cleaned);
  return true;
});

await writeFile(
  '.missing-items.json',
  JSON.stringify(
    {
      summary: {
        totalMegaForms: megaForms.length,
        alreadyInItemsTs: expected.filter((e) => e.inItemsTs).length,
        missingFromItemsTs: missingFromItems.length,
        pcOnlyMegas: pcOnly.length,
        missingNameRefsFromMeta: uniqMissing.length,
      },
      missingFromItemsTs: missingFromItems,
      pcOnlyMegas: pcOnly,
      missingNameRefs: uniqMissing,
      existing: [...existingSlugs].sort(),
    },
    null,
    2,
  ),
);

console.log('Total Mega forms       :', megaForms.length);
console.log('Already in items.ts    :', expected.filter((e) => e.inItemsTs).length);
console.log('Missing from items.ts  :', missingFromItems.length);
console.log('  → of those, PC-only  :', missingFromItems.filter((e) => !e.inPokeApi).length);
console.log('Genuine missing nameEn refs in META:', uniqMissing.length);
for (const r of uniqMissing) {
  console.log(`  raw='${r.raw}' cleaned='${r.cleaned}'`);
}
console.log('\nWrote .missing-items.json');
