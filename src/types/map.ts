import type { GeoRegion } from './civilization'

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

export type AppMode = 'explorer' | 'compare'

export type SubsistenceTag =
  | 'chasse_cueillette'
  | 'agriculture'
  | 'agroforesterie'
  | 'peche'
  | 'pastoralisme'

export interface ComparisonData {
  label: string
  color: string
  politicalOrganization: string
  resilience: string
  forestRelation: string
  collapse: string
  linearBExamples: string
}
