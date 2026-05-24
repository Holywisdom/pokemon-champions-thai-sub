/**
 * Learnset data loader — wraps the build-time generated PokéAPI dump.
 * Returns rich move info per Pokemon (filtered to recent gens, deduped).
 */

import { findMove } from './lookups';
import { translateType } from '@/data/translations';
import learnsetData from '@/data/generated/learnsets.json';

export type LearnMethod = 'level-up' | 'machine' | 'egg' | 'tutor' | 'form-change' | 'light-ball-egg' | 'colosseum-purification' | 'xd-shadow' | 'xd-purification' | string;

export interface MoveDetail {
  name: string;       // slug, e.g. "scale-shot"
  displayName: string; // Title Case for display
  type: string;
  damageClass: 'physical' | 'special' | 'status';
  power: number | null;
  accuracy: number | null;
  pp: number;
  priority: number;
  effect: string;
  // Thai data (from curated moves.ts when available)
  nameTh?: string;
  descriptionTh?: string;
  effectTh?: string;
}

export interface LearnsetEntry {
  move: MoveDetail;
  methods: Array<{
    method: LearnMethod;
    level: number;
    versionGroup: string;
  }>;
  // Primary method (preferred display)
  primaryMethod: LearnMethod;
  primaryLevel: number;
}

const rawMoves: Record<string, {
  name: string;
  type: string;
  damageClass: string;
  power: number | null;
  accuracy: number | null;
  pp: number;
  priority: number;
  effect: string;
  flavorText: string;
}> = (learnsetData as any).moves;

const rawLearnsets: Record<string, Array<{
  name: string;
  methods: Array<{ method: string; level: number; versionGroup: string }>;
}>> = (learnsetData as any).learnsets;

function titleCase(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Resolve a single move into rich display data. */
function buildMoveDetail(slug: string): MoveDetail | null {
  const raw = rawMoves[slug];
  if (!raw) return null;
  const displayName = titleCase(slug);

  // Pull Thai info from curated moves.ts when present
  const curated = findMove(displayName) ?? findMove(slug);

  return {
    name: slug,
    displayName,
    type: raw.type,
    damageClass: raw.damageClass as 'physical' | 'special' | 'status',
    power: raw.power,
    accuracy: raw.accuracy,
    pp: raw.pp,
    priority: raw.priority,
    effect: raw.effect,
    nameTh: curated?.nameTh,
    descriptionTh: curated?.description,
    effectTh: curated?.effect && curated.effect !== '-' ? curated.effect : undefined,
  };
}

/**
 * Get the complete learnset for a Pokemon, with each move enriched and sorted.
 * Returns empty array if the Pokemon isn't in the generated dataset.
 */
export function getLearnset(slug: string): LearnsetEntry[] {
  const raw = rawLearnsets[slug];
  if (!raw) return [];

  const entries: LearnsetEntry[] = [];
  for (const m of raw) {
    const move = buildMoveDetail(m.name);
    if (!move) continue;
    const primary = m.methods[0];
    entries.push({
      move,
      methods: m.methods,
      primaryMethod: primary.method,
      primaryLevel: primary.level,
    });
  }

  // Sort: level-up first (by level), then machine, then egg, then tutor
  const order: Record<string, number> = { 'level-up': 0, 'machine': 1, 'egg': 2, 'tutor': 3 };
  entries.sort((a, b) => {
    const ao = order[a.primaryMethod] ?? 99;
    const bo = order[b.primaryMethod] ?? 99;
    if (ao !== bo) return ao - bo;
    if (a.primaryMethod === 'level-up') return a.primaryLevel - b.primaryLevel;
    return a.move.displayName.localeCompare(b.move.displayName);
  });

  return entries;
}

/** Thai labels for learn methods. */
export const methodLabels: Record<string, { th: string; icon: string; color: string }> = {
  'level-up': { th: 'เลเวลอัพ', icon: '📈', color: '#4cc9f0' },
  'machine': { th: 'TM / HM', icon: '💿', color: '#a890f0' },
  'egg': { th: 'การฟัก', icon: '🥚', color: '#ee99ac' },
  'tutor': { th: 'ครูฝึก', icon: '🎓', color: '#ffd166' },
  'form-change': { th: 'เปลี่ยนร่าง', icon: '✦', color: '#ff6b35' },
};

export function methodInfo(method: string) {
  return methodLabels[method] ?? { th: method, icon: '·', color: '#3a3a48' };
}
