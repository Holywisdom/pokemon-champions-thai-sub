# Roster Expansion 80 → 266 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring all 266 Pokémon Champions roster entries into the site with full Thai translation, matching the data coverage pokebase.app provides — without implementing the other 7 systems on the roadmap.

**Architecture:** One-shot scrape of pokebase to extract canonical roster → PokéAPI fetch for stats/types/abilities/learnsets → extend the existing static data layer (`pokemon-index.ts`, `meta.ts`, `abilities.ts`, `moves.ts`, `items.ts`) with new entries → bulk translate to Thai with community-research QC → relax MetaPokemon required fields so new mons can ship with light curation → no template changes if existing template renders gracefully.

**Tech Stack:** Astro 5 static site, TypeScript, Tailwind, Node fetch script against PokéAPI.

**Spec:** `docs/superpowers/specs/2026-06-07-roster-expansion-design.md`

---

## File map (all changes scoped to system 1)

| File | Action | Responsibility |
|---|---|---|
| `scripts/scrape-pokebase-roster.mjs` | Create | One-shot scrape of pokebase speed-tier page → `roster.json` |
| `scripts/build-variant-id-map.mjs` | Create | Reference PokéAPI to resolve PokéAPI ID for each slug in `roster.json`; emit `variant-id-map.json` |
| `scripts/fetch-data.mjs` | Modify | Accept full 266-slug input, use variant ID map for Mega/regional forms |
| `src/data/roster.json` | Create (generated) | Canonical 266 Pokémon Champions slugs |
| `src/data/variant-id-map.json` | Create (generated) | Slug → PokéAPI ID mapping |
| `src/data/meta.ts` | Modify | Relax MetaPokemon required-fields to optional; extend `META_POKEMON` with 186 new entries; add `Untiered` to `Tier` type and `TIERS_LIST` |
| `src/data/pokemon-index.ts` | Modify | Add 186 new entries; add `nameTh` to all 266 entries |
| `src/data/abilities.ts` | Modify | Add stub + Thai translation for abilities used by new mons but not yet present |
| `src/data/moves.ts` | Modify | Add stub + Thai translation for moves in new learnsets not yet present |
| `src/data/items.ts` | Modify | Add Mega Stones for new Megas + Thai translation |
| `src/data/translations.ts` | Modify (if needed) | Add `Untiered` label string if used in UI |
| `src/data/generated/learnsets.json` | Regenerate | Covers all 266 |
| `src/pages/pokedex.astro` | Modify | Header copy `80` → `266`; add `Untiered` filter chip |
| `src/pages/pokemon/[slug].astro` | Verify only | Confirm renders cleanly for mons with empty `sets`/`counters`/`teammates`/`strengths`/`weaknesses`; if it doesn't, add a single guarded edit task |

No new component files. No route changes.

---

## Verification model

This project has no test framework. Each task's verification step is one of:

- `npm run build` succeeds (Astro emits 266 pages, type-check passes)
- `npx astro check` for TypeScript-only check
- Visual spot-check via `npm run dev` + opening specific URLs
- `node scripts/<script>.mjs` runs to completion and emits expected file

Type safety in `.ts` data files catches most issues at build time. No unit tests required for this work.

---

## Phase A — Bootstrap canonical roster

### Task 1: Scrape pokebase speed-tier into canonical roster list

**Files:**
- Create: `scripts/scrape-pokebase-roster.mjs`
- Create: `src/data/roster.json` (generated output)

- [ ] **Step 1: Write the scraper**

```javascript
// scripts/scrape-pokebase-roster.mjs
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT = resolve(ROOT, 'src/data/roster.json');

const SPEED_TIER_URL = 'https://pokebase.app/pokemon-champions/speed-tiers';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36';

const html = await fetch(SPEED_TIER_URL, { headers: { 'User-Agent': UA } }).then((r) => {
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.text();
});

// Extract every /pokemon-champions/pokemon/<slug> link, dedupe, preserve order.
const slugRe = /\/pokemon-champions\/pokemon\/([a-z0-9-]+)/g;
const seen = new Set();
const slugs = [];
for (const m of html.matchAll(slugRe)) {
  const s = m[1];
  if (!seen.has(s)) { seen.add(s); slugs.push(s); }
}

if (slugs.length < 200) {
  throw new Error(`Expected 200+ slugs; got ${slugs.length}. Page structure may have changed.`);
}

if (!existsSync(dirname(OUT))) await mkdir(dirname(OUT), { recursive: true });
await writeFile(OUT, JSON.stringify({ source: SPEED_TIER_URL, fetchedAt: new Date().toISOString(), count: slugs.length, slugs }, null, 2));
console.log(`Wrote ${slugs.length} slugs to ${OUT}`);
```

- [ ] **Step 2: Run scraper**

Run: `node scripts/scrape-pokebase-roster.mjs`
Expected: `Wrote N slugs to .../roster.json` where N is between 200 and 300 (likely ~266).

- [ ] **Step 3: Sanity check output**

Run: `head -20 src/data/roster.json && echo '...' && wc -l src/data/roster.json`
Expected: JSON file with `count`, `slugs` array. Spot-check that known mons like `garchomp`, `charizard-mega-y`, `tyranitar`, `tauros-paldea-aqua-breed` appear.

- [ ] **Step 4: Commit**

```bash
git add scripts/scrape-pokebase-roster.mjs src/data/roster.json
git commit -m "feat(roster): scrape canonical Pokémon Champions slug list from pokebase"
```

---

### Task 2: Build variant ID map (pokebase slug → PokéAPI ID)

**Files:**
- Create: `scripts/build-variant-id-map.mjs`
- Create: `src/data/variant-id-map.json` (generated)

