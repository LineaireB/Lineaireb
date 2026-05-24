# Linéaire B — Changements visibles & corrections

Récapitulatif des évolutions.

---

## Mode Explorer

### Carte & navigation

- **Zoom** : boutons + / − plus grands et plus faciles à toucher (surtout sur mobile).
- **Vue monde** : le bouton « reset zoom » utilise une **icône globe** à la place du symbole ⌂ (plus clair).
- **Indications carte** : texte d’aide zoom/navigation adapté mobile (2 lignes) et desktop (texte plus lisible).
- **Tooltips des points** : cartes au survol / sélection mieux dimensionnées (textes longs ne débordent plus).
- **Ordre d’affichage** : les tooltips passent **au-dessus** des autres points (plus de points qui masquent une carte ouverte).
- **Clic en dehors** : un clic sur le fond de la carte ferme la sélection, le survol et la notification de découverte.

### Panneau de droite (fiche)

- **Toujours visible sur desktop** : même sans sélection, le panneau affiche « Aucune sélection » avec un message d’aide contextuel.
- **Messages d’aide** :
  - mode normal : « Sélectionne un thème ou clique sur un point de la carte »
  - mode Mystère : « Clique sur un point mystère pour le découvrir »
  - avec un filtre actif : « Clique sur un point de la carte pour afficher sa fiche »
- **Animations** : ouverture _et_ fermeture animées du panneau (slide sur mobile, fondu sur desktop).
- **Mobile** : la fiche reste une barre en bas ; le panneau vide reste masqué sur petit écran.

### Header & sidebar

- **Mode Mystère** : bouton renommé (ex-« Brouillard »), placé à côté Explorer / Comparer sur desktop.
- **Mobile** : bouton **☰ Thèmes** sous les modes, pleine largeur.

### Mode Mystère

- **Points mystère** : couleur orange renforcée + halo pulsé — visibles sur terres **et** océan (avant : quasi invisibles, même couleur que la carte).
- **Découverte** : animation du ring au clic corrigée ; toast « Découverte — … » cliquable.
- **Fermeture** : un seul clic dehors ferme **fiche + toast + backdrop**.

---

## Animations & overlays

- **Toast de découverte** : animation d’**entrée et de sortie** (fondu + léger mouvement).
- **Backdrop** (fond sombre mobile) : fondu à l’**ouverture et à la fermeture**, synchronisé avec la fermeture de la fiche.
- **Fiche détail** : animation de fermeture alignée sur l’ouverture.

---

## Mode Comparer

- **Header compare** : mise en page améliorée sur mobile (sélecteurs empilés si besoin).
- **Cas hybrides** :
  - libellé corrigé : « 1 **hybride** » / « N **hybrides** »
  - le compteur **● N hybride(s)** est **cliquable**
  - au clic : scroll vers la section **Cas hybrides** dans le panneau de droite + **animation** sur le titre et les boutons
  - courte explication ajoutée sous « Cas hybrides »
- **Toast** : se ferme aussi quand on clique un cas hybride dans le panneau (mobile).

---

## Panneau Podcast & crédits

### Accès & contenu

- **Header** : bouton **« Écouter le podcast »** ouvre un panneau dédié (même logique d’animation que la fiche détail : bottom sheet mobile, panneau latéral desktop).
- **Contenu** : kicker « Podcast », titre LinéaireB, tagline, description longue, section **« Écouter sur »** avec liens externes.

### Liens plateformes

- **Badges officiels** (Apple Podcasts, Spotify, Deezer) à la place d’anciens boutons texte + icônes SVG.
- **Badge Apple** : SVG avec **fond blanc**, **coins arrondis** et **bordure grise** (`#A6A6A6`) calqués sur les badges Spotify / Deezer ; pictogramme Apple légèrement réduit pour l’alignement visuel.
- **Mobile** : les trois badges sont **côte à côte** (ligne, retour à la ligne si besoin) ; **desktop** : empilés en colonne dans le panneau étroit.
- **Survol** : léger fondu + remontée de 1 px (pas de surcouche orange type ancien lien texte).

### Crédits

- **Panneau podcast** : « **Podcast par Corréos** ».
- **Footer global** : « **Idée par Corréos** » · lien **« Développé par Chafik El Idrissi »** (profil About.me).

---

## Mobile (global)

- Hauteur viewport corrigée (`100dvh`) — moins de contenu coupé.
- Titre header qui ne se casse plus.
- Contrôles zoom repositionnés (plus de boutons rognés).
- Bottom sheet fiche : n’apparaît plus en style mobile sur **desktop**.

---

## Bugs corrigés

| Problème                                          | Correction                                     |
| ------------------------------------------------- | ---------------------------------------------- |
| Points mystère invisibles sur la carte            | Contraste orange + pulse                       |
| Autres points par-dessus les tooltips             | Calque tooltips séparé au-dessus des marqueurs |
| Toast qui restait en mode Comparer (clic hybride) | Toast fermée à la sélection d’un hybride       |
| Symbole ⌂ peu lisible pour « vue monde »          | Icône globe + libellé accessible               |

---

## Technique (sans impact direct utilisateur)

- Refactor du code (features, tests, CI GitHub Actions).
- TypeScript strict, alias `@/`, lint & tests de données.
- README et structure projet documentés en anglais.

---

## Pistes non implémentées (discutées)

- **Multi-sélection de thèmes** (union / intersection) — reste un seul thème pour l’instant.
- **Fiche thème** dans le panneau de droite quand on filtre — seules les fiches **civilisation** s’y affichent aujourd’hui.
