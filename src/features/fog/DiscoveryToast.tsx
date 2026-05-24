import { useCallback, useEffect, useRef, useState } from 'react'
import { epColor } from '@/data/palette'
import type { Civilisation } from '@/types/civilisation'

const TOAST_ANIM_MS = 250
const AUTO_DISMISS_MS = 3200

interface DiscoveryToastProps {
  civ: Civilisation | null
  onClose: () => void
}

export default function DiscoveryToast({ civ, onClose }: DiscoveryToastProps) {
  const [visibleCiv, setVisibleCiv] = useState<Civilisation | null>(civ)
  const [isClosing, setIsClosing] = useState(false)
  const visibleCivRef = useRef(visibleCiv)
  visibleCivRef.current = visibleCiv

  const dismiss = useCallback(() => {
    setIsClosing((closing) => {
      if (closing) return closing
      return true
    })
  }, [])

  useEffect(() => {
    if (civ) {
      setVisibleCiv(civ)
      setIsClosing(false)
      return
    }

    if (visibleCivRef.current) {
      setIsClosing(true)
    }
  }, [civ])

  useEffect(() => {
    if (!civ || isClosing) return

    const timer = window.setTimeout(dismiss, AUTO_DISMISS_MS)
    return () => window.clearTimeout(timer)
  }, [civ, isClosing, dismiss])

  useEffect(() => {
    if (!isClosing) return

    const timer = window.setTimeout(() => {
      setVisibleCiv(null)
      setIsClosing(false)
      onClose()
    }, TOAST_ANIM_MS)

    return () => window.clearTimeout(timer)
  }, [isClosing, onClose])

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
          {visibleCiv.resume.slice(0, 120)}…
        </div>
      </div>
    </div>
  )
}
