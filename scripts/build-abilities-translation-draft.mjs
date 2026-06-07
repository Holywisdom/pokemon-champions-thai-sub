/**
 * Task 10 (Step 2): Build the Thai translation draft for the 80 missing
 * abilities, using:
 *   - .abilities-pokeapi-raw.json (PokéAPI English effect text)
 *   - .mon-abilities-map.json (mon→abilities reverse map from meta.ts)
 *
 * The translations table is hand-curated to match the style of the 131
 * existing entries in src/data/abilities.ts (Thai phonetic + game-term
 * mix, concise mechanics description).
 *
 * Writes: .abilities-translation-draft.json
 */
import { readFile, writeFile } from 'node:fs/promises';

const raw = JSON.parse(await readFile('.abilities-pokeapi-raw.json', 'utf-8'));
const monMap = JSON.parse(await readFile('.mon-abilities-map.json', 'utf-8'));

// Thai-translation table, keyed by ability nameEn.
// confidence: HIGH | REVIEW | PC
// Each entry: { nameTh, description, category, confidence, note? }
const TRANSLATIONS = {
  // ============ OFFENSE ============
  'Aerilate': {
    nameTh: 'แอริเลต',
    description: 'ท่า Normal เปลี่ยนเป็น Flying + พลัง x1.2',
    category: 'offense',
    confidence: 'HIGH',
  },
  'Refrigerate': {
    nameTh: 'รีฟริจเจอเรต',
    description: 'ท่า Normal เปลี่ยนเป็น Ice + พลัง x1.2',
    category: 'offense',
    confidence: 'HIGH',
  },
  'Analytic': {
    nameTh: 'อะนาลิติก',
    description: 'เมื่อขยับเป็นตัวสุดท้ายในเทิร์น ท่าโจมตีพลัง x1.3',
    category: 'offense',
    confidence: 'HIGH',
  },
  'Anger Point': {
    nameTh: 'แองเกอร์พอยต์',
    description: 'เมื่อโดน critical hit Atk พุ่งทันทีเป็น +6 stages',
    category: 'offense',
    confidence: 'HIGH',
  },
  'Berserk': {
    nameTh: 'เบอร์เซิร์ก',
    description: 'เมื่อ HP ตกลงต่ำกว่า 1/2 จากท่าโจมตี SpA +1 stage อัตโนมัติ',
    category: 'offense',
    confidence: 'HIGH',
  },
  'Compound Eyes': {
    nameTh: 'คอมพาวด์อายส์',
    description: 'Accuracy ของท่าทั้งหมด x1.3 (เช่น Hypnosis 60% → 78%, Hurricane 70% → 91%)',
    category: 'offense',
    confidence: 'HIGH',
  },
  'Dry Skin': {
    nameTh: 'ดรายสกิน',
    description: 'ไม่โดนท่าน้ำ + ฟื้น HP 25% เมื่อถูก absorb; ในฝนฟื้น HP 1/8 ต่อเทิร์น; ในแดดเสีย HP 1/8 ต่อเทิร์น; ท่าไฟพลังเพิ่ม x1.25',
    category: 'offense',
    confidence: 'HIGH',
  },
  'Electromorphosis': {
    nameTh: 'อิเล็คโทรมอร์โฟซิส',
    description: 'เมื่อโดนท่าโจมตี ติด Charge — ท่าธาตุไฟฟ้าครั้งถัดไปพลัง x2',
    category: 'offense',
    confidence: 'HIGH',
  },
  'Fairy Aura': {
    nameTh: 'แฟรี่ออร่า',
    description: 'ท่าธาตุ Fairy ของทุกตัวในสนาม พลัง x1.33',
    category: 'offense',
    confidence: 'HIGH',
  },
  'Huge Power': {
    nameTh: 'ฮิวจ์พาวเวอร์',
    description: 'Atk ของผู้ใช้ x2',
    category: 'offense',
    confidence: 'HIGH',
  },
  'Pure Power': {
    nameTh: 'เพียวพาวเวอร์',
    description: 'Atk ของผู้ใช้ x2 (เหมือน Huge Power)',
    category: 'offense',
    confidence: 'HIGH',
  },
  'Hustle': {
    nameTh: 'ฮัสเซิล',
    description: 'Atk x1.5 แต่ accuracy ของท่ากายภาพลด 20%',
    category: 'offense',
    confidence: 'HIGH',
  },
  'Reckless': {
    nameTh: 'เร็คเคลส',
    description: 'ท่าที่มี recoil (Brave Bird, Double-Edge, Wood Hammer) พลัง x1.2',
    category: 'offense',
    confidence: 'HIGH',
  },
  'Rivalry': {
    nameTh: 'ไรเวิลรี่',
    description: 'ดาเมจต่อเป้าหมายเพศเดียวกัน x1.25 / เพศตรงข้าม x0.75',
    category: 'offense',
    confidence: 'HIGH',
  },
  'Sharpness': {
    nameTh: 'ชาร์ปเนส',
    description: 'ท่าใบมีด (slicing — Sacred Sword, Psycho Cut, Cross Poison ฯลฯ) พลัง x1.5',
    category: 'offense',
    confidence: 'HIGH',
  },
  'Skill Link': {
    nameTh: 'สกิลลิงค์',
    description: 'ท่า multi-hit (Bullet Seed, Rock Blast, Tail Slap) ตี 5 ครั้งเสมอ',
    category: 'offense',
    confidence: 'HIGH',
  },
  'Strong Jaw': {
    nameTh: 'สตรองจอว์',
    description: 'ท่ากัด (Crunch, Ice Fang, Fire Fang, Psychic Fangs ฯลฯ) พลัง x1.5',
    category: 'offense',
    confidence: 'HIGH',
  },
  'Super Luck': {
    nameTh: 'ซูเปอร์ลัค',
    description: 'อัตราการ critical hit +1 stage',
    category: 'offense',
    confidence: 'HIGH',
  },
  'Tough Claws is omitted (already exists)': null,
  'Water Bubble': {
    nameTh: 'วอเตอร์บับเบิ้ล',
    description: 'ท่าธาตุน้ำของผู้ใช้พลัง x2 + ลดดาเมจท่าไฟ 50% + ไม่ติด burn',
    category: 'offense',
    confidence: 'HIGH',
  },
  'Lightning Rod': {
    nameTh: 'ไลท์นิ่งร็อด',
    description: 'ดูดท่าไฟฟ้าทั้งหมดในสนาม (รวมพันธมิตร) + SpA +1 stage เมื่อโดน',
    category: 'utility',
    confidence: 'HIGH',
  },
  'Justified': {
    nameTh: 'จัสติฟายด์',
    description: 'เมื่อโดนท่าธาตุ Dark Atk +1 stage',
    category: 'offense',
    confidence: 'HIGH',
  },
  'Innards Out': {
    nameTh: 'อินนาร์ดส์เอาท์',
    description: 'เมื่อโดน KO ผู้โจมตีเสีย HP เท่ากับ HP ที่เหลือก่อนหมดสติ',
    category: 'offense',
    confidence: 'HIGH',
  },
  'Supersweet Syrup': {
    nameTh: 'ซูเปอร์สวีทไซรัป',
    description: 'เมื่อลงสนามครั้งแรก ลด Evasion ของศัตรู 1 stage',
    category: 'offense',
    confidence: 'HIGH',
  },

  // ============ DEFENSE ============
  'Aftermath': {
    nameTh: 'อาฟเตอร์แมท',
    description: 'เมื่อโดน KO ด้วย contact move ผู้โจมตีเสีย HP 1/4',
    category: 'defense',
    confidence: 'HIGH',
  },
  'Aroma Veil': {
    nameTh: 'อโรมาเวล',
    description: 'ป้องกันตัวเองและพันธมิตรในเกมคู่จากท่ารบกวนจิตใจ (Taunt, Encore, Disable, Torment, Heal Block, Attract)',
    category: 'defense',
    confidence: 'HIGH',
  },
  'Big Pecks': {
    nameTh: 'บิ๊กเป็คส์',
    description: 'ป้องกัน Def drops จากฝ่ายตรงข้าม',
    category: 'defense',
    confidence: 'HIGH',
  },
  'Bulletproof': {
    nameTh: 'บูลเล็ตพรูฟ',
    description: 'ป้องกันท่ากระสุน/ลูกบอล (Shadow Ball, Sludge Bomb, Focus Blast, Aura Sphere, Pyro Ball ฯลฯ)',
    category: 'defense',
    confidence: 'HIGH',
  },
  'Cloud Nine': {
    nameTh: 'คลาวด์ไนน์',
    description: 'เพิกเฉยผลของสภาพอากาศทั้งหมดในสนาม',
    category: 'defense',
    confidence: 'HIGH',
  },
  'Earth Eater': {
    nameTh: 'เอิร์ธอีตเตอร์',
    description: 'ไม่โดนท่าธาตุดิน + ฟื้น HP 25% เมื่อถูก absorb',
    category: 'defense',
    confidence: 'HIGH',
  },
  'Filter': {
    nameTh: 'ฟิลเตอร์',
    description: 'ลดดาเมจจากท่า super effective 25%',
    category: 'defense',
    confidence: 'HIGH',
  },
  'Solid Rock': {
    nameTh: 'โซลิดร็อค',
    description: 'ลดดาเมจจากท่า super effective 25% (เหมือน Filter)',
    category: 'defense',
    confidence: 'HIGH',
  },
  'Fur Coat': {
    nameTh: 'เฟอร์โค้ท',
    description: 'Def ของผู้ใช้ x2',
    category: 'defense',
    confidence: 'HIGH',
  },
  'Heavy Metal': {
    nameTh: 'เฮฟวี่เมทัล',
    description: 'น้ำหนักของผู้ใช้ x2 — โดน Heavy Slam/Heat Crash หนักขึ้น และเลี่ยง Low Kick/Grass Knot ง่ายขึ้น',
    category: 'defense',
    confidence: 'HIGH',
  },
  'Light Metal': {
    nameTh: 'ไลท์เมทัล',
    description: 'น้ำหนักของผู้ใช้ x0.5 — ลดดาเมจ Heavy Slam/Heat Crash ที่รับ',
    category: 'defense',
    confidence: 'HIGH',
  },
  'Magma Armor': {
    nameTh: 'แมกม่าอาร์เมอร์',
    description: 'ไม่ติดสถานะ frozen',
    category: 'defense',
    confidence: 'HIGH',
  },
  'Overcoat': {
    nameTh: 'โอเวอร์โค้ท',
    description: 'ไม่รับดาเมจจากพายุทราย/หิมะ + ป้องกันท่าฝุ่น/สปอร์ (Spore, Sleep Powder, Rage Powder)',
    category: 'defense',
    confidence: 'HIGH',
  },
  'Shed Skin': {
    nameTh: 'เชดสกิน',
    description: 'ทุกเทิร์น 33% โอกาสรักษาสถานะตัวเอง',
    category: 'defense',
    confidence: 'HIGH',
  },
  'Shield Dust': {
    nameTh: 'ชีลด์ดัสต์',
    description: 'ป้องกัน secondary effect จากท่าโจมตีของฝ่ายตรงข้าม (เช่น Scald burn, Iron Head flinch)',
    category: 'defense',
    confidence: 'HIGH',
  },
  'Soundproof': {
    nameTh: 'ซาวด์พรูฟ',
    description: 'ป้องกันท่าเสียงทั้งหมด (Hyper Voice, Boomburst, Snarl, Sing, Perish Song)',
    category: 'defense',
    confidence: 'HIGH',
  },
  'Static': {
    nameTh: 'สแตติก',
    description: 'ผู้โจมตีระยะประชิด (contact) โอกาส 30% ติดอัมพาต',
    category: 'defense',
    confidence: 'HIGH',
  },
  'Steadfast': {
    nameTh: 'สเตดฟาสต์',
    description: 'เมื่อ flinch Speed +1 stage',
    category: 'defense',
    confidence: 'HIGH',
  },
  'Sticky Hold': {
    nameTh: 'สติ๊กกี้โฮลด์',
    description: 'ป้องกันการขโมยและสลับไอเทม (Trick, Switcheroo, Knock Off, Thief)',
    category: 'defense',
    confidence: 'HIGH',
  },
  'Vital Spirit': {
    nameTh: 'ไวทอลสปิริต',
    description: 'ไม่ติดสถานะหลับ',
    category: 'defense',
    confidence: 'HIGH',
  },
  'Stall': {
    nameTh: 'สตอลล์',
    description: 'ผู้ใช้ขยับเป็นตัวสุดท้ายเสมอใน priority bracket เดียวกัน',
    category: 'defense',
    confidence: 'HIGH',
  },
  'Tangled Feet': {
    nameTh: 'แทงเกิ้ลฟีต',
    description: 'Evasion x2 เมื่อ confused',
    category: 'defense',
    confidence: 'HIGH',
  },
  'Telepathy': {
    nameTh: 'เทเลพาธี',
    description: 'ไม่รับดาเมจจากท่าโจมตีของพันธมิตรในเกมคู่',
    category: 'defense',
    confidence: 'HIGH',
  },

  // ============ WEATHER ============
  'Forecast': {
    nameTh: 'ฟอร์คาสต์',
    description: 'Castform เปลี่ยนธาตุตามสภาพอากาศ (Fire ในแดด, Water ในฝน, Ice ในหิมะ)',
    category: 'weather',
    confidence: 'HIGH',
  },
  'Harvest': {
    nameTh: 'ฮาร์เวสต์',
    description: 'ทุกเทิร์น 50% โอกาสฟื้น Berry ที่ใช้ไปแล้ว (100% ในแดดจ้า)',
    category: 'weather',
    confidence: 'HIGH',
  },
  'Sand Spit': {
    nameTh: 'แซนด์สปิต',
    description: 'เมื่อโดนท่าโจมตี สร้างพายุทรายอัตโนมัติ',
    category: 'weather',
    confidence: 'HIGH',
  },

  // ============ TERRAIN ============
  'Mimicry': {
    nameTh: 'มิมิครี่',
    description: 'เปลี่ยนธาตุของผู้ใช้ตาม terrain ปัจจุบัน (Electric=Electric, Grassy=Grass, Misty=Fairy, Psychic=Psychic)',
    category: 'terrain',
    confidence: 'HIGH',
  },

  // ============ UTILITY ============
  'Early Bird': {
    nameTh: 'เออร์ลี่เบิร์ด',
    description: 'หลับลึกครึ่งเดียว — ตื่นเร็วเป็น 2 เท่า',
    category: 'utility',
    confidence: 'HIGH',
  },
  'Frisk': {
    nameTh: 'ฟริสก์',
    description: 'เมื่อลงสนาม เปิดเผยไอเทมของฝ่ายตรงข้าม',
    category: 'utility',
    confidence: 'HIGH',
  },
  'Gooey': {
    nameTh: 'กูอี้',
    description: 'ผู้โจมตีระยะประชิด (contact) โดน Speed -1 stage',
    category: 'utility',
    confidence: 'REVIEW',
    note: 'Thai phonetic choice: กูอี้ (preferred) vs กูวี่ — confirm preferred style',
  },
  'Hunger Switch': {
    nameTh: 'ฮังเกอร์สวิตช์',
    description: 'Morpeko สลับร่าง Full Belly Mode / Hangry Mode ทุกเทิร์น (เปลี่ยนธาตุของ Aura Wheel)',
    category: 'utility',
    confidence: 'REVIEW',
    note: 'Thai phonetic for "Switch" — ฮังเกอร์สวิตช์ vs ฮังเกอร์สวิทช์; verify community preference',
  },
  'Illuminate': {
    nameTh: 'อิลลูมิเนต',
    description: 'ป้องกันการลด accuracy + ทำให้พบโปเกมอนป่าง่ายขึ้น',
    category: 'utility',
    confidence: 'HIGH',
  },
  'Illusion': {
    nameTh: 'อิลลูชั่น',
    description: 'ลงสนามในร่างของโปเกมอนตัวสุดท้ายในทีม — ร่างพังเมื่อโดนท่าโจมตี',
    category: 'utility',
    confidence: 'HIGH',
  },
  'Imposter': {
    nameTh: 'อิมโพสเตอร์',
    description: 'เมื่อลงสนาม Transform เป็นฝ่ายตรงข้ามทันที (ก็อปทุกอย่างยกเว้น HP)',
    category: 'utility',
    confidence: 'HIGH',
  },
  'Klutz': {
    nameTh: 'คลัตซ์',
    description: 'ผู้ใช้ไม่สามารถใช้ผลของไอเทมที่ถือได้ (ใช้คู่ Switcheroo + Choice item เพื่อปล่อย debuff)',
    category: 'utility',
    confidence: 'REVIEW',
    note: 'Thai phonetic for final -tz cluster is awkward — คลัตซ์ vs คลัทซ์ vs คลัซ',
  },
  'Minus': {
    nameTh: 'ไมนัส',
    description: 'SpA x1.5 เมื่อมีพันธมิตรในเกมคู่ที่มี Plus/Minus',
    category: 'utility',
    confidence: 'HIGH',
  },
  'Plus': {
    nameTh: 'พลัส',
    description: 'SpA x1.5 เมื่อมีพันธมิตรในเกมคู่ที่มี Plus/Minus',
    category: 'utility',
    confidence: 'HIGH',
  },
  'Motor Drive': {
    nameTh: 'มอเตอร์ไดร์ฟ',
    description: 'ไม่โดนท่าไฟฟ้า + Speed +1 stage เมื่อถูก absorb',
    category: 'speed',
    confidence: 'HIGH',
  },
  'Mummy': {
    nameTh: 'มัมมี่',
    description: 'ผู้โจมตีระยะประชิด (contact) เปลี่ยนความสามารถเป็น Mummy',
    category: 'utility',
    confidence: 'HIGH',
  },
  'Opportunist': {
    nameTh: 'ออปพอร์ทูนิสต์',
    description: 'เมื่อฝ่ายตรงข้ามได้ stat boost ผู้ใช้ได้ stat boost เดียวกัน',
    category: 'utility',
    confidence: 'HIGH',
  },
  'Pickup': {
    nameTh: 'พิคอัพ',
    description: 'หลังจบเทิร์น ถ้าฝ่ายตรงข้ามใช้ไอเทม ผู้ใช้เก็บมาถือได้',
    category: 'utility',
    confidence: 'HIGH',
  },
  'Poison Point': {
    nameTh: 'พอยซันพอยต์',
    description: 'ผู้โจมตีระยะประชิด (contact) โอกาส 30% ติดพิษ',
    category: 'defense',
    confidence: 'HIGH',
  },
  'Queenly Majesty': {
    nameTh: 'ควีนลี่มาเจสตี้',
    description: 'ป้องกันท่า priority ของฝ่ายตรงข้าม (Fake Out, Sucker Punch, Quick Attack)',
    category: 'utility',
    confidence: 'HIGH',
  },
  'Quick Draw': {
    nameTh: 'ควิกดรอว์',
    description: 'ทุกเทิร์น 30% โอกาสขยับก่อนปกติ (priority +1 บางเทิร์น)',
    category: 'speed',
    confidence: 'HIGH',
  },
  'Receiver': {
    nameTh: 'รีซีฟเวอร์',
    description: 'เมื่อพันธมิตรในเกมคู่หมดสติ รับความสามารถของตัวนั้นต่อ',
    category: 'utility',
    confidence: 'HIGH',
  },
  'Ripen': {
    nameTh: 'ไรเพ่น',
    description: 'ผลของ Berry มีพลัง x2 (เช่น Sitrus Berry ฟื้น HP 50% แทน 25%)',
    category: 'utility',
    confidence: 'HIGH',
  },
  'Screen Cleaner': {
    nameTh: 'สกรีนคลีนเนอร์',
    description: 'เมื่อลงสนาม ลบ Light Screen, Reflect, Aurora Veil ของทั้งสองฝั่ง',
    category: 'utility',
    confidence: 'HIGH',
  },
  'Stench': {
    nameTh: 'สเตนช์',
    description: 'ท่าโจมตีโอกาส 10% ทำให้ flinch (ไม่สแต็กกับ secondary flinch อื่น)',
    category: 'utility',
    confidence: 'HIGH',
  },
  'Sweet Veil': {
    nameTh: 'สวีทเวล',
    description: 'ผู้ใช้และพันธมิตรในเกมคู่ไม่ติดสถานะหลับ',
    category: 'defense',
    confidence: 'HIGH',
  },
  'Symbiosis': {
    nameTh: 'ซิมไบโอซิส',
    description: 'เมื่อพันธมิตรในเกมคู่ใช้ไอเทมหมด ผู้ใช้ยื่นไอเทมของตัวเองให้',
    category: 'utility',
    confidence: 'HIGH',
  },
  'Wandering Spirit': {
    nameTh: 'วอนเดอริ่งสปิริต',
    description: 'เมื่อโดน contact move สลับความสามารถกับผู้โจมตี',
    category: 'utility',
    confidence: 'HIGH',
  },

  // ============ SPEED ============
  'Surge Surfer': {
    nameTh: 'เซิร์จเซิร์ฟเฟอร์',
    description: 'Speed x2 ขณะ Electric Terrain',
    category: 'speed',
    confidence: 'HIGH',
  },
  'Zero To Hero': {
    nameTh: 'ซีโร่ทูฮีโร่',
    description: 'Palafin Zero Form สลับเป็น Hero Form เมื่อสลับออกแล้วกลับเข้า — สเตตัสจู่โจมสูงขึ้นมาก',
    category: 'offense',
    confidence: 'HIGH',
  },

  // ============ NEEDS REVIEW (ambiguous transliteration) ============
  // none — all standard abilities have established Thai transliteration

  // ============ PC-SPECIFIC (mechanic inferred) ============
  'Dragonize': {
    nameTh: 'ดรากอไนซ์',
    description: 'PC-exclusive: ท่า Normal เปลี่ยนเป็น Dragon + พลัง x1.2 (คู่ขนานกับ Aerilate/Pixilate/Refrigerate)',
    category: 'offense',
    confidence: 'PC',
    note: 'Effect inferred from parallel -ate abilities. Verify exact multiplier from PC source.',
  },
  'Mega Sol': {
    nameTh: 'เมก้าซอล',
    description: 'PC-exclusive (Mega Meganium): คาดว่าสร้าง/ขยาย Sun เมื่อ Mega Evolution — รายละเอียดยังไม่ยืนยัน',
    category: 'weather',
    confidence: 'PC',
    note: 'Mechanic guessed from name (sol = sun) + sole user Mega Meganium. Verify from PC source.',
  },
  'Piercing Drill': {
    nameTh: 'เพียร์ซิ่งดริลล์',
    description: 'PC-exclusive (Mega Excadrill): คาดว่าท่าเจาะ/หมุน (drill moves) ทะลุ defense boost ของเป้าหมาย — รายละเอียดยังไม่ยืนยัน',
    category: 'offense',
    confidence: 'PC',
    note: 'Mechanic guessed from name + Excadrill flavor (drill moves). Verify from PC source.',
  },
  'Spicy Spray': {
    nameTh: 'สไปซี่สเปรย์',
    description: 'PC-exclusive (Mega Scovillain): คาดว่าท่าไฟกระจายแบบ spread หรือเพิ่มอัตรา burn — รายละเอียดยังไม่ยืนยัน',
    category: 'offense',
    confidence: 'PC',
    note: 'Mechanic guessed from name + Scovillain (chili pepper) flavor. Verify from PC source.',
  },
};

