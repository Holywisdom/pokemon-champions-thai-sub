/**
 * Lookup helpers — find moves, abilities, items by display name
 * (Used by Pokemon detail page chips to attach descriptions/icons.)
 */

import { moves, type CompetitiveMove } from '@/data/moves';
import { abilities, type CompetitiveAbility } from '@/data/abilities';
import { items, type CompetitiveItem } from '@/data/items';

// Build lookup maps once at module load
const moveByName = new Map<string, CompetitiveMove>();
const moveBySlug = new Map<string, CompetitiveMove>();
moves.forEach((m) => {
  moveByName.set(m.nameEn.toLowerCase(), m);
  moveBySlug.set(m.slug, m);
});

const abilityByName = new Map<string, CompetitiveAbility>();
abilities.forEach((a) => {
  abilityByName.set(a.nameEn.toLowerCase(), a);
});

const itemByName = new Map<string, CompetitiveItem>();
const itemBySlug = new Map<string, CompetitiveItem>();
items.forEach((i) => {
  itemByName.set(i.nameEn.toLowerCase(), i);
  itemBySlug.set(i.slug, i);
});

function normalize(s: string): string {
  return s.toLowerCase().replace(/\s+/g, ' ').trim();
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function findMove(name: string): CompetitiveMove | null {
  const n = normalize(name);
  // Direct name match
  const direct = moveByName.get(n);
  if (direct) return direct;
  // Try without parenthetical (e.g., "Earthquake (Spread)" → "Earthquake")
  const cleaned = name.replace(/\s*\(.*?\)\s*/g, '').trim();
  if (cleaned !== name) {
    const c = moveByName.get(normalize(cleaned));
    if (c) return c;
  }
  // Try slug
  return moveBySlug.get(slugify(name)) ?? null;
}

export function findAbility(name: string): CompetitiveAbility | null {
  const n = normalize(name);
  const direct = abilityByName.get(n);
  if (direct) return direct;
  // Strip "(when Mega)" or "→" parts
  const cleaned = name
    .replace(/→.*$/, '')
    .replace(/\(when\s+mega\)/i, '')
    .replace(/\s*\(.*?\)\s*/g, '')
    .trim();
  if (cleaned !== name) {
    const c = abilityByName.get(normalize(cleaned));
    if (c) return c;
  }
  return null;
}

export function findItem(name: string): CompetitiveItem | null {
  const n = normalize(name);
  const direct = itemByName.get(n);
  if (direct) return direct;
  // Try slug
  return itemBySlug.get(slugify(name)) ?? null;
}

/**
 * Get a stable PokéAPI item slug from a display name.
 * Examples:
 *   "Heavy-Duty Boots" → "heavy-duty-boots"
 *   "Choice Band"     → "choice-band"
 */
export function itemNameToSlug(name: string): string {
  // Strip parentheticals first
  const cleaned = name.replace(/\s*\(.*?\)\s*/g, '').trim();
  return slugify(cleaned);
}
