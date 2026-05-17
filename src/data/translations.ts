/**
 * Thai translations for Pokemon Champions Wiki
 * UI strings + Pokemon-specific terminology (types, stats, status, common moves)
 */

// ---------- UI ----------
export const ui = {
  siteName: 'Pokémon Champions Wiki TH',
  tagline: 'คัมภีร์การแข่งขันโปเกมอนฉบับภาษาไทย',
  nav: {
    home: 'หน้าหลัก',
    pokedex: 'โปเกเด็กซ์',
    moves: 'ท่าโจมตี',
    abilities: 'ความสามารถ',
    items: 'ไอเทม',
    types: 'ระบบธาตุ',
    status: 'สถานะผิดปกติ',
    mechanics: 'กลไกการต่อสู้',
    search: 'ค้นหา…',
  },
  common: {
    type: 'ธาตุ',
    types: 'ธาตุ',
    weakness: 'อ่อนแอต่อ',
    resistance: 'ทนทานต่อ',
    immune: 'ไม่มีผลต่อ',
    stats: 'สเตตัส',
    moves: 'ท่าโจมตี',
    abilities: 'ความสามารถ',
    evolution: 'วิวัฒนาการ',
    height: 'ส่วนสูง',
    weight: 'น้ำหนัก',
    species: 'สายพันธุ์',
    category: 'หมวด',
    description: 'รายละเอียด',
    learnset: 'ท่าที่เรียนได้',
    power: 'พลัง',
    accuracy: 'ความแม่นยำ',
    pp: 'PP',
    priority: 'ลำดับก่อนหลัง',
    target: 'เป้าหมาย',
    effect: 'เอฟเฟกต์',
    flavor: 'คำบรรยาย',
    seeMore: 'ดูเพิ่มเติม',
    backTo: 'ย้อนกลับ',
    notFound: 'ไม่พบข้อมูล',
    competitiveUsage: 'การใช้งานในการแข่งขัน',
    role: 'บทบาท',
    counters: 'ตัวเคาเตอร์',
    teammates: 'เพื่อนร่วมทีม',
    tier: 'ระดับ',
    legality: 'การใช้งานที่ถูกต้อง',
    legendaryRestricted: 'ตำนาน (ใช้จำกัด)',
    physical: 'กายภาพ',
    special: 'พิเศษ',
    status_cls: 'สถานะ',
    hp: 'พลังชีวิต',
    attack: 'โจมตี',
    defense: 'ป้องกัน',
    spAttack: 'โจมตีพิเศษ',
    spDefense: 'ป้องกันพิเศษ',
    speed: 'ความเร็ว',
    totalBaseStats: 'รวมสเตตัสพื้นฐาน',
    competitiveTitle: 'ภาพรวมการแข่งขัน',
    statPoints: 'Stat Points (SP)',
    statAlignment: 'แนวสเตตัส (Stat Alignment)',
    spBudget: 'งบ SP สูงสุด 66 ต่อโปเกมอน (cap 32 ต่อ stat)',
    ivLocked: 'IV ล็อก 31 ทุกตัว',
    autoLevel: 'Auto Lv.50',
  },
  footer: {
    disclaimer:
      'เว็บไซต์นี้สร้างโดยแฟนพันธุ์แท้ Pokémon เพื่อการศึกษาเท่านั้น ไม่มีส่วนเกี่ยวข้องกับ Nintendo, Game Freak หรือ The Pokémon Company',
    dataSource: 'ข้อมูล: PokéAPI',
    builtWith: 'สร้างด้วย Astro + ❤',
  },
} as const;

// ---------- Stats ----------
export const statNames: Record<string, string> = {
  hp: 'พลังชีวิต',
  attack: 'โจมตี',
  defense: 'ป้องกัน',
  'special-attack': 'โจมตีพิเศษ',
  'special-defense': 'ป้องกันพิเศษ',
  speed: 'ความเร็ว',
};

export const statShort: Record<string, string> = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'SpA',
  'special-defense': 'SpD',
  speed: 'SPE',
};

// ---------- Types (Thai names) ----------
export const typeNames: Record<string, string> = {
  normal: 'ปกติ',
  fire: 'ไฟ',
  water: 'น้ำ',
  electric: 'ไฟฟ้า',
  grass: 'หญ้า',
  ice: 'น้ำแข็ง',
  fighting: 'ต่อสู้',
  poison: 'พิษ',
  ground: 'ดิน',
  flying: 'บิน',
  psychic: 'พลังจิต',
  bug: 'แมลง',
  rock: 'หิน',
  ghost: 'ภูตผี',
  dragon: 'มังกร',
  dark: 'ความมืด',
  steel: 'เหล็กกล้า',
  fairy: 'นางฟ้า',
};

// ---------- Damage class ----------
export const damageClassNames: Record<string, string> = {
  physical: 'กายภาพ',
  special: 'พิเศษ',
  status: 'สถานะ',
};

