# LinéaireB — Carte interactive des civilisations

> L'histoire n'est pas une ligne droite.

Carte interactive des épisodes du podcast LinéaireB. Civilisations positionnées sur un planisphère réel, filtres thématiques, mode comparaison, fog of war, zoom/pan.

---

## Structure du projet

```
lineaire-b/
├── public/
│   └── favicon.svg
├── src/
│   ├── data/
│   │   ├── palette.js          → couleurs charte graphique
│   │   ├── themes.js           → arborescence des thèmes + helpers
│   │   ├── civilisations.js    → tous les nœuds de la carte
│   │   ├── comparaisons.js     → données mode comparaison
│   │   └── constants.js        → jalons fog of war, régions zoom
│   ├── components/
│   │   ├── ThemeNode.jsx       → nœud récursif sidebar
│   │   ├── ProgressBar.jsx     → barre de progression fog of war
│   │   ├── DiscoveryToast.jsx  → notification de découverte
│   │   ├── PanneauDetail.jsx   → fiche détail d'un site
│   │   └── PanneauComparaison.jsx → panneau mode comparer
│   ├── App.jsx                 → composant principal
│   ├── main.jsx                → point d'entrée React
│   └── index.css               → styles globaux + animations
├── index.html
├── vite.config.js
├── package.json
└── .gitignore
```

---

## Lancer en local

```bash
npm install
npm run dev
```

Ouvre http://localhost:5173

---

## Build pour Render

```bash
npm run build
```

Le dossier à publier : **`dist/`**

---

## Déployer sur Render

1. Pousse le projet sur GitHub
2. Sur [render.com](https://render.com) → New → Static Site
3. Paramètres :
   - **Build Command** : `npm install && npm run build`
   - **Publish Directory** : `dist`
4. Connecte ton domaine (lineaireb.fr ou .com) dans les settings

---

## Ajouter un épisode

Ouvre `src/data/civilisations.js` et ajoute un objet au tableau `CIVILISATIONS` :

```js
{
  id:      'mon_id_unique',
  label:   'Nom du site',
  periode: 'IVe millénaire av. J.-C.',
  region:  'Région géographique',
  geo:     'europe',   // clé pour le zoom région (ou null)
  lng:     2.5,        // longitude
  lat:     48.5,       // latitude
  episode: 'Épisode X',
  tags:    ['agriculture', 'non_lineaire'],
  resume:  "Description du site pour la fiche détail.",
}
```

---

## Données carte monde

Chargées depuis `cdn.jsdelivr.net/npm/world-atlas@2` (Natural Earth 110m).
Projection : Natural Earth (D3).
