import { P, COMPARE_COLORS } from '../data/palette.js'
import { DIMENSIONS } from '../data/comparaisons.js'
import { CIVILISATIONS } from '../data/civilisations.js'

export default function PanneauComparaison({ compareA, compareB, dataA, dataB, onSelectCiv }) {
  const civBoth = CIVILISATIONS.filter(c => c.tags.includes(compareA) && c.tags.includes(compareB))

  return (
    <div style={{ width: 340, borderLeft: `1px solid ${P.border}`, overflowY: 'auto', background: P.panel, flexShrink: 0 }}>
      <div style={{ padding: '14px 16px 8px', borderBottom: `1px solid ${P.borderFaint}` }}>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 10, color: P.textFaint, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Comparaison
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          {[[compareA, COMPARE_COLORS[0], dataA.label], [compareB, COMPARE_COLORS[1], dataB.label]].map(([k, c, l]) => (
            <div key={k} style={{ flex: 1, padding: '6px 10px', borderRadius: 6, background: `${c}18`, border: `1px solid ${c}44`, fontFamily: "'Cinzel',serif", fontSize: 11, color: c, textAlign: 'center' }}>
              {l}
            </div>
          ))}
        </div>
      </div>

      {DIMENSIONS.map(dim => (
        <div key={dim.key} style={{ borderBottom: `1px solid ${P.borderFaint}` }}>
          <div style={{ padding: '8px 16px 4px', fontSize: 9, color: P.textFaint, textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: "'Cinzel',serif" }}>
            {dim.label}
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ flex: 1, padding: '6px 12px 10px', borderRight: `1px solid ${P.borderFaint}` }}>
              <p style={{ margin: 0, fontSize: 11, lineHeight: 1.65, color: P.textDim, fontFamily: "'EB Garamond',serif", fontStyle: 'italic' }}>
                {dataA[dim.key]}
              </p>
            </div>
            <div style={{ flex: 1, padding: '6px 12px 10px' }}>
              <p style={{ margin: 0, fontSize: 11, lineHeight: 1.65, color: P.textDim, fontFamily: "'EB Garamond',serif", fontStyle: 'italic' }}>
                {dataB[dim.key]}
              </p>
            </div>
          </div>
        </div>
      ))}

      {civBoth.length > 0 && (
        <div style={{ padding: '12px 16px' }}>
          <div style={{ fontSize: 9, color: P.accent, textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: "'Cinzel',serif", marginBottom: 6 }}>
            Cas hybrides
          </div>
          {civBoth.map(c => (
            <div
              key={c.id}
              onClick={() => onSelectCiv(c)}
              style={{ padding: '6px 10px', borderRadius: 6, background: 'rgba(232,132,58,0.06)', border: `1px solid ${P.borderFaint}`, marginBottom: 4, cursor: 'pointer', fontSize: 11, color: P.textDim, fontFamily: "'Cinzel',serif" }}
            >
              {c.label} <span style={{ fontSize: 9, color: P.textFaint }}>— {c.periode}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
