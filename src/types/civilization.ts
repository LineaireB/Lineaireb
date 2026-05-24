import type { TagId } from './theme'

export type GeoRegion =
  | 'bretagne'
  | 'proche_orient'
  | 'europe'
  | 'asie'
  | 'ameriques'
  | null

export interface Civilization {
  id: string
  label: string
  period: string
  region: string
  geo: GeoRegion
  lng: number
  lat: number
  episode: string
  tags: TagId[]
  summary: string
}
