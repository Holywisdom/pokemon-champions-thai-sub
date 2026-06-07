/**
 * Katakana → Thai transliteration utility.
 *
 * Phonetic mapping based on established Thai Pokémon community conventions
 * (PokémonTH wiki, Thai fansub). Aligned to the JP-derived style used by
 * the 80 existing entries in meta.ts (e.g. Charizard リザードン → ลิซาร์ดอน).
 *
 * Limitations: this is a heuristic transliterator. Output should be flagged
 * NEEDS_REVIEW unless the result matches a well-known canonical Thai name.
 */

// Base syllable map (consonant + inherent vowel). Single-mora kana.
// Format: kata -> { th, vowel, consonant }
// 'th' is the rendered Thai syllable with the inherent vowel (usually อา for the 'a' row).
const SYLLABLES = {
  // a-row (inherent vowel = อา)
  'ア': { th: 'อา', v: 'aa', c: '' },
  'カ': { th: 'คา', v: 'aa', c: 'k' },
  'ガ': { th: 'กา', v: 'aa', c: 'g' },
  'サ': { th: 'ซา', v: 'aa', c: 's' },
  'ザ': { th: 'ซา', v: 'aa', c: 'z' },
  'タ': { th: 'ทา', v: 'aa', c: 't' },
  'ダ': { th: 'ดา', v: 'aa', c: 'd' },
  'ナ': { th: 'นา', v: 'aa', c: 'n' },
  'ハ': { th: 'ฮา', v: 'aa', c: 'h' },
  'バ': { th: 'บา', v: 'aa', c: 'b' },
  'パ': { th: 'พา', v: 'aa', c: 'p' },
  'マ': { th: 'มา', v: 'aa', c: 'm' },
  'ヤ': { th: 'ยา', v: 'aa', c: 'y' },
  'ラ': { th: 'รา', v: 'aa', c: 'r' },
  'ワ': { th: 'วา', v: 'aa', c: 'w' },

  // i-row (vowel = อิ)
  'イ': { th: 'อิ', v: 'i', c: '' },
  'キ': { th: 'คิ', v: 'i', c: 'k' },
  'ギ': { th: 'กิ', v: 'i', c: 'g' },
  'シ': { th: 'ชิ', v: 'i', c: 'sh' },
  'ジ': { th: 'จิ', v: 'i', c: 'j' },
  'チ': { th: 'จิ', v: 'i', c: 'ch' },
  'ヂ': { th: 'จิ', v: 'i', c: 'dj' },
  'ニ': { th: 'นิ', v: 'i', c: 'n' },
  'ヒ': { th: 'ฮิ', v: 'i', c: 'h' },
  'ビ': { th: 'บิ', v: 'i', c: 'b' },
  'ピ': { th: 'พิ', v: 'i', c: 'p' },
  'ミ': { th: 'มิ', v: 'i', c: 'm' },
  'リ': { th: 'ริ', v: 'i', c: 'r' },

  // u-row (vowel = อุ; some columns use อึ)
  'ウ': { th: 'อุ', v: 'u', c: '' },
  'ク': { th: 'คุ', v: 'u', c: 'k' },
  'グ': { th: 'กุ', v: 'u', c: 'g' },
  'ス': { th: 'ซุ', v: 'u', c: 's' },
  'ズ': { th: 'ซุ', v: 'u', c: 'z' },
  'ツ': { th: 'ทสึ', v: 'u', c: 'ts' },
  'ヅ': { th: 'ทสึ', v: 'u', c: 'dz' },
  'ヌ': { th: 'นุ', v: 'u', c: 'n' },
  'フ': { th: 'ฟุ', v: 'u', c: 'f' },
  'ブ': { th: 'บุ', v: 'u', c: 'b' },
  'プ': { th: 'พุ', v: 'u', c: 'p' },
  'ム': { th: 'มุ', v: 'u', c: 'm' },
  'ユ': { th: 'ยุ', v: 'u', c: 'y' },
  'ル': { th: 'รุ', v: 'u', c: 'r' },

  // e-row (vowel = เอ)
  'エ': { th: 'เอ', v: 'e', c: '' },
  'ケ': { th: 'เค', v: 'e', c: 'k' },
  'ゲ': { th: 'เก', v: 'e', c: 'g' },
  'セ': { th: 'เซ', v: 'e', c: 's' },
  'ゼ': { th: 'เซ', v: 'e', c: 'z' },
  'テ': { th: 'เท', v: 'e', c: 't' },
  'デ': { th: 'เด', v: 'e', c: 'd' },
  'ネ': { th: 'เน', v: 'e', c: 'n' },
  'ヘ': { th: 'เฮ', v: 'e', c: 'h' },
  'ベ': { th: 'เบ', v: 'e', c: 'b' },
  'ペ': { th: 'เพ', v: 'e', c: 'p' },
  'メ': { th: 'เม', v: 'e', c: 'm' },
  'レ': { th: 'เร', v: 'e', c: 'r' },

  // o-row (vowel = โอ)
  'オ': { th: 'โอ', v: 'o', c: '' },
  'コ': { th: 'โค', v: 'o', c: 'k' },
  'ゴ': { th: 'โก', v: 'o', c: 'g' },
  'ソ': { th: 'โซ', v: 'o', c: 's' },
  'ゾ': { th: 'โซ', v: 'o', c: 'z' },
  'ト': { th: 'โท', v: 'o', c: 't' },
  'ド': { th: 'โด', v: 'o', c: 'd' },
  'ノ': { th: 'โน', v: 'o', c: 'n' },
  'ホ': { th: 'โฮ', v: 'o', c: 'h' },
  'ボ': { th: 'โบ', v: 'o', c: 'b' },
  'ポ': { th: 'โพ', v: 'o', c: 'p' },
  'モ': { th: 'โม', v: 'o', c: 'm' },
  'ヨ': { th: 'โย', v: 'o', c: 'y' },
  'ロ': { th: 'โร', v: 'o', c: 'r' },
  'ヲ': { th: 'โอ', v: 'o', c: '' },

  // Foreign extensions
  'ファ': { th: 'ฟา', v: 'aa', c: 'f' },
  'フィ': { th: 'ฟี', v: 'ii', c: 'f' },
  'フェ': { th: 'เฟ', v: 'e', c: 'f' },
  'フォ': { th: 'โฟ', v: 'o', c: 'f' },
  'ファー': { th: 'ฟาร์', v: 'aa', c: 'f' },
  'ヴァ': { th: 'วา', v: 'aa', c: 'v' },
  'ヴィ': { th: 'วี', v: 'ii', c: 'v' },
  'ヴェ': { th: 'เว', v: 'e', c: 'v' },
  'ヴォ': { th: 'โว', v: 'o', c: 'v' },
  'ティ': { th: 'ที', v: 'ii', c: 't' },
  'ディ': { th: 'ดี', v: 'ii', c: 'd' },
  'トゥ': { th: 'ทู', v: 'uu', c: 't' },
  'ドゥ': { th: 'ดู', v: 'uu', c: 'd' },
  'シェ': { th: 'เช', v: 'e', c: 'sh' },
  'ジェ': { th: 'เจ', v: 'e', c: 'j' },
  'チェ': { th: 'เช', v: 'e', c: 'ch' },
  'ウィ': { th: 'วี', v: 'ii', c: 'w' },
  'ウェ': { th: 'เว', v: 'e', c: 'w' },
  'ウォ': { th: 'วอ', v: 'o', c: 'w' },

  // ya/yu/yo digraphs
  'キャ': { th: 'เคีย', v: 'ya', c: 'ky' },
  'キュ': { th: 'คิว', v: 'yu', c: 'ky' },
  'キョ': { th: 'เคียว', v: 'yo', c: 'ky' },
  'ギャ': { th: 'เกีย', v: 'ya', c: 'gy' },
  'ギュ': { th: 'กิว', v: 'yu', c: 'gy' },
  'ギョ': { th: 'เกียว', v: 'yo', c: 'gy' },
  'シャ': { th: 'ชา', v: 'ya', c: 'sh' },
  'シュ': { th: 'ชู', v: 'yu', c: 'sh' },
  'ショ': { th: 'โช', v: 'yo', c: 'sh' },
  'ジャ': { th: 'จา', v: 'ya', c: 'j' },
  'ジュ': { th: 'จู', v: 'yu', c: 'j' },
  'ジョ': { th: 'โจ', v: 'yo', c: 'j' },
  'チャ': { th: 'ชา', v: 'ya', c: 'ch' },
  'チュ': { th: 'ชู', v: 'yu', c: 'ch' },
  'チョ': { th: 'โช', v: 'yo', c: 'ch' },
  'ニャ': { th: 'เนีย', v: 'ya', c: 'ny' },
  'ニュ': { th: 'นิว', v: 'yu', c: 'ny' },
  'ニョ': { th: 'เนียว', v: 'yo', c: 'ny' },
  'ヒャ': { th: 'เฮีย', v: 'ya', c: 'hy' },
  'ヒュ': { th: 'ฮิว', v: 'yu', c: 'hy' },
  'ヒョ': { th: 'เฮียว', v: 'yo', c: 'hy' },
  'ビャ': { th: 'เบีย', v: 'ya', c: 'by' },
  'ビュ': { th: 'บิว', v: 'yu', c: 'by' },
  'ビョ': { th: 'เบียว', v: 'yo', c: 'by' },
  'ピャ': { th: 'เพีย', v: 'ya', c: 'py' },
  'ピュ': { th: 'พิว', v: 'yu', c: 'py' },
  'ピョ': { th: 'เพียว', v: 'yo', c: 'py' },
  'ミャ': { th: 'เมีย', v: 'ya', c: 'my' },
  'ミュ': { th: 'มิว', v: 'yu', c: 'my' },
  'ミョ': { th: 'เมียว', v: 'yo', c: 'my' },
  'リャ': { th: 'เรีย', v: 'ya', c: 'ry' },
  'リュ': { th: 'ริว', v: 'yu', c: 'ry' },
  'リョ': { th: 'เรียว', v: 'yo', c: 'ry' },
};

