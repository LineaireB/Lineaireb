import { COMPARE_COLORS } from '@/data/palette'
import { SUBSISTENCE_LABELS, SUBSISTENCE_TAGS } from '@/data/comparisons'
import { getHybridCivs } from '@/lib/tags'
import type { AppMode, SubsistenceTag } from '@/types/map'

interface CompareHeaderProps {
  mode: AppMode
  compareA: SubsistenceTag
  compareB: SubsistenceTag
  onCompareAChange: (tag: SubsistenceTag) => void
  onCompareBChange: (tag: SubsistenceTag) => void
  onFocusHybrids: () => void
}

export default function CompareHeader({
  mode,
  compareA,
  compareB,
  onCompareAChange,
  onCompareBChange,
  onFocusHybrids,
}: CompareHeaderProps) {
  if (mode !== 'compare') return null

  const hybridCount = getHybridCivs(compareA, compareB).length
  const hybridLabel = hybridCount > 1 ? 'hybrides' : 'hybride'

  return (
    <div className="compare-header">
      <div className="compare-header__dot" style={{ background: COMPARE_COLORS[0] }} />
      <select value={compareA} onChange={(e) => onCompareAChange(e.target.value as SubsistenceTag)}>
        {SUBSISTENCE_TAGS.filter((t) => t !== compareB).map((t) => (
          <option key={t} value={t}>{SUBSISTENCE_LABELS[t]}</option>
        ))}
      </select>
      <span className="compare-header__vs">vs</span>
      <div className="compare-header__dot" style={{ background: COMPARE_COLORS[1] }} />
      <select value={compareB} onChange={(e) => onCompareBChange(e.target.value as SubsistenceTag)}>
        {SUBSISTENCE_TAGS.filter((t) => t !== compareA).map((t) => (
          <option key={t} value={t}>{SUBSISTENCE_LABELS[t]}</option>
        ))}
      </select>
      {hybridCount > 0 && (
        <button
          type="button"
          className="compare-header__hybrids"
          onClick={onFocusHybrids}
          aria-label={`Voir ${hybridCount} cas ${hybridLabel} dans le panneau`}
          title={`Voir les cas ${hybridLabel}`}
        >
          ● {hybridCount} {hybridLabel}
        </button>
      )}
    </div>
  )
}
