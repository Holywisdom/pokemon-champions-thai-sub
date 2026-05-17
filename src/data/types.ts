/**
 * Pokemon type chart and metadata
 * Each row: how `attacker` type performs against `defender` type
 * 0 = no effect, 0.5 = not very effective, 1 = normal, 2 = super effective
 */

export type TypeId =
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';

export const TYPES: TypeId[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
];

export const typeColors: Record<TypeId, string> = {
  normal: '#a8a878', fire: '#f08030', water: '#6890f0',
  electric: '#f8d030', grass: '#78c850', ice: '#98d8d8',
  fighting: '#c03028', poison: '#a040a0', ground: '#e0c068',
  flying: '#a890f0', psychic: '#f85888', bug: '#a8b820',
  rock: '#b8a038', ghost: '#705898', dragon: '#7038f8',
  dark: '#705848', steel: '#b8b8d0', fairy: '#ee99ac',
};

// Gen 6+ type chart. attacker -> defender -> multiplier
export const typeChart: Record<TypeId, Partial<Record<TypeId, number>>> = {
  normal:   { rock: 0.5, ghost: 0, steel: 0.5 },
  fire:     { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water:    { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass:    { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice:      { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison:   { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground:   { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying:   { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic:  { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug:      { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock:     { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost:    { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon:   { dragon: 2, steel: 0.5, fairy: 0 },
  dark:     { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel:    { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy:    { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
};

export function getEffectiveness(attacker: TypeId, defender: TypeId): number {
  return typeChart[attacker][defender] ?? 1;
}

export function getMultiTypeEffectiveness(
  attacker: TypeId,
  defenders: TypeId[]
): number {
  return defenders.reduce(
    (acc, d) => acc * getEffectiveness(attacker, d),
    1
  );
}

export interface TypeInfo {
  id: TypeId;
  nameTh: string;
  description: string;
  signaturePokemon: string[];
}

export const typeInfo: Record<TypeId, Omit<TypeInfo, 'id' | 'nameTh'>> = {
  normal: {
    description: 'ธาตุพื้นฐาน ไม่มีจุดเด่นพิเศษ แต่หาท่าครอบคลุมหลายธาตุได้ง่าย',
    signaturePokemon: ['Snorlax', 'Slaking', 'Porygon-Z'],
  },
  fire: {
    description: 'พลังโจมตีสูง เผาให้ติดสถานะไหม้ได้ ทนต่อน้ำแข็ง/แมลง/พิษ',
    signaturePokemon: ['Charizard', 'Volcarona', 'Heatran'],
  },
  water: {
    description: 'ครอบคลุมหลายธาตุดี ทนต่อเหล็ก น้ำแข็ง ไฟ',
    signaturePokemon: ['Greninja', 'Urshifu (Rapid Strike)', 'Pelipper'],
  },
  electric: {
    description: 'ความเร็วสูง ใช้สู้บินและน้ำได้ดี ไม่ติดสถานะอัมพาต',
    signaturePokemon: ['Miraidon', 'Iron Hands', 'Pincurchin'],
  },
  grass: {
    description: 'ทนต่อน้ำ/ไฟฟ้า/ดิน เก่งเรื่องท่าสนับสนุนทีม',
    signaturePokemon: ['Rillaboom', 'Amoonguss', 'Ogerpon'],
  },
  ice: {
    description: 'พลังโจมตีดีต่อมังกร/บิน/หญ้า แต่ป้องกันอ่อนแอ',
    signaturePokemon: ['Chien-Pao', 'Baxcalibur', 'Weavile'],
  },
  fighting: {
    description: 'พลังโจมตีกายภาพสูง ครอบคลุมหิน/เหล็ก/ปกติ',
    signaturePokemon: ['Urshifu', 'Iron Hands', 'Annihilape'],
  },
  poison: {
    description: 'ใช้สู้นางฟ้าและหญ้าได้ดี วางพิษทำลายค่อย ๆ',
    signaturePokemon: ['Gholdengo (partial)', 'Glimmora', 'Toxapex'],
  },
  ground: {
    description: 'พลังโจมตีดีต่อเหล็ก/ไฟฟ้า/หิน/พิษ/ไฟ ไม่ติดอัมพาตจากไฟฟ้า',
    signaturePokemon: ['Garchomp', 'Landorus-Therian', 'Ting-Lu'],
  },
  flying: {
    description: 'ความเร็วสูง ไม่โดนท่าดิน ครอบคลุมหญ้า/แมลง/ต่อสู้',
    signaturePokemon: ['Talonflame', 'Corviknight', 'Tornadus'],
  },
  psychic: {
    description: 'พลังโจมตีพิเศษสูง ใช้สู้พิษ/ต่อสู้ได้ดี',
    signaturePokemon: ['Flutter Mane', 'Hatterene', 'Tapu Lele'],
  },
  bug: {
    description: 'ใช้สู้จิต/หญ้า/ดำได้ดี แต่กายภาพอ่อนแอกว่าค่าเฉลี่ย',
    signaturePokemon: ['Volcarona', 'Scizor', 'Galvantula'],
  },
  rock: {
    description: 'ทนต่อไฟ/บิน/ปกติ ใช้สู้บินและไฟได้ดี',
    signaturePokemon: ['Tyranitar', 'Garganacl', 'Diancie'],
  },
  ghost: {
    description: 'ภูตผีไม่โดนท่าปกติ/ต่อสู้ ใช้สู้จิตและภูตผีด้วยกันได้ดี',
    signaturePokemon: ['Gholdengo', 'Dragapult', 'Gengar'],
  },
  dragon: {
    description: 'พลังโจมตีสูง ใช้สู้มังกรด้วยกันได้แต่อ่อนแอต่อนางฟ้า/น้ำแข็ง',
    signaturePokemon: ['Dragapult', 'Garchomp', 'Roaring Moon'],
  },
  dark: {
    description: 'ใช้สู้จิต/ภูตผีได้ดี ไม่โดนท่าจิต ทนต่อความมืดเอง',
    signaturePokemon: ['Chien-Pao', 'Kingambit', 'Roaring Moon'],
  },
  steel: {
    description: 'ทนทานที่สุดในเกม ทนต่อ 10 ธาตุ ใช้สู้น้ำแข็ง/หิน/นางฟ้าได้ดี',
    signaturePokemon: ['Gholdengo', 'Corviknight', 'Heatran'],
  },
  fairy: {
    description: 'นางฟ้าเก่งต่อมังกร/ต่อสู้/ความมืด ไม่โดนท่ามังกร',
    signaturePokemon: ['Flutter Mane', 'Iron Valiant', 'Tapu Fini'],
  },
};

export function getTypeWeaknesses(types: TypeId[]): Record<string, number> {
  const result: Record<string, number> = {};
  TYPES.forEach((attacker) => {
    const mult = getMultiTypeEffectiveness(attacker, types);
    if (mult !== 1) result[attacker] = mult;
  });
  return result;
}
