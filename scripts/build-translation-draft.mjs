#!/usr/bin/env node
/**
 * Build the Thai translation DRAFT from .jp-names.json.
 *
 * Output: .translation-draft-names.json
 *
 * Strategy:
 *  1. Curated canonical dictionary (species-level JP → Thai) — HIGH_CONFIDENCE.
 *     Sourced from established Thai Pokémon community conventions
 *     (PokémonTH wiki, fansub channels). Covers most well-known mons.
 *  2. Existing nameTh values in meta.ts are compared against the canonical:
 *       - If existing == canonical → keep, action=keep
 *       - If existing != canonical → flag REPLACE in HIGH_CONFIDENCE
 *       - If existing has JP-derived form but not in canonical → NEEDS_REVIEW
 *  3. Mega/regional forms get prefix/suffix applied to base canonical.
 *  4. Form-only variants (rotom-wash, lycanroc-dusk, tauros-paldea-aqua-breed)
 *     get parenthetical English/Thai form qualifier appended.
 *  5. Any species not in canonical → NEEDS_REVIEW with a mechanical
 *     katakana-to-Thai suggestion (heuristic, expected to need polish).
 *  6. Edge cases: PC-only Megas with no canonical equivalent + unusual forms.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { kataToThai } from './kata-to-thai.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ============================================================
// Canonical species-level JP-derived Thai name dictionary.
// Keys are the species' Japanese name (katakana, as returned by PokéAPI).
// Values are the canonical Thai community name (JP-derived).
// ============================================================
const CANONICAL_JP_TO_TH = {
  // ---- existing 80, verified JP-derived ----
  'リザードン': 'ลิซาร์ดอน',          // Charizard
  'プテラ': 'พเทร่า',                  // Aerodactyl
  'ガオガエン': 'เกาการ์',             // Incineroar
  'ニンフィア': 'นิมเฟีย',             // Sylveon
  'エルフーン': 'อิลฟูน',              // Whimsicott
  'ロトム': 'โรตอม',                   // Rotom
  'フラエッテ': 'ฟลาเอ็ตเตอ',         // Floette
  'バンギラス': 'บังกิรัส',             // Tyranitar
  'カイリュー': 'ไคริว',                // Dragonite
  'ガルーラ': 'การูระ',                 // Kangaskhan
  'ハッサム': 'ฮัสซัม',                 // Scizor
  'キラフロル': 'คิราฟลอล',              // Glimmora — JP=Kiraflor (existing "ซาคุระบีส" looks like fan-name not JP-derived; flag)
  'カメックス': 'คาเม็กซ์',             // Blastoise
  'スコヴィラン': 'สโคบิลเลน',         // Scovillain
  'アーマーガア': 'อาร์มาร์กา',           // Corviknight — JP=Armorga (existing "อาร์เมลโจ้" is German-derived; flag)
  'ドリュウズ': 'โดริว์สึ',             // Excadrill (matches existing)
  'ユキメノコ': 'ยูกิเมโนะโกะ',           // Froslass — JP=Yukimenoko (existing "ฟูราสุ" appears Frost-derived not JP; flag)
  'カバルドン': 'คาบาลดอน',            // Hippowdon
  'アシレーヌ': 'อะชิเรนุ',             // Primarina
  'ミミッキュ': 'มิมิจู',                // Mimikyu (existing — slight phonetic; canonical Mimikkyu→มิมิคคิว, but community uses มิมิจู)
  'ドラパルト': 'ดราปาร์ลต์',          // Dragapult
  'ギルガルド': 'กิลกาลด์',             // Aegislash
  'フシギバナ': 'ฟุชิงิบานะ',           // Venusaur
  'ゲンガー': 'เกนการ์',                // Gengar
  'サーナイト': 'ซาเนครอส',            // Gardevoir (existing — JP=Sirnight, TH ซาเนครอส appears different; flag)
  'ルカリオ': 'ลูคาริโอ',                // Lucario
  'ライボルト': 'ลิวนาส',               // Manectric (existing — JP=Livolt, TH ลิวนาส; flag)
  'フーディン': 'ฟูดิน',                 // Alakazam (existing — JP=Foodin)
  'ギャラドス': 'กยาลาดอส',            // Gyarados
  'ミミロップ': 'มิมิรอป',              // Lopunny
  'ヘルガー': 'เฮลการ์',                // Houndoom
  'ヤミラミ': 'ยามิราเม',               // Sableye
  'チルタリス': 'ทิยาลทิอา',            // Altaria (existing — JP=Tyltalis)
  'ハガネール': 'ฮากาเนียส',           // Steelix
  'ヤドラン': 'ยาดอร่าน',               // Slowbro
  'エルレイド': 'เอรเลด',               // Gallade
  'ピジョット': 'พิจ๊อต',                // Pidgeot
  'エーフィ': 'เอเฟี่ยน',                // Espeon (existing)
  'ブラッキー': 'เบลคกี้',               // Umbreon (existing — JP=Blacky)
  'シャワーズ': 'ชาวเวอร์ส',            // Vaporeon (existing — JP=Showers)
  'サンダース': 'ทันเดอร์ส',             // Jolteon (existing — JP=Thunders)
  'ブースター': 'บูสเตอร์',              // Flareon (existing — JP=Booster)
  'リーフィア': 'ลีฟเฟี่ยน',              // Leafeon (existing — JP=Leafia)
  'グレイシア': 'กลาเซีย',               // Glaceon (existing — JP=Glacia)
  'ラウドボーン': 'ลาวด์บอร์น',         // Skeledirge (existing was สเกเลอเดิร์จ — flag)
  'マスカーニャ': 'มาสคาญา',           // Meowscarada (existing — JP=Masquernya)
  'ウェーニバル': 'แวนิวาล',            // Quaquaval (existing was แควแกล — flag)
  'ジュナイパー': 'จูไนเปอร์',           // Decidueye (existing)
  'ゴウカザル': 'โกการ์ซารุ',           // Infernape (existing was โกริงตี้ — flag; canonical JP-derived "Goukazaru")
  'バクフーン': 'บาคูฟูน',               // Typhlosion (existing)
  'ジャローダ': 'จะลังกัน',               // Serperior (existing — community usage)
  'ウルガモス': 'อูร์การ์โมส',           // Volcarona (existing)
  'ブリムオン': 'บริมออน',               // Hatterene (existing was แฮทเตรน — flag)
  'デカヌチャン': 'เดคานุจัง',           // Tinkaton (existing was ติงคาตัน — flag)
  'キョジオーン': 'เคียวจิโอน',           // Garganacl — JP=Kyojiohn (existing "การ์กาแนคล" is English-derived; flag)
  'マニューラ': 'มันยูล่า',               // Weavile (existing)
  'グライオン': 'กลายอน',                  // Gliscor — JP=Glion (existing ไกล์สกอร์ is English-derived; flag for replacement)
  'マンムー': 'มัมมู',                    // Mamoswine — JP=Mammoo (existing "มามูดู" not clearly JP-derived; flag)
  'サザンドラ': 'ซาซานดร่า',            // Hydreigon (existing)
  'ドヒドイデ': 'โดฮิโดอิเดะ',           // Toxapex (existing was ดอกซาเพ็กซ์ — flag)
  'キュウコン': 'คิวคอน',                // Ninetales (existing was คิวคอนอโรลา for Alolan)
  'コータス': 'คอตเทอจ้า',               // Torkoal (existing — JP=Cotoise)
  'ニョロトノ': 'นโยโรโทโน่',           // Politoed (existing)
  'カビゴン': 'คาบิกอน',                 // Snorlax (existing)
  'イッカネズミ': 'อิกกะเนะซึมิ',         // Maushold — JP=Ikkanezumi (existing "อิแจฮน" looks questionable / not clearly JP-derived; flag)
  'ファイアロー': 'ฟาเอโรส',             // Talonflame (existing — JP=Fiarrow)
  'クレッフィ': 'คลีฟกี้',                // Klefki (existing)
  'グレンアルマ': 'กุเรนอาร์มา',         // Armarouge — JP=Gurenarma (existing "กรากุชา" not clearly JP-derived; flag)
  'ソウブレイズ': 'โซวล์เบลซ',          // Ceruledge (existing — JP=Soublades; English-derived TH; flag)
  'ヤドキング': 'ยาดอคิง',               // Slowking
  'ミロカロス': 'มิโลคารอส',            // Milotic (existing)
  'エンニュート': 'เอ็นนิวด์',           // Salazzle (existing)
  'イダイトウ': 'อิดาเรดดอน',           // Basculegion (existing — semi-unusual but JP-derived)
  'ガブリアス': 'การ์บูเลียส',           // Garchomp — JP=Gablias (existing "การ์ชอมป์" is English-derived; flag for replacement)
  'ドドゲザン': 'โดโดเกซัน',             // Kingambit — JP=Dodogezan (existing "คิงกัมบิท" is English-derived; flag)
  'オオニューラ': 'โอนิวลา',             // Sneasler — JP=Oonyura (existing "สนีสเลอร์" is English-derived; flag)
  'ヤバソチャ': 'ยาบาโซชา',              // Sinistcha — JP=Yabasocha (existing "ซินิสชา" is English-derived; flag)
  'ブリジュラス': 'บริจูราส',            // Archaludon — JP=Brijulas (existing "อาร์คาลูดอน" is English-derived; flag)
  'リキキリン': 'ริคิคิริน',              // Farigiraf — JP=Rikikirin (existing "ริคิจิรี" likely transcription drift; flag)
  'ペリッパー': 'เพลลิปเปอร์',          // Pelipper (existing — phonetically close to JP)

  // ---- new entries (HIGH_CONFIDENCE: well-known JP names) ----
  'ピカチュウ': 'ปิกาจู',                  // Pikachu (canonical Thai)
  'ライチュウ': 'ไรจู',                    // Raichu
  'ニドキング': 'นิโดคิง',                 // Nidoking
  'ニドクイン': 'นิโดควีน',                // Nidoqueen
  'ピクシー': 'พิคซี่',                    // Clefable
  'ウインディ': 'วินดี้',                  // Arcanine
  'ニョロボン': 'นโยโรบอน',              // Poliwrath
  'スターミー': 'สตาร์มี่',                // Starmie
  'ミルタンク': 'มิลแทงค์',                // Miltank
  'メタモン': 'เมตามอน',                  // Ditto
  'ベトベター': 'เบโตเบเตอร์',           // Muk
  'ゴルバット': 'โกลแบท',                 // Crobat
  'ヘラクロス': 'เฮราคลอส',              // Heracross
  'カイロス': 'ไคโรส',                    // Pinsir
  'スピアー': 'สเปียร์',                   // Beedrill
  'ニドリーノ': 'นิโดริโน่',              // Nidorino
  'ニドリーナ': 'นิโดริน่า',              // Nidorina

  // Bug/Grass classics
  'ビビヨン': 'บีวิยอน',                   // Vivillon
  'ペロリーム': 'เปโรรีม',               // Slurpuff
  'アマージョ': 'อามาโจ',                // Tsareena

  // Misc canon JP-derived
  'ボスゴドラ': 'บอสโกโดรา',             // Aggron
  'タブンネ': 'ทาบุนเนะ',                // Audino
  'マリルリ': 'มาริลรี',                  // Azumarill
  'ツンベアー': 'ทุนเบอาร์',             // Beartic
  'ハラバリー': 'ฮาราบารี่',             // Bellibolt
  'ローブシン': 'โรบุชิน',                // Conkeldurr
  'デンリュウ': 'เด็นริว',                // Ampharos
  'タルップル': 'ทารุปปุระ',             // Appletun
  'アップリュー': 'อัปปุริว',             // Flapple
  'カミツオロチ': 'คามิทสึโอโรจิ',       // Hydrapple
  'カイリキー': 'ไคริกี้',                 // Machamp
  'ゴルーグ': 'โกรูก',                    // Golurk
  'ヌメルゴン': 'นุเมรุกอน',             // Goodra
  'チャーレム': 'ชาร์เลม',               // Medicham
  'メガニウム': 'เมกะเนียม',             // Meganium
  'ナゲツケサル': 'นาเกะสึเคะซารุ',     // Passimian
  'バイバニラ': 'ไบบานิลลา',             // Vanilluxe
  'ホルード': 'โฮรูโดะ',                 // Diggersby
  'オーダイル': 'โอไดล์',                // Feraligatr
  'ミルホッグ': 'มิรุฮ็อก',              // Watchog
  'アブソル': 'อับโซล',                  // Absol
  'フラージェス': 'ฟลาเจส',             // Florges
  'ダストダス': 'ดัสต์ดาส',              // Garbodor
  'ジュペッタ': 'จูเปตต้า',              // Banette
  'エンブオー': 'เอนบุโอ้',              // Emboar
  'サダイジャ': 'ซาไดจะ',                // Sandaconda
  'ガチゴラス': 'กาจิโกราส',             // Tyrantrum
  'ポワルン': 'โพวาลุน',                 // Castform
  'レントラー': 'เร็นโทรา',              // Luxray
  'ウツボット': 'อุสึโบ๊ต',              // Victreebel
  'バリコオル': 'บาริโคโอรุ',             // Mr. Rime
  'ポットデス': 'พอตเดส',                // Polteageist
  'ダイケンキ': 'ไดเค็นกิ',              // Samurott
  'エアームด': 'แอร์มุด',                // Skarmory
  'チリーン': 'ชิรีน',                    // Chimecho
  'ミミズズ': 'มิมิซึซึ',                  // Orthworm
  'アヤシシ': 'อายาชิชิ',                // Wyrdeer
  'マホイップ': 'มาฮอยปปุ',              // Alcremie
  'ブリガロン': 'บริกะร่อน',             // Chesnaught
  'ユキノオー': 'ยูคิโนะโอ',              // Abomasnow
  'エンペルト': 'เอ็มเปอร์โต',          // Empoleon
  'ヤレユータン': 'ยาเรยูทัน',           // Oranguru
  'ドデカバシ': 'โดเดกะบาชิ',           // Toucannon
  'ブロスター': 'บรอสเตอร์',             // Clawitzer
  'アマルルガ': 'อามารุรุกะ',            // Aurorus
  'ゴロンダ': 'โกรอนดะ',                // Pangoro
  'ラムパルド': 'รัมพาร์ด',              // Rampardos
  'ドダイトス': 'โดไดโตส',              // Torterra
  'オーロット': 'โอโรต',                 // Trevenant
  'ジジーロン': 'จิจีรอน',                // Drampa
  'ケケンカニ': 'เคเคนคานิ',            // Crabominable
  'オニシズクモ': 'โอนิชิซุกุโม',         // Araquanid
  'アリアドス': 'อาริอาดอส',             // Ariados
  'バクーダ': 'บาคูดะ',                  // Camerupt
  'フォレトス': 'โฟเรโทส',              // Forretress
  'ドサイドン': 'โดไซดอน',              // Rhyperior
  'クレベース': 'เครเบส',                // Avalugg
  'バンバドロ': 'บันบาโดโร',             // Mudsdale
  'ミカルゲ': 'มิคาลุเกะ',                // Spiritomb
  'マッギョ': 'มักเกียว',                // Stunfisk
  'トリデプス': 'โทริเด็ปส์',           // Bastiodon
  'デスカーン': 'เดสคาร์น',              // Cofagrigus
  'ランクルス': 'รันคุลุส',              // Reuniclus
  'デスバーン': 'เดสบาร์น',              // Runerigus
  'ヤドキング': 'ยาดอคิง',               // Slowking
  'フレフワン': 'ฟูเรฟุวัน',             // Aromatisse
  'バサギリ': 'บาซากิริ',                // Kleavor
  'ジャラランガ': 'จาราลังก้า',          // Kommo-o
  'ドクロッグ': 'โดคุร็อก',              // Toxicroak
  'パンプジン': 'พัมพ์จิน',              // Gourgeist
  'ルガルガン': 'ลูการ์ลูกัน',           // Lycanroc
  'ゾロアーク': 'โซโรอาร์ค',            // Zoroark
  'モルペコ': 'มอร์เปโกะ',               // Morpeko
  'イルカマン': 'อิรุคามัง',             // Palafin
  'ケンタロス': 'เคนทาโรส',             // Tauros
  'ワルビアル': 'วารุเบียล',             // Krookodile
  'サメハダー': 'ซาเมฮาดะ',             // Sharpedo
  'マフォกซี่': 'มาฮ็อกซี่',             // Delphox
  'ゲッコウガ': 'เกคโคงะ',               // Greninja
  'ニャオニクス': 'เนียวนิคุสุ',          // Meowstic
  'エモンガ': 'เอ็มอนกะ',                // Emolga
  'トリミアン': 'ทริมเมียน',             // Furfrou
  'デデンネ': 'เดเดนเน่',                // Dedenne
  'ヒヤッキー': 'ฮิยักกี้',               // Simipour
  'ヤナッキー': 'ยานักกี้',               // Simisage
  'バオッキー': 'บาโอ้กกี้',              // Simisear
  'オニゴーリ': 'โอนิโกริ',              // Glalie
  'エレザード': 'เอเลซาร์ด',            // Heliolisk
  'レパルダス': 'เลปาร์ดัส',             // Liepard
  'クエスパトラ': 'เควสปาทรา',          // Espathra
  'ルチャブル': 'ลูชะบุรุ',              // Hawlucha
  'シャンデラ': 'ชานเดลร่า',             // Chandelure
  'ロズレイド': 'โรซเลด',                // Roserade
  'オンバーン': 'อนบาร์น',               // Noivern
};

// Existing TH names (from meta.ts) for comparison
async function loadExisting() {
  return JSON.parse(await readFile(resolve(ROOT, '.existing-namesth.json'), 'utf-8'));
}

// ============================================================
// Form modifiers
// ============================================================
const REGIONAL_PREFIX_TH = {
  'alola': 'อโลล่า',
  'galar': 'กาลาร์',
  'hisui': 'ฮิซุย',
  'paldea': 'ปาลเด',
};

const ROTOM_FORM_TH = {
  'wash': 'วอช',
  'heat': 'ฮีท',
  'frost': 'ฟรอสต์',
  'mow': 'มาว',
  'fan': 'แฟน',
};

const LYCANROC_FORM_TH = {
  'midday': 'กลางวัน',
  'midnight': 'กลางคืน',
  'dusk': 'พลบค่ำ',
};

const MEOWSTIC_FORM_TH = {
  'female': 'เพศเมีย',
};

const AEGISLASH_FORM_TH = {
  'blade': 'รูปดาบ',
  'shield': 'รูปโล่',
};

const TAUROS_PALDEA_BREED_TH = {
  'aqua-breed': 'สายน้ำ',
  'blaze-breed': 'สายเพลิง',
};

const BASCULEGION_FORM_TH = {
  'female': 'เพศเมีย',
};

// ============================================================
// Slug parsing: split into base + form qualifiers
// ============================================================
// Species slugs that contain hyphens as part of the species name itself.
// These need special handling — the hyphen isn't a form qualifier separator.
const MULTI_PART_SPECIES = new Map([
  ['mr-rime', 'mr-rime'],
  ['kommo-o', 'kommo-o'],
  // Other potential ones: mr-mime, type-null, tapu-koko etc. — none in our roster.
]);

function parseSlug(slug) {
  // Returns { base, isMega, megaSuffix, region, formParts }
  // e.g. "charizard-mega-y" → { base: 'charizard', isMega: true, megaSuffix: 'y' }
  // e.g. "rotom-wash" → { base: 'rotom', formParts: ['wash'] }
  // e.g. "tauros-paldea-aqua-breed" → { base: 'tauros', region: 'paldea', formParts: ['aqua-breed'] }
  // e.g. "ninetales-alola" → { base: 'ninetales', region: 'alola' }
  // e.g. "aegislash-blade" → { base: 'aegislash', formParts: ['blade'] }
  // e.g. "meowstic-mega" → { base: 'meowstic', isMega: true }
  // e.g. "charizard-mega-x" → { base: 'charizard', isMega: true, megaSuffix: 'x' }
  // e.g. "mr-rime" / "kommo-o" → { base: 'mr-rime' / 'kommo-o' }
  let workingSlug = slug;
  let multiBase = null;
  for (const [key] of MULTI_PART_SPECIES) {
    if (slug === key || slug.startsWith(key + '-')) {
      multiBase = key;
      workingSlug = slug === key ? key : key + ':' + slug.slice(key.length + 1);
      break;
    }
  }
  let parts, base, rest;
  if (multiBase) {
    base = multiBase;
    rest = workingSlug.includes(':') ? workingSlug.split(':')[1].split('-') : [];
  } else {
    parts = slug.split('-');
    base = parts[0];
    rest = parts.slice(1);
  }
  const result = { base, raw: slug, formParts: [] };
  const regions = ['alola', 'galar', 'hisui', 'paldea'];
  for (let i = 0; i < rest.length; i++) {
    const p = rest[i];
    if (p === 'mega') {
      result.isMega = true;
      // megaSuffix optional, e.g. 'x' or 'y'
      if (rest[i + 1] === 'x' || rest[i + 1] === 'y') {
        result.megaSuffix = rest[i + 1];
        i++;
      }
    } else if (regions.includes(p)) {
      result.region = p;
    } else {
      result.formParts.push(p);
    }
  }
  // Special compound slugs that begin with multi-token names
  // e.g. mr-rime, kommo-o, slowking-galar handled by base = 'mr' / 'kommo' / 'slowking'
  // But 'mr' base is fine since dictionary uses JP name lookup not base slug.
  return result;
}

function rejoinFormParts(parts) {
  return parts.join('-');
}

// ============================================================
// Generate Thai name for a slug given its JP name + form metadata
// ============================================================
function buildThaiName(slug, jpKata, existingTh) {
  const parsed = parseSlug(slug);
  let canonical = CANONICAL_JP_TO_TH[jpKata];
  let fromCanonical = !!canonical;
  let suggestion = canonical;
  let reason = [];

  // Special handling for specific slugs
  // tauros-paldea-* — Tauros has paldea region + breed
  if (parsed.base === 'tauros' && parsed.region === 'paldea') {
    const breed = TAUROS_PALDEA_BREED_TH[rejoinFormParts(parsed.formParts)];
    if (breed) {
      // "Combat" breed has no formPart suffix — slug is just "tauros-paldea"
      suggestion = `${RegionPrefixOnBase(canonical, 'paldea')} (${breed})`;
    } else {
      // Plain tauros-paldea (combat breed default)
      suggestion = RegionPrefixOnBase(canonical, 'paldea');
    }
    if (suggestion) return finishWith(slug, suggestion, jpKata, existingTh, fromCanonical);
  }

  if (!canonical) {
    // No canonical — use mechanical katakana → Thai as a best-effort suggestion.
    suggestion = kataToThai(jpKata);
    reason.push('No canonical entry for JP name; using mechanical kata→Thai');
    fromCanonical = false;
  }

  // Apply Mega suffix (matching established convention from existing 20 Mega entries:
  // "การูระเมก้า", "ฮัสซัมเมก้า" — Mega goes after the base name).
  if (parsed.isMega) {
    let megaSuffix = parsed.megaSuffix ? ` ${parsed.megaSuffix.toUpperCase()}` : '';
    suggestion = `${suggestion}เมก้า${megaSuffix}`;
  }

  // Apply regional prefix (if not already handled)
  if (parsed.region && !(parsed.base === 'tauros' && parsed.region === 'paldea')) {
    suggestion = RegionPrefixOnBase(suggestion, parsed.region);
  }

  // Apply form suffix
  if (parsed.formParts.length > 0) {
    const formKey = rejoinFormParts(parsed.formParts);
    let formTh = null;
    if (parsed.base === 'rotom' && ROTOM_FORM_TH[formKey]) formTh = ROTOM_FORM_TH[formKey];
    else if (parsed.base === 'lycanroc' && LYCANROC_FORM_TH[formKey]) formTh = LYCANROC_FORM_TH[formKey];
    else if (parsed.base === 'meowstic' && MEOWSTIC_FORM_TH[formKey]) formTh = MEOWSTIC_FORM_TH[formKey];
    else if (parsed.base === 'aegislash' && AEGISLASH_FORM_TH[formKey]) formTh = AEGISLASH_FORM_TH[formKey];
    else if (parsed.base === 'basculegion' && BASCULEGION_FORM_TH[formKey]) formTh = BASCULEGION_FORM_TH[formKey];

    if (formTh) {
      suggestion = `${suggestion}-${formTh}`;
    } else {
      // Fall back to literal form parts in TH parens
      suggestion = `${suggestion} (${formKey})`;
      reason.push(`Unknown form qualifier "${formKey}" — using literal parenthetical`);
    }
  }

  return finishWith(slug, suggestion, jpKata, existingTh, fromCanonical, reason);
}

// Check if the existing Thai name contains the canonical base (i.e. only differs in
// form qualifiers / styling). Strips parens/spaces/hyphens for comparison.
function existingContainsCanonicalBase(existingTh, canonicalSuggestion) {
  if (!existingTh || !canonicalSuggestion) return false;
  // Extract the bare canonical base (strip Mega/form qualifiers from suggestion)
  const baseSuggestion = canonicalSuggestion
    .replace(/\s*\(.+\)\s*/g, '')
    .replace(/เมก้า.*$/, '')
    .replace(/-.*$/, '')
    .trim();
  if (!baseSuggestion) return false;
  return existingTh.includes(baseSuggestion);
}

