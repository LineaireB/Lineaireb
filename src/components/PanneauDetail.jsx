import { P, epColor } from '../data/palette.js'

export default function PanneauDetail({ civ, relevantTags, onClose, onTagClick }) {
  if (!civ) return null
  const color = epColor(civ.episode)

  return (
    <div style={{
      width: 275, borderLeft: `1px solid ${P.border}`,
      padding: '18px 16px', overflowY: 'auto',
      background: P.panel, animation: 'fadeIn 0.25s ease',
      flexShrink: 0, position: 'relative', zIndex: 5,
    }}>
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: 12, right: 12,
          background: 'transparent', border: `1px solid ${P.borderFaint}`,
          color: P.textFaint, cursor: 'pointer', borderRadius: 6,
          width: 22, height: 22, fontSize: 11,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >✕</button>

      <div style={{ fontSize: 9, color, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6, fontFamily: "'Cinzel',serif" }}>
        {civ.episode}
      </div>
      <div style={{ fontFamily: "'Cinzel',serif", fontSize: 14, color: P.accent, marginBottom: 3 }}>{civ.label}</div>
      <div style={{ fontSize: 10, color: P.textDim, marginBottom: 4 }}>{civ.periode}</div>
      <div style={{ fontSize: 10, color: P.textFaint, marginBottom: 12 }}>📍 {civ.region}</div>

      <div style={{ width: '100%', height: 1, background: P.borderFaint, marginBottom: 12 }} />

      <p style={{ fontSize: 12, lineHeight: 1.8, color: P.textDim, fontFamily: "'EB Garamond',serif", fontStyle: 'italic', margin: 0, marginBottom: 16 }}>
        {civ.resume}
      </p>

      <div style={{ fontSize: 8, color: P.textFaint, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 6, fontFamily: "'Cinzel',serif" }}>
        Connexions thématiques
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {civ.tags.map(t => (
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
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}
