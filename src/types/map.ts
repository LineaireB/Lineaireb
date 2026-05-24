import type { GeoRegion } from './civilisation'

export interface MapDimensions {
  w: number
  h: number
}

export interface MapTransform {
  x: number
  y: number
  k: number
}

export interface RegionPreset {
  key: Exclude<GeoRegion, null> | 'monde'
  label: string
  lng: number
  lat: number
  zoom: number
}

export type AppMode = 'explorer' | 'comparer'

export type SubsistanceTag =
  | 'chasse_cueillette'
  | 'agriculture'
  | 'agroforesterie'
  | 'peche'
  | 'pastoralisme'

export interface ComparisonData {
  label: string
  couleur: string
  dimension_politique: string
  resilience: string
  rapport_foret: string
  effondrement: string
  exemple_lineaireb: string
}
