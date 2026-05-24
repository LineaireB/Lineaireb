/**
 * Root orchestrator: global UI mode, selection state, and layout wiring.
 * Map rendering lives in `features/map/`; business rules in `lib/` and `features/*`.
 */
import { useCallback, useMemo, useState } from 'react'
import { TOTAL } from '@/data/civilizations'
import { COMPARISONS } from '@/data/comparisons'
import AppFooter from '@/components/layout/AppFooter'
import AppHeader from '@/components/layout/AppHeader'
import DetailPanel from '@/components/DetailPanel'
import PodcastPanel from '@/components/PodcastPanel'
import ComparePanel from '@/features/compare/ComparePanel'
import ExplorerSidebar from '@/features/explorer/ExplorerSidebar'
import MapView from '@/features/map/MapView'
import { useDiscovery } from '@/features/fog/useDiscovery'
import { useUiPanels } from '@/hooks/useUiPanels'
import { getRelevantTags } from '@/lib/tags'
import type { Civilization } from '@/types/civilization'
import type { TagId } from '@/types/theme'
import { isDesktopViewport } from '@/lib/breakpoints'
import type { AppMode, RegionPreset, SubsistenceTag } from '@/types/map'

export default function App() {
  const [mode, setMode] = useState<AppMode>('explorer')
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  const [hoveredCivId, setHoveredCivId] = useState<string | null>(null)
  const [compareA, setCompareA] = useState<SubsistenceTag>('chasse_cueillette')
  const [compareB, setCompareB] = useState<SubsistenceTag>('agriculture')
  const [activeGeo, setActiveGeo] = useState<string | null>(null)
  const [flyRegion, setFlyRegion] = useState<RegionPreset | null>(null)
  const [toast, setToast] = useState<Civilization | null>(null)
  const [fogMode, setFogMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(() => isDesktopViewport())
  const [hybridsHighlightToken, setHybridsHighlightToken] = useState(0)

  const panels = useUiPanels()
  const {
    selectedCiv,
    setSelectedCiv,
    detailClosing,
    handleDetailClosingChange,
    podcastPanelOpen,
    podcastClosing,
    podcastActive,
    detailBackdropActive,
    showExplorerDetail,
    dismissMapOverlays,
    closePodcastPanel,
    togglePodcastPanel: togglePodcastPanelBase,
    handlePodcastClosingChange,
  } = panels

  const { revealAnim, discoveredCount, isDiscovered, discover, resetFog } = useDiscovery(fogMode)

  const relevantTags = useMemo(() => getRelevantTags(selectedTheme), [selectedTheme])

  const closeSidebar = useCallback(() => setSidebarOpen(false), [])

  const handleRegionClick = useCallback((region: RegionPreset) => {
    setActiveGeo((prev) => (region.key === prev ? null : region.key))
    setFlyRegion(region)
  }, [])

  const dismissAllMapOverlays = useCallback(() => {
    dismissMapOverlays()
    setToast(null)
    setHoveredCivId(null)
  }, [dismissMapOverlays])

  const handleCivClick = useCallback(
    (civ: Civilization) => {
      if (fogMode && !isDiscovered(civ)) discover(civ)
      closePodcastPanel()
      setToast(civ)
      setSelectedCiv((prev) => (prev?.id === civ.id ? null : civ))
      closeSidebar()
    },
    [fogMode, isDiscovered, discover, closeSidebar, closePodcastPanel, setSelectedCiv],
  )

  const handleCompareCivSelect = useCallback((civ: Civilization) => {
    setSelectedCiv(civ)
    setToast(null)
  }, [setSelectedCiv])

  const focusCompareHybrids = useCallback(() => {
    setHybridsHighlightToken((t) => t + 1)
  }, [])

  const togglePodcastPanel = useCallback(() => {
    togglePodcastPanelBase()
    setToast(null)
    setHoveredCivId(null)
  }, [togglePodcastPanelBase])

  const handleFogReset = useCallback(() => {
    resetFog()
    setSelectedCiv(null)
  }, [resetFog, setSelectedCiv])

  const handleTagClick = useCallback((tag: TagId) => {
    setSelectedTheme(tag)
    setMode('explorer')
    closeSidebar()
  }, [closeSidebar])

  const handleModeChange = useCallback(
    (next: AppMode) => {
      if (next === mode) return
      setMode(next)
      closePodcastPanel()
    },
    [mode, closePodcastPanel],
  )

  const showDetailBackdrop =
    mode === 'explorer' && detailBackdropActive && showExplorerDetail

  const dataA = COMPARISONS[compareA]
  const dataB = COMPARISONS[compareB]

  return (
    <div className="app-shell">
      <AppHeader
        mode={mode}
        fogMode={fogMode}
        discoveredCount={discoveredCount}
        selectedTheme={selectedTheme}
        compareA={compareA}
        compareB={compareB}
        sidebarOpen={sidebarOpen}
        onModeChange={handleModeChange}
        onFogToggle={() => setFogMode((v) => !v)}
        onFogReset={handleFogReset}
        onClearTheme={() => setSelectedTheme(null)}
        onCompareAChange={setCompareA}
        onCompareBChange={setCompareB}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        onFocusCompareHybrids={focusCompareHybrids}
        podcastPanelOpen={podcastPanelOpen}
        onTogglePodcastPanel={togglePodcastPanel}
      />

      {mode === 'explorer' && sidebarOpen && (
        <button
          type="button"
          className="app-backdrop"
          aria-label="Fermer le menu"
          onClick={closeSidebar}
        />
      )}

      <div
        className={`app-body ${mode === 'compare' ? 'app-body--compare' : 'app-body--explorer'}`}
      >
        <ExplorerSidebar
          visible={mode === 'explorer'}
          open={sidebarOpen}
          fogMode={fogMode}
          discoveredCount={discoveredCount}
          total={TOTAL}
          selectedTheme={selectedTheme}
          onSelectTheme={setSelectedTheme}
          activeGeo={activeGeo}
          onRegionClick={handleRegionClick}
          onToggle={() => setSidebarOpen((v) => !v)}
          onNavigate={() => {
            if (!isDesktopViewport()) closeSidebar()
          }}
        />

        <MapView
          mode={mode}
          selectedTheme={selectedTheme}
          relevantTags={relevantTags}
          selectedCiv={selectedCiv}
          hoveredCivId={hoveredCivId}
          compareA={compareA}
          compareB={compareB}
          fogMode={fogMode}
          revealAnim={revealAnim}
          toast={toast}
          flyRegion={flyRegion}
          isDiscovered={isDiscovered}
          onCivClick={handleCivClick}
          onCivHover={setHoveredCivId}
          onToastClose={() => setToast(null)}
          onMapBackgroundClick={dismissAllMapOverlays}
        />

        {mode === 'compare' ? (
          <ComparePanel
            compareA={compareA}
            compareB={compareB}
            dataA={dataA}
            dataB={dataB}
            onSelectCiv={handleCompareCivSelect}
            hybridsHighlightToken={hybridsHighlightToken}
          />
        ) : null}

        {showDetailBackdrop && (
          <button
            type="button"
            className={`app-backdrop app-backdrop--detail${detailClosing ? ' app-backdrop--closing' : ''}`}
            aria-label="Fermer la fiche"
            onClick={dismissAllMapOverlays}
          />
        )}

        {podcastActive && (
          <button
            type="button"
            className={`app-backdrop app-backdrop--detail app-backdrop--podcast${podcastClosing ? ' app-backdrop--closing' : ''}${mode === 'explorer' ? ' app-backdrop--podcast-inline' : ''}`}
            aria-label="Fermer le panneau podcast"
            onClick={closePodcastPanel}
          />
        )}

        {mode === 'explorer' && showExplorerDetail ? (
          <DetailPanel
            civ={selectedCiv}
            fogMode={fogMode}
            selectedTheme={selectedTheme}
            relevantTags={relevantTags}
            onClose={dismissAllMapOverlays}
            onTagClick={handleTagClick}
            onClosingChange={handleDetailClosingChange}
          />
        ) : null}

        {podcastActive && (
          <PodcastPanel
            open={podcastPanelOpen}
            onClose={closePodcastPanel}
            onClosingChange={handlePodcastClosingChange}
          />
        )}
      </div>

      <AppFooter />
    </div>
  )
}
