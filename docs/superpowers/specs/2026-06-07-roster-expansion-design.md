# Roster Expansion: 80 → 266 Pokémon

**Status:** Approved
**Date:** 2026-06-07
**System:** 1 of 8 (Pokémon Champions parity roadmap, per pokebase.app reference)

## Context

Project currently ships 80 hand-curated Pokémon detail pages for Pokémon Champions Reg M-A. Reference site **pokebase.app/pokemon-champions** covers the full Champions roster (~266 entries, counting each Mega/regional/special form as a separate entry). To reach feature parity with pokebase, the roster must be expanded first — every later system (Stat Points UI, usage stats, team builder, damage calc, speed tier page, tournaments) depends on the full roster existing.

This spec covers **system 1 only**: getting all 266 Pokémon into the site at the same content depth as the existing 80. Systems 2–8 are explicitly out of scope and will be brainstormed/specced separately after this ships.

## Goals

- All 266 Pokémon Champions roster entries have a detail page reachable via the existing route scheme `/pokemon/<slug>` (no route migration as part of this system — see Open verification items).
- Each new detail page renders the same data sections as existing pages: header, stats, abilities, type effectiveness, full learnset table.
- `/pokedex` listing shows all 266 entries with the existing search and filter UX working.
- Thai translation coverage is complete for: Pokémon names (all 266), ability names + descriptions, move names + descriptions, item names + descriptions.
- No regression for the existing 80 Pokémon.

## Non-goals (covered in future systems)

| System | Out-of-scope item |
|---|---|
| 2 | Raw vs Lv50 stat display, 66 Stat Points (EV) input UI |
| 3 | Usage stats per Pokémon (popular items/abilities/moves/natures/stat-spreads) |
| 3 | Regulation Set filter on moves page |
| 4 | Team builder |
| 5 | Damage calculator |
| 6 | Speed tier page |
| 7 | Tournaments / team lists |
| 8 | Additional bulk translation polish passes |

Detail pages for new 186 mons will **not** show "Champions Showcase" / Stat Points / usage stat sections. They will look like current 80-mon pages.

## Approach

### Data source

- **PokéAPI** (`https://pokeapi.co/api/v2`) is the data source for stats, types, abilities, learnsets — same as existing `scripts/fetch-data.mjs`.
- **Pokebase speed-tier page** is scraped **once** to extract the canonical list of 266 Pokémon Champions slugs. Result is checked into the repo as static JSON; the scraper is one-shot bootstrap, not part of build.
- A slug-mapping adapter handles the gap between pokebase slug conventions (e.g., `charizard-mega-y`) and PokéAPI IDs (e.g., `10035`).

### Files to change/add

```
scripts/
  scrape-pokebase-roster.mjs   NEW — bootstrap: scrape pokebase speed-tier
                               page, emit canonical 266-slug list as JSON
  fetch-data.mjs               EXTEND — accept full 266-slug list, handle
                               variant ID mapping for Mega/regional forms

src/data/
  pokemon-index.ts             EXTEND — add 186 new entries; add nameTh to
                               all 266 entries
  abilities.ts                 EXTEND — add ~80–150 missing abilities with
                               Thai translation
  moves.ts                     EXTEND — add ~200–400 missing moves with Thai
                               translation
  items.ts                     EXTEND — add Mega Stones required by the
                               new Mega forms (each Mega Pokémon's
                               corresponding stone), and any item the
                               existing/new detail pages link to but does
                               not yet exist. Competitive item expansion
                               beyond this is deferred to system 3 (usage
                               stats), which will surface popular items
                               per Pokémon.
  meta.ts                      EXTEND — add META_POKEMON entries for new
                               186 mons with tier classification
  translations.ts              MAYBE — add UI strings if new tier label
                               ("Untiered") or other terms needed
  generated/learnsets.json     REGENERATE — covers all 266

src/pages/
  pokedex.astro                EDIT — update header copy (266 not 80),
                               handle "Untiered" tier filter
  pokemon/[slug].astro         VERIFY — should work unchanged if template
                               consumes the existing data shape; verify
                               before/after

docs/superpowers/specs/
  2026-06-07-roster-expansion-design.md  THIS FILE
```

