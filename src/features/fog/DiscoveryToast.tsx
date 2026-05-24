import { useEffect } from 'react'
import { epColor } from '@/data/palette'
import { useAnimatedPresence } from '@/hooks/useAnimatedPresence'
import type { Civilization } from '@/types/civilization'

const AUTO_DISMISS_MS = 3200

interface DiscoveryToastProps {
  civ: Civilization | null
  onClose: () => void
}

export default function DiscoveryToast({ civ, onClose }: DiscoveryToastProps) {
  const { visible: visibleCiv, isClosing, dismiss } = useAnimatedPresence(civ, {
    onAfterClose: onClose,
  })

  useEffect(() => {
    if (!civ || isClosing) return

    const timer = window.setTimeout(dismiss, AUTO_DISMISS_MS)
    return () => window.clearTimeout(timer)
  }, [civ, isClosing, dismiss])

  if (!visibleCiv) return null

  const color = epColor(visibleCiv.episode)
  const toastClass = isClosing ? 'discovery-toast discovery-toast--closing' : 'discovery-toast'

  return (
    <div
      className={toastClass}
      role="status"
      onClick={(e) => {
        e.stopPropagation()
        dismiss()
      }}
      style={{
        border: `1px solid ${color}88`,
        boxShadow: `0 0 30px ${color}44, 0 4px 20px rgba(0,0,0,0.6)`,
      }}
    >
      <div className="discovery-toast__dot" style={{ background: color, boxShadow: `0 0 10px ${color}` }} />
      <div>
        <div className="discovery-toast__episode" style={{ color }}>
          Découverte — {visibleCiv.episode}
        </div>
        <div className="discovery-toast__label">{visibleCiv.label}</div>
        <div className="discovery-toast__excerpt">
          {visibleCiv.summary.slice(0, 120)}…
        </div>
      </div>
    </div>
  )
}