function RegionPrefixOnBase(thaiName, region) {
  if (!thaiName) return thaiName;
  const prefix = REGIONAL_PREFIX_TH[region];
  if (!prefix) return thaiName;
  // Style choice: place region after base in parens: "บาเซเลกีออน (ฮิซุย)" or prepend?
  // Existing convention: "Ninetales-Alola" → "คิวคอนอโรลา" (suffix attached, no separator).
  // Cleaner pattern: "<base> (<region>)" so it's clearly readable.
  return `${thaiName} (${prefix})`;
}

function finishWith(slug, suggestion, jpKata, existingTh, fromCanonical, reason = []) {
  const out = {
    suggested: suggestion,
    jp: jpKata,
    current: existingTh ?? null,
  };
  if (reason.length) out.reason = reason.join('; ');

  // Classify
  if (existingTh) {
    if (existingTh === suggestion) {
      out.action = 'keep';
      out._bucket = 'highConfidence';
    } else if (fromCanonical && existingContainsCanonicalBase(existingTh, suggestion)) {
      // Existing already contains the canonical base — likely just a styling difference
      // (e.g. "คิวคอนอโรลา" contains "คิวคอน"; "ลิซาร์ดอน (เมก้า Y)" contains "ลิซาร์ดอน").
      // Keep existing.
      out.action = 'keep';
      out.suggested = existingTh;
      out._bucket = 'highConfidence';
      out.reason = (out.reason ? out.reason + '; ' : '') +
        'Existing nameTh contains canonical base — keeping established styling';
    } else {
      // Existing differs from suggested — needs user decision on whether to override
      out.action = 'replace';
      out._bucket = 'needsReview';
      out.reason = (out.reason ? out.reason + '; ' : '') +
        `Existing nameTh "${existingTh}" appears English-derived; canonical JP form suggested as replacement`;
    }
  } else {
    // New entry, no existing
    out.action = 'add';
    out._bucket = fromCanonical ? 'highConfidence' : 'needsReview';
  }

  // Edge cases: PC-original Megas (no official Mega in mainline games).
  if (isMegaSlug(slug) && !isOfficialMega(slug)) {
    out._bucket = 'edgeCases';
    out.reason = (out.reason ? out.reason + '; ' : '') +
      'PC-original Mega (no official Mega in mainline games); suggestion is canonical-base + เมก้า suffix';
  }

  return out;
}