PokéAPI uses different slug conventions than pokebase. Examples:
- pokebase `charizard-mega-y` → PokéAPI `charizard-mega-y` (matches, ID 10035)
- pokebase `tauros-paldea-aqua-breed` → PokéAPI `tauros-paldea-aqua-breed`
- pokebase `floette-eternal` → PokéAPI `floette-eternal-flower`

We resolve each slug by attempting the slug-as-is on PokéAPI's `/pokemon/{slug}` endpoint; if 404, try a small set of common variants; if still failing, write a manual override map in this script.

- [ ] **Step 1: Write the resolver**

```javascript
// scripts/build-variant-id-map.mjs
import { readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const ROSTER = resolve(ROOT, 'src/data/roster.json');
const OUT = resolve(ROOT, 'src/data/variant-id-map.json');

const API = 'https://pokeapi.co/api/v2/pokemon';

// Manual overrides for slugs that PokéAPI names differently.
// Extend this map as resolution failures surface.
const OVERRIDES = {
  'floette-eternal': 'floette-eternal-flower',
  // add more as 404s appear
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

await writeFile(OUT, JSON.stringify({ count: Object.keys(result).length, failures, map: result }, null, 2));
console.log(`Resolved ${Object.keys(result).length}/${slugs.length}; failures: ${failures.length}`);
if (failures.length) console.log('Failures:', failures);
```

- [ ] **Step 2: Run resolver**

Run: `node scripts/build-variant-id-map.mjs`
Expected output: `Resolved N/N; failures: 0` ideally. If failures > 0, add overrides to the script and re-run until all resolve.

- [ ] **Step 3: Validate output**

Run: `node -e "const m = require('./src/data/variant-id-map.json'); console.log('count:', m.count, 'failures:', m.failures.length); console.log('garchomp:', m.map.garchomp); console.log('charizard-mega-y:', m.map['charizard-mega-y']);"`
Expected: count ≈ 266, failures = 0, both lookups return valid IDs.

- [ ] **Step 4: Commit**

```bash
git add scripts/build-variant-id-map.mjs src/data/variant-id-map.json
git commit -m "feat(roster): map pokebase slugs to PokéAPI IDs"
```

---

## Phase B — Schema relaxation

### Task 3: Make MetaPokemon curation fields optional

Current `MetaPokemon` interface requires: `role`, `roleTh`, `description`, `strengths`, `weaknesses`, `commonItems`, `commonMoves`. For 186 new mons with no curation, these need to be optional.

**Files:**
- Modify: `src/data/meta.ts` (interface block near top, ~line 50)

- [ ] **Step 1: Mark curation fields optional**

In `src/data/meta.ts`, change the `MetaPokemon` interface:

```typescript
export interface MetaPokemon {
  id: number;
  slug: string;
  nameEn: string;
  nameTh?: string;

  // Battle data (required — always available from PokéAPI)
  types: TypeId[];
  baseStats: { hp: number; atk: number; def: number; spa: number; spd: number; spe: number };
  abilities: string[];
  hiddenAbility?: string;

  // Tier (required — curated for old 80, "Untiered" default for new 186)
  tier: Tier;

  // Champions-specific curation (OPTIONAL — present for curated mons only)
  usagePercent?: number;
  winRate?: number;
  role?: string;
  roleTh?: string;
  description?: string;
  strengths?: string[];
  weaknesses?: string[];
  commonItems?: string[];
  commonMoves?: string[];
  sets?: CompetitiveSet[];
  counters?: string[];
  teammates?: string[];

  hasMega?: boolean;
  megaForm?: string;
}
```

- [ ] **Step 2: Add `Untiered` tier**

In the same file, change:

```typescript
export type Tier = 'S' | 'A' | 'B' | 'C' | 'Restricted' | 'Untiered';
```

And append to `TIERS_LIST`:

```typescript
{ id: 'Untiered', label: 'Untiered', desc: 'ยังไม่จัด tier — ข้อมูลพื้นฐานเท่านั้น', color: '#6b7280' },
```

- [ ] **Step 3: Type-check**

Run: `npx astro check`
Expected: No new type errors. Existing 80 entries still satisfy the interface because optional fields can be present.

- [ ] **Step 4: Commit**

```bash
git add src/data/meta.ts
git commit -m "refactor(meta): make curation fields optional; add Untiered tier"
```

---

### Task 4: Audit pokemon/[slug].astro for null-safe access on now-optional fields

The template currently assumes `pokemon.description`, `pokemon.role`, etc. are present. With new optional fields, the template must render gracefully when they're undefined.

**Files:**
- Verify (and Modify if needed): `src/pages/pokemon/[slug].astro`

- [ ] **Step 1: Read the template end-to-end**

Run: `wc -l src/pages/pokemon/\[slug\].astro && cat src/pages/pokemon/\[slug\].astro`
Note every direct access to: `description`, `role`, `roleTh`, `strengths`, `weaknesses`, `commonItems`, `commonMoves`, `sets`, `counters`, `teammates`, `usagePercent`, `winRate`.

- [ ] **Step 2: Add a temporary stub mon and try to build**

Append a minimal entry to `META_POKEMON` in `src/data/meta.ts`:

```typescript
{
  id: 1,
  slug: '__stub__',
  nameEn: 'Bulbasaur (stub)',
  types: ['grass', 'poison'],
  baseStats: { hp: 45, atk: 49, def: 49, spa: 65, spd: 65, spe: 45 },
  abilities: ['Overgrow'],
  tier: 'Untiered',
},
```

Run: `npm run build 2>&1 | tail -40`
Expected: Either succeeds (template already null-safe) or fails with a clear error pointing to which line accesses undefined.

- [ ] **Step 3: Patch the template for any failures found**

