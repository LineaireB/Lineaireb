import { useEffect, useState } from 'react'
import type { MapDimensions } from '@/types/map'

/** Re-run measure when this value changes (e.g. layout mode). */
export function useContainerSize(
  containerRef: React.RefObject<HTMLElement | null>,
  remeasureWhen?: unknown,
): MapDimensions {
  const [dims, setDims] = useState<MapDimensions>({ w: 800, h: 500 })

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setDims({
          w: containerRef.current.clientWidth,
          h: containerRef.current.clientHeight,
        })
      }
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [containerRef, remeasureWhen])

  return dims
}