// Long-vowel extension. Apply to the previous syllable's vowel.
// e.g. リ + ー -> รี ; ラ + ー -> รา (already long with อา) etc.
const LONG_VOWEL_REPLACE = {
  // map (last vowel char in Thai) -> long form
  // we map by inspecting the trailing chars of the rendered Thai syllable
};

// ン handling: usually a final ン nasal -> ง or น.
// In Pokémon conventions: ン at end of word commonly = น (e.g. リザードン → ลิซาร์ดอน).
// Mid-word ン before labials -> ม, before velars -> ง, otherwise น.
function nasalForContext(nextKana) {
  if (!nextKana) return 'น';
  if ('バビブベボパピプペポマミムメモ'.includes(nextKana)) return 'ม';
  if ('カキクケコガギグゲゴ'.includes(nextKana)) return 'ง';
  return 'น';
}

// Apply chōonpu (ー) — extends the vowel of the previous syllable.
// We do simple substitution: if last rendered Thai ends in 'า' keep, in 'ิ' -> 'ี', etc.
function applyChonpuToThai(prevTh, prevVowel) {
  if (!prevTh) return 'ー';
  // Map short -> long
  if (prevVowel === 'aa') return prevTh; // already long with อา
  if (prevVowel === 'i') return prevTh.replace(/ิ$/, 'ี');
  if (prevVowel === 'u') return prevTh.replace(/ุ$/, 'ู');
  if (prevVowel === 'e') return prevTh.replace(/^เ/, 'เ').replace(/$/, 'อ'); // เก + ー -> เกอ ; but common Pokemon: ケー → เค (already long-ish)
  if (prevVowel === 'o') return prevTh; // โ already long
  return prevTh;
}

