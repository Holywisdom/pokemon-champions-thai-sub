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
  hasDetailPage?: boolean; // true if we have a detail page for this Pokemon
}

// Comprehensive lookup table for all Pokemon referenced in counters/teammates/etc.
// Keyed by display name (case-insensitive lookup via the helper).
export const pokemonIndex: Record<string, PokemonRef> = {
  // ===== Champions Reg M-A meta (have detail pages) =====
  'Basculegion': { id: 902, slug: 'basculegion', nameEn: 'Basculegion', hasDetailPage: true },
  'Garchomp': { id: 445, slug: 'garchomp', nameEn: 'Garchomp', hasDetailPage: true },
  'Charizard': { id: 6, slug: 'charizard', nameEn: 'Charizard', hasDetailPage: true },
  'Mega Charizard Y': { id: 10035, slug: 'charizard-mega-y', nameEn: 'Mega Charizard Y', hasDetailPage: true },
  'Mega Charizard X': { id: 10034, slug: 'charizard-mega-x', nameEn: 'Mega Charizard X', hasDetailPage: true },
  'Kingambit': { id: 983, slug: 'kingambit', nameEn: 'Kingambit', hasDetailPage: true },
  'Aerodactyl': { id: 142, slug: 'aerodactyl', nameEn: 'Aerodactyl', hasDetailPage: true },
  'Mega Aerodactyl': { id: 10042, slug: 'aerodactyl-mega', nameEn: 'Mega Aerodactyl', hasDetailPage: true },
  'Sylveon': { id: 700, slug: 'sylveon', nameEn: 'Sylveon', hasDetailPage: true },
  'Floette-Eternal': { id: 10061, slug: 'floette-eternal', nameEn: 'Floette-Eternal', hasDetailPage: true },
  'Sneasler': { id: 903, slug: 'sneasler', nameEn: 'Sneasler', hasDetailPage: true },
  'Sinistcha': { id: 1013, slug: 'sinistcha', nameEn: 'Sinistcha', hasDetailPage: true },
  'Incineroar': { id: 727, slug: 'incineroar', nameEn: 'Incineroar', hasDetailPage: true },
  'Archaludon': { id: 1018, slug: 'archaludon', nameEn: 'Archaludon', hasDetailPage: true },
  'Farigiraf': { id: 981, slug: 'farigiraf', nameEn: 'Farigiraf', hasDetailPage: true },
  'Pelipper': { id: 279, slug: 'pelipper', nameEn: 'Pelipper', hasDetailPage: true },
  'Whimsicott': { id: 547, slug: 'whimsicott', nameEn: 'Whimsicott', hasDetailPage: true },
  'Rotom-Wash': { id: 10009, slug: 'rotom-wash', nameEn: 'Rotom-Wash', hasDetailPage: true },
  'Tyranitar': { id: 248, slug: 'tyranitar', nameEn: 'Tyranitar', hasDetailPage: true },
  'Dragonite': { id: 149, slug: 'dragonite', nameEn: 'Dragonite', hasDetailPage: true },
  'Kangaskhan': { id: 115, slug: 'kangaskhan', nameEn: 'Kangaskhan', hasDetailPage: true },
  'Mega Kangaskhan': { id: 10039, slug: 'kangaskhan-mega', nameEn: 'Mega Kangaskhan', hasDetailPage: true },
  'Scizor': { id: 212, slug: 'scizor', nameEn: 'Scizor', hasDetailPage: true },
  'Mega Scizor': { id: 10046, slug: 'scizor-mega', nameEn: 'Mega Scizor', hasDetailPage: true },
  'Glimmora': { id: 970, slug: 'glimmora', nameEn: 'Glimmora', hasDetailPage: true },
  'Blastoise': { id: 9, slug: 'blastoise', nameEn: 'Blastoise', hasDetailPage: true },
  'Mega Blastoise': { id: 10036, slug: 'blastoise-mega', nameEn: 'Mega Blastoise', hasDetailPage: true },
  'Scovillain': { id: 952, slug: 'scovillain', nameEn: 'Scovillain', hasDetailPage: true },
  'Corviknight': { id: 823, slug: 'corviknight', nameEn: 'Corviknight', hasDetailPage: true },
  'Excadrill': { id: 530, slug: 'excadrill', nameEn: 'Excadrill', hasDetailPage: true },
  'Froslass': { id: 478, slug: 'froslass', nameEn: 'Froslass', hasDetailPage: true },
  'Hippowdon': { id: 450, slug: 'hippowdon', nameEn: 'Hippowdon', hasDetailPage: true },
  'Primarina': { id: 730, slug: 'primarina', nameEn: 'Primarina', hasDetailPage: true },
  'Mimikyu': { id: 778, slug: 'mimikyu', nameEn: 'Mimikyu', hasDetailPage: true },
  'Dragapult': { id: 887, slug: 'dragapult', nameEn: 'Dragapult', hasDetailPage: true },
  'Aegislash': { id: 681, slug: 'aegislash', nameEn: 'Aegislash', hasDetailPage: true },

  // ===== References (no detail page yet) =====
  'Gholdengo': { id: 1000, slug: 'gholdengo', nameEn: 'Gholdengo' },
  'Gardevoir': { id: 282, slug: 'gardevoir', nameEn: 'Gardevoir', hasDetailPage: true },
  'Mega Gardevoir': { id: 10051, slug: 'gardevoir-mega', nameEn: 'Mega Gardevoir' },
  'Mega Lucario': { id: 10059, slug: 'lucario-mega', nameEn: 'Mega Lucario' },
  'Mega Heracross': { id: 10047, slug: 'heracross-mega', nameEn: 'Mega Heracross', hasDetailPage: true },
  'Mega Pinsir': { id: 10040, slug: 'pinsir-mega', nameEn: 'Mega Pinsir', hasDetailPage: true },
  'Mega Mawile': { id: 10052, slug: 'mawile-mega', nameEn: 'Mega Mawile' },
  'Mega Gengar': { id: 10038, slug: 'gengar-mega', nameEn: 'Mega Gengar' },
  'Mega Manectric': { id: 10055, slug: 'manectric-mega', nameEn: 'Mega Manectric' },
  'Talonflame': { id: 663, slug: 'talonflame', nameEn: 'Talonflame' },
  'Torkoal': { id: 324, slug: 'torkoal', nameEn: 'Torkoal' },
  'Venusaur': { id: 3, slug: 'venusaur', nameEn: 'Venusaur', hasDetailPage: true },
  'Heatran': { id: 485, slug: 'heatran', nameEn: 'Heatran' },
  'Zapdos': { id: 145, slug: 'zapdos', nameEn: 'Zapdos' },
  'Amoonguss': { id: 591, slug: 'amoonguss', nameEn: 'Amoonguss' },
  'Hatterene': { id: 858, slug: 'hatterene', nameEn: 'Hatterene' },
  'Indeedee': { id: 876, slug: 'indeedee', nameEn: 'Indeedee' },
  'Annihilape': { id: 979, slug: 'annihilape', nameEn: 'Annihilape' },
  'Garganacl': { id: 934, slug: 'garganacl', nameEn: 'Garganacl' },
  'Skeledirge': { id: 911, slug: 'skeledirge', nameEn: 'Skeledirge' },
  'Slowking-Galar': { id: 10172, slug: 'slowking-galar', nameEn: 'Slowking-Galar' },
  'Politoed': { id: 186, slug: 'politoed', nameEn: 'Politoed' },
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
  'Greninja': { id: 658, slug: 'greninja', nameEn: 'Greninja', hasDetailPage: true },
  'Hydrapple': { id: 1019, slug: 'hydrapple', nameEn: 'Hydrapple', hasDetailPage: true },
  'Tinkaton': { id: 959, slug: 'tinkaton', nameEn: 'Tinkaton' },
  'Clefable': { id: 36, slug: 'clefable', nameEn: 'Clefable', hasDetailPage: true },
  'Baxcalibur': { id: 998, slug: 'baxcalibur', nameEn: 'Baxcalibur' },
  'Weavile': { id: 461, slug: 'weavile', nameEn: 'Weavile' },
  'Gyarados': { id: 130, slug: 'gyarados', nameEn: 'Gyarados', hasDetailPage: true },
  'Toxapex': { id: 748, slug: 'toxapex', nameEn: 'Toxapex' },
  'Salamence': { id: 373, slug: 'salamence', nameEn: 'Salamence' },
  'Metagross': { id: 376, slug: 'metagross', nameEn: 'Metagross' },
  'Volcarona': { id: 637, slug: 'volcarona', nameEn: 'Volcarona' },
  'Iron Hands': { id: 1003, slug: 'iron-hands', nameEn: 'Iron Hands' },
  'Flutter Mane': { id: 987, slug: 'flutter-mane', nameEn: 'Flutter Mane' },
  'Great Tusk': { id: 984, slug: 'great-tusk', nameEn: 'Great Tusk' },
  'Iron Valiant': { id: 1006, slug: 'iron-valiant', nameEn: 'Iron Valiant' },
  'Roaring Moon': { id: 1005, slug: 'roaring-moon', nameEn: 'Roaring Moon' },

  // ===== NEW MEGAS (with detail pages) =====
  'Mega Venusaur': { id: 10033, slug: 'venusaur-mega', nameEn: 'Mega Venusaur', hasDetailPage: true },
  'Mega Gengar': { id: 10038, slug: 'gengar-mega', nameEn: 'Mega Gengar', hasDetailPage: true },
  'Mega Gardevoir': { id: 10051, slug: 'gardevoir-mega', nameEn: 'Mega Gardevoir', hasDetailPage: true },
  'Mega Lucario': { id: 10059, slug: 'lucario-mega', nameEn: 'Mega Lucario', hasDetailPage: true },
  'Mega Manectric': { id: 10055, slug: 'manectric-mega', nameEn: 'Mega Manectric', hasDetailPage: true },
  'Mega Alakazam': { id: 10037, slug: 'alakazam-mega', nameEn: 'Mega Alakazam', hasDetailPage: true },
  'Mega Gyarados': { id: 10041, slug: 'gyarados-mega', nameEn: 'Mega Gyarados', hasDetailPage: true },
  'Mega Lopunny': { id: 10088, slug: 'lopunny-mega', nameEn: 'Mega Lopunny', hasDetailPage: true },
  'Mega Houndoom': { id: 10048, slug: 'houndoom-mega', nameEn: 'Mega Houndoom', hasDetailPage: true },
  'Mega Sableye': { id: 10066, slug: 'sableye-mega', nameEn: 'Mega Sableye', hasDetailPage: true },
  'Mega Altaria': { id: 10067, slug: 'altaria-mega', nameEn: 'Mega Altaria', hasDetailPage: true },
  'Mega Steelix': { id: 10072, slug: 'steelix-mega', nameEn: 'Mega Steelix', hasDetailPage: true },
  'Mega Slowbro': { id: 10071, slug: 'slowbro-mega', nameEn: 'Mega Slowbro', hasDetailPage: true },
  'Mega Gallade': { id: 10068, slug: 'gallade-mega', nameEn: 'Mega Gallade', hasDetailPage: true },
  'Mega Pidgeot': { id: 10073, slug: 'pidgeot-mega', nameEn: 'Mega Pidgeot', hasDetailPage: true },
  'Mega Pinsir': { id: 10040, slug: 'pinsir-mega', nameEn: 'Mega Pinsir', hasDetailPage: true },
  'Mega Heracross': { id: 10047, slug: 'heracross-mega', nameEn: 'Mega Heracross', hasDetailPage: true },
  'Mega Banette': { id: 10056, slug: 'banette-mega', nameEn: 'Mega Banette', hasDetailPage: true },
  'Mega Aggron': { id: 10053, slug: 'aggron-mega', nameEn: 'Mega Aggron', hasDetailPage: true },
  'Mega Ampharos': { id: 10045, slug: 'ampharos-mega', nameEn: 'Mega Ampharos', hasDetailPage: true },

  // ===== NEW EEVEELUTIONS (with detail pages) =====
  'Espeon': { id: 196, slug: 'espeon', nameEn: 'Espeon', hasDetailPage: true },
  'Umbreon': { id: 197, slug: 'umbreon', nameEn: 'Umbreon', hasDetailPage: true },
  'Vaporeon': { id: 134, slug: 'vaporeon', nameEn: 'Vaporeon', hasDetailPage: true },
  'Jolteon': { id: 135, slug: 'jolteon', nameEn: 'Jolteon', hasDetailPage: true },
  'Flareon': { id: 136, slug: 'flareon', nameEn: 'Flareon', hasDetailPage: true },
  'Leafeon': { id: 470, slug: 'leafeon', nameEn: 'Leafeon', hasDetailPage: true },
  'Glaceon': { id: 471, slug: 'glaceon', nameEn: 'Glaceon', hasDetailPage: true },

  // ===== NEW STARTERS / VIABLE PICKS (with detail pages) =====
  'Skeledirge': { id: 911, slug: 'skeledirge', nameEn: 'Skeledirge', hasDetailPage: true },
  'Meowscarada': { id: 908, slug: 'meowscarada', nameEn: 'Meowscarada', hasDetailPage: true },
  'Quaquaval': { id: 914, slug: 'quaquaval', nameEn: 'Quaquaval', hasDetailPage: true },
  'Decidueye': { id: 724, slug: 'decidueye', nameEn: 'Decidueye', hasDetailPage: true },
  'Infernape': { id: 392, slug: 'infernape', nameEn: 'Infernape', hasDetailPage: true },
  'Typhlosion': { id: 157, slug: 'typhlosion', nameEn: 'Typhlosion', hasDetailPage: true },
  'Serperior': { id: 497, slug: 'serperior', nameEn: 'Serperior', hasDetailPage: true },
  'Volcarona': { id: 637, slug: 'volcarona', nameEn: 'Volcarona', hasDetailPage: true },
  'Hatterene': { id: 858, slug: 'hatterene', nameEn: 'Hatterene', hasDetailPage: true },
  'Tinkaton': { id: 959, slug: 'tinkaton', nameEn: 'Tinkaton', hasDetailPage: true },
  'Garganacl': { id: 934, slug: 'garganacl', nameEn: 'Garganacl', hasDetailPage: true },
  'Weavile': { id: 461, slug: 'weavile', nameEn: 'Weavile', hasDetailPage: true },
  'Gliscor': { id: 472, slug: 'gliscor', nameEn: 'Gliscor', hasDetailPage: true },
  'Mamoswine': { id: 473, slug: 'mamoswine', nameEn: 'Mamoswine', hasDetailPage: true },
  'Hydreigon': { id: 635, slug: 'hydreigon', nameEn: 'Hydreigon', hasDetailPage: true },
  'Toxapex': { id: 748, slug: 'toxapex', nameEn: 'Toxapex', hasDetailPage: true },
  'Ninetales-Alola': { id: 10104, slug: 'ninetales-alola', nameEn: 'Ninetales-Alola', hasDetailPage: true },
  'Torkoal': { id: 324, slug: 'torkoal', nameEn: 'Torkoal', hasDetailPage: true },
  'Politoed': { id: 186, slug: 'politoed', nameEn: 'Politoed', hasDetailPage: true },
  'Snorlax': { id: 143, slug: 'snorlax', nameEn: 'Snorlax', hasDetailPage: true },
  'Maushold': { id: 925, slug: 'maushold', nameEn: 'Maushold', hasDetailPage: true },
  'Talonflame': { id: 663, slug: 'talonflame', nameEn: 'Talonflame', hasDetailPage: true },
  'Klefki': { id: 707, slug: 'klefki', nameEn: 'Klefki', hasDetailPage: true },
  'Armarouge': { id: 936, slug: 'armarouge', nameEn: 'Armarouge', hasDetailPage: true },
  'Ceruledge': { id: 937, slug: 'ceruledge', nameEn: 'Ceruledge', hasDetailPage: true },
  'Slowking-Galar': { id: 10172, slug: 'slowking-galar', nameEn: 'Slowking-Galar', hasDetailPage: true },
  'Milotic': { id: 350, slug: 'milotic', nameEn: 'Milotic', hasDetailPage: true },
  'Salazzle': { id: 758, slug: 'salazzle', nameEn: 'Salazzle', hasDetailPage: true },

  // ===== NEW EXPANDED ROSTER (Task 7) =====
  'Mega Beedrill': { id: 10090, slug: 'beedrill-mega', nameEn: 'Mega Beedrill', hasDetailPage: true },
  'Mega Greninja': { id: 10294, slug: 'greninja-mega', nameEn: 'Mega Greninja', hasDetailPage: true },
  'Mega Delphox': { id: 10293, slug: 'delphox-mega', nameEn: 'Mega Delphox', hasDetailPage: true },
  'Raichu': { id: 26, slug: 'raichu', nameEn: 'Raichu', hasDetailPage: true },
  'Mega Meowstic': { id: 10314, slug: 'meowstic-mega', nameEn: 'Mega Meowstic', hasDetailPage: true },
  'Noivern': { id: 715, slug: 'noivern', nameEn: 'Noivern', hasDetailPage: true },
  'Alakazam': { id: 65, slug: 'alakazam', nameEn: 'Alakazam', hasDetailPage: true },
  'Mega Froslass': { id: 10285, slug: 'froslass-mega', nameEn: 'Mega Froslass', hasDetailPage: true },
  'Mega Starmie': { id: 10280, slug: 'starmie-mega', nameEn: 'Mega Starmie', hasDetailPage: true },
  'Hawlucha': { id: 701, slug: 'hawlucha', nameEn: 'Hawlucha', hasDetailPage: true },
  'Mega Hawlucha': { id: 10300, slug: 'hawlucha-mega', nameEn: 'Mega Hawlucha', hasDetailPage: true },
  'Mega Absol': { id: 10057, slug: 'absol-mega', nameEn: 'Mega Absol', hasDetailPage: true },
  'Starmie': { id: 121, slug: 'starmie', nameEn: 'Starmie', hasDetailPage: true },
  'Lycanroc Midday': { id: 745, slug: 'lycanroc', nameEn: 'Lycanroc Midday', hasDetailPage: true },
  'Alolan Raichu': { id: 10100, slug: 'raichu-alola', nameEn: 'Alolan Raichu', hasDetailPage: true },
  'Gengar': { id: 94, slug: 'gengar', nameEn: 'Gengar', hasDetailPage: true },
  'Hisuian Zoroark': { id: 10239, slug: 'zoroark-hisui', nameEn: 'Hisuian Zoroark', hasDetailPage: true },
  'Lycanroc Dusk': { id: 10152, slug: 'lycanroc-dusk', nameEn: 'Lycanroc Dusk', hasDetailPage: true },
  'Mega Skarmory': { id: 10284, slug: 'skarmory-mega', nameEn: 'Mega Skarmory', hasDetailPage: true },
  'Tauros': { id: 128, slug: 'tauros', nameEn: 'Tauros', hasDetailPage: true },
  'Heliolisk': { id: 695, slug: 'heliolisk', nameEn: 'Heliolisk', hasDetailPage: true },
  'Liepard': { id: 510, slug: 'liepard', nameEn: 'Liepard', hasDetailPage: true },
  'Espathra': { id: 956, slug: 'espathra', nameEn: 'Espathra', hasDetailPage: true },
  'Lopunny': { id: 428, slug: 'lopunny', nameEn: 'Lopunny', hasDetailPage: true },
  'Manectric': { id: 310, slug: 'manectric', nameEn: 'Manectric', hasDetailPage: true },
  'Mega Sharpedo': { id: 10070, slug: 'sharpedo-mega', nameEn: 'Mega Sharpedo', hasDetailPage: true },
  'Zoroark': { id: 571, slug: 'zoroark', nameEn: 'Zoroark', hasDetailPage: true },
  'Delphox': { id: 655, slug: 'delphox', nameEn: 'Delphox', hasDetailPage: true },
  'Meowstic Male': { id: 678, slug: 'meowstic', nameEn: 'Meowstic Male', hasDetailPage: true },
  'Meowstic Female': { id: 10025, slug: 'meowstic-female', nameEn: 'Meowstic Female', hasDetailPage: true },
  'Emolga': { id: 587, slug: 'emolga', nameEn: 'Emolga', hasDetailPage: true },
  'Mega Excadrill': { id: 10287, slug: 'excadrill-mega', nameEn: 'Mega Excadrill', hasDetailPage: true },
  'Furfrou': { id: 676, slug: 'furfrou', nameEn: 'Furfrou', hasDetailPage: true },
  'Mega Floette': { id: 10296, slug: 'floette-mega', nameEn: 'Mega Floette', hasDetailPage: true },
  'Dedenne': { id: 702, slug: 'dedenne', nameEn: 'Dedenne', hasDetailPage: true },
  'Mega Glimmora': { id: 10321, slug: 'glimmora-mega', nameEn: 'Mega Glimmora', hasDetailPage: true },
  'Pidgeot': { id: 18, slug: 'pidgeot', nameEn: 'Pidgeot', hasDetailPage: true },
  'Simipour': { id: 516, slug: 'simipour', nameEn: 'Simipour', hasDetailPage: true },
  'Simisage': { id: 512, slug: 'simisage', nameEn: 'Simisage', hasDetailPage: true },
  'Simisear': { id: 514, slug: 'simisear', nameEn: 'Simisear', hasDetailPage: true },
  'Mega Dragonite': { id: 10281, slug: 'dragonite-mega', nameEn: 'Mega Dragonite', hasDetailPage: true },
  'Mega Glalie': { id: 10074, slug: 'glalie-mega', nameEn: 'Mega Glalie', hasDetailPage: true },
  'Mega Medicham': { id: 10054, slug: 'medicham-mega', nameEn: 'Mega Medicham', hasDetailPage: true },
  'Ninetales': { id: 38, slug: 'ninetales', nameEn: 'Ninetales', hasDetailPage: true },
  'Palafin Zero': { id: 964, slug: 'palafin', nameEn: 'Palafin Zero', hasDetailPage: true },
  'Tauros Paldea Combat Breed': { id: 10250, slug: 'tauros-paldea', nameEn: 'Tauros Paldea Combat Breed', hasDetailPage: true },
  'Tauros Paldea Aqua Breed': { id: 10252, slug: 'tauros-paldea-aqua-breed', nameEn: 'Tauros Paldea Aqua Breed', hasDetailPage: true },
  'Tauros Paldea Blaze Breed': { id: 10251, slug: 'tauros-paldea-blaze-breed', nameEn: 'Tauros Paldea Blaze Breed', hasDetailPage: true },
  'Morpeko Full Belly': { id: 877, slug: 'morpeko', nameEn: 'Morpeko Full Belly', hasDetailPage: true },
  'Arcanine': { id: 59, slug: 'arcanine', nameEn: 'Arcanine', hasDetailPage: true },
  'Hisuian Typhlosion': { id: 10233, slug: 'typhlosion-hisui', nameEn: 'Hisuian Typhlosion', hasDetailPage: true },
  'Houndoom': { id: 229, slug: 'houndoom', nameEn: 'Houndoom', hasDetailPage: true },
  'Sharpedo': { id: 319, slug: 'sharpedo', nameEn: 'Sharpedo', hasDetailPage: true },
  'Krookodile': { id: 553, slug: 'krookodile', nameEn: 'Krookodile', hasDetailPage: true },
  'Mega Garchomp': { id: 10058, slug: 'garchomp-mega', nameEn: 'Mega Garchomp', hasDetailPage: true },
  'Rotom': { id: 479, slug: 'rotom', nameEn: 'Rotom', hasDetailPage: true },
  'Hisuian Arcanine': { id: 10230, slug: 'arcanine-hisui', nameEn: 'Hisuian Arcanine', hasDetailPage: true },
  'Lucario': { id: 448, slug: 'lucario', nameEn: 'Lucario', hasDetailPage: true },
  'Mega Chandelure': { id: 10291, slug: 'chandelure-mega', nameEn: 'Mega Chandelure', hasDetailPage: true },
  'Pikachu': { id: 25, slug: 'pikachu', nameEn: 'Pikachu', hasDetailPage: true },
  'Roserade': { id: 407, slug: 'roserade', nameEn: 'Roserade', hasDetailPage: true },
  'Vivillon': { id: 666, slug: 'vivillon', nameEn: 'Vivillon', hasDetailPage: true },
  'Rotom Fan': { id: 10011, slug: 'rotom-fan', nameEn: 'Rotom Fan', hasDetailPage: true },
  'Rotom Frost': { id: 10010, slug: 'rotom-frost', nameEn: 'Rotom Frost', hasDetailPage: true },
  'Rotom Heat': { id: 10008, slug: 'rotom-heat', nameEn: 'Rotom Heat', hasDetailPage: true },
  'Rotom Mow': { id: 10012, slug: 'rotom-mow', nameEn: 'Rotom Mow', hasDetailPage: true },
  'Heracross': { id: 214, slug: 'heracross', nameEn: 'Heracross', hasDetailPage: true },
  'Hisuian Samurott': { id: 10236, slug: 'samurott-hisui', nameEn: 'Hisuian Samurott', hasDetailPage: true },
  'Kleavor': { id: 900, slug: 'kleavor', nameEn: 'Kleavor', hasDetailPage: true },
  'Kommo O': { id: 784, slug: 'kommo-o', nameEn: 'Kommo O', hasDetailPage: true },
  'Pinsir': { id: 127, slug: 'pinsir', nameEn: 'Pinsir', hasDetailPage: true },
  'Toxicroak': { id: 454, slug: 'toxicroak', nameEn: 'Toxicroak', hasDetailPage: true },
  'Gourgeist Average': { id: 711, slug: 'gourgeist', nameEn: 'Gourgeist Average', hasDetailPage: true },
  'Lycanroc Midnight': { id: 10126, slug: 'lycanroc-midnight', nameEn: 'Lycanroc Midnight', hasDetailPage: true },
  'Altaria': { id: 334, slug: 'altaria', nameEn: 'Altaria', hasDetailPage: true },
  'Arbok': { id: 24, slug: 'arbok', nameEn: 'Arbok', hasDetailPage: true },
  'Chandelure': { id: 609, slug: 'chandelure', nameEn: 'Chandelure', hasDetailPage: true },
  'Gallade': { id: 475, slug: 'gallade', nameEn: 'Gallade', hasDetailPage: true },
  'Glalie': { id: 362, slug: 'glalie', nameEn: 'Glalie', hasDetailPage: true },
  'Goodra': { id: 706, slug: 'goodra', nameEn: 'Goodra', hasDetailPage: true },
  'Medicham': { id: 308, slug: 'medicham', nameEn: 'Medicham', hasDetailPage: true },
  'Mega Meganium': { id: 10282, slug: 'meganium-mega', nameEn: 'Mega Meganium', hasDetailPage: true },
  'Meganium': { id: 154, slug: 'meganium', nameEn: 'Meganium', hasDetailPage: true },
  'Passimian': { id: 766, slug: 'passimian', nameEn: 'Passimian', hasDetailPage: true },
  'Vanilluxe': { id: 584, slug: 'vanilluxe', nameEn: 'Vanilluxe', hasDetailPage: true },
  'Basculegion Female': { id: 10248, slug: 'basculegion-female', nameEn: 'Basculegion Female', hasDetailPage: true },
  'Diggersby': { id: 660, slug: 'diggersby', nameEn: 'Diggersby', hasDetailPage: true },
  'Feraligatr': { id: 160, slug: 'feraligatr', nameEn: 'Feraligatr', hasDetailPage: true },
  'Mega Feraligatr': { id: 10283, slug: 'feraligatr-mega', nameEn: 'Mega Feraligatr', hasDetailPage: true },
  'Watchog': { id: 505, slug: 'watchog', nameEn: 'Watchog', hasDetailPage: true },
  'Absol': { id: 359, slug: 'absol', nameEn: 'Absol', hasDetailPage: true },
  'Beedrill': { id: 15, slug: 'beedrill', nameEn: 'Beedrill', hasDetailPage: true },
  'Florges': { id: 671, slug: 'florges', nameEn: 'Florges', hasDetailPage: true },
  'Garbodor': { id: 569, slug: 'garbodor', nameEn: 'Garbodor', hasDetailPage: true },
  'Mega Emboar': { id: 10286, slug: 'emboar-mega', nameEn: 'Mega Emboar', hasDetailPage: true },
  'Mega Scovillain': { id: 10320, slug: 'scovillain-mega', nameEn: 'Mega Scovillain', hasDetailPage: true },
  'Slurpuff': { id: 685, slug: 'slurpuff', nameEn: 'Slurpuff', hasDetailPage: true },
  'Tsareena': { id: 763, slug: 'tsareena', nameEn: 'Tsareena', hasDetailPage: true },
  'Mega Tyranitar': { id: 10049, slug: 'tyranitar-mega', nameEn: 'Mega Tyranitar', hasDetailPage: true },
  'Sandaconda': { id: 844, slug: 'sandaconda', nameEn: 'Sandaconda', hasDetailPage: true },
  'Tyrantrum': { id: 697, slug: 'tyrantrum', nameEn: 'Tyrantrum', hasDetailPage: true },
  'Castform': { id: 351, slug: 'castform', nameEn: 'Castform', hasDetailPage: true },
  'Flapple': { id: 841, slug: 'flapple', nameEn: 'Flapple', hasDetailPage: true },
  'Luxray': { id: 405, slug: 'luxray', nameEn: 'Luxray', hasDetailPage: true },
  'Mega Clefable': { id: 10278, slug: 'clefable-mega', nameEn: 'Mega Clefable', hasDetailPage: true },
  'Mega Victreebel': { id: 10279, slug: 'victreebel-mega', nameEn: 'Mega Victreebel', hasDetailPage: true },
  'Mr Rime': { id: 866, slug: 'mr-rime', nameEn: 'Mr Rime', hasDetailPage: true },
  'Polteageist': { id: 855, slug: 'polteageist', nameEn: 'Polteageist', hasDetailPage: true },
  'Samurott': { id: 503, slug: 'samurott', nameEn: 'Samurott', hasDetailPage: true },
  'Skarmory': { id: 227, slug: 'skarmory', nameEn: 'Skarmory', hasDetailPage: true },
  'Victreebel': { id: 71, slug: 'victreebel', nameEn: 'Victreebel', hasDetailPage: true },
  'Banette': { id: 354, slug: 'banette', nameEn: 'Banette', hasDetailPage: true },
  'Chimecho': { id: 358, slug: 'chimecho', nameEn: 'Chimecho', hasDetailPage: true },
  'Emboar': { id: 500, slug: 'emboar', nameEn: 'Emboar', hasDetailPage: true },
  'Mega Chimecho': { id: 10306, slug: 'chimecho-mega', nameEn: 'Mega Chimecho', hasDetailPage: true },
  'Orthworm': { id: 968, slug: 'orthworm', nameEn: 'Orthworm', hasDetailPage: true },
  'Wyrdeer': { id: 899, slug: 'wyrdeer', nameEn: 'Wyrdeer', hasDetailPage: true },
  'Alcremie': { id: 869, slug: 'alcremie', nameEn: 'Alcremie', hasDetailPage: true },
  'Chesnaught': { id: 652, slug: 'chesnaught', nameEn: 'Chesnaught', hasDetailPage: true },
  'Abomasnow': { id: 460, slug: 'abomasnow', nameEn: 'Abomasnow', hasDetailPage: true },
  'Aegislash Blade': { id: 10026, slug: 'aegislash-blade', nameEn: 'Aegislash Blade', hasDetailPage: true },
  'Aegislash Shield': { id: 681, slug: 'aegislash-shield', nameEn: 'Aegislash Shield', hasDetailPage: true },
  'Empoleon': { id: 395, slug: 'empoleon', nameEn: 'Empoleon', hasDetailPage: true },
  'Hisuian Decidueye': { id: 10244, slug: 'decidueye-hisui', nameEn: 'Hisuian Decidueye', hasDetailPage: true },
  'Hisuian Goodra': { id: 10242, slug: 'goodra-hisui', nameEn: 'Hisuian Goodra', hasDetailPage: true },
  'Oranguru': { id: 765, slug: 'oranguru', nameEn: 'Oranguru', hasDetailPage: true },
  'Toucannon': { id: 733, slug: 'toucannon', nameEn: 'Toucannon', hasDetailPage: true },
  'Clawitzer': { id: 693, slug: 'clawitzer', nameEn: 'Clawitzer', hasDetailPage: true },
  'Aurorus': { id: 699, slug: 'aurorus', nameEn: 'Aurorus', hasDetailPage: true },
  'Pangoro': { id: 675, slug: 'pangoro', nameEn: 'Pangoro', hasDetailPage: true },
  'Rampardos': { id: 409, slug: 'rampardos', nameEn: 'Rampardos', hasDetailPage: true },
  'Torterra': { id: 389, slug: 'torterra', nameEn: 'Torterra', hasDetailPage: true },
  'Trevenant': { id: 709, slug: 'trevenant', nameEn: 'Trevenant', hasDetailPage: true },
  'Ampharos': { id: 181, slug: 'ampharos', nameEn: 'Ampharos', hasDetailPage: true },
  'Golurk': { id: 623, slug: 'golurk', nameEn: 'Golurk', hasDetailPage: true },
  'Machamp': { id: 68, slug: 'machamp', nameEn: 'Machamp', hasDetailPage: true },
  'Mega Golurk': { id: 10313, slug: 'golurk-mega', nameEn: 'Mega Golurk', hasDetailPage: true },
  'Floette': { id: 670, slug: 'floette', nameEn: 'Floette', hasDetailPage: true },
  'Aggron': { id: 306, slug: 'aggron', nameEn: 'Aggron', hasDetailPage: true },
  'Audino': { id: 531, slug: 'audino', nameEn: 'Audino', hasDetailPage: true },
  'Azumarill': { id: 184, slug: 'azumarill', nameEn: 'Azumarill', hasDetailPage: true },
  'Beartic': { id: 614, slug: 'beartic', nameEn: 'Beartic', hasDetailPage: true },
  'Mega Audino': { id: 10069, slug: 'audino-mega', nameEn: 'Mega Audino', hasDetailPage: true },
  'Sableye': { id: 302, slug: 'sableye', nameEn: 'Sableye', hasDetailPage: true },
  'Ditto': { id: 132, slug: 'ditto', nameEn: 'Ditto', hasDetailPage: true },
  'Bellibolt': { id: 939, slug: 'bellibolt', nameEn: 'Bellibolt', hasDetailPage: true },
  'Conkeldurr': { id: 534, slug: 'conkeldurr', nameEn: 'Conkeldurr', hasDetailPage: true },
  'Mega Chesnaught': { id: 10292, slug: 'chesnaught-mega', nameEn: 'Mega Chesnaught', hasDetailPage: true },
  'Crabominable': { id: 740, slug: 'crabominable', nameEn: 'Crabominable', hasDetailPage: true },
  'Araquanid': { id: 752, slug: 'araquanid', nameEn: 'Araquanid', hasDetailPage: true },
  'Ariados': { id: 168, slug: 'ariados', nameEn: 'Ariados', hasDetailPage: true },
  'Camerupt': { id: 323, slug: 'camerupt', nameEn: 'Camerupt', hasDetailPage: true },
  'Forretress': { id: 205, slug: 'forretress', nameEn: 'Forretress', hasDetailPage: true },
  'Rhyperior': { id: 464, slug: 'rhyperior', nameEn: 'Rhyperior', hasDetailPage: true },
  'Hisuian Avalugg': { id: 10243, slug: 'avalugg-hisui', nameEn: 'Hisuian Avalugg', hasDetailPage: true },
  'Drampa': { id: 780, slug: 'drampa', nameEn: 'Drampa', hasDetailPage: true },
  'Mega Drampa': { id: 10302, slug: 'drampa-mega', nameEn: 'Mega Drampa', hasDetailPage: true },
  'Mudsdale': { id: 750, slug: 'mudsdale', nameEn: 'Mudsdale', hasDetailPage: true },
  'Spiritomb': { id: 442, slug: 'spiritomb', nameEn: 'Spiritomb', hasDetailPage: true },
  'Mega Crabominable': { id: 10315, slug: 'crabominable-mega', nameEn: 'Mega Crabominable', hasDetailPage: true },
  'Galarian Stunfisk': { id: 10180, slug: 'stunfisk-galar', nameEn: 'Galarian Stunfisk', hasDetailPage: true },
  'Stunfisk': { id: 618, slug: 'stunfisk', nameEn: 'Stunfisk', hasDetailPage: true },
  'Appletun': { id: 842, slug: 'appletun', nameEn: 'Appletun', hasDetailPage: true },
  'Bastiodon': { id: 411, slug: 'bastiodon', nameEn: 'Bastiodon', hasDetailPage: true },
  'Cofagrigus': { id: 563, slug: 'cofagrigus', nameEn: 'Cofagrigus', hasDetailPage: true },
  'Galarian Slowbro': { id: 10165, slug: 'slowbro-galar', nameEn: 'Galarian Slowbro', hasDetailPage: true },
  'Mega Abomasnow': { id: 10060, slug: 'abomasnow-mega', nameEn: 'Mega Abomasnow', hasDetailPage: true },
  'Reuniclus': { id: 579, slug: 'reuniclus', nameEn: 'Reuniclus', hasDetailPage: true },
  'Runerigus': { id: 867, slug: 'runerigus', nameEn: 'Runerigus', hasDetailPage: true },
  'Slowbro': { id: 80, slug: 'slowbro', nameEn: 'Slowbro', hasDetailPage: true },
  'Slowking': { id: 199, slug: 'slowking', nameEn: 'Slowking', hasDetailPage: true },
  'Steelix': { id: 208, slug: 'steelix', nameEn: 'Steelix', hasDetailPage: true },
  'Aromatisse': { id: 683, slug: 'aromatisse', nameEn: 'Aromatisse', hasDetailPage: true },
  'Avalugg': { id: 713, slug: 'avalugg', nameEn: 'Avalugg', hasDetailPage: true },
  'Mega Camerupt': { id: 10087, slug: 'camerupt-mega', nameEn: 'Mega Camerupt', hasDetailPage: true },

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