// Remove sentinel
delete TRANSLATIONS['Tough Claws is omitted (already exists)'];

const missingList = raw.map((r) => r.nameEn);

// Verify all 80 missing abilities have a translation
const untranslated = missingList.filter((n) => !TRANSLATIONS[n]);
if (untranslated.length > 0) {
  console.error('ERROR: missing translations for:');
  untranslated.forEach((n) => console.error(' -', n));
  process.exit(1);
}

// Build the draft
const high = {};
const review = {};
const pc = {};

for (const r of raw) {
  const t = TRANSLATIONS[r.nameEn];
  const users = (monMap[r.nameEn] || []).slice(0, 4);
  const entry = {
    nameEn: r.nameEn,
    nameTh: t.nameTh,
    description: t.description,
    category: t.category,
    notableUsers: users,
    sourceEffect: r.shortEffect || r.effect || '(PC-specific — not in PokéAPI)',
  };
  if (t.note) entry.note = t.note;

  if (t.confidence === 'PC') {
    entry.needsConfirmation = t.note || 'Inferred mechanic — verify from PC source';
    pc[r.slug] = entry;
  } else if (t.confidence === 'REVIEW') {
    entry.reviewReason = t.note || 'Ambiguous transliteration';
    review[r.slug] = entry;
  } else {
    high[r.slug] = entry;
  }
}

const total = Object.keys(high).length + Object.keys(review).length + Object.keys(pc).length;

const out = {
  metadata: {
    total,
    highConfidence: Object.keys(high).length,
    needsReview: Object.keys(review).length,
    pcSpecific: Object.keys(pc).length,
    generatedAt: new Date().toISOString(),
  },
  highConfidence: high,
  needsReview: review,
  pcSpecific: pc,
};

await writeFile('.abilities-translation-draft.json', JSON.stringify(out, null, 2));
console.log('Wrote .abilities-translation-draft.json');
console.log(`  total:          ${total}`);
console.log(`  highConfidence: ${out.metadata.highConfidence}`);
console.log(`  needsReview:    ${out.metadata.needsReview}`);
console.log(`  pcSpecific:     ${out.metadata.pcSpecific}`);
