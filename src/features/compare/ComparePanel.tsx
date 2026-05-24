import { useEffect, useRef, useState } from 'react'
import { COMPARE_COLORS } from '@/data/palette'
import { DIMENSIONS } from '@/data/comparisons'
import { getHybridCivs } from '@/lib/tags'
import type { Civilization } from '@/types/civilization'
import type { ComparisonData, SubsistenceTag } from '@/types/map'

const HYBRID_HIGHLIGHT_MS = 2200

interface ComparePanelProps {
  compareA: SubsistenceTag
  compareB: SubsistenceTag
  dataA: ComparisonData
  dataB: ComparisonData
  onSelectCiv: (civ: Civilization) => void
  hybridsHighlightToken: number
}

export default function ComparePanel({
  compareA,
  compareB,
  dataA,
  dataB,
  onSelectCiv,
  hybridsHighlightToken,
}: ComparePanelProps) {
  const hybridsRef = useRef<HTMLDivElement>(null)
  const [hybridsHighlighted, setHybridsHighlighted] = useState(false)
  const hybridCivs = getHybridCivs(compareA, compareB)

  useEffect(() => {
    if (hybridsHighlightToken === 0 || hybridCivs.length === 0) return

    const section = hybridsRef.current
    section?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })

    const frame = requestAnimationFrame(() => setHybridsHighlighted(true))
    const timer = window.setTimeout(() => setHybridsHighlighted(false), HYBRID_HIGHLIGHT_MS)

    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(timer)
    }
  }, [hybridsHighlightToken, hybridCivs.length])

  return (
    <aside className="compare-panel">
      <div className="compare-panel__header">
        <div className="compare-panel__title">Comparaison</div>
        <div className="compare-panel__labels">
          {[
            [compareA, COMPARE_COLORS[0], dataA.label] as const,
            [compareB, COMPARE_COLORS[1], dataB.label] as const,
          ].map(([k, color, label]) => (
            <div
              key={k}
              className="compare-panel__mode-label"
              style={{ background: `${color}18`, border: `1px solid ${color}44`, color }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      {DIMENSIONS.map((dim) => (
        <div key={dim.key} className="compare-panel__dimension">
          <div className="compare-panel__dimension-label">{dim.label}</div>
          <div className="compare-panel__columns">
            <p className="compare-panel__text">{dataA[dim.key]}</p>
            <p className="compare-panel__text">{dataB[dim.key]}</p>
          </div>
        </div>
      ))}

      {hybridCivs.length > 0 && (
        <div
          ref={hybridsRef}
          id="compare-panel-hybrids"
          className={`compare-panel__hybrids${hybridsHighlighted ? ' compare-panel__hybrids--highlight' : ''}`}
        >
          <div className="compare-panel__hybrids-title">Cas hybrides</div>
          <p className="compare-panel__hybrids-intro">
            Civilizations qui combinent les deux modes de subsistance comparés.
          </p>
          {hybridCivs.map((c) => (
            <button
              key={c.id}
              type="button"
              className="compare-panel__hybrid-item"
              onClick={() => onSelectCiv(c)}
            >
              {c.label}{' '}
              <span className="compare-panel__hybrid-period">— {c.period}</span>
            </button>
          ))}
        </div>
      )}
    </aside>
  )
}
