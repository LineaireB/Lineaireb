import { useCallback, useEffect, useRef, useState } from 'react'
import { select } from 'd3-selection'
import 'd3-transition'
import { zoom, zoomIdentity, type D3ZoomEvent, type ZoomBehavior } from 'd3-zoom'
import { transformToD3Identity } from '@/lib/geo'
import type { MapDimensions, MapTransform } from '@/types/map'

interface UseMapZoomResult {
  svgRef: React.RefObject<SVGSVGElement | null>
  transform: MapTransform
  zoomLevel: number
  zoomIn: () => void
  zoomOut: () => void
  resetZoom: () => void
  flyTo: (target: MapTransform) => void
}

export function useMapZoom(dims: MapDimensions, ready: boolean): UseMapZoomResult {
  const svgRef = useRef<SVGSVGElement>(null)
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null)
  const [transform, setTransform] = useState<MapTransform>({ x: 0, y: 0, k: 1 })
  const [zoomLevel, setZoomLevel] = useState(1)

  useEffect(() => {
    if (!svgRef.current || !ready) return

    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.8, 20])
      .on('zoom', (ev: D3ZoomEvent<SVGSVGElement, unknown>) => {
        setTransform({ x: ev.transform.x, y: ev.transform.y, k: ev.transform.k })
        setZoomLevel(Math.round(ev.transform.k * 10) / 10)
      })

    zoomRef.current = zoomBehavior
    const svg = svgRef.current
    select(svg).call(zoomBehavior)

    return () => {
      select(svg).on('.zoom', null)
    }
  }, [ready, dims])

  const resetZoom = useCallback(() => {
    if (!svgRef.current || !zoomRef.current) return
    select(svgRef.current)
      .transition()
      .duration(600)
      .call(zoomRef.current.transform, zoomIdentity)
  }, [])

  const zoomIn = useCallback(() => {
    if (!svgRef.current || !zoomRef.current) return
    select(svgRef.current)
      .transition()
      .duration(300)
      .call(zoomRef.current.scaleBy, 1.6)
  }, [])

  const zoomOut = useCallback(() => {
    if (!svgRef.current || !zoomRef.current) return
    select(svgRef.current)
      .transition()
      .duration(300)
      .call(zoomRef.current.scaleBy, 0.625)
  }, [])

  const flyTo = useCallback((target: MapTransform) => {
    if (!svgRef.current || !zoomRef.current) return
    select(svgRef.current)
      .transition()
      .duration(700)
      .call(zoomRef.current.transform, transformToD3Identity(target))
  }, [])

  return { svgRef, transform, zoomLevel, zoomIn, zoomOut, resetZoom, flyTo }
}
