import { P } from '@/data/palette'
import type { ComparisonData, SubsistenceTag } from '@/types/map'

export const COMPARISONS: Record<SubsistenceTag, ComparisonData> = {
  chasse_cueillette: {
    label: 'Chasse-cueillette', color: P.green,
    politicalOrganization: "Souvent sans État centralisé. Mobilité = résistance naturelle à la taxation. Capacité à alterner hiérarchie saisonnière et égalitarisme (Graeber/Wengrow).",
    resilience: "Très haute : diversité des ressources, mobilité, pas de stocks vulnérables.",
    forestRelation: "Rapport holistique : la forêt est gérée, pas extraite. Écobuages réguliers.",
    collapse: "Rarement d'effondrement brutal. Vulnérables à la pression externe (Norvège).",
    linearBExamples: "Natoufiens, Jomon, chasseurs norvégiens, peuples des marges (Zomia)",
  },
  agriculture: {
    label: 'Agriculture', color: P.terra,
    politicalOrganization: "Base des premiers États : les céréales sont visibles, stockables, taxables. Génère hiérarchie et pouvoir centralisé.",
    resilience: "Vulnérable aux sécheresses, épidémies, épuisement des sols. Mais nourrit de grandes densités.",
    forestRelation: "Déforestation pour les champs. Les Song du Nord : déforestation → crues → effondrement.",
    collapse: "Effondrements spectaculaires : Indus, Mayas, Song du Nord. La densité crée de la fragilité.",
    linearBExamples: "Agriculteurs néolithiques norvégiens, Mayas, Song du Nord, expansion ibérique",
  },
  agroforesterie: {
    label: 'Agroforesterie', color: P.teal,
    politicalOrganization: "Sociétés décentralisées. Difficile à taxer et contrôler.",
    resilience: "Très haute : diversité des espèces, gestion du sol sur le long terme.",
    forestRelation: "Coévolution avec la forêt. L'Amazonie précolombienne était le produit de millénaires d'agroforesterie.",
    collapse: "La disparition des agroforestiers amérindiens (90% post-1492) a refroidi la planète de 0,15-0,20°C.",
    linearBExamples: "Amériques précolumbiennes, peuples des marges (Zomia)",
  },
  peche: {
    label: 'Pêche', color: P.tealLight,
    politicalOrganization: "Permet des sociétés complexes SANS agriculture intensive. La hiérarchie n'est pas liée à l'agriculture.",
    resilience: "Très dépendante des conditions marines. Refroidissement du Skagerrak ~2500 av. J.-C. = effondrement norvégien.",
    forestRelation: "Peu de pression sur la forêt. Orientation vers la mer.",
    collapse: "Vulnérabilité climatique marine documentée en Norvège.",
    linearBExamples: "Natoufiens (partiellement), Jomon, chasseurs-pêcheurs norvégiens",
  },
  pastoralisme: {
    label: 'Pastoralisme', color: P.mauve,
    politicalOrganization: "Insaisissables par les États (James C. Scott). Ont pu construire des empires en restant mobiles.",
    resilience: "Haute mobilité = haute résilience. Dépendance aux pâturages.",
    forestRelation: "Rapport indirect. Les troupeaux peuvent dégrader les pâturages.",
    collapse: "Rarement d'effondrement strict — la mobilité est un amortisseur.",
    linearBExamples: "Peuples des marges (Zomia), épisode 7 sur James C. Scott",
  },
}

export const SUBSISTENCE_TAGS: SubsistenceTag[] = [
  'chasse_cueillette', 'agriculture', 'agroforesterie', 'peche', 'pastoralisme',
]

export const SUBSISTENCE_LABELS: Record<SubsistenceTag, string> = {
  chasse_cueillette: 'Chasse-cueillette',
  agriculture: 'Agriculture',
  agroforesterie: 'Agroforesterie',
  peche: 'Pêche',
  pastoralisme: 'Pastoralisme',
}

export const DIMENSIONS = [
  { key: 'politicalOrganization' as const, label: 'Organisation politique' },
  { key: 'resilience' as const, label: 'Résilience' },
  { key: 'forestRelation' as const, label: 'Rapport à la forêt' },
  { key: 'collapse' as const, label: 'Effondrement' },
  { key: 'linearBExamples' as const, label: 'Dans LinéaireB' },
]
