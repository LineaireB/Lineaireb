import { P } from '@/data/palette'
import { MILESTONES } from '@/data/constants'

interface ProgressBarProps {
  count: number
  total: number
}

export default function ProgressBar({ count, total }: ProgressBarProps) {
  const pct = (count / total) * 100
  const milestone = MILESTONES[count]

  return (
    <div className="progress-bar">
      <div className="progress-bar__header">
        <div className="progress-bar__label">Civilisations découvertes</div>
        <div className="progress-bar__count" style={{ color: count === total ? P.accent : P.sandDim }}>
          {count}
          <span className="progress-bar__count-fraction">/{total}</span>
        </div>
      </div>
      <div className="progress-bar__track">
        <div
          className="progress-bar__fill"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(to right, ${P.accentDim}, ${P.accent})`,
            boxShadow: `0 0 8px ${P.accent}66`,
          }}
        />
      </div>
      <div className="progress-bar__dots">
        {[0, 4, 8, 12, 19].map((n) => (
          <div
            key={n}
            className="progress-bar__dot"
            style={{ background: count >= n ? P.accent : P.borderFaint }}
          />
        ))}
      </div>
      {milestone && (
        <div key={count} className="progress-bar__milestone">
          {milestone}
        </div>
      )}
    </div>
  )
}
