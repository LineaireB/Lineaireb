export const P = {
  bg:          '#1E1208',
  ocean:       '#2A3A4A',
  land:        '#2A1E0E',
  landStroke:  '#6A4A2A',
  sidebar:     '#180E06',
  panel:       '#1C1208',
  border:      '#5A3A1A',
  borderFaint: '#2E1E0A',
  accent:      '#E8843A',
  accentDim:   '#A05A20',
  sand:        '#F0D4A0',
  sandDim:     '#C4A060',
  mauve:       '#9070A0',
  teal:        '#5A9090',
  tealLight:   '#A0C4D4',
  green:       '#6A9A5A',
  terra:       '#C4623A',
  brick:       '#B85030',
  textMain:    '#F0D4A0',
  textDim:     '#8A6A40',
  textFaint:   '#4A2E14',
  graticule:   'rgba(232,132,58,0.07)',
  sphere:      'rgba(232,132,58,0.25)',
}

export const EP_COLORS = {
  'Épisode 2':           P.accent,
  'Épisode 3':           P.green,
  'Épisodes 4 & 7':      P.sandDim,
  'Épisode 4':           P.sandDim,
  'Épisode 5 (×2)':     P.terra,
  'Épisode 5':           P.terra,
  'Épisodes 1, 5, Bonus':P.brick,
  'Épisode Bonus forêt': P.teal,
  'Épisode 7':           P.mauve,
  'Réel Bretagne':       P.mauve,
}

export const epColor = (ep) => EP_COLORS[ep] || P.accent
export const COMPARE_COLORS = [P.green, P.terra]
