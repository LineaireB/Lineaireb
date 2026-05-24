import DiscoveryToast from '@/features/fog/DiscoveryToast'
import { CIVILIZATIONS } from '@/data/civilizations'
import type { Civilization } from '@/types/civilization'

export const MAP_CIV_ROME =
  CIVILIZATIONS.find((c) => c.id === 'rome') ?? CIVILIZATIONS[0]

export const MAP_CIV_MAYAS =
  CIVILIZATIONS.find((c) => c.id === 'mayas') ?? CIVILIZATIONS[0]

export function MapViewMock({
  toast,
  selectedCiv,
  onMapBackgroundClick,
  onCivClick,
  onToastClose,
}: {
  toast: Civilization | null
  selectedCiv: Civilization | null
  onMapBackgroundClick: () => void
  onCivClick: (civ: Civilization) => void
  onToastClose: () => void
}) {
  return (
    <div
      data-testid="map-view-stub"
      className="map-view"
      role="region"
      aria-label="Carte (test)"
      onClick={onMapBackgroundClick}
    >
      <DiscoveryToast civ={toast} onClose={onToastClose} />

      {selectedCiv ? (
        <span data-testid="map-selected-civ" hidden>
          {selectedCiv.id}
        </span>
      ) : null}

      <button
        type="button"
        data-testid="map-civ-rome"
        onClick={(e) => {
          e.stopPropagation()
          onCivClick(MAP_CIV_ROME)
        }}
      >
        {MAP_CIV_ROME.label}
      </button>

      <button
        type="button"
        data-testid="map-civ-mayas"
        onClick={(e) => {
          e.stopPropagation()
          onCivClick(MAP_CIV_MAYAS)
        }}
      >
        {MAP_CIV_MAYAS.label}
      </button>
    </div>
  )
}