// Small tsu ッ: doubles consonant of next syllable. Often dropped in Thai.
// In Pokémon convention often rendered as a closing consonant.
// We just skip it (treat as none) — leaves the Thai cleaner.

// Detect digraphs (two-char) like シャ
function readNext(kata, i) {
  // Try 3-char first (e.g. ファー which is ファ+ー but ー is its own logic)
  // We rely on 2-char digraphs.
  const c = kata[i];
  const n = kata[i + 1];
  if (n && (n === 'ャ' || n === 'ュ' || n === 'ョ' || n === 'ィ' || n === 'ェ' || n === 'ァ' || n === 'ォ' || n === 'ゥ')) {
    const di = c + n;
    if (SYLLABLES[di]) return { kana: di, len: 2 };
  }
  return { kana: c, len: 1 };
}

export function kataToThai(kata) {
  if (!kata) return '';
  let out = '';
  let i = 0;
  let lastSyl = null;
  while (i < kata.length) {
    const ch = kata[i];
    if (ch === 'ー') {
      // Long vowel: replace last syllable with its long form
      if (lastSyl) {
        // Re-render with long vowel
        const longTh = applyChonpuToThai(lastSyl.th, lastSyl.v);
        out = out.slice(0, -lastSyl.th.length) + longTh;
        lastSyl = { ...lastSyl, th: longTh };
      } else {
        out += '-';
      }
      i++;
      continue;
    }
    if (ch === 'ッ') {
      // sokuon: render as ส/ส็ — often drop in Pokemon names
      i++;
      continue;
    }
    if (ch === 'ン') {
      const next = kata[i + 1];
      const nasal = nasalForContext(next);
      out += nasal;
      lastSyl = { th: nasal, v: '', c: 'n' };
      i++;
      continue;
    }
    if (ch === '・') {
      out += '-';
      i++;
      continue;
    }
    const { kana, len } = readNext(kata, i);
    if (SYLLABLES[kana]) {
      const s = SYLLABLES[kana];
      out += s.th;
      lastSyl = { th: s.th, v: s.v, c: s.c };
      i += len;
    } else {
      // unknown kana — fall back to literal
      out += ch;
      lastSyl = null;
      i++;
    }
  }
  return out;
}

