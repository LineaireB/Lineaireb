import { useEffect } from 'react'
import { P, epColor } from '../data/palette.js'

export default function DiscoveryToast({ civ, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3200)
    return () => clearTimeout(t)
  }, [])

  const color = epColor(civ.episode)

  return (
    <div style={{
      position: 'absolute', top: 16, left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(12,6,0,0.96)', border: `1px solid ${color}88`,
      borderRadius: 10, padding: '12px 20px', zIndex: 100,
      boxShadow: `0 0 30px ${color}44, 0 4px 20px rgba(0,0,0,0.6)`,
      animation: 'toastIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
      minWidth: 260, maxWidth: 340, display: 'flex', alignItems: 'flex-start', gap: 12,
      pointerEvents: 'none',
    }}>
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, boxShadow: `0 0 10px ${color}`, flexShrink: 0, marginTop: 3 }} />
      <div>
        <div style={{ fontSize: 9, color, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: "'Cinzel',serif", marginBottom: 3 }}>
          Découverte — {civ.episode}
        </div>
        <div style={{ fontSize: 13, color: P.sand, fontFamily: "'Cinzel',serif", marginBottom: 4 }}>{civ.label}</div>
        <div style={{ fontSize: 11, color: P.textDim, fontFamily: "'EB Garamond',serif", fontStyle: 'italic', lineHeight: 1.5 }}>
          {civ.resume.slice(0, 120)}…
        </div>
      </div>
    </div>
  )
}
