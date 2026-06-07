/**
 * Pokemon name → ID mapping for sprite/link lookups
 * Includes Mega Evolutions and special forms used in Pokémon Champions Reg M-A
 *
 * Sprite URL pattern:
 *   https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png
 *
 * Mega/form variant IDs follow PokéAPI's pokemon_form_id conventions.
 */

export interface PokemonRef {
  id: number;          // PokéAPI ID for sprite
  slug: string;        // URL-safe slug for our internal /pokemon/[slug] route (if exists)
  nameEn: string;
  nameTh?: string;     // Optional Thai (Katakana-derived) display name
  hasDetailPage?: boolean; // true if we have a detail page for this Pokemon
}

// Comprehensive lookup table for all Pokemon referenced in counters/teammates/etc.
// Keyed by display name (case-insensitive lookup via the helper).
export const pokemonIndex: Record<string, PokemonRef> = {
  // ===== Champions Reg M-A meta (have detail pages) =====
  'Basculegion': { id: 902, slug: 'basculegion', nameEn: 'Basculegion', nameTh: 'อิดาเรดดอน', hasDetailPage: true },
  'Garchomp': { id: 445, slug: 'garchomp', nameEn: 'Garchomp', nameTh: 'การ์บูเลียส', hasDetailPage: true },
  'Charizard': { id: 6, slug: 'charizard', nameEn: 'Charizard', nameTh: 'ลิซาร์ดอน (เมก้า Y)', hasDetailPage: true },
  'Mega Charizard Y': { id: 10035, slug: 'charizard-mega-y', nameEn: 'Mega Charizard Y', nameTh: 'ลิซาร์ดอนเมก้า Y', hasDetailPage: true },
  'Mega Charizard X': { id: 10034, slug: 'charizard-mega-x', nameEn: 'Mega Charizard X', nameTh: 'ลิซาร์ดอนเมก้า X', hasDetailPage: true },
  'Kingambit': { id: 983, slug: 'kingambit', nameEn: 'Kingambit', nameTh: 'โดโดเกซัน', hasDetailPage: true },
  'Aerodactyl': { id: 142, slug: 'aerodactyl', nameEn: 'Aerodactyl', nameTh: 'พเทร่า (เมก้า)', hasDetailPage: true },
  'Mega Aerodactyl': { id: 10042, slug: 'aerodactyl-mega', nameEn: 'Mega Aerodactyl', nameTh: 'พเทร่าเมก้า', hasDetailPage: true },
  'Sylveon': { id: 700, slug: 'sylveon', nameEn: 'Sylveon', nameTh: 'นิมเฟีย', hasDetailPage: true },
  'Floette-Eternal': { id: 10061, slug: 'floette-eternal', nameEn: 'Floette-Eternal', nameTh: 'ฟลาเอ็ตเตอ-เอเทอร์นัล', hasDetailPage: true },
  'Sneasler': { id: 903, slug: 'sneasler', nameEn: 'Sneasler', nameTh: 'โอนิวลา', hasDetailPage: true },
  'Sinistcha': { id: 1013, slug: 'sinistcha', nameEn: 'Sinistcha', nameTh: 'ยาบาโซชา', hasDetailPage: true },
  'Incineroar': { id: 727, slug: 'incineroar', nameEn: 'Incineroar', nameTh: 'เกาการ์', hasDetailPage: true },
  'Archaludon': { id: 1018, slug: 'archaludon', nameEn: 'Archaludon', nameTh: 'บริจูราส', hasDetailPage: true },
  'Farigiraf': { id: 981, slug: 'farigiraf', nameEn: 'Farigiraf', nameTh: 'ริคิคิริน', hasDetailPage: true },
  'Pelipper': { id: 279, slug: 'pelipper', nameEn: 'Pelipper', nameTh: 'เพลลิปเปอร์', hasDetailPage: true },
  'Whimsicott': { id: 547, slug: 'whimsicott', nameEn: 'Whimsicott', nameTh: 'อิลฟูน', hasDetailPage: true },
  'Rotom-Wash': { id: 10009, slug: 'rotom-wash', nameEn: 'Rotom-Wash', nameTh: 'โรตอม-วอช', hasDetailPage: true },
  'Tyranitar': { id: 248, slug: 'tyranitar', nameEn: 'Tyranitar', nameTh: 'บังกิรัส', hasDetailPage: true },
  'Dragonite': { id: 149, slug: 'dragonite', nameEn: 'Dragonite', nameTh: 'ไคริว', hasDetailPage: true },
  'Kangaskhan': { id: 115, slug: 'kangaskhan', nameEn: 'Kangaskhan', nameTh: 'การูระ', hasDetailPage: true },
  'Mega Kangaskhan': { id: 10039, slug: 'kangaskhan-mega', nameEn: 'Mega Kangaskhan', nameTh: 'การูระเมก้า', hasDetailPage: true },
  'Scizor': { id: 212, slug: 'scizor', nameEn: 'Scizor', nameTh: 'ฮัสซัม', hasDetailPage: true },
  'Mega Scizor': { id: 10046, slug: 'scizor-mega', nameEn: 'Mega Scizor', nameTh: 'ฮัสซัมเมก้า', hasDetailPage: true },
  'Glimmora': { id: 970, slug: 'glimmora', nameEn: 'Glimmora', nameTh: 'คิราฟลอล', hasDetailPage: true },
  'Blastoise': { id: 9, slug: 'blastoise', nameEn: 'Blastoise', nameTh: 'คาเม็กซ์เมก้า', hasDetailPage: true },
  'Mega Blastoise': { id: 10036, slug: 'blastoise-mega', nameEn: 'Mega Blastoise', nameTh: 'คาเม็กซ์เมก้า', hasDetailPage: true },
  'Scovillain': { id: 952, slug: 'scovillain', nameEn: 'Scovillain', nameTh: 'สโคบิลเลน', hasDetailPage: true },
  'Corviknight': { id: 823, slug: 'corviknight', nameEn: 'Corviknight', nameTh: 'อาร์มาร์กา', hasDetailPage: true },
  'Excadrill': { id: 530, slug: 'excadrill', nameEn: 'Excadrill', nameTh: 'โดริว์สึ', hasDetailPage: true },
  'Froslass': { id: 478, slug: 'froslass', nameEn: 'Froslass', nameTh: 'ยูกิเมโนะโกะ', hasDetailPage: true },
  'Hippowdon': { id: 450, slug: 'hippowdon', nameEn: 'Hippowdon', nameTh: 'คาบาลดอน', hasDetailPage: true },
  'Primarina': { id: 730, slug: 'primarina', nameEn: 'Primarina', nameTh: 'อะชิเรนุ', hasDetailPage: true },
  'Mimikyu': { id: 778, slug: 'mimikyu', nameEn: 'Mimikyu', nameTh: 'มิมิจู', hasDetailPage: true },
  'Dragapult': { id: 887, slug: 'dragapult', nameEn: 'Dragapult', nameTh: 'ดราปาร์ลต์', hasDetailPage: true },
  'Aegislash': { id: 681, slug: 'aegislash', nameEn: 'Aegislash', nameTh: 'กิลกาลด์', hasDetailPage: true },

  // ===== References (no detail page yet) =====
  'Gholdengo': { id: 1000, slug: 'gholdengo', nameEn: 'Gholdengo' },
  'Gardevoir': { id: 282, slug: 'gardevoir', nameEn: 'Gardevoir', nameTh: 'ซาเนครอส', hasDetailPage: true },
  'Mega Gardevoir': { id: 10051, slug: 'gardevoir-mega', nameEn: 'Mega Gardevoir', nameTh: 'ซาเนครอสเมก้า',  },
  'Mega Lucario': { id: 10059, slug: 'lucario-mega', nameEn: 'Mega Lucario', nameTh: 'ลูคาริโอเมก้า',  },
  'Mega Heracross': { id: 10047, slug: 'heracross-mega', nameEn: 'Mega Heracross', nameTh: 'เฮราคลอสเมก้า', hasDetailPage: true },
  'Mega Pinsir': { id: 10040, slug: 'pinsir-mega', nameEn: 'Mega Pinsir', nameTh: 'ไคโรสเมก้า', hasDetailPage: true },
  'Mega Mawile': { id: 10052, slug: 'mawile-mega', nameEn: 'Mega Mawile' },
  'Mega Gengar': { id: 10038, slug: 'gengar-mega', nameEn: 'Mega Gengar', nameTh: 'เกนการ์เมก้า',  },
  'Mega Manectric': { id: 10055, slug: 'manectric-mega', nameEn: 'Mega Manectric', nameTh: 'ลิวนาสเมก้า',  },
  'Talonflame': { id: 663, slug: 'talonflame', nameEn: 'Talonflame', nameTh: 'ฟาเอโรส',  },
  'Torkoal': { id: 324, slug: 'torkoal', nameEn: 'Torkoal', nameTh: 'คอตเทอจ้า',  },
  'Venusaur': { id: 3, slug: 'venusaur', nameEn: 'Venusaur', nameTh: 'ฟุชิงิบานะ', hasDetailPage: true },
  'Heatran': { id: 485, slug: 'heatran', nameEn: 'Heatran' },
  'Zapdos': { id: 145, slug: 'zapdos', nameEn: 'Zapdos' },
  'Amoonguss': { id: 591, slug: 'amoonguss', nameEn: 'Amoonguss' },
  'Hatterene': { id: 858, slug: 'hatterene', nameEn: 'Hatterene', nameTh: 'บริมออน',  },
  'Indeedee': { id: 876, slug: 'indeedee', nameEn: 'Indeedee' },
  'Annihilape': { id: 979, slug: 'annihilape', nameEn: 'Annihilape' },
  'Garganacl': { id: 934, slug: 'garganacl', nameEn: 'Garganacl', nameTh: 'เคียวจิโอน',  },
  'Skeledirge': { id: 911, slug: 'skeledirge', nameEn: 'Skeledirge', nameTh: 'ลาวด์บอร์น',  },
  'Slowking-Galar': { id: 10172, slug: 'slowking-galar', nameEn: 'Slowking-Galar', nameTh: 'ยาดอคิงกาลาร์',  },
  'Politoed': { id: 186, slug: 'politoed', nameEn: 'Politoed', nameTh: 'นโยโรโทโน่',  },
  'Tapu Koko': { id: 785, slug: 'tapu-koko', nameEn: 'Tapu Koko' },
  'Tapu Lele': { id: 786, slug: 'tapu-lele', nameEn: 'Tapu Lele' },
  'Tapu Bulu': { id: 787, slug: 'tapu-bulu', nameEn: 'Tapu Bulu' },
  'Tapu Fini': { id: 788, slug: 'tapu-fini', nameEn: 'Tapu Fini' },
  'Ogerpon': { id: 1017, slug: 'ogerpon', nameEn: 'Ogerpon' },
  'Ogerpon-Wellspring': { id: 10272, slug: 'ogerpon-wellspring-mask', nameEn: 'Ogerpon-Wellspring' },
  'Urshifu': { id: 892, slug: 'urshifu', nameEn: 'Urshifu' },
  'Urshifu-Rapid Strike': { id: 10199, slug: 'urshifu-rapid-strike', nameEn: 'Urshifu-Rapid Strike' },
  'Ursaluna': { id: 901, slug: 'ursaluna', nameEn: 'Ursaluna' },
  'Cinderace': { id: 815, slug: 'cinderace', nameEn: 'Cinderace' },
  'Rillaboom': { id: 812, slug: 'rillaboom', nameEn: 'Rillaboom' },
  'Greninja': { id: 658, slug: 'greninja', nameEn: 'Greninja', nameTh: 'เกคโคงะ', hasDetailPage: true },
  'Hydrapple': { id: 1019, slug: 'hydrapple', nameEn: 'Hydrapple', nameTh: 'คามิทสึโอโรจิ', hasDetailPage: true },
  'Tinkaton': { id: 959, slug: 'tinkaton', nameEn: 'Tinkaton', nameTh: 'เดคานุจัง',  },
  'Clefable': { id: 36, slug: 'clefable', nameEn: 'Clefable', nameTh: 'พิคซี่', hasDetailPage: true },
  'Baxcalibur': { id: 998, slug: 'baxcalibur', nameEn: 'Baxcalibur' },
  'Weavile': { id: 461, slug: 'weavile', nameEn: 'Weavile', nameTh: 'มันยูล่า',  },
  'Gyarados': { id: 130, slug: 'gyarados', nameEn: 'Gyarados', nameTh: 'กยาลาดอส', hasDetailPage: true },
  'Toxapex': { id: 748, slug: 'toxapex', nameEn: 'Toxapex', nameTh: 'โดฮิโดอิเดะ',  },
  'Salamence': { id: 373, slug: 'salamence', nameEn: 'Salamence' },
  'Metagross': { id: 376, slug: 'metagross', nameEn: 'Metagross' },
  'Volcarona': { id: 637, slug: 'volcarona', nameEn: 'Volcarona', nameTh: 'อูร์การ์โมส',  },
  'Iron Hands': { id: 1003, slug: 'iron-hands', nameEn: 'Iron Hands' },
  'Flutter Mane': { id: 987, slug: 'flutter-mane', nameEn: 'Flutter Mane' },
  'Great Tusk': { id: 984, slug: 'great-tusk', nameEn: 'Great Tusk' },
  'Iron Valiant': { id: 1006, slug: 'iron-valiant', nameEn: 'Iron Valiant' },
  'Roaring Moon': { id: 1005, slug: 'roaring-moon', nameEn: 'Roaring Moon' },

  // ===== NEW MEGAS (with detail pages) =====
  'Mega Venusaur': { id: 10033, slug: 'venusaur-mega', nameEn: 'Mega Venusaur', nameTh: 'ฟุชิงิบานะเมก้า', hasDetailPage: true },
  'Mega Gengar': { id: 10038, slug: 'gengar-mega', nameEn: 'Mega Gengar', nameTh: 'เกนการ์เมก้า', hasDetailPage: true },
  'Mega Gardevoir': { id: 10051, slug: 'gardevoir-mega', nameEn: 'Mega Gardevoir', nameTh: 'ซาเนครอสเมก้า', hasDetailPage: true },
  'Mega Lucario': { id: 10059, slug: 'lucario-mega', nameEn: 'Mega Lucario', nameTh: 'ลูคาริโอเมก้า', hasDetailPage: true },
  'Mega Manectric': { id: 10055, slug: 'manectric-mega', nameEn: 'Mega Manectric', nameTh: 'ลิวนาสเมก้า', hasDetailPage: true },
  'Mega Alakazam': { id: 10037, slug: 'alakazam-mega', nameEn: 'Mega Alakazam', nameTh: 'ฟูดินเมก้า', hasDetailPage: true },
  'Mega Gyarados': { id: 10041, slug: 'gyarados-mega', nameEn: 'Mega Gyarados', nameTh: 'กยาลาดอสเมก้า', hasDetailPage: true },
  'Mega Lopunny': { id: 10088, slug: 'lopunny-mega', nameEn: 'Mega Lopunny', nameTh: 'มิมิรอปเมก้า', hasDetailPage: true },
  'Mega Houndoom': { id: 10048, slug: 'houndoom-mega', nameEn: 'Mega Houndoom', nameTh: 'เฮลการ์เมก้า', hasDetailPage: true },
  'Mega Sableye': { id: 10066, slug: 'sableye-mega', nameEn: 'Mega Sableye', nameTh: 'ยามิราเมเมก้า', hasDetailPage: true },
  'Mega Altaria': { id: 10067, slug: 'altaria-mega', nameEn: 'Mega Altaria', nameTh: 'ทิยาลทิอาเมก้า', hasDetailPage: true },
  'Mega Steelix': { id: 10072, slug: 'steelix-mega', nameEn: 'Mega Steelix', nameTh: 'ฮากาเนียสเมก้า', hasDetailPage: true },
  'Mega Slowbro': { id: 10071, slug: 'slowbro-mega', nameEn: 'Mega Slowbro', nameTh: 'ยาดอร่านเมก้า', hasDetailPage: true },
  'Mega Gallade': { id: 10068, slug: 'gallade-mega', nameEn: 'Mega Gallade', nameTh: 'เอรเลดเมก้า', hasDetailPage: true },
  'Mega Pidgeot': { id: 10073, slug: 'pidgeot-mega', nameEn: 'Mega Pidgeot', nameTh: 'พิจ๊อตเมก้า', hasDetailPage: true },
  'Mega Pinsir': { id: 10040, slug: 'pinsir-mega', nameEn: 'Mega Pinsir', nameTh: 'ไคโรสเมก้า', hasDetailPage: true },
  'Mega Heracross': { id: 10047, slug: 'heracross-mega', nameEn: 'Mega Heracross', nameTh: 'เฮราคลอสเมก้า', hasDetailPage: true },
  'Mega Banette': { id: 10056, slug: 'banette-mega', nameEn: 'Mega Banette', nameTh: 'จูเปตต้าเมก้า', hasDetailPage: true },
  'Mega Aggron': { id: 10053, slug: 'aggron-mega', nameEn: 'Mega Aggron', nameTh: 'บอสโกโดราเมก้า', hasDetailPage: true },
  'Mega Ampharos': { id: 10045, slug: 'ampharos-mega', nameEn: 'Mega Ampharos', nameTh: 'เด็นริวเมก้า', hasDetailPage: true },

  // ===== NEW EEVEELUTIONS (with detail pages) =====
  'Espeon': { id: 196, slug: 'espeon', nameEn: 'Espeon', nameTh: 'เอเฟี่ยน', hasDetailPage: true },
  'Umbreon': { id: 197, slug: 'umbreon', nameEn: 'Umbreon', nameTh: 'เบลคกี้', hasDetailPage: true },
  'Vaporeon': { id: 134, slug: 'vaporeon', nameEn: 'Vaporeon', nameTh: 'ชาวเวอร์ส', hasDetailPage: true },
  'Jolteon': { id: 135, slug: 'jolteon', nameEn: 'Jolteon', nameTh: 'ทันเดอร์ส', hasDetailPage: true },
  'Flareon': { id: 136, slug: 'flareon', nameEn: 'Flareon', nameTh: 'บูสเตอร์', hasDetailPage: true },
  'Leafeon': { id: 470, slug: 'leafeon', nameEn: 'Leafeon', nameTh: 'ลีฟเฟี่ยน', hasDetailPage: true },
  'Glaceon': { id: 471, slug: 'glaceon', nameEn: 'Glaceon', nameTh: 'กลาเซีย', hasDetailPage: true },

  // ===== NEW STARTERS / VIABLE PICKS (with detail pages) =====
  'Skeledirge': { id: 911, slug: 'skeledirge', nameEn: 'Skeledirge', nameTh: 'ลาวด์บอร์น', hasDetailPage: true },
  'Meowscarada': { id: 908, slug: 'meowscarada', nameEn: 'Meowscarada', nameTh: 'มาสคาญา', hasDetailPage: true },
  'Quaquaval': { id: 914, slug: 'quaquaval', nameEn: 'Quaquaval', nameTh: 'แวนิวาล', hasDetailPage: true },
  'Decidueye': { id: 724, slug: 'decidueye', nameEn: 'Decidueye', nameTh: 'จูไนเปอร์', hasDetailPage: true },
  'Infernape': { id: 392, slug: 'infernape', nameEn: 'Infernape', nameTh: 'โกการ์ซารุ', hasDetailPage: true },
  'Typhlosion': { id: 157, slug: 'typhlosion', nameEn: 'Typhlosion', nameTh: 'บาคูฟูน', hasDetailPage: true },
  'Serperior': { id: 497, slug: 'serperior', nameEn: 'Serperior', nameTh: 'จะลังกัน', hasDetailPage: true },
  'Volcarona': { id: 637, slug: 'volcarona', nameEn: 'Volcarona', nameTh: 'อูร์การ์โมส', hasDetailPage: true },
  'Hatterene': { id: 858, slug: 'hatterene', nameEn: 'Hatterene', nameTh: 'บริมออน', hasDetailPage: true },
  'Tinkaton': { id: 959, slug: 'tinkaton', nameEn: 'Tinkaton', nameTh: 'เดคานุจัง', hasDetailPage: true },
  'Garganacl': { id: 934, slug: 'garganacl', nameEn: 'Garganacl', nameTh: 'เคียวจิโอน', hasDetailPage: true },
  'Weavile': { id: 461, slug: 'weavile', nameEn: 'Weavile', nameTh: 'มันยูล่า', hasDetailPage: true },
  'Gliscor': { id: 472, slug: 'gliscor', nameEn: 'Gliscor', nameTh: 'กลายอน', hasDetailPage: true },
  'Mamoswine': { id: 473, slug: 'mamoswine', nameEn: 'Mamoswine', nameTh: 'มัมมู', hasDetailPage: true },
  'Hydreigon': { id: 635, slug: 'hydreigon', nameEn: 'Hydreigon', nameTh: 'ซาซานดร่า', hasDetailPage: true },
  'Toxapex': { id: 748, slug: 'toxapex', nameEn: 'Toxapex', nameTh: 'โดฮิโดอิเดะ', hasDetailPage: true },
  'Ninetales-Alola': { id: 10104, slug: 'ninetales-alola', nameEn: 'Ninetales-Alola', nameTh: 'คิวคอนอโรลา', hasDetailPage: true },
  'Torkoal': { id: 324, slug: 'torkoal', nameEn: 'Torkoal', nameTh: 'คอตเทอจ้า', hasDetailPage: true },
  'Politoed': { id: 186, slug: 'politoed', nameEn: 'Politoed', nameTh: 'นโยโรโทโน่', hasDetailPage: true },
  'Snorlax': { id: 143, slug: 'snorlax', nameEn: 'Snorlax', nameTh: 'คาบิกอน', hasDetailPage: true },
  'Maushold': { id: 925, slug: 'maushold', nameEn: 'Maushold', nameTh: 'อิกกะเนะซึมิ', hasDetailPage: true },
  'Talonflame': { id: 663, slug: 'talonflame', nameEn: 'Talonflame', nameTh: 'ฟาเอโรส', hasDetailPage: true },
  'Klefki': { id: 707, slug: 'klefki', nameEn: 'Klefki', nameTh: 'คลีฟกี้', hasDetailPage: true },
  'Armarouge': { id: 936, slug: 'armarouge', nameEn: 'Armarouge', nameTh: 'กุเรนอาร์มา', hasDetailPage: true },
  'Ceruledge': { id: 937, slug: 'ceruledge', nameEn: 'Ceruledge', nameTh: 'โซวล์เบลซ', hasDetailPage: true },
  'Slowking-Galar': { id: 10172, slug: 'slowking-galar', nameEn: 'Slowking-Galar', nameTh: 'ยาดอคิงกาลาร์', hasDetailPage: true },
  'Milotic': { id: 350, slug: 'milotic', nameEn: 'Milotic', nameTh: 'มิโลคารอส', hasDetailPage: true },
  'Salazzle': { id: 758, slug: 'salazzle', nameEn: 'Salazzle', nameTh: 'เอ็นนิวด์', hasDetailPage: true },

  // ===== NEW EXPANDED ROSTER (Task 7) =====
  'Mega Beedrill': { id: 10090, slug: 'beedrill-mega', nameEn: 'Mega Beedrill', nameTh: 'สเปียร์เมก้า', hasDetailPage: true },
  'Mega Greninja': { id: 10294, slug: 'greninja-mega', nameEn: 'Mega Greninja', nameTh: 'เกคโคงะเมก้า', hasDetailPage: true },
  'Mega Delphox': { id: 10293, slug: 'delphox-mega', nameEn: 'Mega Delphox', nameTh: 'มาโฟคุชีเมก้า', hasDetailPage: true },
  'Raichu': { id: 26, slug: 'raichu', nameEn: 'Raichu', nameTh: 'ไรจู', hasDetailPage: true },
  'Mega Meowstic': { id: 10314, slug: 'meowstic-mega', nameEn: 'Mega Meowstic', nameTh: 'เนียวนิคุสุเมก้า', hasDetailPage: true },
  'Noivern': { id: 715, slug: 'noivern', nameEn: 'Noivern', nameTh: 'อนบาร์น', hasDetailPage: true },
  'Alakazam': { id: 65, slug: 'alakazam', nameEn: 'Alakazam', nameTh: 'ฟูดิน', hasDetailPage: true },
  'Mega Froslass': { id: 10285, slug: 'froslass-mega', nameEn: 'Mega Froslass', nameTh: 'ยูกิเมโนะโกะเมก้า', hasDetailPage: true },
  'Mega Starmie': { id: 10280, slug: 'starmie-mega', nameEn: 'Mega Starmie', nameTh: 'สตาร์มี่เมก้า', hasDetailPage: true },
  'Hawlucha': { id: 701, slug: 'hawlucha', nameEn: 'Hawlucha', nameTh: 'ลูชะบุรุ', hasDetailPage: true },
  'Mega Hawlucha': { id: 10300, slug: 'hawlucha-mega', nameEn: 'Mega Hawlucha', nameTh: 'ลูชะบุรุเมก้า', hasDetailPage: true },
  'Mega Absol': { id: 10057, slug: 'absol-mega', nameEn: 'Mega Absol', nameTh: 'อับโซลเมก้า', hasDetailPage: true },
  'Starmie': { id: 121, slug: 'starmie', nameEn: 'Starmie', nameTh: 'สตาร์มี่', hasDetailPage: true },
  'Lycanroc Midday': { id: 745, slug: 'lycanroc', nameEn: 'Lycanroc Midday', nameTh: 'ลูการ์ลูกัน', hasDetailPage: true },
  'Alolan Raichu': { id: 10100, slug: 'raichu-alola', nameEn: 'Alolan Raichu', nameTh: 'ไรจู (อโลล่า)', hasDetailPage: true },
  'Gengar': { id: 94, slug: 'gengar', nameEn: 'Gengar', nameTh: 'เกนการ์', hasDetailPage: true },
  'Hisuian Zoroark': { id: 10239, slug: 'zoroark-hisui', nameEn: 'Hisuian Zoroark', nameTh: 'โซโรอาร์ค (ฮิซุย)', hasDetailPage: true },
  'Lycanroc Dusk': { id: 10152, slug: 'lycanroc-dusk', nameEn: 'Lycanroc Dusk', nameTh: 'ลูการ์ลูกัน-พลบค่ำ', hasDetailPage: true },
  'Mega Skarmory': { id: 10284, slug: 'skarmory-mega', nameEn: 'Mega Skarmory', nameTh: 'เออามุโดเมก้า', hasDetailPage: true },
  'Tauros': { id: 128, slug: 'tauros', nameEn: 'Tauros', nameTh: 'เคนทาโรส', hasDetailPage: true },
  'Heliolisk': { id: 695, slug: 'heliolisk', nameEn: 'Heliolisk', nameTh: 'เอเลซาร์ด', hasDetailPage: true },
  'Liepard': { id: 510, slug: 'liepard', nameEn: 'Liepard', nameTh: 'เลปาร์ดัส', hasDetailPage: true },
  'Espathra': { id: 956, slug: 'espathra', nameEn: 'Espathra', nameTh: 'เควสปาทรา', hasDetailPage: true },
  'Lopunny': { id: 428, slug: 'lopunny', nameEn: 'Lopunny', nameTh: 'มิมิรอป', hasDetailPage: true },
  'Manectric': { id: 310, slug: 'manectric', nameEn: 'Manectric', nameTh: 'ลิวนาส', hasDetailPage: true },
  'Mega Sharpedo': { id: 10070, slug: 'sharpedo-mega', nameEn: 'Mega Sharpedo', nameTh: 'ซาเมฮาดะเมก้า', hasDetailPage: true },
  'Zoroark': { id: 571, slug: 'zoroark', nameEn: 'Zoroark', nameTh: 'โซโรอาร์ค', hasDetailPage: true },
  'Delphox': { id: 655, slug: 'delphox', nameEn: 'Delphox', nameTh: 'มาโฟคุชี', hasDetailPage: true },
  'Meowstic Male': { id: 678, slug: 'meowstic', nameEn: 'Meowstic Male', nameTh: 'เนียวนิคุสุ', hasDetailPage: true },
  'Meowstic Female': { id: 10025, slug: 'meowstic-female', nameEn: 'Meowstic Female', nameTh: 'เนียวนิคุสุ-เพศเมีย', hasDetailPage: true },
  'Emolga': { id: 587, slug: 'emolga', nameEn: 'Emolga', nameTh: 'เอ็มอนกะ', hasDetailPage: true },
  'Mega Excadrill': { id: 10287, slug: 'excadrill-mega', nameEn: 'Mega Excadrill', nameTh: 'โดริว์สึเมก้า', hasDetailPage: true },
  'Furfrou': { id: 676, slug: 'furfrou', nameEn: 'Furfrou', nameTh: 'ทริมเมียน', hasDetailPage: true },
  'Mega Floette': { id: 10296, slug: 'floette-mega', nameEn: 'Mega Floette', nameTh: 'ฟลาเอ็ตเตอเมก้า', hasDetailPage: true },
  'Dedenne': { id: 702, slug: 'dedenne', nameEn: 'Dedenne', nameTh: 'เดเดนเน่', hasDetailPage: true },
  'Mega Glimmora': { id: 10321, slug: 'glimmora-mega', nameEn: 'Mega Glimmora', nameTh: 'คิราฟลอลเมก้า', hasDetailPage: true },
  'Pidgeot': { id: 18, slug: 'pidgeot', nameEn: 'Pidgeot', nameTh: 'พิจ๊อต', hasDetailPage: true },
  'Simipour': { id: 516, slug: 'simipour', nameEn: 'Simipour', nameTh: 'ฮิยักกี้', hasDetailPage: true },
  'Simisage': { id: 512, slug: 'simisage', nameEn: 'Simisage', nameTh: 'ยานักกี้', hasDetailPage: true },
  'Simisear': { id: 514, slug: 'simisear', nameEn: 'Simisear', nameTh: 'บาโอ้กกี้', hasDetailPage: true },
  'Mega Dragonite': { id: 10281, slug: 'dragonite-mega', nameEn: 'Mega Dragonite', nameTh: 'ไคริวเมก้า', hasDetailPage: true },
  'Mega Glalie': { id: 10074, slug: 'glalie-mega', nameEn: 'Mega Glalie', nameTh: 'โอนิโกริเมก้า', hasDetailPage: true },
  'Mega Medicham': { id: 10054, slug: 'medicham-mega', nameEn: 'Mega Medicham', nameTh: 'ชาร์เลมเมก้า', hasDetailPage: true },
  'Ninetales': { id: 38, slug: 'ninetales', nameEn: 'Ninetales', nameTh: 'คิวคอน', hasDetailPage: true },
  'Palafin Zero': { id: 964, slug: 'palafin', nameEn: 'Palafin Zero', nameTh: 'อิรุคามัง', hasDetailPage: true },
  'Tauros Paldea Combat Breed': { id: 10250, slug: 'tauros-paldea', nameEn: 'Tauros Paldea Combat Breed', nameTh: 'เคนทาโรส (ปาลเด)', hasDetailPage: true },
  'Tauros Paldea Aqua Breed': { id: 10252, slug: 'tauros-paldea-aqua-breed', nameEn: 'Tauros Paldea Aqua Breed', nameTh: 'เคนทาโรส (ปาลเด) (สายน้ำ)', hasDetailPage: true },
  'Tauros Paldea Blaze Breed': { id: 10251, slug: 'tauros-paldea-blaze-breed', nameEn: 'Tauros Paldea Blaze Breed', nameTh: 'เคนทาโรส (ปาลเด) (สายเพลิง)', hasDetailPage: true },
  'Morpeko Full Belly': { id: 877, slug: 'morpeko', nameEn: 'Morpeko Full Belly', nameTh: 'มอร์เปโกะ', hasDetailPage: true },
  'Arcanine': { id: 59, slug: 'arcanine', nameEn: 'Arcanine', nameTh: 'วินดี้', hasDetailPage: true },
  'Hisuian Typhlosion': { id: 10233, slug: 'typhlosion-hisui', nameEn: 'Hisuian Typhlosion', nameTh: 'บาคูฟูน (ฮิซุย)', hasDetailPage: true },
  'Houndoom': { id: 229, slug: 'houndoom', nameEn: 'Houndoom', nameTh: 'เฮลการ์', hasDetailPage: true },
  'Sharpedo': { id: 319, slug: 'sharpedo', nameEn: 'Sharpedo', nameTh: 'ซาเมฮาดะ', hasDetailPage: true },
  'Krookodile': { id: 553, slug: 'krookodile', nameEn: 'Krookodile', nameTh: 'วารุเบียล', hasDetailPage: true },
  'Mega Garchomp': { id: 10058, slug: 'garchomp-mega', nameEn: 'Mega Garchomp', nameTh: 'การ์บูเลียสเมก้า', hasDetailPage: true },
  'Rotom': { id: 479, slug: 'rotom', nameEn: 'Rotom', nameTh: 'โรตอม', hasDetailPage: true },
  'Hisuian Arcanine': { id: 10230, slug: 'arcanine-hisui', nameEn: 'Hisuian Arcanine', nameTh: 'วินดี้ (ฮิซุย)', hasDetailPage: true },
  'Lucario': { id: 448, slug: 'lucario', nameEn: 'Lucario', nameTh: 'ลูคาริโอ', hasDetailPage: true },
  'Mega Chandelure': { id: 10291, slug: 'chandelure-mega', nameEn: 'Mega Chandelure', nameTh: 'ชานเดลร่าเมก้า', hasDetailPage: true },
  'Pikachu': { id: 25, slug: 'pikachu', nameEn: 'Pikachu', nameTh: 'ปิกาจู', hasDetailPage: true },
  'Roserade': { id: 407, slug: 'roserade', nameEn: 'Roserade', nameTh: 'โรซเลด', hasDetailPage: true },
  'Vivillon': { id: 666, slug: 'vivillon', nameEn: 'Vivillon', nameTh: 'บีวิยอน', hasDetailPage: true },
  'Rotom Fan': { id: 10011, slug: 'rotom-fan', nameEn: 'Rotom Fan', nameTh: 'โรตอม-แฟน', hasDetailPage: true },
  'Rotom Frost': { id: 10010, slug: 'rotom-frost', nameEn: 'Rotom Frost', nameTh: 'โรตอม-ฟรอสต์', hasDetailPage: true },
  'Rotom Heat': { id: 10008, slug: 'rotom-heat', nameEn: 'Rotom Heat', nameTh: 'โรตอม-ฮีท', hasDetailPage: true },
  'Rotom Mow': { id: 10012, slug: 'rotom-mow', nameEn: 'Rotom Mow', nameTh: 'โรตอม-มาว', hasDetailPage: true },
  'Heracross': { id: 214, slug: 'heracross', nameEn: 'Heracross', nameTh: 'เฮราคลอส', hasDetailPage: true },
  'Hisuian Samurott': { id: 10236, slug: 'samurott-hisui', nameEn: 'Hisuian Samurott', nameTh: 'ไดเค็นกิ (ฮิซุย)', hasDetailPage: true },
  'Kleavor': { id: 900, slug: 'kleavor', nameEn: 'Kleavor', nameTh: 'บาซากิริ', hasDetailPage: true },
  'Kommo O': { id: 784, slug: 'kommo-o', nameEn: 'Kommo O', nameTh: 'จาราลังก้า', hasDetailPage: true },
  'Pinsir': { id: 127, slug: 'pinsir', nameEn: 'Pinsir', nameTh: 'ไคโรส', hasDetailPage: true },
  'Toxicroak': { id: 454, slug: 'toxicroak', nameEn: 'Toxicroak', nameTh: 'โดคุร็อก', hasDetailPage: true },
  'Gourgeist Average': { id: 711, slug: 'gourgeist', nameEn: 'Gourgeist Average', nameTh: 'พัมพ์จิน', hasDetailPage: true },
  'Lycanroc Midnight': { id: 10126, slug: 'lycanroc-midnight', nameEn: 'Lycanroc Midnight', nameTh: 'ลูการ์ลูกัน-กลางคืน', hasDetailPage: true },
  'Altaria': { id: 334, slug: 'altaria', nameEn: 'Altaria', nameTh: 'ทิยาลทิอา', hasDetailPage: true },
  'Arbok': { id: 24, slug: 'arbok', nameEn: 'Arbok', nameTh: 'อาโบคุ', hasDetailPage: true },
  'Chandelure': { id: 609, slug: 'chandelure', nameEn: 'Chandelure', nameTh: 'ชานเดลร่า', hasDetailPage: true },
  'Gallade': { id: 475, slug: 'gallade', nameEn: 'Gallade', nameTh: 'เอรเลด', hasDetailPage: true },
  'Glalie': { id: 362, slug: 'glalie', nameEn: 'Glalie', nameTh: 'โอนิโกริ', hasDetailPage: true },
  'Goodra': { id: 706, slug: 'goodra', nameEn: 'Goodra', nameTh: 'นุเมรุกอน', hasDetailPage: true },
  'Medicham': { id: 308, slug: 'medicham', nameEn: 'Medicham', nameTh: 'ชาร์เลม', hasDetailPage: true },
  'Mega Meganium': { id: 10282, slug: 'meganium-mega', nameEn: 'Mega Meganium', nameTh: 'เมกะเนียมเมก้า', hasDetailPage: true },
  'Meganium': { id: 154, slug: 'meganium', nameEn: 'Meganium', nameTh: 'เมกะเนียม', hasDetailPage: true },
  'Passimian': { id: 766, slug: 'passimian', nameEn: 'Passimian', nameTh: 'นาเกะสึเคะซารุ', hasDetailPage: true },
  'Vanilluxe': { id: 584, slug: 'vanilluxe', nameEn: 'Vanilluxe', nameTh: 'ไบบานิลลา', hasDetailPage: true },
  'Basculegion Female': { id: 10248, slug: 'basculegion-female', nameEn: 'Basculegion Female', nameTh: 'อิดาเรดดอน-เพศเมีย', hasDetailPage: true },
  'Diggersby': { id: 660, slug: 'diggersby', nameEn: 'Diggersby', nameTh: 'โฮรูโดะ', hasDetailPage: true },
  'Feraligatr': { id: 160, slug: 'feraligatr', nameEn: 'Feraligatr', nameTh: 'โอไดล์', hasDetailPage: true },
  'Mega Feraligatr': { id: 10283, slug: 'feraligatr-mega', nameEn: 'Mega Feraligatr', nameTh: 'โอไดล์เมก้า', hasDetailPage: true },
  'Watchog': { id: 505, slug: 'watchog', nameEn: 'Watchog', nameTh: 'มิรุฮ็อก', hasDetailPage: true },
  'Absol': { id: 359, slug: 'absol', nameEn: 'Absol', nameTh: 'อับโซล', hasDetailPage: true },
  'Beedrill': { id: 15, slug: 'beedrill', nameEn: 'Beedrill', nameTh: 'สเปียร์', hasDetailPage: true },
  'Florges': { id: 671, slug: 'florges', nameEn: 'Florges', nameTh: 'ฟลาเจส', hasDetailPage: true },
  'Garbodor': { id: 569, slug: 'garbodor', nameEn: 'Garbodor', nameTh: 'ดัสต์ดาส', hasDetailPage: true },
  'Mega Emboar': { id: 10286, slug: 'emboar-mega', nameEn: 'Mega Emboar', nameTh: 'เอนบุโอ้เมก้า', hasDetailPage: true },
  'Mega Scovillain': { id: 10320, slug: 'scovillain-mega', nameEn: 'Mega Scovillain', nameTh: 'สโคบิลเลนเมก้า', hasDetailPage: true },
  'Slurpuff': { id: 685, slug: 'slurpuff', nameEn: 'Slurpuff', nameTh: 'เปโรรีม', hasDetailPage: true },
  'Tsareena': { id: 763, slug: 'tsareena', nameEn: 'Tsareena', nameTh: 'อามาโจ', hasDetailPage: true },
  'Mega Tyranitar': { id: 10049, slug: 'tyranitar-mega', nameEn: 'Mega Tyranitar', nameTh: 'บังกิรัสเมก้า', hasDetailPage: true },
  'Sandaconda': { id: 844, slug: 'sandaconda', nameEn: 'Sandaconda', nameTh: 'ซาไดจะ', hasDetailPage: true },
  'Tyrantrum': { id: 697, slug: 'tyrantrum', nameEn: 'Tyrantrum', nameTh: 'กาจิโกราส', hasDetailPage: true },
  'Castform': { id: 351, slug: 'castform', nameEn: 'Castform', nameTh: 'โพวาลุน', hasDetailPage: true },
  'Flapple': { id: 841, slug: 'flapple', nameEn: 'Flapple', nameTh: 'อัปปุริว', hasDetailPage: true },
  'Luxray': { id: 405, slug: 'luxray', nameEn: 'Luxray', nameTh: 'เร็นโทรา', hasDetailPage: true },
  'Mega Clefable': { id: 10278, slug: 'clefable-mega', nameEn: 'Mega Clefable', nameTh: 'พิคซี่เมก้า', hasDetailPage: true },
  'Mega Victreebel': { id: 10279, slug: 'victreebel-mega', nameEn: 'Mega Victreebel', nameTh: 'อุสึโบ๊ตเมก้า', hasDetailPage: true },
  'Mr Rime': { id: 866, slug: 'mr-rime', nameEn: 'Mr Rime', nameTh: 'บาริโคโอรุ', hasDetailPage: true },
  'Polteageist': { id: 855, slug: 'polteageist', nameEn: 'Polteageist', nameTh: 'พอตเดส', hasDetailPage: true },
  'Samurott': { id: 503, slug: 'samurott', nameEn: 'Samurott', nameTh: 'ไดเค็นกิ', hasDetailPage: true },
  'Skarmory': { id: 227, slug: 'skarmory', nameEn: 'Skarmory', nameTh: 'เออามุโด', hasDetailPage: true },
  'Victreebel': { id: 71, slug: 'victreebel', nameEn: 'Victreebel', nameTh: 'อุสึโบ๊ต', hasDetailPage: true },
  'Banette': { id: 354, slug: 'banette', nameEn: 'Banette', nameTh: 'จูเปตต้า', hasDetailPage: true },
  'Chimecho': { id: 358, slug: 'chimecho', nameEn: 'Chimecho', nameTh: 'ชิรีน', hasDetailPage: true },
  'Emboar': { id: 500, slug: 'emboar', nameEn: 'Emboar', nameTh: 'เอนบุโอ้', hasDetailPage: true },
  'Mega Chimecho': { id: 10306, slug: 'chimecho-mega', nameEn: 'Mega Chimecho', nameTh: 'ชิรีนเมก้า', hasDetailPage: true },
  'Orthworm': { id: 968, slug: 'orthworm', nameEn: 'Orthworm', nameTh: 'มิมิซึซึ', hasDetailPage: true },
  'Wyrdeer': { id: 899, slug: 'wyrdeer', nameEn: 'Wyrdeer', nameTh: 'อายาชิชิ', hasDetailPage: true },
  'Alcremie': { id: 869, slug: 'alcremie', nameEn: 'Alcremie', nameTh: 'มาฮอยปปุ', hasDetailPage: true },
  'Chesnaught': { id: 652, slug: 'chesnaught', nameEn: 'Chesnaught', nameTh: 'บริกะร่อน', hasDetailPage: true },
  'Abomasnow': { id: 460, slug: 'abomasnow', nameEn: 'Abomasnow', nameTh: 'ยูคิโนะโอ', hasDetailPage: true },
  'Aegislash Blade': { id: 10026, slug: 'aegislash-blade', nameEn: 'Aegislash Blade', nameTh: 'กิลกาลด์-รูปดาบ', hasDetailPage: true },
  'Aegislash Shield': { id: 681, slug: 'aegislash-shield', nameEn: 'Aegislash Shield', nameTh: 'กิลกาลด์-รูปโล่', hasDetailPage: true },
  'Empoleon': { id: 395, slug: 'empoleon', nameEn: 'Empoleon', nameTh: 'เอ็มเปอร์โต', hasDetailPage: true },
  'Hisuian Decidueye': { id: 10244, slug: 'decidueye-hisui', nameEn: 'Hisuian Decidueye', nameTh: 'จูไนเปอร์ (ฮิซุย)', hasDetailPage: true },
  'Hisuian Goodra': { id: 10242, slug: 'goodra-hisui', nameEn: 'Hisuian Goodra', nameTh: 'นุเมรุกอน (ฮิซุย)', hasDetailPage: true },
  'Oranguru': { id: 765, slug: 'oranguru', nameEn: 'Oranguru', nameTh: 'ยาเรยูทัน', hasDetailPage: true },
  'Toucannon': { id: 733, slug: 'toucannon', nameEn: 'Toucannon', nameTh: 'โดเดกะบาชิ', hasDetailPage: true },
  'Clawitzer': { id: 693, slug: 'clawitzer', nameEn: 'Clawitzer', nameTh: 'บรอสเตอร์', hasDetailPage: true },
  'Aurorus': { id: 699, slug: 'aurorus', nameEn: 'Aurorus', nameTh: 'อามารุรุกะ', hasDetailPage: true },
  'Pangoro': { id: 675, slug: 'pangoro', nameEn: 'Pangoro', nameTh: 'โกรอนดะ', hasDetailPage: true },
  'Rampardos': { id: 409, slug: 'rampardos', nameEn: 'Rampardos', nameTh: 'รัมพาร์ด', hasDetailPage: true },
  'Torterra': { id: 389, slug: 'torterra', nameEn: 'Torterra', nameTh: 'โดไดโตส', hasDetailPage: true },
  'Trevenant': { id: 709, slug: 'trevenant', nameEn: 'Trevenant', nameTh: 'โอโรต', hasDetailPage: true },
  'Ampharos': { id: 181, slug: 'ampharos', nameEn: 'Ampharos', nameTh: 'เด็นริว', hasDetailPage: true },
  'Golurk': { id: 623, slug: 'golurk', nameEn: 'Golurk', nameTh: 'โกรูก', hasDetailPage: true },
  'Machamp': { id: 68, slug: 'machamp', nameEn: 'Machamp', nameTh: 'ไคริกี้', hasDetailPage: true },
  'Mega Golurk': { id: 10313, slug: 'golurk-mega', nameEn: 'Mega Golurk', nameTh: 'โกรูกเมก้า', hasDetailPage: true },
  'Floette': { id: 670, slug: 'floette', nameEn: 'Floette', nameTh: 'ฟลาเอ็ตเตอ', hasDetailPage: true },
  'Aggron': { id: 306, slug: 'aggron', nameEn: 'Aggron', nameTh: 'บอสโกโดรา', hasDetailPage: true },
  'Audino': { id: 531, slug: 'audino', nameEn: 'Audino', nameTh: 'ทาบุนเนะ', hasDetailPage: true },
  'Azumarill': { id: 184, slug: 'azumarill', nameEn: 'Azumarill', nameTh: 'มาริลรี', hasDetailPage: true },
  'Beartic': { id: 614, slug: 'beartic', nameEn: 'Beartic', nameTh: 'ทุนเบอาร์', hasDetailPage: true },
  'Mega Audino': { id: 10069, slug: 'audino-mega', nameEn: 'Mega Audino', nameTh: 'ทาบุนเนะเมก้า', hasDetailPage: true },
  'Sableye': { id: 302, slug: 'sableye', nameEn: 'Sableye', nameTh: 'ยามิราเม', hasDetailPage: true },
  'Ditto': { id: 132, slug: 'ditto', nameEn: 'Ditto', nameTh: 'เมตามอน', hasDetailPage: true },
  'Bellibolt': { id: 939, slug: 'bellibolt', nameEn: 'Bellibolt', nameTh: 'ฮาราบารี่', hasDetailPage: true },
  'Conkeldurr': { id: 534, slug: 'conkeldurr', nameEn: 'Conkeldurr', nameTh: 'โรบุชิน', hasDetailPage: true },
  'Mega Chesnaught': { id: 10292, slug: 'chesnaught-mega', nameEn: 'Mega Chesnaught', nameTh: 'บริกะร่อนเมก้า', hasDetailPage: true },
  'Crabominable': { id: 740, slug: 'crabominable', nameEn: 'Crabominable', nameTh: 'เคเคนคานิ', hasDetailPage: true },
  'Araquanid': { id: 752, slug: 'araquanid', nameEn: 'Araquanid', nameTh: 'โอนิชิซุกุโม', hasDetailPage: true },
  'Ariados': { id: 168, slug: 'ariados', nameEn: 'Ariados', nameTh: 'อาริอาดอส', hasDetailPage: true },
  'Camerupt': { id: 323, slug: 'camerupt', nameEn: 'Camerupt', nameTh: 'บาคูดะ', hasDetailPage: true },
  'Forretress': { id: 205, slug: 'forretress', nameEn: 'Forretress', nameTh: 'โฟเรโทส', hasDetailPage: true },
  'Rhyperior': { id: 464, slug: 'rhyperior', nameEn: 'Rhyperior', nameTh: 'โดไซดอน', hasDetailPage: true },
  'Hisuian Avalugg': { id: 10243, slug: 'avalugg-hisui', nameEn: 'Hisuian Avalugg', nameTh: 'เครเบส (ฮิซุย)', hasDetailPage: true },
  'Drampa': { id: 780, slug: 'drampa', nameEn: 'Drampa', nameTh: 'จิจีรอน', hasDetailPage: true },
  'Mega Drampa': { id: 10302, slug: 'drampa-mega', nameEn: 'Mega Drampa', nameTh: 'จิจีรอนเมก้า', hasDetailPage: true },
  'Mudsdale': { id: 750, slug: 'mudsdale', nameEn: 'Mudsdale', nameTh: 'บันบาโดโร', hasDetailPage: true },
  'Spiritomb': { id: 442, slug: 'spiritomb', nameEn: 'Spiritomb', nameTh: 'มิคาลุเกะ', hasDetailPage: true },
  'Mega Crabominable': { id: 10315, slug: 'crabominable-mega', nameEn: 'Mega Crabominable', nameTh: 'เคเคนคานิเมก้า', hasDetailPage: true },
  'Galarian Stunfisk': { id: 10180, slug: 'stunfisk-galar', nameEn: 'Galarian Stunfisk', nameTh: 'มักเกียว (กาลาร์)', hasDetailPage: true },
  'Stunfisk': { id: 618, slug: 'stunfisk', nameEn: 'Stunfisk', nameTh: 'มักเกียว', hasDetailPage: true },
  'Appletun': { id: 842, slug: 'appletun', nameEn: 'Appletun', nameTh: 'ทารุปปุระ', hasDetailPage: true },
  'Bastiodon': { id: 411, slug: 'bastiodon', nameEn: 'Bastiodon', nameTh: 'โทริเด็ปส์', hasDetailPage: true },
  'Cofagrigus': { id: 563, slug: 'cofagrigus', nameEn: 'Cofagrigus', nameTh: 'เดสคาร์น', hasDetailPage: true },
  'Galarian Slowbro': { id: 10165, slug: 'slowbro-galar', nameEn: 'Galarian Slowbro', nameTh: 'ยาดอร่าน (กาลาร์)', hasDetailPage: true },
  'Mega Abomasnow': { id: 10060, slug: 'abomasnow-mega', nameEn: 'Mega Abomasnow', nameTh: 'ยูคิโนะโอเมก้า', hasDetailPage: true },
  'Reuniclus': { id: 579, slug: 'reuniclus', nameEn: 'Reuniclus', nameTh: 'รันคุลุส', hasDetailPage: true },
  'Runerigus': { id: 867, slug: 'runerigus', nameEn: 'Runerigus', nameTh: 'เดสบาร์น', hasDetailPage: true },
  'Slowbro': { id: 80, slug: 'slowbro', nameEn: 'Slowbro', nameTh: 'ยาดอร่าน', hasDetailPage: true },
  'Slowking': { id: 199, slug: 'slowking', nameEn: 'Slowking', nameTh: 'ยาดอคิง', hasDetailPage: true },
  'Steelix': { id: 208, slug: 'steelix', nameEn: 'Steelix', nameTh: 'ฮากาเนียส', hasDetailPage: true },
  'Aromatisse': { id: 683, slug: 'aromatisse', nameEn: 'Aromatisse', nameTh: 'ฟูเรฟุวัน', hasDetailPage: true },
  'Avalugg': { id: 713, slug: 'avalugg', nameEn: 'Avalugg', nameTh: 'เครเบส', hasDetailPage: true },
  'Mega Camerupt': { id: 10087, slug: 'camerupt-mega', nameEn: 'Mega Camerupt', nameTh: 'บาคูดะเมก้า', hasDetailPage: true },

};