// For 'reun' style endings (consonant clusters), apply diacritics:
// e.g. リザードン -> ลิซา+ー+ド+ン. Auto produces: リ=ริ, ザ=ซา, ー=ซา (long), ド=โด, ン=น
// Want: ลิซาร์ดอน — so 'ar' from ザー + ル/ル/ーー... actually no, riza→rd→on. Plain output works.
// But proper canonical form uses ดอน for "don" (closed syllable spelled with อ).
// That's a polish layer we'd hand-tune. For draft, our basic mapping is acceptable as REVIEW-tier.

// Self-test (when run as script)
if (import.meta.url === `file://${process.argv[1]}`) {
  const tests = [
    ['リザードン', 'expected: ลิซาร์ดอน (canonical)'],
    ['ピカチュウ', 'expected: ปิกาจู'],
    ['ガオガエン', 'expected: เกาการ์ / ガオガエン Gaogaen'],
    ['ガブリアス', 'expected: ガブリアス Gablias'],
    ['イダイトウ', 'expected: อิดาเรดดอน (canonical existing nameTh)'],
    ['ニンフィア', 'expected: นิมเฟีย'],
    ['プテラ', 'expected: พเทร่า'],
    ['エルフーン', 'expected: อิลฟูน'],
  ];
  for (const [k, note] of tests) {
    console.log(k, '->', kataToThai(k), '  //', note);
  }
}
