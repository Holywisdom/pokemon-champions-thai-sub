import { spriteUrl } from '@/data/meta';

export { spriteUrl };

export function getBase(): string {
  // Astro injects this via import.meta.env.BASE_URL at runtime
  return import.meta.env.BASE_URL || '/';
}

export function url(path: string): string {
  const base = getBase().replace(/\/$/, '');
  const p = path.startsWith('/') ? path : '/' + path;
  return base + p;
}

export function totalBaseStats(stats: Record<string, number>): number {
  return Object.values(stats).reduce((a, b) => a + b, 0);
}

export function statMaxColor(value: number): string {
  if (value >= 130) return 'text-champ-gold';
  if (value >= 100) return 'text-champ-electric';
  if (value >= 80) return 'text-champ-ocean';
  if (value >= 60) return 'text-champ-text';
  return 'text-champ-muted';
}

export function statBarPercent(value: number): number {
  return Math.min(100, Math.round((value / 255) * 100));
}

export function statBarColor(value: number): string {
  if (value >= 130) return '#ffd166';
  if (value >= 100) return '#ff9a3c';
  if (value >= 80) return '#4cc9f0';
  if (value >= 60) return '#a890f0';
  return '#6b6b80';
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function titleCase(text: string): string {
  return text
    .replace(/-/g, ' ')
    .split(' ')
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(' ');
}

export function effectivenessLabel(mult: number): string {
  if (mult === 0) return 'ไม่มีผล (0×)';
  if (mult === 0.25) return 'ต้านทานอย่างยิ่ง (¼×)';
  if (mult === 0.5) return 'ต้านทาน (½×)';
  if (mult === 1) return 'ปกติ (1×)';
  if (mult === 2) return 'แทงค์มาก (2×)';
  if (mult === 4) return 'แทงค์อย่างยิ่ง (4×)';
  return `${mult}×`;
}

export function effectivenessColor(mult: number): string {
  if (mult === 0) return 'bg-champ-border text-champ-muted';
  if (mult < 1) return 'bg-blue-500/20 text-blue-300';
  if (mult === 1) return 'bg-champ-border text-champ-text';
  if (mult > 1) return 'bg-red-500/20 text-red-300';
  return '';
}