// Normalize lookup: case-insensitive, strip extra spaces
function normalizeKey(name: string): string {
  return name.trim();
}

export function findPokemon(name: string): PokemonRef | null {
  const direct = pokemonIndex[normalizeKey(name)];
  if (direct) return direct;

  // Try case-insensitive match
  const lower = name.toLowerCase();
  for (const [key, ref] of Object.entries(pokemonIndex)) {
    if (key.toLowerCase() === lower) return ref;
  }

  // Try without parenthetical notes (e.g., "Charizard (Mega Y)" → "Charizard")
  const cleaned = name.replace(/\s*\(.*?\)\s*/g, '').trim();
  if (cleaned && cleaned !== name) {
    const cleanedDirect = pokemonIndex[cleaned];
    if (cleanedDirect) return cleanedDirect;
  }

  return null;
}

export function pokemonSpriteUrl(id: number, size: 'small' | 'large' = 'small'): string {
  if (size === 'large') {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  }
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export function itemSpriteUrl(slug: string): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${slug}.png`;
}

/**
 * Fallback sprite URL for items not in PokéAPI sprites repo (mostly Gen 8-9 items).
 * Maps our kebab-case slug → Serebii's condensed slug (no hyphens, lowercase).
 * Returns null if no fallback known (browser will show 🎒 emoji).
 */
const SEREBII_FALLBACKS: Record<string, string> = {
  'booster-energy': 'boosterenergy',
  'wellspring-mask': 'wellspringmask',
  'hearthflame-mask': 'hearthflamemask',
  'cornerstone-mask': 'cornerstonemask',
  'covert-cloak': 'covertcloak',
  'loaded-dice': 'loadeddice',
  'clear-amulet': 'clearamulet',
  'punching-glove': 'punchingglove',
  // PokéAPI has these too but Serebii is a backup
  'mystic-water': 'mysticwater',
  'soft-sand': 'softsand',
  'spell-tag': 'spelltag',
  'pixie-plate': 'pixieplate',
  'grip-claw': 'gripclaw',
};

export function itemSpriteFallbackUrl(slug: string): string | null {
  const serebii = SEREBII_FALLBACKS[slug];
  if (!serebii) return null;
  return `https://www.serebii.net/itemdex/sprites/${serebii}.png`;
}
