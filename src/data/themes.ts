import type { ThemeNode } from '@/types/theme'

export const THEMES: Record<string, ThemeNode> = {
  temporalite: {
    label: 'Rapport au temps',
    children: {
      lineaire: { label: 'Vision linéaire / progrès' },
      non_lineaire: { label: 'Ruptures & bifurcations' },
      presentisme: { label: 'Présentisme' },
    },
  },
  politique: {
    label: 'Organisation politique',
    children: {
      royaute_sacree: { label: 'Royauté sacrée' },
      cite_etat: { label: 'Cité-État' },
      sans_etat: { label: 'Sans État / marges' },
      empire: { label: 'Empire' },
    },
  },
  subsistance: {
    label: 'Mode de subsistance',
    children: {
      chasse_cueillette: { label: 'Chasse-cueillette' },
      agriculture: { label: 'Agriculture' },
      agroforesterie: { label: 'Agroforesterie' },
      pastoralisme: { label: 'Pastoralisme' },
      peche: { label: 'Pêche & ressources marines' },
    },
  },
  effondrement: {
    label: 'Effondrement & recomposition',
    children: {
      collapse_politique: { label: 'Collapse politique' },
      crise_eco: { label: 'Crise écologique' },
      bifurcation: { label: 'Bifurcation / renaissance' },
      migration: { label: 'Migration & rupture' },
    },
  },
  foret: {
    label: 'Rapport à la forêt',
    children: {
      deforestation: { label: 'Déforestation' },
      reforestation: { label: 'Reforestation involontaire' },
      gestion: { label: 'Gestion planifiée' },
      holistique: { label: 'Rapport holistique' },
    },
  },
  technique: {
    label: 'Innovation technique',
    children: {
      silex: { label: 'Taille du silex' },
      poterie: { label: 'Poterie' },
      ecriture: { label: 'Écriture' },
      architecture: { label: 'Architecture monumentale' },
      commerce: { label: 'Commerce longue distance' },
    },
  },
}
