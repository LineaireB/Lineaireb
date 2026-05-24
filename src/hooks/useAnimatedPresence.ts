import { useEffect, useRef, useState } from 'react'

export const PANEL_ANIM_MS = 250

export interface UseAnimatedPresenceOptions {
  durationMs?: number
  onClosingChange?: (closing: boolean) => void
  /** Called after exit animation completes (visible cleared). */
  onAfterClose?: () => void
}

/**
 * Keeps content mounted while an exit animation runs (open → closing → hidden).
 */
export function useAnimatedPresence<T>(
  value: T | null,
  {
    durationMs = PANEL_ANIM_MS,
    onClosingChange,
    onAfterClose,
  }: UseAnimatedPresenceOptions = {},
) {
  const [visible, setVisible] = useState<T | null>(value)
  const [isClosing, setIsClosing] = useState(false)
  const visibleRef = useRef(visible)

  useEffect(() => {
    visibleRef.current = visible
  }, [visible])

  useEffect(() => {
    if (value) {
      const frame = requestAnimationFrame(() => {
        setVisible(value)
        setIsClosing(false)
      })
      return () => cancelAnimationFrame(frame)
    }

    if (visibleRef.current) {
      const frame = requestAnimationFrame(() => setIsClosing(true))
      return () => cancelAnimationFrame(frame)
    }
  }, [value])

  useEffect(() => {
    onClosingChange?.(isClosing)
  }, [isClosing, onClosingChange])

  useEffect(() => {
    if (!isClosing) return

    const timer = window.setTimeout(() => {
      setVisible(null)
      setIsClosing(false)
      onAfterClose?.()
    }, durationMs)

    return () => window.clearTimeout(timer)
  }, [isClosing, durationMs, onAfterClose])

  const dismiss = () => {
    setIsClosing((closing) => closing || true)
  }

  return { visible, isClosing, dismiss }
}