For each error encountered, guard the section with a conditional. Pattern:

```astro
{pokemon.description && (
  <section class="...">
    <p>{pokemon.description}</p>
  </section>
)}
```

```astro
{pokemon.sets && pokemon.sets.length > 0 && (
  <section>...</section>
)}
```

For required-feeling fields like `role` that appear inline near the header, render a fallback:

```astro
<p class="text-champ-muted">{pokemon.role ?? 'ข้อมูล competitive ยังไม่ครบ'}</p>
```

Repeat until build passes.

- [ ] **Step 4: Remove the stub entry, build again**

Remove the `__stub__` entry. Run: `npm run build`
Expected: Build succeeds, 80 pages emitted (same as before this task).

- [ ] **Step 5: Commit**

```bash
git add src/pages/pokemon/\[slug\].astro
git commit -m "fix(pokemon-detail): render gracefully when curation fields are absent"
```

---

## Phase C — Fetch & data integration

### Task 5: Extend fetch-data.mjs to use the variant ID map

**Files:**
- Modify: `scripts/fetch-data.mjs`

Current `fetch-data.mjs` (~172 lines) iterates a hardcoded list of slug/ID pairs. New version reads `roster.json` + `variant-id-map.json` and iterates the union.

- [ ] **Step 1: Read current fetch-data.mjs**

Run: `cat scripts/fetch-data.mjs`
Identify the slug/ID source array (likely a `META_LIST` const near the top) and the loop that consumes it.

- [ ] **Step 2: Replace the hardcoded list with map-driven iteration**

Replace the slug/ID source with:

```javascript
import { readFile } from 'node:fs/promises';
const ROSTER = JSON.parse(await readFile(resolve(ROOT, 'src/data/roster.json'), 'utf-8'));
const VARIANT_MAP = JSON.parse(await readFile(resolve(ROOT, 'src/data/variant-id-map.json'), 'utf-8'));
const META_LIST = ROSTER.slugs.map((slug) => ({ slug, id: VARIANT_MAP.map[slug]?.id, apiSlug: VARIANT_MAP.map[slug]?.apiSlug ?? slug }));
const missing = META_LIST.filter((m) => !m.id);
if (missing.length) throw new Error(`Missing PokéAPI ID for: ${missing.map((m) => m.slug).join(', ')}`);
```

Replace any `fetchJSON(\`${API}/pokemon/${slug}\`)` with `fetchJSON(\`${API}/pokemon/${apiSlug}\`)` so the API call uses the correct slug.

- [ ] **Step 3: Run fetch (smoke test, limit to first 5)**

Add a temporary `META_LIST.slice(0, 5)` to limit. Run: `npm run fetch`
Expected: Completes without errors. `src/data/generated/learnsets.json` contains the 5 mons.

- [ ] **Step 4: Run full fetch**

Remove the `.slice(0, 5)`. Run: `npm run fetch`
Expected: Takes 5–20 minutes; completes; `learnsets.json` grows substantially.

- [ ] **Step 5: Validate output**

Run: `node -e "const d = require('./src/data/generated/learnsets.json'); const keys = Object.keys(d); console.log('mons:', keys.length, 'sample:', keys.slice(0, 5));"`
Expected: ~266 entries.

- [ ] **Step 6: Commit**

```bash
git add scripts/fetch-data.mjs src/data/generated/learnsets.json
git commit -m "feat(roster): fetch PokéAPI data for full 266-mon roster"
```

---

### Task 6: Generate META_POKEMON entries for 186 new mons

For each new mon (those in `roster.json` but not in current `META_POKEMON`), emit a minimal entry with: `id`, `slug`, `nameEn`, `types`, `baseStats`, `abilities`, `hiddenAbility`, `tier: 'Untiered'`.

**Files:**
- Create: `scripts/generate-meta-entries.mjs` (one-shot script; can delete after)
- Modify: `src/data/meta.ts` (append generated block)

- [ ] **Step 1: Write the generator**

```javascript
// scripts/generate-meta-entries.mjs
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
console.log(`Generating ${need.length} new entries`);

function statName(s) {
  return ({ 'hp': 'hp', 'attack': 'atk', 'defense': 'def', 'special-attack': 'spa', 'special-defense': 'spd', 'speed': 'spe' })[s];
}

function typeId(t) {
  // PokéAPI type names match our TypeId set already (lowercase)
  return t;
}

const entries = [];
for (const slug of need) {
  const { apiSlug } = variantMap.map[slug];
  const data = await fetch(`${API}/pokemon/${apiSlug}`).then((r) => r.json());
  const stats = Object.fromEntries(data.stats.map((s) => [statName(s.stat.name), s.base_stat]));
  const types = data.types.map((t) => typeId(t.type.name));
  const abilities = data.abilities.filter((a) => !a.is_hidden).map((a) => titleCase(a.ability.name));
  const hidden = data.abilities.find((a) => a.is_hidden);
  const nameEn = toDisplayName(data.name);
  entries.push({
    id: data.id, slug, nameEn,
    types, baseStats: stats,
    abilities,
    hiddenAbility: hidden ? titleCase(hidden.ability.name) : undefined,
    tier: 'Untiered',
  });
  await new Promise((r) => setTimeout(r, 50));
}

function titleCase(s) { return s[0].toUpperCase() + s.slice(1); }

// Convert PokéAPI canonical slug (e.g. 'charizard-mega-y', 'arcanine-hisui',
// 'tauros-paldea-aqua-breed') into the display name convention this repo uses
// (e.g. 'Mega Charizard Y', 'Hisuian Arcanine', 'Tauros - Paldea Aqua Breed').
// Pattern: detect known suffixes/prefixes and reorder. Fall back to title-cased
// space-joined parts.
function toDisplayName(apiSlug) {
  const parts = apiSlug.split('-');
  // Mega forms: 'aggron-mega' → 'Mega Aggron'; 'charizard-mega-x' → 'Mega Charizard X'
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

// Emit as TS source block for manual append to meta.ts
const tsBlock = entries.map((e) => {
  const lines = [`  {`,
    `    id: ${e.id},`,
    `    slug: '${e.slug}',`,
    `    nameEn: '${e.nameEn}',`,
    `    types: [${e.types.map((t) => `'${t}'`).join(', ')}],`,
    `    baseStats: { hp: ${e.baseStats.hp}, atk: ${e.baseStats.atk}, def: ${e.baseStats.def}, spa: ${e.baseStats.spa}, spd: ${e.baseStats.spd}, spe: ${e.baseStats.spe} },`,
    `    abilities: [${e.abilities.map((a) => `'${a}'`).join(', ')}],`,
    e.hiddenAbility ? `    hiddenAbility: '${e.hiddenAbility}',` : null,
    `    tier: 'Untiered',`,
    `  },`].filter(Boolean);
  return lines.join('\n');
}).join('\n');

await writeFile(resolve(ROOT, '.meta-entries-generated.ts'), tsBlock);
console.log(`Wrote .meta-entries-generated.ts (${entries.length} entries)`);
```

