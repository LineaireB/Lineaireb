import { useEffect, useRef, useState } from 'react'
import { P, epColor } from '@/data/palette'
import { getTagLabel } from '@/lib/tags'
import type { Civilisation } from '@/types/civilisation'
import type { TagId } from '@/types/theme'

const PANEL_ANIM_MS = 250

interface PanneauDetailProps {
  civ: Civilisation | null
  fogMode: boolean
  selectedTheme: string | null
  relevantTags: TagId[]
  onClose: () => void
  onTagClick: (tag: TagId) => void
  onClosingChange?: (closing: boolean) => void
}

export default function PanneauDetail({
  civ,
  fogMode,
  selectedTheme,
  relevantTags,
  onClose,
  onTagClick,
  onClosingChange,
}: PanneauDetailProps) {
  const [visibleCiv, setVisibleCiv] = useState<Civilisation | null>(civ)
  const [isClosing, setIsClosing] = useState(false)
  const visibleCivRef = useRef(visibleCiv)
  visibleCivRef.current = visibleCiv

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
    onClosingChange?.(isClosing)
  }, [isClosing, onClosingChange])

  useEffect(() => {
    if (!isClosing) return

    const timer = window.setTimeout(() => {
      setVisibleCiv(null)
      setIsClosing(false)
    }, PANEL_ANIM_MS)

    return () => window.clearTimeout(timer)
  }, [isClosing])

  if (!visibleCiv) {
    const hint = fogMode
      ? 'Clique sur un point mystère pour le découvrir.'
      : selectedTheme
        ? 'Clique sur un point de la carte pour afficher sa fiche.'
        : 'Sélectionne un thème ou clique sur un point de la carte.'

    return (
      <aside className="detail-panel detail-panel--empty" aria-live="polite">
        <div className="detail-panel__placeholder">
          <div className="detail-panel__placeholder-title">Aucune sélection</div>
          <p className="detail-panel__placeholder-text">{hint}</p>
        </div>
      </aside>
    )
  }

  const color = epColor(visibleCiv.episode)
  const panelClass = isClosing ? 'detail-panel detail-panel--closing' : 'detail-panel'

  return (
    <aside className={panelClass}>
      <button type="button" className="detail-panel__close" onClick={onClose}>✕</button>

      <div className="detail-panel__episode" style={{ color }}>
        {visibleCiv.episode}
      </div>
      <div className="detail-panel__title">{visibleCiv.label}</div>
      <div className="detail-panel__period">{visibleCiv.periode}</div>
      <div className="detail-panel__region">📍 {visibleCiv.region}</div>

      <div className="detail-panel__divider" />

      <p className="detail-panel__resume">{visibleCiv.resume}</p>

      <div className="detail-panel__tags-title">Connexions thématiques</div>
      <div className="detail-panel__tags">
        {visibleCiv.tags.map((t) => (
          <span
            key={t}
            className="tag-pill"
            onClick={() => onTagClick(t)}
            style={{
              background: relevantTags.includes(t) ? 'rgba(232,132,58,0.2)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${relevantTags.includes(t) ? P.accent : P.borderFaint}`,
              color: relevantTags.includes(t) ? P.accent : P.textFaint,
            }}
          >
            {getTagLabel(t)}
          </span>
        ))}
      </div>
    </aside>
  )
}
