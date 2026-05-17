# Pokémon Champions Thai Wiki

คัมภีร์การแข่งขันโปเกมอนฉบับภาษาไทย — Static site built with **Astro + Tailwind CSS**, deployed to **GitHub Pages**.

ครอบคลุมข้อมูล meta competitive ของ Pokémon Champions:
- 📖 Pokédex (โปเกมอน meta พร้อมข้อมูลครบ: stats, sets, counters, teammates)
- ⚔️ ท่าโจมตี (Moves) ยอดนิยม + filter ตามธาตุและหมวด
- ⭐ ความสามารถ (Abilities) สำคัญในการแข่งขัน
- 🎒 ไอเทม (Items) แบ่งตามหมวด
- 🔥 ระบบธาตุ (Type Chart) ครบ 18 ธาตุ
- ☠️ สถานะผิดปกติ, สภาพอากาศ, ภูมิประเทศ, กับดัก (Hazards)
- 🎯 กลไกการต่อสู้ (Mechanics) — Damage calc, EV/IV, Stat stages, etc.

---

## 🚀 เริ่มใช้งาน

### 1. ติดตั้ง dependencies

```bash
npm install
```

### 2. รัน dev server

```bash
npm run dev
```

เปิด `http://localhost:4321/pokemon-champions-thai-sub/` ในเบราว์เซอร์

### 3. Build สำหรับ production

```bash
npm run build
```

ผลลัพธ์อยู่ใน `dist/`

### 4. (ตัวเลือก) ดึงข้อมูลเพิ่มเติมจาก PokéAPI

```bash
npm run fetch         # ดึงเฉพาะ Pokemon ที่อยู่ใน meta list
npm run fetch:full    # ดึง moves ทั้งหมดด้วย (ช้า)
```

ข้อมูลจะถูกเขียนลงใน `src/data/generated/`

---

## 🌐 Deploy ไป GitHub Pages

### Setup ครั้งแรก

1. **แก้ `astro.config.mjs`** ให้ `site` ตรงกับ GitHub Pages URL ของคุณ:
   ```js
   site: 'https://YOUR-USERNAME.github.io',
   base: '/pokemon-champions-thai-sub',
   ```

2. **Push ไป GitHub** (branch `main` หรือ `master`):
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git remote add origin https://github.com/YOUR-USERNAME/pokemon-champions-thai-sub.git
   git push -u origin main
   ```

3. **เปิด GitHub Pages**:
   - ไปที่ Settings → Pages
   - Source: **GitHub Actions**

4. GitHub Action จะ build + deploy อัตโนมัติ (ดูใน Actions tab)

---

## 📁 โครงสร้างโปรเจค

```
.
├── astro.config.mjs        # Astro config (site, base, integrations)
├── tailwind.config.mjs     # Tailwind config (theme, colors)
├── public/                 # Static assets (favicon, robots.txt, etc.)
├── scripts/
│   └── fetch-data.mjs      # ดึงข้อมูลจาก PokéAPI
└── src/
    ├── components/         # Astro components (PokemonCard, TypeBadge, etc.)
    ├── data/
    │   ├── meta.ts         # รายการ Pokemon meta competitive
    │   ├── moves.ts        # ท่าโจมตียอดนิยม
    │   ├── abilities.ts    # ความสามารถ
    │   ├── items.ts        # ไอเทม
    │   ├── types.ts        # Type chart
    │   ├── status.ts       # Status conditions, weather, terrain, hazards
    │   ├── mechanics.ts    # Battle mechanics
    │   └── translations.ts # ตัวแปลภาษาไทย
    ├── layouts/
    │   └── BaseLayout.astro
    ├── lib/
    │   └── utils.ts        # Helpers
    ├── pages/
    │   ├── index.astro     # หน้าแรก
    │   ├── pokedex.astro
    │   ├── pokemon/[slug].astro  # หน้า detail แต่ละตัว
    │   ├── moves/index.astro
    │   ├── abilities/index.astro
    │   ├── items/index.astro
    │   ├── types.astro
    │   ├── status.astro
    │   └── mechanics.astro
    └── styles/
        └── global.css
```

---

## ✏️ การเพิ่มข้อมูล

### เพิ่ม Pokemon ใหม่

แก้ไข `src/data/meta.ts` เพิ่ม entry ใน `META_POKEMON` array:

```ts
{
  id: 1234,
  slug: 'pokemon-name',
  nameEn: 'PokemonName',
  nameTh: 'ชื่อไทย',
  types: ['fire', 'flying'],
  baseStats: { hp: 80, atk: 100, def: 70, spa: 110, spd: 70, spe: 100 },
  abilities: ['Ability Name'],
  tier: 'A',
  role: 'Sweeper',
  roleTh: 'ผู้กวาดล้าง',
  description: 'คำอธิบาย...',
  strengths: ['ข้อ 1', 'ข้อ 2'],
  weaknesses: ['ข้อ 1'],
  commonItems: ['Heavy-Duty Boots'],
  commonMoves: ['Move 1', 'Move 2'],
  sets: [/* ... */],
  counters: ['Pokemon 1'],
  teammates: ['Pokemon 2'],
}
```

### เพิ่มท่าใหม่

แก้ไข `src/data/moves.ts` เพิ่ม entry ใน `moves` array (ดูตัวอย่างในไฟล์)

### เพิ่มคำแปลไทย

แก้ไข `src/data/translations.ts` เพิ่มในส่วน dictionary ที่เกี่ยวข้อง

---

## 🎨 Design System

- **Theme**: Dark mode (Pokemon Champions esports vibes)
- **Colors**:
  - Background: `#0a0a0f`
  - Gold accent: `#ffd166`
  - Ember/Crimson: `#ff6b35` / `#e63946`
  - 18 type colors แบบ official-ish
- **Fonts**:
  - Display: Bebas Neue
  - Body: Noto Sans Thai + Inter
  - Mono: JetBrains Mono

---

## ⚖️ Disclaimer

เว็บไซต์นี้สร้างโดยแฟนพันธุ์แท้ Pokémon เพื่อการศึกษาเท่านั้น
ไม่มีส่วนเกี่ยวข้องกับ Nintendo, Game Freak หรือ The Pokémon Company

- ข้อมูลโปเกมอน: [PokéAPI](https://pokeapi.co/)
- Sprites: [PokeAPI/sprites](https://github.com/PokeAPI/sprites)
- Meta references: VGC, Smogon University

---

## 📝 License

MIT — ใช้งานได้อย่างอิสระทั้งส่วนตัวและเชิงพาณิชย์