- [ ] **Step 2: Run generator**

Run: `node scripts/generate-meta-entries.mjs`
Expected: `Wrote .meta-entries-generated.ts (~186 entries)`.

- [ ] **Step 3: Append to meta.ts**

Open `src/data/meta.ts`, find the closing `];` of `META_POKEMON`. Just before it, paste the contents of `.meta-entries-generated.ts`. Delete `.meta-entries-generated.ts`.

- [ ] **Step 4: Type-check + build**

Run: `npx astro check && npm run build 2>&1 | tail -30`
Expected: Type-check passes. Build emits ~266 pages.

If type errors surface (e.g., unknown ability names in `abilities.ts` are not flagged because abilities.ts is a separate list — that's fine for now), they will be addressed in Phase D.

- [ ] **Step 5: Commit**

```bash
git add src/data/meta.ts
git commit -m "feat(roster): add 186 new META_POKEMON entries (Untiered, stats from PokéAPI)"
```

---

### Task 7: Extend pokemon-index.ts with new entries

The 186 new mons must also appear in `pokemon-index.ts` so cross-references (chips, links) resolve.

**Files:**
- Modify: `src/data/pokemon-index.ts`

- [ ] **Step 1: Write entries from META_POKEMON additions**

For each new META_POKEMON entry from Task 6, ensure a corresponding `pokemon-index.ts` entry exists with `hasDetailPage: true`.

Pattern:

```typescript
'Aegislash': { id: 681, slug: 'aegislash', nameEn: 'Aegislash', hasDetailPage: true },
```

The display key matches `nameEn`. Use the display name format pokebase uses (e.g., `'Mega Charizard X'` not `'Charizard-Mega-X'`).

A small helper script:

```javascript
// scripts/sync-pokemon-index.mjs (one-shot, can delete after)
import { readFile, writeFile } from 'node:fs/promises';
const meta = await readFile('src/data/meta.ts', 'utf-8');
const idx = await readFile('src/data/pokemon-index.ts', 'utf-8');
const existingKeys = new Set([...idx.matchAll(/'([^']+)':\s*\{/g)].map((m) => m[1].toLowerCase()));

// Parse new entries from meta — find { id:, slug:, nameEn: } tuples
const re = /\{\s*id:\s*(\d+),\s*slug:\s*'([^']+)',\s*nameEn:\s*'([^']+)'/g;
const additions = [];
for (const m of meta.matchAll(re)) {
  const [, id, slug, nameEn] = m;
  if (!existingKeys.has(nameEn.toLowerCase())) {
    additions.push(`  '${nameEn}': { id: ${id}, slug: '${slug}', nameEn: '${nameEn}', hasDetailPage: true },`);
  }
}
console.log(`${additions.length} new pokemon-index entries to add:`);
console.log(additions.join('\n'));
await writeFile('.pokemon-index-additions.txt', additions.join('\n'));
```

Run: `node scripts/sync-pokemon-index.mjs`
Then paste contents of `.pokemon-index-additions.txt` into `pokemon-index.ts` before the closing `};` of `pokemonIndex`.

- [ ] **Step 2: Type-check**

Run: `npx astro check`
Expected: Passes.

- [ ] **Step 3: Commit**

```bash
git add src/data/pokemon-index.ts
rm -f scripts/sync-pokemon-index.mjs .pokemon-index-additions.txt
git commit -m "feat(roster): extend pokemon-index with 186 new entries"
```

---

## Phase D — Translation: Pokémon names

### Task 8: Translate all 266 Pokémon names to Thai

Per the translation feedback (`feedback-translation-qc`), each translation batch goes: draft → community research → adjust → flag uncertainty → commit.

**Files:**
- Modify: `src/data/meta.ts` (add `nameTh` to all entries)
- Modify: `src/data/pokemon-index.ts` (add `nameTh` field; update interface)

- [ ] **Step 1: Update PokemonRef interface to include nameTh**

In `src/data/pokemon-index.ts`, change the interface:

```typescript
export interface PokemonRef {
  id: number;
  slug: string;
  nameEn: string;
  nameTh?: string;
  hasDetailPage?: boolean;
}
```

- [ ] **Step 2: Draft Thai names for all 266**

Generate the full draft list. For each:
- Use Thai PokémonTH community conventions (transliteration style: Katakana-to-Thai phonetic, e.g. ガブリアス → การ์ชอม).
- Mega/regional prefix: "เมก้า" for Mega, "อโลล่า"/"กาลาร์"/"ฮิซุย"/"ปาลเด" for regional.
- For each name, run a `WebFetch` against the relevant Thai Pokémon source (PokémonTH wiki, Thai Wikipedia article for that Pokémon) to verify community-standard spelling.

Process in chunks of 30 mons. For each chunk:
  1. Generate draft
  2. Research each entry against community sources
  3. Group "confident" / "uncertain" entries
  4. Present uncertain entries to the user for confirmation
  5. Apply final list to both `meta.ts` and `pokemon-index.ts`

- [ ] **Step 3: Apply translations**

Edit each `META_POKEMON` entry and each `pokemonIndex` value to add `nameTh: '...'`.

For efficient editing, write a small script that takes a `{ slug: nameTh }` JSON object and patches both files. Don't hand-edit 266 entries.

```javascript
// scripts/apply-pokemon-names.mjs (one-shot)
import { readFile, writeFile } from 'node:fs/promises';
const translations = JSON.parse(await readFile('pokemon-names-th.json', 'utf-8'));

let meta = await readFile('src/data/meta.ts', 'utf-8');
let idx = await readFile('src/data/pokemon-index.ts', 'utf-8');

function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

for (const [slug, nameTh] of Object.entries(translations)) {
  const slugRe = escapeRe(slug);

  // meta.ts: each entry is an object literal starting with `id: N, slug: 'X', nameEn: '...'`
  // Replace any existing nameTh first; if not present, insert after nameEn.
  // Match the entry block from `slug: 'X'` to the first `types:` field.
  const metaBlockRe = new RegExp(`(slug:\\s*'${slugRe}',\\s*nameEn:\\s*'[^']+',)\\s*(nameTh:\\s*'[^']*',\\s*)?`);
  meta = meta.replace(metaBlockRe, `$1\n    nameTh: '${nameTh}',\n    `);

  // pokemon-index.ts: single-line entries like `'Name': { id: N, slug: 'X', nameEn: 'Y', hasDetailPage: true },`
  const idxBlockRe = new RegExp(`(slug:\\s*'${slugRe}',\\s*nameEn:\\s*'[^']+',)\\s*(nameTh:\\s*'[^']*',\\s*)?`);
  idx = idx.replace(idxBlockRe, `$1 nameTh: '${nameTh}', `);
}

await writeFile('src/data/meta.ts', meta);
await writeFile('src/data/pokemon-index.ts', idx);
console.log(`Applied ${Object.keys(translations).length} translations to meta.ts and pokemon-index.ts`);
```

**Before running on all 266**, test against a single entry first:

```bash
echo '{"garchomp":"การ์ชอม"}' > pokemon-names-th-test.json
# temporarily change script to read pokemon-names-th-test.json, then:
node scripts/apply-pokemon-names.mjs
git diff src/data/meta.ts src/data/pokemon-index.ts | head -30
```

Confirm the patch looks correct (single `nameTh` line inserted, no duplication, surrounding code intact). Revert with `git checkout -- src/data/meta.ts src/data/pokemon-index.ts`, fix script if needed, then run on the full file.

- [ ] **Step 4: Type-check + build**

Run: `npx astro check && npm run build 2>&1 | tail -20`
Expected: Passes.

- [ ] **Step 5: Commit**

```bash
git add src/data/meta.ts src/data/pokemon-index.ts pokemon-names-th.json
git commit -m "feat(roster): add Thai names for all 266 Pokémon"
```

---

## Phase E — Translation: Abilities

### Task 9: Identify abilities used by new mons but missing in abilities.ts

**Files:**
- Create: `scripts/find-missing-abilities.mjs` (one-shot)

- [ ] **Step 1: Write detector**

```javascript
// scripts/find-missing-abilities.mjs
import { readFile, writeFile } from 'node:fs/promises';
const meta = await readFile('src/data/meta.ts', 'utf-8');
const abilities = await readFile('src/data/abilities.ts', 'utf-8');

// Collect all ability names referenced in meta.ts (abilities + hiddenAbility fields)
const refRe = /(?:abilities|hiddenAbility):\s*(\[[^\]]*\]|'[^']+')/g;
const referenced = new Set();
for (const m of meta.matchAll(refRe)) {
  if (m[1].startsWith('[')) {
    for (const a of m[1].matchAll(/'([^']+)'/g)) referenced.add(a[1]);
  } else referenced.add(m[1].slice(1, -1));
}

// Collect existing ability slugs/names
const existing = new Set([...abilities.matchAll(/nameEn:\s*'([^']+)'/g)].map((m) => m[1]));

const missing = [...referenced].filter((a) => !existing.has(a)).sort();
console.log(`Missing abilities (${missing.length}):`);
console.log(missing.join('\n'));
await writeFile('.missing-abilities.json', JSON.stringify(missing, null, 2));
```

- [ ] **Step 2: Run detector**

Run: `node scripts/find-missing-abilities.mjs`
Expected: List of ~80–150 missing ability names (e.g., `Overgrow`, `Solar Power`, `Beast Boost`).

- [ ] **Step 3: Commit detector for traceability**

```bash
git add scripts/find-missing-abilities.mjs .missing-abilities.json
git commit -m "chore(roster): identify abilities missing from abilities.ts"
```

---

### Task 10: Translate and add missing abilities

**Files:**
- Modify: `src/data/abilities.ts`

For each missing ability:
- Fetch PokéAPI description for the English text reference
- Draft Thai name (transliteration) + Thai description
- Research community standard via WebFetch (Thai Pokémon wiki, fansub conventions)
- Categorize (`offense | defense | weather | terrain | utility | speed`)
- List 2–4 notable users from the new roster

- [ ] **Step 1: Generate ability draft script**

```javascript
// scripts/draft-missing-abilities.mjs
import { readFile, writeFile } from 'node:fs/promises';
const missing = JSON.parse(await readFile('.missing-abilities.json', 'utf-8'));
const API = 'https://pokeapi.co/api/v2/ability';

const out = [];
for (const name of missing) {
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const r = await fetch(`${API}/${slug}`);
  if (!r.ok) { console.warn(`skip ${name} (${slug}): ${r.status}`); continue; }
  const d = await r.json();
  const effect = d.effect_entries.find((e) => e.language.name === 'en')?.short_effect ?? '';
  out.push({ slug, nameEn: name, effect });
  await new Promise((r) => setTimeout(r, 50));
}
await writeFile('.abilities-draft.json', JSON.stringify(out, null, 2));
console.log(`Drafted ${out.length} abilities`);
```

Run: `node scripts/draft-missing-abilities.mjs`
Expected: `.abilities-draft.json` containing English effect text for each.

- [ ] **Step 2: Translate to Thai (with community research)**

For each ability in `.abilities-draft.json`:
- Draft `nameTh` (Thai transliteration; e.g., `Overgrow` → `โอเวอร์โกรว์` or `แต่งใหญ่`)
- Draft `description` in Thai using the English `effect` as basis
- Cross-reference against Thai Pokémon community sources (WebFetch one or two known fansub/wiki pages per uncommon term)
- Pick `category` from the enum
- Assign `notableUsers` from new roster

Process in batches of 25–30. For each batch:
  1. Draft
  2. Community-research uncertain transliterations
  3. Group confident vs flagged
  4. Present flagged to user
  5. Append finalized batch to `abilities.ts`

- [ ] **Step 3: Append entries to abilities.ts**

For each batch, edit `src/data/abilities.ts` to insert new entries before the closing `];`. Group by category (the file already uses category comment-headers).

- [ ] **Step 4: Type-check + build**

Run: `npx astro check && npm run build 2>&1 | tail -20`
Expected: Passes.

- [ ] **Step 5: Commit (one commit per batch)**

```bash
git add src/data/abilities.ts
git commit -m "feat(abilities): add and translate batch N (~30 abilities)"
```

Repeat for all batches. After the final batch:

```bash
git add .missing-abilities.json .abilities-draft.json
git rm scripts/find-missing-abilities.mjs scripts/draft-missing-abilities.mjs
git commit -m "chore(abilities): remove one-shot ability scripts after full coverage"
```

---

## Phase F — Translation: Moves

### Task 11: Identify moves used by new learnsets but missing in moves.ts

**Files:**
- Create: `scripts/find-missing-moves.mjs` (one-shot)

- [ ] **Step 1: Write detector**

```javascript
// scripts/find-missing-moves.mjs
import { readFile, writeFile } from 'node:fs/promises';
const learnsets = JSON.parse(await readFile('src/data/generated/learnsets.json', 'utf-8'));
const moves = await readFile('src/data/moves.ts', 'utf-8');

const referenced = new Set();
for (const mon of Object.values(learnsets)) {
  for (const moveSlug of Object.keys(mon.moves ?? {})) referenced.add(moveSlug);
}

const existing = new Set([...moves.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]));
const missing = [...referenced].filter((m) => !existing.has(m)).sort();
console.log(`Missing moves: ${missing.length}`);
await writeFile('.missing-moves.json', JSON.stringify(missing, null, 2));
```

Before running, inspect actual shape of `learnsets.json`:
```bash
node -e "const d = require('./src/data/generated/learnsets.json'); const k = Object.keys(d)[0]; console.log('keys:', Object.keys(d[k]).slice(0, 5)); console.log('sample:', JSON.stringify(d[k]).slice(0, 200));"
```
Then adjust the per-mon access pattern. If learnset is `mon.moves`, use `mon.moves`. If it's `mon.learnset` or a top-level move list keyed by slug, adjust accordingly.

- [ ] **Step 2: Run detector**

Run: `node scripts/find-missing-moves.mjs`
Expected: ~200–400 missing move slugs.

- [ ] **Step 3: Commit detector output**

```bash
git add scripts/find-missing-moves.mjs .missing-moves.json
git commit -m "chore(roster): identify moves missing from moves.ts"
```

---

### Task 12: Translate and add missing moves (batched)

**Files:**
- Modify: `src/data/moves.ts`

Since moves are ~300+ entries, split into 4 batches of ~80 each, by category:
- Batch 1: Physical attacks
- Batch 2: Special attacks
- Batch 3: Status moves
- Batch 4: Remainder + niche

For each move:
- Fetch PokéAPI for `type`, `damage_class`, `power`, `accuracy`, `pp`, `priority`, English effect text
- Draft `nameTh` (transliteration, e.g., `Hyper Beam` → `ไฮเปอร์บีม`)
- Draft `description` in Thai
- Research community-standard name via WebFetch when uncertain
- Pick `category` from the enum (`attack | setup | recovery | status | hazard | pivot | priority | screen`)

- [ ] **Step 1: Generate move draft script**

```javascript
// scripts/draft-missing-moves.mjs
import { readFile, writeFile } from 'node:fs/promises';
const missing = JSON.parse(await readFile('.missing-moves.json', 'utf-8'));
const API = 'https://pokeapi.co/api/v2/move';

const out = [];
for (const slug of missing) {
  const r = await fetch(`${API}/${slug}`);
  if (!r.ok) { console.warn(`skip ${slug}: ${r.status}`); continue; }
  const d = await r.json();
  const effect = d.effect_entries.find((e) => e.language.name === 'en')?.short_effect ?? '';
  out.push({
    slug,
    nameEn: d.names.find((n) => n.language.name === 'en')?.name ?? slug,
    type: d.type.name,
    damageClass: d.damage_class.name,
    power: d.power, accuracy: d.accuracy, pp: d.pp, priority: d.priority,
    effect,
  });
  await new Promise((r) => setTimeout(r, 50));
}
await writeFile('.moves-draft.json', JSON.stringify(out, null, 2));
console.log(`Drafted ${out.length} moves`);
```

Run: `node scripts/draft-missing-moves.mjs`
Expected: `.moves-draft.json` populated.

- [ ] **Step 2: Translate batch 1 (physical attacks)**

Filter `.moves-draft.json` for `damageClass === 'physical'`. For each:
1. Draft nameTh + description in Thai
2. Cross-reference community standard (WebFetch on uncertain entries)
3. Pick category
4. Group confident vs flagged
5. Present flagged to user

Append to `src/data/moves.ts` under the existing `// ============== ATTACKS - PHYSICAL ==============` header.

Run: `npx astro check && npm run build 2>&1 | tail -20` → expected pass.
Commit:

```bash
git add src/data/moves.ts
git commit -m "feat(moves): add and translate physical attack moves"
```

- [ ] **Step 3: Translate batch 2 (special attacks)**

Same process, `damageClass === 'special'`. Append under `// ATTACKS - SPECIAL` (create header if absent).
Run build, commit:

```bash
git commit -m "feat(moves): add and translate special attack moves"
```

- [ ] **Step 4: Translate batch 3 (status moves)**

Same process, `damageClass === 'status'`. Append under `// STATUS / UTILITY` header.

```bash
git commit -m "feat(moves): add and translate status moves"
```

- [ ] **Step 5: Translate batch 4 (remainder)**

Anything skipped or weird-shaped from earlier batches.

```bash
git commit -m "feat(moves): add and translate remaining moves"
```

- [ ] **Step 6: Cleanup**

```bash
git rm scripts/find-missing-moves.mjs scripts/draft-missing-moves.mjs
git add .missing-moves.json .moves-draft.json
git commit -m "chore(moves): remove one-shot scripts after full coverage"
```

---

## Phase G — Translation: Items

### Task 13: Add Mega Stones + missing referenced items

For every new Mega-form in the roster (e.g., `aggron-mega`, `delphox-mega`), the corresponding Mega Stone must exist in `items.ts` (e.g., `aggronite`, `delphoxite`).

**Files:**
- Modify: `src/data/items.ts`

- [ ] **Step 1: List missing Mega Stones**

Identify every `*-mega` (or `*-mega-x`/`*-mega-y`) slug in `roster.json`. Compute the Mega Stone slug (e.g., `garchomp` → `garchompite`; check pokebase items page for canonical spelling) and check `items.ts` for presence.

Run: `node scripts/find-missing-items.mjs` (write a small detector similar to Task 9).

Expected: list of Mega Stones needed.

- [ ] **Step 2: Fetch + translate Mega Stones**

For each missing Mega Stone:
- Fetch PokéAPI `/item/{slug}` for English description
- Draft Thai name (transliteration; e.g., `aggronite` → `อักโกรไนต์`)
- Draft Thai description (template: "ไอเทมสำหรับ Mega Evolution ของ <Pokémon ที่ตรงกัน>")
- Category: `'mega'`
- Notable users: the Mega form(s) that use it

- [ ] **Step 3: Add to items.ts**

Append entries under a `// ============== MEGA STONES ==============` header in `src/data/items.ts`.

- [ ] **Step 4: Audit other item references**

Search for any `commonItems: [...]` or `sets[].item: '...'` reference in `meta.ts` that points to an item missing from `items.ts`. (This may yield zero results for new mons since they lack `sets`.) Add any missing ones with Thai translation.

- [ ] **Step 5: Type-check + build**

Run: `npx astro check && npm run build 2>&1 | tail -20`
Expected: Passes.

- [ ] **Step 6: Commit**

```bash
git add src/data/items.ts
git commit -m "feat(items): add Mega Stones for full roster + Thai translation"
```

---

## Phase H — Tier curation & UI

### Task 14: Curate tier for 186 new mons (S/A/B/C/Restricted/Untiered)

Per the spec, tiers are curated by Claude based on competitive meta knowledge, cross-checked against external sources, defaulting uncertain entries to `Untiered`.

**Files:**
- Modify: `src/data/meta.ts` (change `tier` field on relevant entries)

- [ ] **Step 1: Draft tier list for 186 new entries**

Group new mons into tiers using:
- Knowledge of VGC Reg M-A meta + Pokémon Champions specifics
- pokebase "Popular Pokemon" surface (top of homepage = candidate S/A)
- Smogon-equivalent doubles tier lists

Output as JSON: `{ slug: tier }` for each of the 186 mons.

- [ ] **Step 2: Spot-check sample against pokebase**

Pick 20 random mons from the draft. For each, fetch `https://pokebase.app/pokemon-champions/pokemon/<slug>` (with browser UA) and inspect the "Champions Showcase" usage indicators. Adjust draft tier where pokebase signal contradicts.

- [ ] **Step 3: Present draft to user**

Surface the full tier draft (organized by tier) to the user for spot-check approval before committing.

- [ ] **Step 4: Apply tiers via patch script**

```javascript
// scripts/apply-tiers.mjs (one-shot)
import { readFile, writeFile } from 'node:fs/promises';
const tiers = JSON.parse(await readFile('tier-draft.json', 'utf-8'));
let meta = await readFile('src/data/meta.ts', 'utf-8');
for (const [slug, tier] of Object.entries(tiers)) {
  const re = new RegExp(`(slug:\\s*'${slug}',[\\s\\S]*?tier:\\s*)'[^']+'`);
  meta = meta.replace(re, `$1'${tier}'`);
}
await writeFile('src/data/meta.ts', meta);
```

Run: `node scripts/apply-tiers.mjs`

- [ ] **Step 5: Type-check + build**

Run: `npx astro check && npm run build 2>&1 | tail -20`
Expected: Passes.

- [ ] **Step 6: Commit**

```bash
git add src/data/meta.ts tier-draft.json
git rm scripts/apply-tiers.mjs
git commit -m "feat(roster): curate tiers for 186 new mons (with pokebase cross-check)"
```

---

### Task 15: Update Pokedex listing page

**Files:**
- Modify: `src/pages/pokedex.astro`

- [ ] **Step 1: Update header copy**

In `src/pages/pokedex.astro`, find the header description that says `80` mons (looks like): `รวบรวม {META_POKEMON.length} โปเกมอน meta...`. Since this uses a dynamic length, no change to that line — but the sub-line about "Roster เต็มของเกม ~269 ตัว" should be updated to reflect coverage now equals roster.

Change:
```astro
<span class="block mt-1 text-xs">
  Roster เต็มของเกม ~269 ตัว (210 base + 59 Megas) — เรานำเสนอเฉพาะที่ใช้แข่งหรือเป็นที่นิยม
