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
  'Mega Charizard X': { id: 10034, slug: 'charizard-mega-x', nameEn: 'Mega Charizard X' },
  'Kingambit': { id: 983, slug: 'kingambit', nameEn: 'Kingambit', hasDetailPage: true },
  'Aerodactyl': { id: 142, slug: 'aerodactyl', nameEn: 'Aerodactyl', hasDetailPage: true },
  'Mega Aerodactyl': { id: 10042, slug: 'aerodactyl-mega', nameEn: 'Mega Aerodactyl' },
  'Sylveon': { id: 700, slug: 'sylveon', nameEn: 'Sylveon', hasDetailPage: true },
  'Floette-Eternal': { id: 10061, slug: 'floette-eternal', nameEn: 'Floette-Eternal', hasDetailPage: true },
  'Sneasler': { id: 903, slug: 'sneasler', nameEn: 'Sneasler', hasDetailPage: true },
  'Sinistcha': { id: 1013, slug: 'sinistcha', nameEn: 'Sinistcha', hasDetailPage: true },
  'Incineroar': { id: 727, slug: 'incineroar', nameEn: 'Incineroar', hasDetailPage: true },
  'Archaludon': { id: 1018, slug: 'archaludon', nameEn: 'Archaludon', hasDetailPage: true },
  'Farigiraf': { id: 981, slug: 'farigiraf', nameEn: 'Farigiraf', hasDetailPage: true },
  'Pelipper': { id: 279, slug: 'pelipper', nameEn: 'Pelipper', hasDetailPage: true },
  'Whimsicott': { id: 547, slug: 'whimsicott', nameEn: 'Whimsicott', hasDetailPage: true },
  'Rotom-Wash': { id: 10008, slug: 'rotom-wash', nameEn: 'Rotom-Wash', hasDetailPage: true },
  'Tyranitar': { id: 248, slug: 'tyranitar', nameEn: 'Tyranitar', hasDetailPage: true },
  'Dragonite': { id: 149, slug: 'dragonite', nameEn: 'Dragonite', hasDetailPage: true },
  'Kangaskhan': { id: 115, slug: 'kangaskhan', nameEn: 'Kangaskhan' },
  'Mega Kangaskhan': { id: 10039, slug: 'kangaskhan-mega', nameEn: 'Mega Kangaskhan', hasDetailPage: true },
  'Scizor': { id: 212, slug: 'scizor', nameEn: 'Scizor' },
  'Mega Scizor': { id: 10046, slug: 'scizor-mega', nameEn: 'Mega Scizor', hasDetailPage: true },
  'Glimmora': { id: 970, slug: 'glimmora', nameEn: 'Glimmora', hasDetailPage: true },
  'Blastoise': { id: 9, slug: 'blastoise', nameEn: 'Blastoise', hasDetailPage: true },
  'Mega Blastoise': { id: 10036, slug: 'blastoise-mega', nameEn: 'Mega Blastoise' },
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
  'Gardevoir': { id: 282, slug: 'gardevoir', nameEn: 'Gardevoir' },
  'Mega Gardevoir': { id: 10068, slug: 'gardevoir-mega', nameEn: 'Mega Gardevoir' },
  'Mega Lucario': { id: 10059, slug: 'lucario-mega', nameEn: 'Mega Lucario' },
  'Mega Heracross': { id: 10047, slug: 'heracross-mega', nameEn: 'Mega Heracross' },
  'Mega Pinsir': { id: 10043, slug: 'pinsir-mega', nameEn: 'Mega Pinsir' },
  'Mega Mawile': { id: 10052, slug: 'mawile-mega', nameEn: 'Mega Mawile' },
  'Mega Gengar': { id: 10038, slug: 'gengar-mega', nameEn: 'Mega Gengar' },
  'Mega Manectric': { id: 10055, slug: 'manectric-mega', nameEn: 'Mega Manectric' },
  'Talonflame': { id: 663, slug: 'talonflame', nameEn: 'Talonflame' },
  'Torkoal': { id: 324, slug: 'torkoal', nameEn: 'Torkoal' },
  'Venusaur': { id: 3, slug: 'venusaur', nameEn: 'Venusaur' },
  'Heatran': { id: 485, slug: 'heatran', nameEn: 'Heatran' },
  'Zapdos': { id: 145, slug: 'zapdos', nameEn: 'Zapdos' },
  'Amoonguss': { id: 591, slug: 'amoonguss', nameEn: 'Amoonguss' },
  'Hatterene': { id: 858, slug: 'hatterene', nameEn: 'Hatterene' },
  'Indeedee': { id: 876, slug: 'indeedee', nameEn: 'Indeedee' },
  'Annihilape': { id: 979, slug: 'annihilape', nameEn: 'Annihilape' },
  'Garganacl': { id: 999, slug: 'garganacl', nameEn: 'Garganacl' },
  'Skeledirge': { id: 935, slug: 'skeledirge', nameEn: 'Skeledirge' },
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
  'Greninja': { id: 658, slug: 'greninja', nameEn: 'Greninja' },
  'Hydrapple': { id: 1019, slug: 'hydrapple', nameEn: 'Hydrapple' },
  'Tinkaton': { id: 959, slug: 'tinkaton', nameEn: 'Tinkaton' },
  'Clefable': { id: 36, slug: 'clefable', nameEn: 'Clefable' },
  'Baxcalibur': { id: 998, slug: 'baxcalibur', nameEn: 'Baxcalibur' },
  'Weavile': { id: 461, slug: 'weavile', nameEn: 'Weavile' },
  'Gyarados': { id: 130, slug: 'gyarados', nameEn: 'Gyarados' },
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
  'Mega Gardevoir': { id: 10068, slug: 'gardevoir-mega', nameEn: 'Mega Gardevoir', hasDetailPage: true },
  'Mega Lucario': { id: 10059, slug: 'lucario-mega', nameEn: 'Mega Lucario', hasDetailPage: true },
  'Mega Manectric': { id: 10055, slug: 'manectric-mega', nameEn: 'Mega Manectric', hasDetailPage: true },
  'Mega Alakazam': { id: 10037, slug: 'alakazam-mega', nameEn: 'Mega Alakazam', hasDetailPage: true },
  'Mega Gyarados': { id: 10041, slug: 'gyarados-mega', nameEn: 'Mega Gyarados', hasDetailPage: true },
  'Mega Lopunny': { id: 10088, slug: 'lopunny-mega', nameEn: 'Mega Lopunny', hasDetailPage: true },
  'Mega Houndoom': { id: 10051, slug: 'houndoom-mega', nameEn: 'Mega Houndoom', hasDetailPage: true },
  'Mega Sableye': { id: 10066, slug: 'sableye-mega', nameEn: 'Mega Sableye', hasDetailPage: true },
  'Mega Altaria': { id: 10067, slug: 'altaria-mega', nameEn: 'Mega Altaria', hasDetailPage: true },
  'Mega Steelix': { id: 10072, slug: 'steelix-mega', nameEn: 'Mega Steelix', hasDetailPage: true },
  'Mega Slowbro': { id: 10071, slug: 'slowbro-mega', nameEn: 'Mega Slowbro', hasDetailPage: true },
  'Mega Gallade': { id: 10069, slug: 'gallade-mega', nameEn: 'Mega Gallade', hasDetailPage: true },
  'Mega Pidgeot': { id: 10073, slug: 'pidgeot-mega', nameEn: 'Mega Pidgeot', hasDetailPage: true },
  'Mega Pinsir': { id: 10043, slug: 'pinsir-mega', nameEn: 'Mega Pinsir' },
  'Mega Heracross': { id: 10047, slug: 'heracross-mega', nameEn: 'Mega Heracross' },
  'Mega Banette': { id: 10049, slug: 'banette-mega', nameEn: 'Mega Banette' },
  'Mega Aggron': { id: 10050, slug: 'aggron-mega', nameEn: 'Mega Aggron' },
  'Mega Ampharos': { id: 10045, slug: 'ampharos-mega', nameEn: 'Mega Ampharos' },

  // ===== NEW EEVEELUTIONS (with detail pages) =====
  'Espeon': { id: 196, slug: 'espeon', nameEn: 'Espeon', hasDetailPage: true },
  'Umbreon': { id: 197, slug: 'umbreon', nameEn: 'Umbreon', hasDetailPage: true },
  'Vaporeon': { id: 134, slug: 'vaporeon', nameEn: 'Vaporeon', hasDetailPage: true },
  'Jolteon': { id: 135, slug: 'jolteon', nameEn: 'Jolteon', hasDetailPage: true },
  'Flareon': { id: 136, slug: 'flareon', nameEn: 'Flareon', hasDetailPage: true },
  'Leafeon': { id: 470, slug: 'leafeon', nameEn: 'Leafeon', hasDetailPage: true },
  'Glaceon': { id: 471, slug: 'glaceon', nameEn: 'Glaceon', hasDetailPage: true },

  // ===== NEW STARTERS / VIABLE PICKS (with detail pages) =====
  'Skeledirge': { id: 935, slug: 'skeledirge', nameEn: 'Skeledirge', hasDetailPage: true },
  'Meowscarada': { id: 908, slug: 'meowscarada', nameEn: 'Meowscarada', hasDetailPage: true },
  'Quaquaval': { id: 912, slug: 'quaquaval', nameEn: 'Quaquaval', hasDetailPage: true },
  'Decidueye': { id: 724, slug: 'decidueye', nameEn: 'Decidueye', hasDetailPage: true },
  'Infernape': { id: 392, slug: 'infernape', nameEn: 'Infernape', hasDetailPage: true },
  'Typhlosion': { id: 157, slug: 'typhlosion', nameEn: 'Typhlosion', hasDetailPage: true },
  'Serperior': { id: 497, slug: 'serperior', nameEn: 'Serperior', hasDetailPage: true },
  'Volcarona': { id: 637, slug: 'volcarona', nameEn: 'Volcarona', hasDetailPage: true },
  'Hatterene': { id: 858, slug: 'hatterene', nameEn: 'Hatterene', hasDetailPage: true },
  'Tinkaton': { id: 959, slug: 'tinkaton', nameEn: 'Tinkaton', hasDetailPage: true },
  'Garganacl': { id: 968, slug: 'garganacl', nameEn: 'Garganacl', hasDetailPage: true },
  'Weavile': { id: 461, slug: 'weavile', nameEn: 'Weavile', hasDetailPage: true },
  'Gliscor': { id: 472, slug: 'gliscor', nameEn: 'Gliscor', hasDetailPage: true },
  'Mamoswine': { id: 473, slug: 'mamoswine', nameEn: 'Mamoswine', hasDetailPage: true },
  'Hydreigon': { id: 635, slug: 'hydreigon', nameEn: 'Hydreigon', hasDetailPage: true },
  'Toxapex': { id: 748, slug: 'toxapex', nameEn: 'Toxapex', hasDetailPage: true },
  'Ninetales-Alola': { id: 10103, slug: 'ninetales-alola', nameEn: 'Ninetales-Alola', hasDetailPage: true },
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
