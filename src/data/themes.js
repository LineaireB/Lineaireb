export const THEMES = {
  temporalite: {
    label: 'Rapport au temps',
    children: {
      lineaire:     { label: 'Vision linéaire / progrès' },
      non_lineaire: { label: 'Ruptures & bifurcations' },
      presentisme:  { label: 'Présentisme' },
    },
  },
  politique: {
    label: 'Organisation politique',
    children: {
      royaute_sacree: { label: 'Royauté sacrée' },
      cite_etat:      { label: 'Cité-État' },
      sans_etat:      { label: 'Sans État / marges' },
      empire:         { label: 'Empire' },
    },
  },
  subsistance: {
    label: 'Mode de subsistance',
    children: {
      chasse_cueillette: { label: 'Chasse-cueillette' },
      agriculture:       { label: 'Agriculture' },
      agroforesterie:    { label: 'Agroforesterie' },
      pastoralisme:      { label: 'Pastoralisme' },
      peche:             { label: 'Pêche & ressources marines' },
    },
  },
  effondrement: {
    label: 'Effondrement & recomposition',
    children: {
      collapse_politique: { label: 'Collapse politique' },
      crise_eco:          { label: 'Crise écologique' },
      bifurcation:        { label: 'Bifurcation / renaissance' },
      migration:          { label: 'Migration & rupture' },
    },
  },
  foret: {
    label: 'Rapport à la forêt',
    children: {
      deforestation: { label: 'Déforestation' },
      reforestation: { label: 'Reforestation involontaire' },
      gestion:       { label: 'Gestion planifiée' },
      holistique:    { label: 'Rapport holistique' },
    },
  },
  technique: {
    label: 'Innovation technique',
    children: {
      silex:        { label: 'Taille du silex' },
      poterie:      { label: 'Poterie' },
      ecriture:     { label: 'Écriture' },
      architecture: { label: 'Architecture monumentale' },
      commerce:     { label: 'Commerce longue distance' },
    },
  },
}

export function getAllTags(node, prefix = '') {
  let tags = []
  if (prefix) tags.push(prefix)
  if (node.children)
    Object.entries(node.children).forEach(([k, v]) => {
      tags = tags.concat(getAllTags(v, k))
    })
  return tags
}

export function getRelevantTags(key) {
  if (!key) return []
  const find = (obj, k) => {
    for (const [id, v] of Object.entries(obj)) {
      if (id === k) return v
      if (v.children) { const f = find(v.children, k); if (f) return f }
    }
    return null
  }
  const node = find(THEMES, key)
  return node ? getAllTags(node, key) : []
}