</span>
```
to:
```astro
<span class="block mt-1 text-xs">
  Roster เต็มของ Pokémon Champions ~266 ตัว — ครอบคลุมทั้ง Mega Evolution, regional forms, และตัวเสริมทุกตัว
</span>
```

Also update the `<BaseLayout title>` from `"80 ตัว meta พร้อม sets, counters"` to `"266 ตัว roster พร้อม Thai translation"`.

- [ ] **Step 2: Verify Untiered chip appears**

`TIERS_LIST` (modified in Task 3) now includes `Untiered`. The `.map()` over `TIERS_LIST` in pokedex.astro will automatically emit a chip. No code change needed unless the filter logic explicitly excludes unknown tiers.

Run: `grep -n "tier-filter" src/pages/pokedex.astro` and inspect filter logic to confirm.

- [ ] **Step 3: Build + visual spot-check**

```bash
npm run build && npm run preview
```
Open `http://localhost:4321/pokedex` in a browser. Verify:
- "Untiered" chip appears in tier filter row
- Filter shows ~186 cards when Untiered selected
- Filter shows ~80 cards when "ทั้งหมด" selected then S+A+B+C+Restricted toggled
- Search box finds both old and new mons

- [ ] **Step 4: Commit**

```bash
git add src/pages/pokedex.astro
git commit -m "feat(pokedex): update copy + Untiered chip for 266-mon roster"
```

