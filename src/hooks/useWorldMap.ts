import { useMemo } from 'react'
import * as topojson from 'topojson-client'
import type { FeatureCollection } from 'geojson'
import countriesTopo from '@/data/geo/countries-110m.json'

export function useWorldMap(): FeatureCollection {
  return useMemo(() => {
    const topo = countriesTopo as unknown as Parameters<typeof topojson.feature>[0]
    const countries = (countriesTopo as { objects: { countries: Parameters<typeof topojson.feature>[1] } }).objects.countries
    return topojson.feature(topo, countries) as FeatureCollection
  }, [])
}
