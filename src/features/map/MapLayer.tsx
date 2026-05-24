import * as d3 from 'd3'
import { P } from '@/data/palette'
import { createProjection } from '@/lib/geo'
import type { FeatureCollection } from 'geojson'
import type { MapDimensions, MapTransform } from '@/types/map'

interface MapLayerProps {
  dims: MapDimensions
  transform: MapTransform
  worldData: FeatureCollection
}

export default function MapLayer({ dims, transform, worldData }: MapLayerProps) {
  const projection = createProjection(dims.w, dims.h)
  const geoPath = d3.geoPath(projection)

  return (
    <>
      <path d={geoPath({ type: 'Sphere' }) ?? undefined} fill={P.ocean} />
      <path
        d={geoPath(d3.geoGraticule10()) ?? undefined}
        fill="none"
        stroke={P.graticule}
        strokeWidth={0.4 / transform.k}
      />
      {worldData.features.map((f, i) => (
        <path
          key={i}
          d={geoPath(f) ?? undefined}
          fill={P.land}
          stroke={P.landStroke}
          strokeWidth={0.4 / transform.k}
        />
      ))}
      <path
        d={geoPath({ type: 'Sphere' }) ?? undefined}
        fill="none"
        stroke={P.sphere}
        strokeWidth={1 / transform.k}
      />
    </>
  )
}