---

## Phase I — Final verification & merge

### Task 16: Smoke test 10–15 new detail pages

- [ ] **Step 1: Build**

Run: `npm run build`
Expected: Succeeds. Output mentions ~266 pages.

- [ ] **Step 2: Spot-check rendering**

Run: `npm run preview` (starts on port 4321).

Open these 15 URLs in a browser. For each, verify the page renders with: name (EN + TH), types, stats block, abilities (with Thai names + descriptions), type effectiveness, learnset table.

Picks (mix of well-known and obscure new mons):

```
/pokemon/aegislash
/pokemon/garchomp                    # existing — regression check
/pokemon/gholdengo
/pokemon/iron-hands
/pokemon/flutter-mane
/pokemon/great-tusk
/pokemon/walking-wake
/pokemon/urshifu-single-strike
/pokemon/urshifu-rapid-strike
/pokemon/zoroark-hisui
/pokemon/calyrex
/pokemon/koraidon
/pokemon/regieleki
/pokemon/cinderace
/pokemon/dragapult                   # existing — regression check
```

(Adjust list to slugs that actually exist in `roster.json`.)

For each: open page, scroll, confirm no broken sections, no obvious untranslated English in places that should be Thai.

- [ ] **Step 3: Spot-check old detail pages for regression**

Open 5 existing-curated mons (Basculegion, Garchomp, Tyranitar, Whimsicott, Sneasler). Confirm `sets`, `counters`, `teammates` sections still render — Task 4's null-safe edits should not affect filled-in fields.