// ---------- Move target ----------
export const targetNames: Record<string, string> = {
  'specific-move': 'ท่าเฉพาะ',
  'selected-pokemon-me-first': 'โปเกมอนที่เลือก (ก่อน)',
  ally: 'พันธมิตร',
  'users-field': 'ฝั่งของผู้ใช้',
  'user-or-ally': 'ผู้ใช้หรือพันธมิตร',
  'opponents-field': 'ฝั่งศัตรู',
  user: 'ผู้ใช้',
  'random-opponent': 'ศัตรูแบบสุ่ม',
  'all-other-pokemon': 'โปเกมอนทั้งหมดที่ไม่ใช่ผู้ใช้',
  'selected-pokemon': 'โปเกมอนที่เลือก',
  'all-opponents': 'ศัตรูทั้งหมด',
  'entire-field': 'ทั้งสนาม',
  'user-and-allies': 'ผู้ใช้และพันธมิตร',
  'all-pokemon': 'โปเกมอนทุกตัว',
  'all-allies': 'พันธมิตรทั้งหมด',
  'fainting-pokemon': 'โปเกมอนที่หมดสติ',
};

// ---------- Generation ----------
export const generationNames: Record<string, string> = {
  'generation-i': 'รุ่นที่ 1 (Kanto)',
  'generation-ii': 'รุ่นที่ 2 (Johto)',
  'generation-iii': 'รุ่นที่ 3 (Hoenn)',
  'generation-iv': 'รุ่นที่ 4 (Sinnoh)',
  'generation-v': 'รุ่นที่ 5 (Unova)',
  'generation-vi': 'รุ่นที่ 6 (Kalos)',
  'generation-vii': 'รุ่นที่ 7 (Alola)',
  'generation-viii': 'รุ่นที่ 8 (Galar/Hisui)',
  'generation-ix': 'รุ่นที่ 9 (Paldea)',
};

// ---------- Pokemon name Thai (transliteration for common ones) ----------
// Only the most popular competitive Pokemon need manual Thai names.
// Others fall back to English/Romaji.
export const pokemonNamesTh: Record<string, string> = {
  bulbasaur: 'ฟุชิงิดาเนะ',
  ivysaur: 'ฟุชิงิโซ',
  venusaur: 'ฟุชิงิบานะ',
  charmander: 'ฮิโตคาเงะ',
  charmeleon: 'ลิซาร์โด',
  charizard: 'ลิซาร์ดอน',
  squirtle: 'เซนิกาเมะ',
  wartortle: 'คาเมล',
  blastoise: 'คาเม็กซ์',
  pikachu: 'ปิคาชู',
  raichu: 'ไรชู',
  mewtwo: 'มิวทู',
  mew: 'มิว',
  lugia: 'ลูเกีย',
  'ho-oh': 'โฮ-โอ',
  rayquaza: 'เรย์ควาซา',
  garchomp: 'การ์ชอมป์',
  lucario: 'ลูคาริโอ',
  greninja: 'เกะคโคะกะ',
  zacian: 'ซาเซียน',
  zamazenta: 'ซามาเซนตะ',
  miraidon: 'มิราอิดอน',
  koraidon: 'โคไรดอน',
  dragonite: 'ไคริว',
  tyranitar: 'บังกิรัส',
  metagross: 'เมตากรอส',
  salamence: 'โบเมนเด้อ',
  gengar: 'เกนการ์',
  gardevoir: 'ซาเน่ครอส',
  blaziken: 'บาชาโม',
  swampert: 'ลากู่ลาคุส',
  sceptile: 'จูไคน์',
  flutter_mane: 'ฟลัตเทอเมน',
  iron_hands: 'ไอรอนแฮนด์',
  urshifu: 'อุรชิฟุ',
  incineroar: 'เกาการ์',
  rillaboom: 'โกริลังเดอร์',
  amoonguss: 'โมโรบาเรล',
  indeedee: 'อินเดเด',
  grimmsnarl: 'โอโรนเก้',
  chien_pao: 'ปาโอจี้อัน',
  chi_yu: 'อี้ยูอิ',
  ting_lu: 'ดิงลู่',
  wo_chien: 'จาฮย',
  ogerpon: 'โอเงอร์พอน',
  'roaring-moon': 'โรริ่งมูน',
  'iron-valiant': 'ไอรอนวาเลียนต์',
  kingambit: 'คิงกัมบิท',
};

// ---------- Status conditions ----------
export const statusNamesTh: Record<string, string> = {
  burn: 'ไหม้',
  paralysis: 'อัมพาต',
  freeze: 'แช่แข็ง',
  poison: 'พิษ',
  'bad-poison': 'พิษร้ายแรง',
  sleep: 'หลับ',
  faint: 'หมดสติ',
  confusion: 'สับสน',
  infatuation: 'หลงรัก',
  flinch: 'สะดุ้ง',
  trap: 'ติดกับ',
};

// ---------- Categories used for filters ----------
export const tierLabelsTh: Record<string, string> = {
  s: 'S-Tier (เหนือสุด)',
  a: 'A-Tier (แข็งแกร่ง)',
  b: 'B-Tier (ใช้งานได้',
  c: 'C-Tier (เฉพาะทีม)',
  unranked: 'ยังไม่จัดอันดับ',
  restricted: 'ตำนานจำกัดสิทธิ์',
};

// ---------- Helpers ----------
export function translateType(en: string): string {
  return typeNames[en] ?? en;
}

export function translateStat(en: string): string {
  return statNames[en] ?? en;
}

export function translateStatus(en: string): string {
  return statusNamesTh[en] ?? en;
}

export function translatePokemon(en: string): string | null {
  const key = en.toLowerCase().replace(/_/g, '-');
  return pokemonNamesTh[key] ?? pokemonNamesTh[key.replace(/-/g, '_')] ?? null;
}

export function translateDamageClass(en: string): string {
  return damageClassNames[en] ?? en;
}

export function translateTarget(en: string): string {
  return targetNames[en] ?? en;
}
