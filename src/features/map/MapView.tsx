import { useEffect, useRef } from 'react'
import DiscoveryToast from '@/features/fog/DiscoveryToast'
import MapLayer from '@/features/map/MapLayer'
import ConnectionLines from '@/features/map/ConnectionLines'
import CivNodes from '@/features/map/CivNodes'
import ZoomControls, { MapHint } from '@/features/map/ZoomControls'
import { useContainerSize } from '@/hooks/useContainerSize'
import { useMapZoom } from '@/hooks/useMapZoom'
import { useWorldMap } from '@/hooks/useWorldMap'
import type { Civilization } from '@/types/civilization'
import type { TagId } from '@/types/theme'
import { computeRegionTransform } from '@/lib/geo'
import type { AppMode, RegionPreset, SubsistenceTag } from '@/types/map'

interface MapViewProps {
  mode: AppMode
  selectedTheme: string | null
  relevantTags: TagId[]
  selectedCiv: Civilization | null
  hoveredCivId: string | null
  compareA: SubsistenceTag
  compareB: SubsistenceTag
  fogMode: boolean
  revealAnim: Set<string>
  toast: Civilization | null
  flyRegion: RegionPreset | null
  isDiscovered: (civ: Civilization) => boolean
  onCivClick: (civ: Civilization) => void
  onCivHover: (id: string | null) => void
  onToastClose: () => void
  onMapBackgroundClick: () => void
}

export default function MapView({
  mode,
  selectedTheme,
  relevantTags,
  selectedCiv,
  hoveredCivId,
  compareA,
  compareB,
  fogMode,
  revealAnim,
  toast,
  flyRegion,
  isDiscovered,
  onCivClick,
  onCivHover,
  onToastClose,
  onMapBackgroundClick,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const worldData = useWorldMap()
  const dims = useContainerSize(containerRef, mode)
  const { svgRef, transform, zoomLevel, zoomIn, zoomOut, resetZoom, flyTo } = useMapZoom(dims, true)

  useEffect(() => {
    if (flyRegion) flyTo(computeRegionTransform(dims, flyRegion))
  }, [flyRegion, dims, flyTo])

  return (
    <div ref={containerRef} className="map-view" onClick={onMapBackgroundClick}>
      <DiscoveryToast civ={toast} onClose={onToastClose} />

      <svg ref={svgRef} width={dims.w} height={dims.h} className="map-view__svg">
        <g transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}>
          <MapLayer dims={dims} transform={transform} worldData={worldData} />
          {mode === 'explorer' && (
            <ConnectionLines
              dims={dims}
              transform={transform}
              selectedTheme={selectedTheme}
              relevantTags={relevantTags}
              isDiscovered={isDiscovered}
            />
          )}
          <CivNodes
            mode={mode}
            dims={dims}
            transform={transform}
            selectedTheme={selectedTheme}
            relevantTags={relevantTags}
            selectedCivId={selectedCiv?.id ?? null}
            hoveredCivId={hoveredCivId}
            compareA={compareA}
            compareB={compareB}
            fogMode={fogMode}
            revealAnim={revealAnim}
            isDiscovered={isDiscovered}
            onCivClick={onCivClick}
            onCivHover={onCivHover}
          />
        </g>
      </svg>

      <div className="map-view__chrome" onClick={(e) => e.stopPropagation()}>
        <ZoomControls zoomLevel={zoomLevel} onZoomIn={zoomIn} onZoomOut={zoomOut} onReset={resetZoom} />
        <MapHint />
      </div>
    </div>
  )
}
