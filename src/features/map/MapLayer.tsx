import { P } from '@/data/palette'
import { createProjection, geoGraticule10, geoPath } from '@/lib/geo'
import type { FeatureCollection } from 'geojson'
import type { MapDimensions, MapTransform } from '@/types/map'

interface MapLayerProps {
  dims: MapDimensions
  transform: MapTransform
  worldData: FeatureCollection
}

export default function MapLayer({ dims, transform, worldData }: MapLayerProps) {
  const projection = createProjection(dims.w, dims.h)
  const path = geoPath(projection)

  return (
    <>
      <path d={path({ type: 'Sphere' }) ?? undefined} fill={P.ocean} />
      <path
        d={path(geoGraticule10()) ?? undefined}
        fill="none"
        stroke={P.graticule}
        strokeWidth={0.4 / transform.k}
      />
      {worldData.features.map((f, i) => (
        <path
          key={i}
          d={path(f) ?? undefined}
          fill={P.land}
          stroke={P.landStroke}
          strokeWidth={0.4 / transform.k}
        />
      ))}
      <path
        d={path({ type: 'Sphere' }) ?? undefined}
        fill="none"
        stroke={P.sphere}
        strokeWidth={1 / transform.k}
      />
    </>
  )
}