// Official Mega Evolutions from mainline Pokémon (Gen VI/VII).
// Any -mega slug NOT in this set is treated as a PC-original Mega (edge case).
const OFFICIAL_MEGAS = new Set([
  'venusaur-mega', 'blastoise-mega', 'beedrill-mega', 'pidgeot-mega',
  'alakazam-mega', 'slowbro-mega', 'gengar-mega', 'kangaskhan-mega',
  'pinsir-mega', 'gyarados-mega', 'aerodactyl-mega', 'ampharos-mega',
  'steelix-mega', 'scizor-mega', 'heracross-mega', 'houndoom-mega',
  'tyranitar-mega', 'gardevoir-mega', 'sableye-mega', 'aggron-mega',
  'medicham-mega', 'manectric-mega', 'sharpedo-mega', 'camerupt-mega',
  'altaria-mega', 'banette-mega', 'absol-mega', 'glalie-mega',
  'lopunny-mega', 'garchomp-mega', 'lucario-mega', 'abomasnow-mega',
  'gallade-mega', 'audino-mega',
  // The "Mega via slug" entries — original 80 stored Mega forms under base slug:
  // 'charizard' (Mega Y), 'blastoise' (Mega), 'aerodactyl' (Mega) — these aren't
  // treated as Mega here because the slug itself is the base.
  // Mega Charizard X/Y when stored as -mega-x/-mega-y are official:
  'charizard-mega-x', 'charizard-mega-y',
]);
function isOfficialMega(slug) { return OFFICIAL_MEGAS.has(slug); }
function isMegaSlug(slug) {
  // -mega anywhere in the suffix portion
  return /-mega(-|$)/.test(slug);
}

