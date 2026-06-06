/**
 * Task 9: Identify abilities referenced in src/data/meta.ts that are NOT
 * yet present in src/data/abilities.ts. Output is consumed by Task 10
 * (translate & add the missing entries).
 *
 * Usage: node scripts/find-missing-abilities.mjs
 * Writes: .missing-abilities.json (sorted array of ability names)
 */
import { readFile, writeFile } from 'node:fs/promises';

const meta = await readFile('src/data/meta.ts', 'utf-8');
const abilitiesFile = await readFile('src/data/abilities.ts', 'utf-8');

// Collect all ability names referenced in meta.ts (abilities[] + hiddenAbility fields)
const arrayRefRe = /abilities:\s*\[([^\]]+)\]/g;
const hiddenRefRe = /hiddenAbility:\s*'([^']+)'/g;
const referenced = new Set();
for (const m of meta.matchAll(arrayRefRe)) {
  for (const a of m[1].matchAll(/'([^']+)'/g)) referenced.add(a[1]);
}
for (const m of meta.matchAll(hiddenRefRe)) referenced.add(m[1]);

// Collect existing ability nameEn values from abilities.ts
const existing = new Set(
  [...abilitiesFile.matchAll(/nameEn:\s*'([^']+)'/g)].map((m) => m[1]),
);

const missing = [...referenced].filter((a) => !existing.has(a)).sort();
console.log(`Referenced abilities (unique): ${referenced.size}`);
console.log(`Existing in abilities.ts: ${existing.size}`);
console.log(`Missing (need translation): ${missing.length}`);
await writeFile('.missing-abilities.json', JSON.stringify(missing, null, 2));
console.log('Wrote .missing-abilities.json');
