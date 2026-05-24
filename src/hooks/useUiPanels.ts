import { useCallback, useState } from 'react'
import type { Civilization } from '@/types/civilization'

export interface UseUiPanelsResult {
  selectedCiv: Civilization | null
  setSelectedCiv: React.Dispatch<React.SetStateAction<Civilization | null>>
  detailClosing: boolean
  handleDetailClosingChange: (closing: boolean) => void
  podcastPanelOpen: boolean
  podcastClosing: boolean
  podcastActive: boolean
  detailBackdropActive: boolean
  showExplorerDetail: boolean
  dismissMapOverlays: () => void
  closePodcastPanel: () => void
  togglePodcastPanel: () => void
  handlePodcastClosingChange: (closing: boolean) => void
}

/**
 * Coordinates detail sheet and podcast panel (mutually exclusive in explorer mode).
 */
export function useUiPanels(): UseUiPanelsResult {
  const [selectedCiv, setSelectedCiv] = useState<Civilization | null>(null)
  const [detailClosing, setDetailClosing] = useState(false)
  const [podcastPanelOpen, setPodcastPanelOpen] = useState(false)
  const [podcastClosing, setPodcastClosing] = useState(false)

  const podcastActive = podcastPanelOpen || podcastClosing
  const detailBackdropActive = Boolean(selectedCiv || detailClosing)

  const beginClosePodcastPanel = useCallback(() => {
    setPodcastPanelOpen((wasOpen) => {
      if (wasOpen) {
        setPodcastClosing(true)
      }
      return false
    })
  }, [])

  const dismissMapOverlays = useCallback(() => {
    setSelectedCiv(null)
    beginClosePodcastPanel()
  }, [beginClosePodcastPanel])

  const togglePodcastPanel = useCallback(() => {
    setPodcastPanelOpen((wasOpen) => {
      if (wasOpen) {
        setPodcastClosing(true)
        return false
      }
      setPodcastClosing(false)
      setSelectedCiv(null)
      return true
    })
  }, [])

  const handleDetailClosingChange = useCallback((closing: boolean) => {
    setDetailClosing(closing)
  }, [])

  const handlePodcastClosingChange = useCallback((closing: boolean) => {
    setPodcastClosing(closing)
  }, [])

  return {
    selectedCiv,
    setSelectedCiv,
    detailClosing,
    handleDetailClosingChange,
    podcastPanelOpen,
    podcastClosing,
    podcastActive,
    detailBackdropActive,
    showExplorerDetail: !podcastActive,
    dismissMapOverlays,
    closePodcastPanel: beginClosePodcastPanel,
    togglePodcastPanel,
    handlePodcastClosingChange,
  }
}