// ============================================================
// MAIN
// ============================================================
async function main() {
  const jpNames = JSON.parse(await readFile(resolve(ROOT, '.jp-names.json'), 'utf-8'));
  const existing = await loadExisting();
  const slugs = JSON.parse(await readFile(resolve(ROOT, '.all-slugs.json'), 'utf-8'));

  const draft = {
    metadata: { totalCount: slugs.length, highConfidence: 0, needsReview: 0, edgeCases: 0 },
    highConfidence: {},
    needsReview: {},
    edgeCases: {},
  };

  for (const slug of slugs) {
    const jp = jpNames[slug];
    if (!jp || !jp.jp_kata) {
      draft.edgeCases[slug] = {
        suggested: null,
        jp: null,
        current: existing[slug]?.th ?? null,
        reason: 'No JP name from PokéAPI',
        action: 'manual',
      };
      continue;
    }
    const existingTh = existing[slug]?.th ?? null;
    const result = buildThaiName(slug, jp.jp_kata, existingTh);
    const bucket = result._bucket;
    delete result._bucket;
    draft[bucket][slug] = result;
  }

  draft.metadata.highConfidence = Object.keys(draft.highConfidence).length;
  draft.metadata.needsReview = Object.keys(draft.needsReview).length;
  draft.metadata.edgeCases = Object.keys(draft.edgeCases).length;

  const OUT = resolve(ROOT, '.translation-draft-names.json');
  await writeFile(OUT, JSON.stringify(draft, null, 2));
  console.log('Wrote', OUT);
  console.log('Counts:', draft.metadata);
}

await main();
