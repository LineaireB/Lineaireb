/**
 * D3 geo helpers: Natural Earth projection and preset region zoom transforms.
 */
import * as d3 from 'd3'
import type { MapDimensions, MapTransform, RegionPreset } from '@/types/map'

export function createProjection(width: number, height: number): d3.GeoProjection {
  return d3.geoNaturalEarth1().fitSize([width, height], { type: 'Sphere' })
}

export function projectPoint(
  projection: d3.GeoProjection,
  lng: number,
  lat: number,
): [number, number] {
  return projection([lng, lat]) as [number, number]
}

/** Compute a D3 zoom transform for a sidebar region preset. */
export function computeRegionTransform(
  dims: MapDimensions,
  region: RegionPreset,
): MapTransform {
  if (region.key === 'monde') {
    return { x: 0, y: 0, k: 1 }
  }

  const projection = createProjection(dims.w, dims.h)
  const [px, py] = projectPoint(projection, region.lng, region.lat)
  return {
    x: dims.w / 2 - region.zoom * px,
    y: dims.h / 2 - region.zoom * py,
    k: region.zoom,
  }
}

export function transformToD3Identity(transform: MapTransform): d3.ZoomTransform {
  return d3.zoomIdentity.translate(transform.x, transform.y).scale(transform.k)
}
