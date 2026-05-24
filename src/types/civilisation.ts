import type { TagId } from './theme'

export type GeoRegion =
  | 'bretagne'
  | 'proche_orient'
  | 'europe'
  | 'asie'
  | 'ameriques'
  | null

export interface Civilisation {
  id: string
  label: string
  periode: string
  region: string
  geo: GeoRegion
  lng: number
  lat: number
  episode: string
  tags: TagId[]
  resume: string
}
