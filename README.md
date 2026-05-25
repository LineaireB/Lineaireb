# LinéaireB — Interactive civilizations map

> History is not a straight line.

Interactive map of _Linéaire B_ podcast episodes. Civilizations placed on a real-world map, thematic filters, comparison mode, fog of war, zoom/pan.

**UX changelog (French):** [CHANGELOG-UX.md](./CHANGELOG-UX.md)

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
│   │   ├── civilizations.ts    → all map nodes
│   │   ├── comparisons.ts      → comparison mode copy
│   │   ├── constants.ts        → fog milestones, region zoom presets
│   │   └── geo/
│   │       └── countries-110m.json  → bundled Natural Earth TopoJSON
│   ├── lib/
│   │   ├── tags.ts             → theme filtering, tag labels
│   │   ├── geo.ts              → D3 projection, region zoom
│   │   └── storage.ts          → fog persistence (localStorage)
│   ├── hooks/
│   │   ├── useAnimatedPresence.ts
│   │   ├── useContainerSize.ts
│   │   ├── useUiPanels.ts
│   │   ├── useWorldMap.ts
│   │   └── useMapZoom.ts
│   ├── features/
│   │   ├── map/                → MapView, MapLayer, CivNodes, ConnectionLines
│   │   ├── explorer/           → theme sidebar + region zoom
│   │   ├── compare/            → subsistence comparison mode
│   │   └── fog/                → fog of war, discovery progress
│   ├── components/
│   │   ├── layout/AppHeader.tsx
│   │   └── DetailPanel.tsx
│   ├── styles/
│   │   ├── tokens.css          → CSS variables (palette mirror)
│   │   ├── layout.css          → imports layout modules
│   │   └── layout/             → header, panels, map, compare, …
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── src/__tests__/              → Vitest (data integrity, geo, tags)
├── .nvmrc                      → Node 20 (CI + local)
├── .github/workflows/ci.yml    → typecheck + lint + test + build
├── CHANGELOG-UX.md             → visible UX changes (French)
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

From **900px** upward: theme filter as a **map overlay** (collapsible side tab), **340px** side panels (detail, compare, podcast), and wheel / click-drag hints.

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
npm run test        # Vitest — unit + integration
npm run lint        # ESLint
npm run build       # production build → dist/
npm run build:analyze  # build + print dist asset sizes
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

Edit `src/data/civilizations.ts` and append an object to the `CIVILIZATIONS` array:

```ts
{
  id:      'my_unique_id',
  label:   'Site name',
  period: '4th millennium BCE',
  region:  'Geographic region',
  geo:     'europe',   // bretagne | proche_orient | europe | asie | ameriques | null
  lng:     2.5,
  lat:     48.5,
  episode: 'Épisode X',
  tags:    ['agriculture', 'non_lineaire'],  // see src/data/themes.ts
  summary: 'Site description for the detail panel.',
}
```

Run `npm run test` to validate tags and `geo` region keys.

### Test layout

| Area     | File                                                                                 | What it guards                                                 |
| -------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| Data     | `civilizations.test.ts`, `comparisons.test.ts`                                       | Civ records, tags, geo keys, comparison copy                   |
| Lib      | `tags.test.ts`, `geo.test.ts`, `storage.test.ts`, `mapTooltipLayout.test.ts`         | Theme tree, map projection, fog persistence, tooltips          |
| Hooks    | `useDiscovery.test.tsx`, `useAnimatedPresence.test.tsx`, `useContainerSize.test.tsx` | Mystère mode, panel enter/exit, map container measure          |
| Features | `ComparePanel`, `DetailPanel`, `ThemeTree`, `ProgressBar`, `DiscoveryToast`          | Compare hybrids, detail sheet, theme picker, milestones, toast |
| App      | `App.features.test.tsx`, `App.mobile.test.tsx`                                       | Desktop flows + mobile drawer, bottom sheet, overlays          |
| Layout   | `breakpoints.test.ts`, `layout.breakpoints.test.ts`                                  | JS/CSS breakpoint contract (900px tablet)                      |
| Map UI   | `MapHint.test.tsx`                                                                   | Touch vs desktop map hints                                     |

---

## World map data

Projection: Natural Earth (D3). Geometry is bundled from `world-atlas@2` (Natural Earth 110m) — no runtime CDN dependency.

---

## Author

**Chafik El Idrissi**

- [GitHub](https://github.com/celidrissi)
- [LinkedIn](https://www.linkedin.com/in/chafik-el-idrissi/)

The editorial content of the _Linéaire B_ podcast belongs to its creators; this project is a companion map.
