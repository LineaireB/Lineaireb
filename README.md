# LinéaireB — Interactive civilizations map

> History is not a straight line.

Interactive map of _LinéaireB_ podcast episodes. Civilizations placed on a real-world map, thematic filters, comparison mode, fog of war, zoom/pan.

---

## Project structure

```
lineaire-b/
├── public/
│   └── favicon.svg
├── src/
│   ├── types/                  → TypeScript types (Civilisation, TagId, map)
│   ├── data/
│   │   ├── palette.ts          → design system colors
│   │   ├── themes.ts           → theme tree
│   │   ├── civilisations.ts    → all map nodes
│   │   ├── comparaisons.ts     → comparison mode copy
│   │   ├── constants.ts        → fog milestones, region zoom presets
│   │   └── geo/
│   │       └── countries-110m.json  → bundled Natural Earth TopoJSON
│   ├── lib/
│   │   ├── tags.ts             → theme filtering, tag labels
│   │   ├── geo.ts              → D3 projection, region zoom
│   │   └── storage.ts          → fog persistence (localStorage)
│   ├── hooks/
│   │   ├── useContainerSize.ts
│   │   ├── useWorldMap.ts
│   │   └── useMapZoom.ts
│   ├── features/
│   │   ├── map/                → MapView, MapLayer, CivNodes, ConnectionLines
│   │   ├── explorer/           → theme sidebar + region zoom
│   │   ├── compare/            → subsistence comparison mode
│   │   └── fog/                → fog of war, discovery progress
│   ├── components/
│   │   ├── layout/AppHeader.tsx
│   │   └── PanneauDetail.tsx
│   ├── styles/layout.css
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── src/__tests__/              → Vitest (data integrity, geo, tags)
├── .nvmrc                      → Node 20 (CI + local)
├── .github/workflows/ci.yml    → typecheck + test + build
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Prerequisites

- **Node.js 20** (see `.nvmrc`) — matches GitHub Actions CI

```bash
nvm use          # if nvm is installed
npm install
npm run dev
```

Open http://localhost:5173

---

## Responsive layout (mobile-first)

Below **900px** width (phones / narrow viewports):

- **Map** uses the full width; the theme sidebar opens as a **drawer** via the **☰ Thèmes** button in the header.
- **Civilization detail** opens as a **bottom sheet** (tap outside or ✕ to close).
- **Compare mode** stacks the map above the comparison panel (~42vh).
- Map hints and zoom controls use **touch-friendly** copy and tap targets (pinch / drag).

From **900px** upward, the layout matches the desktop experience: persistent sidebar, side detail panel, and wheel / click-drag hints.

---

## Local development (quick start)

```bash
npm install
npm run dev
```

---

## Quality checks

```bash
npm run typecheck   # strict TypeScript
npm run test        # Vitest — data integrity
npm run lint        # ESLint
npm run build       # production build → dist/
```

---

## Build for Render

```bash
npm run build
```

Publish directory: **`dist/`**

---

## Deploy on Render

1. Push the project to GitHub
2. On [render.com](https://render.com) → New → Static Site
3. Settings:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Connect your domain (lineaireb.fr or .com) in site settings

---

## Add an episode

Edit `src/data/civilisations.ts` and append an object to the `CIVILISATIONS` array:

```ts
{
  id:      'my_unique_id',
  label:   'Site name',
  periode: '4th millennium BCE',
  region:  'Geographic region',
  geo:     'europe',   // bretagne | proche_orient | europe | asie | ameriques | null
  lng:     2.5,
  lat:     48.5,
  episode: 'Épisode X',
  tags:    ['agriculture', 'non_lineaire'],  // see src/data/themes.ts
  resume:  'Site description for the detail panel.',
}
```

Run `npm run test` to validate tags and `geo` region keys.

---

## World map data

Projection: Natural Earth (D3). Geometry is bundled from `world-atlas@2` (Natural Earth 110m) — no runtime CDN dependency.

---

## Author

**Chafik El Idrissi** — interactive map application

- [GitHub](https://github.com/celidrissi)
- [LinkedIn](https://www.linkedin.com/in/chafik-el-idrissi/)

The editorial content of the _Linéaire B_ podcast belongs to its creators; this project is a fan companion map.