- [ ] **Step 4: Build artifact size check**

Run: `du -sh dist/ && find dist -name '*.html' | wc -l`
Expected: ~266 HTML files. Total `dist/` size noticeably larger than before (3–5×).

- [ ] **Step 5: No commit needed for verification — just document**

If any failure surfaces, file a fix task; loop back to the relevant phase.

---

### Task 17: Merge to main and deploy

- [ ] **Step 1: Final review of branch**

Run: `git log --oneline main..HEAD` and read each commit message. Confirm the story makes sense.

- [ ] **Step 2: Switch to main, merge**

```bash
git checkout main
git merge --no-ff <branch-name>
```

- [ ] **Step 3: Push**

```bash
git push origin main
```

CI/CD pipeline (per project history — auto-deploys on main push) runs.

- [ ] **Step 4: Monitor deploy**

Verify production reflects 266 mons.

---

## Out of scope reminder

This plan implements **system 1 only**. Do NOT add to this plan:
- Raw/Lv50 stat display (system 2)
- 66 Stat Points UI (system 2)
- Usage stats per Pokémon (system 3)
- Regulation Set filter (system 3)
- Team builder (system 4)
- Damage calculator (system 5)
- Speed tier page (system 6)
- Tournaments / team lists (system 7)
- Additional translation polish beyond initial QC (system 8)

Each gets its own brainstorming + spec + plan cycle after system 1 ships.
