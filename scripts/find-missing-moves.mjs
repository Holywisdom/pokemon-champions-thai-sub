// scripts/find-missing-moves.mjs
import { readFile, writeFile } from 'node:fs/promises';

const learnsets = JSON.parse(await readFile('src/data/generated/learnsets.json', 'utf-8'));
const movesFile = await readFile('src/data/moves.ts', 'utf-8');

// All moves referenced (top-level moves dict in learnsets.json)
const referenced = new Set(Object.keys(learnsets.moves ?? {}));

// Existing moves in moves.ts (by slug)
const existing = new Set([...movesFile.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]));

const missing = [...referenced].filter((m) => !existing.has(m)).sort();
console.log(`Referenced moves: ${referenced.size}`);
console.log(`Existing in moves.ts: ${existing.size}`);
console.log(`Missing: ${missing.length}`);
await writeFile('.missing-moves.json', JSON.stringify(missing, null, 2));
console.log('Wrote .missing-moves.json');
