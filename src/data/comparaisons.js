import { P } from './palette.js'

export const COMPARAISONS = {
  chasse_cueillette: {
    label: 'Chasse-cueillette', couleur: P.green,
    dimension_politique: "Souvent sans État centralisé. Mobilité = résistance naturelle à la taxation. Capacité à alterner hiérarchie saisonnière et égalitarisme (Graeber/Wengrow).",
    resilience: "Très haute : diversité des ressources, mobilité, pas de stocks vulnérables.",
    rapport_foret: "Rapport holistique : la forêt est gérée, pas extraite. Écobuages réguliers.",
    effondrement: "Rarement d'effondrement brutal. Vulnérables à la pression externe (Norvège).",
    exemple_lineaireb: "Natoufiens, Jomon, chasseurs norvégiens, peuples des marges (Zomia)",
  },
  agriculture: {
    label: 'Agriculture', couleur: P.terra,
    dimension_politique: "Base des premiers États : les céréales sont visibles, stockables, taxables. Génère hiérarchie et pouvoir centralisé.",
    resilience: "Vulnérable aux sécheresses, épidémies, épuisement des sols. Mais nourrit de grandes densités.",
    rapport_foret: "Déforestation pour les champs. Les Song du Nord : déforestation → crues → effondrement.",
    effondrement: "Effondrements spectaculaires : Indus, Mayas, Song du Nord. La densité crée de la fragilité.",
    exemple_lineaireb: "Agriculteurs néolithiques norvégiens, Mayas, Song du Nord, expansion ibérique",
  },
  agroforesterie: {
    label: 'Agroforesterie', couleur: P.teal,
    dimension_politique: "Sociétés décentralisées. Difficile à taxer et contrôler.",
    resilience: "Très haute : diversité des espèces, gestion du sol sur le long terme.",
    rapport_foret: "Coévolution avec la forêt. L'Amazonie précolombienne était le produit de millénaires d'agroforesterie.",
    effondrement: "La disparition des agroforestiers amérindiens (90% post-1492) a refroidi la planète de 0,15-0,20°C.",
    exemple_lineaireb: "Amériques précolumbiennes, peuples des marges (Zomia)",
  },
  peche: {
    label: 'Pêche', couleur: P.tealLight,
    dimension_politique: "Permet des sociétés complexes SANS agriculture intensive. La hiérarchie n'est pas liée à l'agriculture.",
    resilience: "Très dépendante des conditions marines. Refroidissement du Skagerrak ~2500 av. J.-C. = effondrement norvégien.",
    rapport_foret: "Peu de pression sur la forêt. Orientation vers la mer.",
    effondrement: "Vulnérabilité climatique marine documentée en Norvège.",
    exemple_lineaireb: "Natoufiens (partiellement), Jomon, chasseurs-pêcheurs norvégiens",
  },
  pastoralisme: {
    label: 'Pastoralisme', couleur: P.mauve,
    dimension_politique: "Insaisissables par les États (James C. Scott). Ont pu construire des empires en restant mobiles.",
    resilience: "Haute mobilité = haute résilience. Dépendance aux pâturages.",
    rapport_foret: "Rapport indirect. Les troupeaux peuvent dégrader les pâturages.",
    effondrement: "Rarement d'effondrement strict — la mobilité est un amortisseur.",
    exemple_lineaireb: "Peuples des marges (Zomia), épisode 7 sur James C. Scott",
  },
}

export const SUBSISTANCE_TAGS   = ['chasse_cueillette','agriculture','agroforesterie','peche','pastoralisme']
export const SUBSISTANCE_LABELS = {
  chasse_cueillette:'Chasse-cueillette', agriculture:'Agriculture',
  agroforesterie:'Agroforesterie', peche:'Pêche', pastoralisme:'Pastoralisme',
}
export const DIMENSIONS = [
  { key:'dimension_politique', label:'Organisation politique' },
  { key:'resilience',          label:'Résilience' },
  { key:'rapport_foret',       label:'Rapport à la forêt' },
  { key:'effondrement',        label:'Effondrement' },
  { key:'exemple_lineaireb',   label:'Dans LinéaireB' },
]
