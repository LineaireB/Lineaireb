import { useCallback, useState } from 'react'
import { clearDiscovered, loadDiscovered, saveDiscovered } from '@/lib/storage'
import type { Civilisation } from '@/types/civilisation'

interface UseDiscoveryResult {
  discovered: Set<string>
  revealAnim: Set<string>
  discoveredCount: number
  isDiscovered: (civ: Civilisation) => boolean
  discover: (civ: Civilisation) => void
  resetFog: () => void
}

export function useDiscovery(fogMode: boolean): UseDiscoveryResult {
  const [discovered, setDiscovered] = useState(() => loadDiscovered())
  const [revealAnim, setRevealAnim] = useState<Set<string>>(new Set())

  const isDiscovered = useCallback(
    (civ: Civilisation) => !fogMode || discovered.has(civ.id),
    [fogMode, discovered],
  )

  const discover = useCallback((civ: Civilisation) => {
    setDiscovered((prev) => {
      if (prev.has(civ.id)) return prev
      const next = new Set([...prev, civ.id])
      saveDiscovered(next)
      return next
    })
    setRevealAnim((prev) => new Set([...prev, civ.id]))
    setTimeout(() => {
      setRevealAnim((prev) => {
        const next = new Set(prev)
        next.delete(civ.id)
        return next
      })
    }, 650)
  }, [])

  const resetFog = useCallback(() => {
    setDiscovered(new Set())
    clearDiscovered()
  }, [])

  return {
    discovered,
    revealAnim,
    discoveredCount: discovered.size,
    isDiscovered,
    discover,
    resetFog,
  }
}
