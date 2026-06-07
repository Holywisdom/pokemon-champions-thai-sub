/**
 * Task 10 (Step 1): Fetch PokéAPI English short_effect for each missing ability.
 * Also build mon→abilities map from meta.ts so notableUsers can be populated.
 *
 * Writes: .abilities-pokeapi-raw.json
 */
import { readFile, writeFile } from 'node:fs/promises';

const missing = JSON.parse(await readFile('.missing-abilities.json', 'utf-8'));
const API = 'https://pokeapi.co/api/v2/ability';

// PC-specific abilities — NOT in PokéAPI. Filled by hand from PC context.
const PC_SPECIFIC = {
  'Dragonize': {
    effect: 'PC-exclusive: Normal-type moves become Dragon-type and get 1.2x power (parallels Aerilate/Pixilate/Refrigerate).',
    inferred: true,
  },
  'Mega Sol': {
    effect: 'PC-exclusive Mega Meganium ability — likely sets/extends Sun on Mega Evolution; effect unverified.',
    inferred: true,
  },
  'Piercing Drill': {
    effect: 'PC-exclusive Mega Excadrill ability — likely contact/penetration boost; effect unverified.',
    inferred: true,
  },
  'Spicy Spray': {
    effect: 'PC-exclusive Mega Scovillain ability — likely fire-spread / burn-related; effect unverified.',
    inferred: true,
  },
};

function toSlug(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

const out = [];
for (const name of missing) {
  const slug = toSlug(name);
  if (PC_SPECIFIC[name]) {
    out.push({ slug, nameEn: name, effect: PC_SPECIFIC[name].effect, pcSpecific: true });
    continue;
  }
  try {
    const r = await fetch(`${API}/${slug}`);
    if (!r.ok) {
      console.warn(`skip ${name} (${slug}): HTTP ${r.status}`);
      out.push({ slug, nameEn: name, effect: '', error: r.status });
      continue;
    }
    const d = await r.json();
    const enEffectEntries = d.effect_entries.filter((e) => e.language.name === 'en');
    const shortEffect = enEffectEntries[0]?.short_effect ?? '';
    const longEffect = enEffectEntries[0]?.effect ?? '';
    out.push({
      slug,
      nameEn: name,
      shortEffect,
      effect: longEffect,
    });
    process.stdout.write('.');
  } catch (err) {
    console.warn(`error ${name}: ${err.message}`);
    out.push({ slug, nameEn: name, effect: '', error: err.message });
  }
  await new Promise((r) => setTimeout(r, 60));
}
process.stdout.write('\n');

await writeFile('.abilities-pokeapi-raw.json', JSON.stringify(out, null, 2));
console.log(
  `Drafted ${out.length} abilities (${out.filter((x) => x.pcSpecific).length} PC-specific, ${out.filter((x) => x.error).length} errors)`,
);

// --- Build mon→abilities map ---
const meta = await readFile('src/data/meta.ts', 'utf-8');
// Match each MetaPokemon object — find nameEn + abilities[] + optional hiddenAbility.
// Approach: split file by `\n  {` boundaries within META_POKEMON array.
const monAbilities = {}; // { abilityName: Set<monName> }

// Step through file with a stateful parser keyed on `nameEn: '...'`
// We scan all nameEn occurrences and then look forward to capture abilities+hiddenAbility
// belonging to the same object (terminated by the next nameEn or end-of-array).
const idxRe = /nameEn:\s*'([^']+)'/g;
const matches = [];
let m;
while ((m = idxRe.exec(meta)) !== null) {
  matches.push({ name: m[1], start: m.index });
}
for (let i = 0; i < matches.length; i++) {
  const startIdx = matches[i].start;
  const endIdx = i + 1 < matches.length ? matches[i + 1].start : meta.length;
  const block = meta.slice(startIdx, endIdx);
  // Skip the second nameEn fields belonging to non-mon contexts? In our schema nameEn appears
  // once per MetaPokemon — safe.
  const monName = matches[i].name;
  const abilMatch = block.match(/abilities:\s*\[([^\]]+)\]/);
  if (abilMatch) {
    for (const a of abilMatch[1].matchAll(/'([^']+)'/g)) {
      (monAbilities[a[1]] = monAbilities[a[1]] || new Set()).add(monName);
    }
  }
  const hidMatch = block.match(/hiddenAbility:\s*'([^']+)'/);
  if (hidMatch) {
    (monAbilities[hidMatch[1]] = monAbilities[hidMatch[1]] || new Set()).add(`${monName} (HA)`);
  }
}

const monAbilitiesObj = {};
for (const [k, v] of Object.entries(monAbilities)) {
  monAbilitiesObj[k] = [...v];
}
await writeFile('.mon-abilities-map.json', JSON.stringify(monAbilitiesObj, null, 2));
console.log(`Wrote .mon-abilities-map.json (${Object.keys(monAbilitiesObj).length} abilities mapped)`);
