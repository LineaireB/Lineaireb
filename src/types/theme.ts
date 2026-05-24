export type TagId =
  | 'lineaire'
  | 'non_lineaire'
  | 'presentisme'
  | 'royaute_sacree'
  | 'cite_etat'
  | 'sans_etat'
  | 'empire'
  | 'chasse_cueillette'
  | 'agriculture'
  | 'agroforesterie'
  | 'pastoralisme'
  | 'peche'
  | 'collapse_politique'
  | 'crise_eco'
  | 'bifurcation'
  | 'migration'
  | 'deforestation'
  | 'reforestation'
  | 'gestion'
  | 'holistique'
  | 'silex'
  | 'poterie'
  | 'ecriture'
  | 'architecture'
  | 'commerce'

export interface ThemeNode {
  label: string
  children?: Record<string, ThemeNode>
}

export type ThemeKey = keyof typeof import('@/data/themes').THEMES
