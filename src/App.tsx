/**
 * Root orchestrator: global UI mode, selection state, and layout wiring.
 * Map rendering lives in `features/map/`; business rules in `lib/` and `features/*`.
 */
import { useCallback, useMemo, useState } from 'react'
import { TOTAL } from '@/data/civilisations'
import { COMPARAISONS } from '@/data/comparaisons'
import AppFooter from '@/components/layout/AppFooter'
import AppHeader from '@/components/layout/AppHeader'
import PanneauDetail from '@/components/PanneauDetail'
import PodcastPanel from '@/components/PodcastPanel'
import ComparePanel from '@/features/compare/ComparePanel'
import ExplorerSidebar from '@/features/explorer/ExplorerSidebar'
import MapView from '@/features/map/MapView'
import { useDiscovery } from '@/features/fog/useDiscovery'
import { getRelevantTags } from '@/lib/tags'
import type { Civilisation } from '@/types/civilisation'
import type { TagId } from '@/types/theme'
import type { AppMode, RegionPreset, SubsistanceTag } from '@/types/map'

export default function App() {
  const [mode, setMode] = useState<AppMode>('explorer')
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  const [selectedCiv, setSelectedCiv] = useState<Civilisation | null>(null)
  const [hoveredCivId, setHoveredCivId] = useState<string | null>(null)
  const [compareA, setCompareA] = useState<SubsistanceTag>('chasse_cueillette')
  const [compareB, setCompareB] = useState<SubsistanceTag>('agriculture')
  const [activeGeo, setActiveGeo] = useState<string | null>(null)
  const [flyRegion, setFlyRegion] = useState<RegionPreset | null>(null)
  const [toast, setToast] = useState<Civilisation | null>(null)
  const [fogMode, setFogMode] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [detailClosing, setDetailClosing] = useState(false)
  const [podcastPanelOpen, setPodcastPanelOpen] = useState(false)
  const [podcastClosing, setPodcastClosing] = useState(false)
  const [hybridsHighlightToken, setHybridsHighlightToken] = useState(0)

  const { revealAnim, discoveredCount, isDiscovered, discover, resetFog } = useDiscovery(fogMode)

  const relevantTags = useMemo(() => getRelevantTags(selectedTheme), [selectedTheme])

  const closeSidebar = useCallback(() => setSidebarOpen(false), [])

  const handleRegionClick = useCallback((region: RegionPreset) => {
    setActiveGeo((prev) => (region.key === prev ? null : region.key))
    setFlyRegion(region)
  }, [])

  const beginClosePodcastPanel = useCallback(() => {
    setPodcastPanelOpen((wasOpen) => {
      if (wasOpen) {
        setPodcastClosing(true)
      }
      return false
    })
  }, [])

  const handleCivClick = useCallback(
    (civ: Civilisation) => {
      if (fogMode && !isDiscovered(civ)) discover(civ)
      beginClosePodcastPanel()
      setToast(civ)
      setSelectedCiv((prev) => (prev?.id === civ.id ? null : civ))
      closeSidebar()
    },
    [fogMode, isDiscovered, discover, closeSidebar, beginClosePodcastPanel],
  )

  const handleCompareCivSelect = useCallback((civ: Civilisation) => {
    setSelectedCiv(civ)
    setToast(null)
  }, [])

  const focusCompareHybrids = useCallback(() => {
    setHybridsHighlightToken((t) => t + 1)
  }, [])

  const handleDetailClosingChange = useCallback((closing: boolean) => {
    setDetailClosing(closing)
  }, [])

  const dismissMapOverlays = useCallback(() => {
    setSelectedCiv(null)
    setToast(null)
    setHoveredCivId(null)
    beginClosePodcastPanel()
  }, [beginClosePodcastPanel])

  const closePodcastPanel = beginClosePodcastPanel

  const togglePodcastPanel = useCallback(() => {
    setPodcastPanelOpen((wasOpen) => {
      if (wasOpen) {
        setPodcastClosing(true)
        return false
      }
      setPodcastClosing(false)
      setSelectedCiv(null)
      setToast(null)
      setHoveredCivId(null)
      return true
    })
  }, [])

  const handlePodcastClosingChange = useCallback((closing: boolean) => {
    setPodcastClosing(closing)
  }, [])

  const handleFogReset = useCallback(() => {
    resetFog()
    setSelectedCiv(null)
  }, [resetFog])

  const handleTagClick = useCallback((tag: TagId) => {
    setSelectedTheme(tag)
    setMode('explorer')
    closeSidebar()
  }, [closeSidebar])

  const handleModeChange = useCallback((next: AppMode) => {
    setMode(next)
    beginClosePodcastPanel()
    closeSidebar()
  }, [closeSidebar, beginClosePodcastPanel])

  const dataA = COMPARAISONS[compareA]
  const dataB = COMPARAISONS[compareB]

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

      {sidebarOpen && (
        <button
          type="button"
          className="app-backdrop"
          aria-label="Fermer le menu"
          onClick={closeSidebar}
        />
      )}

      <div className={`app-body ${mode === 'comparer' ? 'app-body--compare' : ''}`}>
        {mode === 'explorer' ? (
          <ExplorerSidebar
            open={sidebarOpen}
            fogMode={fogMode}
            discoveredCount={discoveredCount}
            total={TOTAL}
            selectedTheme={selectedTheme}
            onSelectTheme={setSelectedTheme}
            activeGeo={activeGeo}
            onRegionClick={handleRegionClick}
            onNavigate={closeSidebar}
          />
        ) : null}

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
          onMapBackgroundClick={dismissMapOverlays}
        />

        {mode === 'comparer' ? (
          <ComparePanel
            compareA={compareA}
            compareB={compareB}
            dataA={dataA}
            dataB={dataB}
            onSelectCiv={handleCompareCivSelect}
            hybridsHighlightToken={hybridsHighlightToken}
          />
        ) : null}

        {(selectedCiv || detailClosing) &&
          mode === 'explorer' &&
          !podcastPanelOpen &&
          !podcastClosing && (
          <button
            type="button"
            className={`app-backdrop app-backdrop--detail${detailClosing ? ' app-backdrop--closing' : ''}`}
            aria-label="Fermer la fiche"
            onClick={dismissMapOverlays}
          />
        )}

        {(podcastPanelOpen || podcastClosing) && (
          <button
            type="button"
            className={`app-backdrop app-backdrop--detail app-backdrop--podcast${podcastClosing ? ' app-backdrop--closing' : ''}${mode === 'explorer' ? ' app-backdrop--podcast-inline' : ''}`}
            aria-label="Fermer le panneau podcast"
            onClick={closePodcastPanel}
          />
        )}

        {mode === 'explorer' && !(podcastPanelOpen || podcastClosing) ? (
          <PanneauDetail
            civ={selectedCiv}
            fogMode={fogMode}
            selectedTheme={selectedTheme}
            relevantTags={relevantTags}
            onClose={dismissMapOverlays}
            onTagClick={handleTagClick}
            onClosingChange={handleDetailClosingChange}
          />
        ) : null}

        {(podcastPanelOpen || podcastClosing) && (
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
