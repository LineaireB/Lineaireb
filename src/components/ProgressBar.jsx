import { P } from '../data/palette.js'
import { MILESTONES } from '../data/constants.js'

export default function ProgressBar({ count, total }) {
  const pct = (count / total) * 100
  const milestone = MILESTONES[count]

  return (
    <div style={{ padding: '8px 16px', borderBottom: `1px solid ${P.borderFaint}`, background: 'rgba(10,5,0,0.6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 9, color: P.textFaint, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          Civilisations découvertes
        </div>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 12, color: count === total ? P.accent : P.sandDim, fontWeight: 600 }}>
          {count}<span style={{ color: P.textFaint, fontSize: 9 }}>/{total}</span>
        </div>
      </div>

      <div style={{ height: 4, background: P.borderFaint, borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`, borderRadius: 2,
          background: `linear-gradient(to right, ${P.accentDim}, ${P.accent})`,
          transition: 'width 0.6s cubic-bezier(0.34,1.56,0.64,1)',
          boxShadow: `0 0 8px ${P.accent}66`,
        }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        {[0, 4, 8, 12, 19].map(n => (
          <div key={n} style={{ width: 3, height: 3, borderRadius: '50%', background: count >= n ? P.accent : P.borderFaint, transition: 'background 0.3s' }} />
        ))}
      </div>

      {milestone && (
        <div key={count} style={{ marginTop: 6, fontSize: 10, color: P.sandDim, fontFamily: "'EB Garamond',serif", fontStyle: 'italic', animation: 'fadeIn 0.5s ease' }}>
          {milestone}
        </div>
      )}
    </div>
  )
}
