/**
 * Core battle mechanics for Pokemon Champions competitive play
 * (Thai explanations of damage calc, stat stages, EV/IV, turn order, etc.)
 */

export interface MechanicSection {
  id: string;
  title: string;
  icon: string;
  summary: string;
  content: {
    heading?: string;
    body: string;
    list?: string[];
    formula?: string;
  }[];
}

export const mechanics: MechanicSection[] = [
  {
    id: 'damage-calc',
    title: 'การคำนวณดาเมจ',
    icon: '⚔️',
    summary: 'สูตรพื้นฐานในการคำนวณความเสียหายต่อโปเกมอน',
    content: [
      {
        heading: 'สูตรหลัก',
        body: 'ดาเมจในเกมโปเกมอนคำนวณจากสูตรต่อไปนี้ (Gen 5+):',
        formula:
          'Damage = ((2 × Level / 5 + 2) × Power × A/D / 50 + 2) × Modifier',
      },
      {
        heading: 'Modifier ประกอบด้วย',
        body: 'ตัวคูณเพิ่ม/ลดดาเมจจากปัจจัยต่าง ๆ',
        list: [
          'Targets (Doubles): x0.75 ถ้าโจมตีหลายตัว',
          'Weather: x1.5 (เช่น Fire ในแดดจ้า)',
          'Critical Hit: x1.5 (Gen 6+)',
          'STAB (Same Type Attack Bonus): x1.5 หรือ x2 ถ้า Adaptability',
          'Type Effectiveness: x0.25 / x0.5 / x1 / x2 / x4',
          'Burn: x0.5 ดาเมจกายภาพ',
          'Other (Item/Ability modifiers): Choice Band x1.5, Life Orb x1.3, etc.',
        ],
      },
      {
        heading: 'Random Factor',
        body: 'ทุกการโจมตีมีค่า random 0.85 - 1.00 (16 ค่า) ทำให้ดาเมจไม่คงที่ ใช้ damage calculator เพื่อดูช่วงดาเมจที่เป็นไปได้',
      },
    ],
  },
  {
    id: 'stats-sp',
    title: 'สเตตัส และ Stat Points (SP)',
    icon: '📊',
    summary: 'ระบบ Stat Points ใหม่ของ Champions (ไม่ใช้ EV/IV)',
    content: [
      {
        heading: '⚠️ Champions ไม่ใช้ระบบ EV/IV แบบเกมหลัก',
        body: 'Pokémon Champions เปลี่ยนระบบปรับสเตตัสจาก EV/IV/Nature เป็นระบบใหม่ที่เรียกว่า Stat Points (SP) ทำให้ลองทีมและปรับ build ได้เร็วกว่ามาก',
      },
      {
        heading: 'Base Stats (ค่าพื้นฐาน)',
        body: 'ค่าพื้นฐานของโปเกมอนแต่ละสายพันธุ์ — 6 ค่า: HP, Atk, Def, SpA, SpD, Spe ผลรวม (BST) อยู่ในช่วง 200-720 — Base Stats ใน Champions เหมือนเกมหลักทุกประการ (เช่น Garchomp ยังคือ 108 HP / 130 Atk)',
      },
      {
        heading: 'Stat Points (SP) — แทน EV',
        body: 'ผู้เล่นได้ Budget 66 SP กระจายลงสเตตัส 6 ช่อง โดย cap ที่ 32 SP ต่อช่อง — เทียบเท่ากับ EV เดิม 510/252 แบบหารด้วย ~8',
        list: [
          'รวมสูงสุด 66 SP ต่อโปเกมอน 1 ตัว',
          'แต่ละ stat: 0-32 SP',
          'สเปรดยอดนิยม: 32/32/2 (เน้น 2 stats หลัก + 2 SP เพิ่มเติม)',
          'Bulk spread: 32 HP / 32 Def / 2 SpD',
          'Trick Room: ใส่ 0 SP Speed',
          'รีเซ็ตได้ตลอดเวลา ผ่านเมนู — ไม่ต้อง breed ใหม่',
          'ราคา: 5 VP (Victory Points) ต่อ SP — รวม 330 VP สำหรับ max',
        ],
      },
      {
        heading: 'IVs — ล็อก 31 ทุกตัว',
        body: 'IV (Individual Values) ไม่มีในระบบ Champions ทุกโปเกมอนได้ IV 31 ทุกค่าโดยอัตโนมัติ ไม่ต้อง breed, ไม่ต้อง Hyper Train, ไม่ต้องเช็คค่า — ทำให้ทุกคนเริ่มต้นเท่ากัน',
        list: [
          'ไม่มี Bottle Cap / Hyper Training',
          'ไม่มี HP IV ตั้ง 30 เพื่อ Hidden Power',
          'IV Speed 0 สำหรับ Trick Room ใช้ "Stat Alignment" ลด Speed แทน',
        ],
      },
      {
        heading: 'Stat Alignment — แทน Nature',
        body: 'ระบบเดิม "Nature" ถูกเปลี่ยนชื่อเป็น Stat Alignment เพิ่ม/ลดสเตตัส x1.1/x0.9 เหมือนเดิม แต่เปลี่ยนได้ฟรีผ่านเมนู (จ่าย VP)',
        list: [
          'Adamant: +Atk -SpA (Physical attacker)',
          'Modest: +SpA -Atk (Special attacker)',
          'Jolly: +Spe -SpA (Physical fast)',
          'Timid: +Spe -Atk (Special fast)',
          'Bold: +Def -Atk (Physical wall)',
          'Calm: +SpD -Atk (Special wall)',
          'Impish: +Def -SpA',
          'Careful: +SpD -SpA',
          'Brave / Relaxed / Quiet / Sassy: ลด Speed (สำหรับ Trick Room)',
          'Neutral: เหลือเฉพาะ "Serious" (ไม่บูสต์ ไม่ลด)',
        ],
      },
      {
        heading: 'Level — Auto-scale 50',
        body: 'โปเกมอนทุกตัวถูกปรับเป็น Level 50 อัตโนมัติเมื่อเข้าแบทเทิล Ranked — ไม่ต้อง grind EXP เหมือนเกมหลัก',
      },
      {
        heading: 'การโอนจาก Pokémon HOME',
        body: 'โปเกมอนจาก HOME โอนเข้ามาได้ — Nature/Form/Shiny/Moveset ถูก carry over แต่ EVs/IVs จะถูก reset เป็นระบบ SP ของ Champions อัตโนมัติ',
      },
    ],
  },
  {
    id: 'stat-stages',
    title: 'Stat Stages (การเพิ่ม/ลดสเตตัส)',
    icon: '📈',
    summary: 'ระบบ Stat Boost/Debuff (-6 ถึง +6)',
    content: [
      {
        heading: 'ระดับ stage',
        body: 'แต่ละ stat (ยกเว้น HP) สามารถปรับเพิ่ม/ลดได้ -6 ถึง +6 ในระหว่างต่อสู้',
      },
      {
        heading: 'ตัวคูณ',
        body: 'Atk, Def, SpA, SpD, Spe ใช้ตัวคูณนี้:',
        list: [
          '+6: x4.0 (เพิ่มสุด)',
          '+5: x3.5',
          '+4: x3.0',
          '+3: x2.5',
          '+2: x2.0',
          '+1: x1.5',
          '0: x1.0 (ปกติ)',
          '-1: x0.66',
          '-2: x0.5',
          '-3: x0.4',
          '-4: x0.33',
          '-5: x0.28',
          '-6: x0.25 (ลดสุด)',
        ],
      },
      {
        heading: 'Accuracy / Evasion',
        body: 'ค่า Accuracy (ของผู้โจมตี) และ Evasion (ของเป้าหมาย) ใช้สูตรต่างจาก stat อื่น โดย +1 = x1.33, +2 = x1.66, ... สูงสุด x3 (+6) และต่ำสุด x0.33 (-6)',
      },
      {
        heading: 'รีเซ็ตเมื่อ',
        body: 'Stat stage จะรีเซ็ตเมื่อสลับโปเกมอน หรือเจอท่า Haze, Clear Smog, Roar/Whirlwind',
      },
    ],
  },
  {
    id: 'turn-order',
    title: 'ลำดับการเล่นในเทิร์น',
    icon: '⏱️',
    summary: 'ใครเล่นก่อน-หลัง ขึ้นกับ Priority, Speed, และ Trick Room',
    content: [
      {
        heading: 'Priority',
        body: 'ท่ามีระดับ priority ตั้งแต่ -7 ถึง +5 ท่าที่ priority สูงกว่าจะใช้ก่อนเสมอ (โดยไม่นับความเร็ว)',
        list: [
          '+5: Helping Hand',
          '+4: Protect, Detect, Endure, Magic Coat',
          '+3: Fake Out, Quick Guard, Wide Guard, Crafty Shield',
          '+2: Extreme Speed, First Impression',
          '+1: Quick Attack, Aqua Jet, Bullet Punch, Sucker Punch, Mach Punch, Ice Shard, Shadow Sneak, Vacuum Wave',
          '0: ท่าทั่วไป',
          '-1: Vital Throw',
          '-3: Focus Punch (charge)',
          '-4: Avalanche, Revenge',
          '-5: Counter, Mirror Coat',
          '-6: Roar, Whirlwind, Circle Throw, Dragon Tail',
          '-7: Trick Room (ใช้ใน turn order)',
        ],
      },
      {
        heading: 'Speed',
        body: 'ถ้า priority เท่ากัน จะใช้ Speed ที่สูงกว่าก่อน ในกรณี speed เท่ากันให้สุ่ม (Speed Tie)',
      },
      {
        heading: 'Trick Room',
        body: 'ท่า Trick Room กลับลำดับ Speed - โปเกมอนที่ช้าจะเล่นก่อน คงอยู่ 5 เทิร์น มี priority -7 (ใช้ทีหลังเสมอ)',
      },
    ],
  },
  {
    id: 'critical-hit',
    title: 'Critical Hit',
    icon: '💥',
    summary: 'การโจมตีเหนือชั้นที่เพิ่มดาเมจ x1.5',
    content: [
      {
        heading: 'อัตราการเกิด',
        body: 'Gen 6+: ท่าทั่วไปมีโอกาส 1/24 (4.17%) - Critical Hit เพิ่มดาเมจ x1.5',
      },
      {
        heading: 'การเพิ่มอัตรา',
        body: 'มีหลายวิธีเพิ่มโอกาส crit',
        list: [
          'High Crit Ratio (Slash, Stone Edge, Karate Chop, etc.): 1/8 (12.5%)',
          'Razor Claw / Scope Lens: +1 stage = 1/8',
          'Focus Energy: +2 stages = 1/2',
          'Super Luck ability: +1 stage',
          'Lansat Berry: +2 stages เมื่อ HP ต่ำ',
          'Frigibax line + Sniper ability: crit ดาเมจ x2.25 แทน x1.5',
        ],
      },
      {
        heading: 'Critical Hit ไม่นับ',
        body: 'Stat reductions (Atk debuff ของผู้โจมตี / Def buff ของเป้าหมาย) ทำให้ทะลุการป้องกัน',
      },
    ],
  },
  {
    id: 'abilities',
    title: 'Abilities สำคัญใน Meta',
    icon: '⭐',
    summary: 'ความสามารถยอดนิยมในการแข่งขัน',
    content: [
      {
        heading: 'Damage Boost',
        body: 'เพิ่มพลังของท่า',
        list: [
          'Adaptability: STAB x2 แทน x1.5',
          'Sheer Force: ท่ามี secondary effect ได้ x1.3 พลัง',
          'Tinted Lens: ท่าที่ไม่ค่อยมีผล (x0.5) เพิ่มเป็น x1',
          'Sniper: Critical hit ดาเมจ x2.25',
          'Iron Fist: ท่ากำปั้น x1.2',
          'Hadron Engine (Miraidon): สร้าง Electric Terrain + SpA boost',
          'Orichalcum Pulse (Koraidon): สร้างแดดจ้า + Atk boost',
        ],
      },
      {
        heading: 'Defensive',
        body: 'เพิ่มความทนทาน',
        list: [
          'Magic Guard: ไม่โดนดาเมจจากแหล่งที่ไม่ใช่ท่าโจมตี (พิษ, ไหม้, hazard, sandstorm, etc.)',
          'Multiscale / Shadow Shield: ดาเมจครึ่งเมื่อ HP เต็ม',
          'Unaware: เพิกเฉย stat boost ของฝ่ายตรงข้าม',
          'Levitate: ไม่โดนท่าธาตุดิน',
          'Wonder Guard: โดนเฉพาะท่าที่ super effective',
          'Disguise (Mimikyu): บล็อกการโจมตีครั้งแรก',
        ],
      },
      {
        heading: 'Setup / Utility',
        body: 'ความสามารถสนับสนุนทีม',
        list: [
          'Intimidate: ลด Atk ของศัตรู 1 stage เมื่อลงสนาม',
          'Drought / Drizzle / Sand Stream / Snow Warning: สร้างสภาพอากาศ',
          'Electric Surge / Grassy Surge / etc.: สร้าง terrain',
          'Prankster: ท่าสถานะมี priority +1',
          'Speed Boost: ความเร็ว +1 ทุกเทิร์น',
          'Protean / Libero: เปลี่ยนธาตุตามท่าที่ใช้ (Gen 9: ใช้ครั้งเดียวต่อสนาม)',
        ],
      },
    ],
  },
  {
    id: 'team-building',
    title: 'หลักการสร้างทีม',
    icon: '🎯',
    summary: 'แนวคิดในการสร้างทีม competitive ที่แข็งแกร่ง',
    content: [
      {
        heading: 'Archetype (Pokémon Champions Reg M-A)',
        body: 'รูปแบบทีมยอดนิยมใน Doubles',
        list: [
          'Sun Team: Mega Charizard Y/Torkoal + Leafeon/Venusaur (Chlorophyll) + Scovillain',
          'Rain Team: Pelipper/Politoed + Basculegion (Swift Swim) + Archaludon (Electro Shot)',
          'Sand Team: Tyranitar/Hippowdon + Excadrill (Sand Rush) + Garganacl',
          'Snow Team: Ninetales-Alola + Glaceon/Sneasler + Aurora Veil',
          'Trick Room: Farigiraf/Hatterene setter + Snorlax/Ursaluna/Mamoswine',
          'Mega Y Sun: Mega Charizard Y core build รอบแดด',
          'Tailwind Offense: Whimsicott (Prankster) + Pelipper Tailwind + fast sweepers',
          'Intimidate Spam: Incineroar + Mega Manectric + Mega Gyarados',
        ],
      },
      {
        heading: 'Role Compression',
        body: 'แต่ละโปเกมอนควรทำหน้าที่อย่างน้อย 1 อย่าง',
        list: [
          'Sweeper: โจมตีหนัก ทำลายฝ่ายตรงข้ามด้วย Setup',
          'Wall: รับท่าโจมตีและฟื้นพลัง',
          'Pivot: สลับเข้าออกเพื่อปรับ momentum (U-turn, Volt Switch, Teleport)',
          'Hazard Setter: วาง Stealth Rock / Spikes / Toxic Spikes / Sticky Web',
          'Hazard Remover: ลบ hazard (Defog, Rapid Spin, Mortal Spin)',
          'Cleric: รักษาสถานะของทีม (Heal Bell, Aromatherapy)',
          'Win Condition: โปเกมอนที่ออกแบบมาเพื่อจบเกม',
        ],
      },
      {
        heading: 'การครอบคลุมธาตุ',
        body: 'ตรวจสอบให้แน่ใจว่าทีมมีท่าทำต่อ:',
        list: [
          'ทุกธาตุที่เป็น threat (เช่น Steel ของ Gholdengo, Dragon ของ Dragapult)',
          'Pokemon ตำนาน (Restricted) ถ้าเล่นในรูปแบบที่อนุญาต',
          'มี answer ต่อ Setup sweeper (เช่น Unaware, phazer, สเตทัส)',
        ],
      },
    ],
  },
  {
    id: 'champions-format',
    title: 'Pokémon Champions — Regulation M-A',
    icon: '🏆',
    summary: 'ข้อมูลฟอร์แมต Reg M-A ของ Pokémon Champions (เปิดตัว 8 เม.ย. 2026)',
    content: [
      {
        heading: 'ภาพรวมเกม',
        body: 'Pokémon Champions เปิดตัวพร้อมกันบน Nintendo Switch และ Switch 2 เมื่อ 8 เมษายน 2026 (เวอร์ชั่น iOS/Android ตามมาในปี 2026) เป็นเกมฟรี ที่ใช้เป็นแพลตฟอร์มทางการของ VGC ตั้งแต่ฤดูกาล 2026 — รวมถึง Pokémon Worlds 2026 ที่ San Francisco (28-30 สิงหาคม 2026)',
      },
      {
        heading: 'การจัด Roster',
        body: 'Pokémon Champions ไม่มี dex ครบ — ใช้ระบบ Roster ที่ขยายตามฤดูกาล',
        list: [
          'จับ Pokémon ผ่าน Roster/Recruit Ranch ในเกม',
          'หรือโอนจาก Pokémon HOME (โอนได้ครั้งเดียว ไม่สามารถส่งกลับ)',
          'บางฟอร์ม (เช่น Floette-Eternal) ได้จากการโอนผ่าน HOME เท่านั้น',
          'Currency = Victory Points (VP) — ได้จากการแข่งขัน ห้ามซื้อด้วยเงินจริง',
        ],
      },
      {
        heading: 'Regulation M-A (ปัจจุบัน)',
        body: 'กฎฟอร์แมตที่ใช้แข่งใน Ranked / NAIC / Worlds 2026',
        list: [
          'แบน Paradox Pokémon ทั้งหมด (Flutter Mane, Iron Hands, Roaring Moon ฯลฯ)',
          'แบน Four Treasures of Ruin (Chien-Pao, Chi-Yu, Ting-Lu, Wo-Chien)',
          'แบน Koraidon, Miraidon, ตำนาน restricted',
          'Mega Evolution + Terastallization ใช้ได้ทั้งคู่ (แต่ใช้ 1 กิมมิคต่อแมตช์)',
          'Z-Moves และ Dynamax ยังไม่เปิด (คาดว่าจะตามมา)',
        ],
      },
      {
        heading: 'กฎไอเทมพิเศษ',
        body: 'Champions มีกฎไอเทมที่ต่างจาก VGC/Smogon',
        list: [
          'ไอเทม unique: โปเกมอน 2 ตัวห้ามถือเหมือนกัน',
          'มีเพียง ~30 ไอเทม (ไม่รวม Mega Stone/Berry) ตอนเปิดตัว',
          'Life Orb, Choice Band, Choice Specs, Choice Scarf ไม่มีในเกม',
          'ใช้ Mystic Water, Throat Spray, Booster Energy, Plate ต่าง ๆ แทน',
        ],
      },
      {
        heading: 'ฟอร์แมต',
        body: 'เกมรองรับ 3 โหมด: Ranked, Casual, Private',
        list: [
          'Singles 6v6 (เลือก 6 ตัวจากทีม)',
          'Doubles 6v6 → 4v4 (Bring 6 Pick 4) — ฟอร์แมตที่ใช้แข่ง',
          'ไม่มี Smogon clauses (Sleep Clause, Species Clause) — เป็น Pokemon Company official',
        ],
      },
      {
        heading: 'Mega Evolution ใน Champions',
        body: 'หลังหายไปจาก Sword/Shield, Scarlet/Violet — Mega Evolution กลับมาเป็นกิมมิคหลัก',
        list: [
          'Mega Charizard Y (Drought + SpA 159) — ใช้สูงสุด ~20%',
          'Mega Aerodactyl (Tough Claws + Speed 150)',
          'Mega Scizor (Technician + Bulk)',
          'Mega Kangaskhan (Parental Bond ตี 2 ครั้ง)',
          'Mega Blastoise (Mega Launcher x1.5 aura moves)',
          'Mega Stone ใช้แทน Held Item ของ Pokemon ตัวนั้น',
        ],
      },
      {
        heading: 'การแข่งทางการ',
        body: 'ตารางการแข่ง 2026',
        list: [
          '29-31 พฤษภาคม 2026: Indianapolis Regionals (Champions ครั้งแรก)',
          '12-14 มิถุนายน 2026: NAIC',
          '28-30 สิงหาคม 2026: Pokémon Worlds 2026 (San Francisco)',
        ],
      },
    ],
  },
];