### Tier curation

The existing project assigns S / A / B / C / Restricted tiers manually for the 80 curated mons. New 186 mons need tier assignments to keep the pokedex filter useful.

Strategy:
- Curator (Claude) drafts a tier for each new mon based on competitive meta knowledge, cross-referenced against pokebase's "Popular Pokemon" surface and any external community usage signals.
- Uncertain entries default to a new tier label `Untiered`.
- The full tier draft is presented to the user in batches for spot-check approval before commit.

This is a **C+D hybrid** per the brainstorming decision: curate first, then sanity-check against external sources.

### Translation workflow

Per saved feedback (`feedback-translation-qc`), every translation batch follows:

1. **Draft** — LLM bulk-translates a batch using existing hand-translated entries in `abilities.ts` / `moves.ts` as style anchors (transliteration style, terminology, tone).
2. **Research community standard** — for each term, cross-reference Thai Pokémon community sources (PokémonTH fansub conventions, Thai Wikipedia, established fansites) via WebFetch/WebSearch.
3. **Adjust** — modify draft entries that diverge from community-accepted Thai terminology.
4. **Flag uncertainty** — group entries with no clear community standard and surface them for user verification before commit.
5. **Commit by batch** — separate commits for: (a) Pokémon names, (b) abilities, (c) moves [may be 2–3 sub-batches due to volume], (d) items.

Translation is NOT auto-generate-and-commit. No translation batch is committed without (a) the QC research step having happened and (b) user awareness of any flagged-uncertain entries.

### Listing UX

- All 266 entries render on a single `/pokedex` page (no pagination).
- Existing search (EN + TH name) and type filter continue to work — they are JS-side, scale fine to 266 entries.
- Tier filter: existing chips (S/A/B/C/Restricted) remain. Add a chip `Untiered` for new mons that did not receive a tier curation.

### Variant handling

- Every Mega Evolution, regional form, and special form is a **separate card** in the pokedex listing (e.g., `charizard`, `charizard-mega-x`, `charizard-mega-y` are three cards) — matches pokebase convention and matches existing `pokemon-index.ts` structure.
- No grouping/toggling logic needed in the detail page.

### Roll-out

- Work on a dedicated git branch. Main keeps the current 80-mon site live.
- Translation, fetch, and rendering iterate on the branch until all 266 mons render correctly and translation QC is complete.
- Verify: `npm run build` succeeds; spot-check 10–15 random new detail pages in the local preview; confirm no regression on a sample of existing 80 mons.
- Merge to main when QC complete → single production deploy.

## Open verification items

To resolve during implementation, not blocking on this spec:

1. Confirm exact PokéAPI ID for every variant in the 266-mon list (some Mega/regional forms have non-obvious IDs).
2. Confirm `pokemon/[slug].astro` template works without code changes for new data, or identify what needs to change.
3. Resolve any moves/abilities that PokéAPI returns differently than expected (e.g., Z-moves, signature moves).
4. Decide route prefix: keep current `/pokemon/<slug>` or migrate to pokebase-style `/pokemon-champions/pokemon/<slug>`. (Suggested: defer; routing migration is its own concern.)

## Success criteria

- [ ] `/pokedex` lists 266 entries; search + tier + type filters work on all.
- [ ] `npm run build` produces 266 working detail pages.
- [ ] Each new detail page has: type pills, stats block, abilities (with Thai), type effectiveness chart, learnset table (with Thai move names/descriptions).
- [ ] Thai translations committed and reviewed for: 266 Pokémon names, all abilities used by new mons, all moves used by new mons, all items referenced.
- [ ] No regression on existing 80 detail pages.
- [ ] One production deploy after merge.
