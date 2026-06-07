/**
 * Task 12 (Step 1): Fetch PokéAPI data for each of the 487 missing moves.
 *
 * Writes: .moves-pokeapi-raw.json
 */
import { readFile, writeFile } from 'node:fs/promises';

const missing = JSON.parse(await readFile('.missing-moves.json', 'utf-8'));
const API = 'https://pokeapi.co/api/v2/move';

const out = [];
let i = 0;
for (const slug of missing) {
  i++;
  try {
    const r = await fetch(`${API}/${slug}`);
    if (!r.ok) {
      console.warn(`\nskip ${slug}: HTTP ${r.status}`);
      out.push({ slug, error: r.status });
      continue;
    }
    const d = await r.json();
    const nameEn = d.names.find((n) => n.language.name === 'en')?.name ?? slug;
    const shortEffect = d.effect_entries.find((e) => e.language.name === 'en')?.short_effect ?? '';
    const effect = d.effect_entries.find((e) => e.language.name === 'en')?.effect ?? '';
    const flavor = d.flavor_text_entries.find((e) => e.language.name === 'en')?.flavor_text ?? '';
    out.push({
      slug,
      nameEn,
      type: d.type.name,
      damageClass: d.damage_class.name,
      power: d.power,
      accuracy: d.accuracy,
      pp: d.pp,
      priority: d.priority,
      effectChance: d.effect_chance,
      shortEffect,
      effect,
      flavor: flavor.replace(/[\f\n\r]+/g, ' '),
    });
    if (i % 25 === 0) {
      console.log(`  ${i}/${missing.length}...`);
    } else {
      process.stdout.write('.');
    }
  } catch (err) {
    console.warn(`\nerror ${slug}: ${err.message}`);
    out.push({ slug, error: err.message });
  }
  await new Promise((r) => setTimeout(r, 50));
}
process.stdout.write('\n');

await writeFile('.moves-pokeapi-raw.json', JSON.stringify(out, null, 2));
const errs = out.filter((x) => x.error).length;
console.log(`Drafted ${out.length} moves (${errs} errors)`);
