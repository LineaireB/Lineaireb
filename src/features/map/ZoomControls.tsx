import { P } from '@/data/palette'

interface ZoomControlsProps {
  zoomLevel: number
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
}

export default function ZoomControls({ zoomLevel, onZoomIn, onZoomOut, onReset }: ZoomControlsProps) {
  return (
    <div className="zoom-controls">
      <button type="button" className="zoom-btn" onClick={onZoomIn}>+</button>
      <button type="button" className="zoom-btn" onClick={onZoomOut}>−</button>
      <button
        type="button"
        className="zoom-btn zoom-btn--reset"
        onClick={onReset}
        aria-label="Vue monde entier"
        title="Vue monde entier"
      >
        <svg className="zoom-btn__icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <ellipse cx="12" cy="12" rx="3.5" ry="8.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M3.5 12h17" stroke="currentColor" strokeWidth="1.5" />
          <path d="M5 8.5h14M5 15.5h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      <div className="zoom-controls__level">×{zoomLevel}</div>
    </div>
  )
}

export function MapHint() {
  return (
    <div className="map-hint">
      <span className="map-hint__touch">
        <span className="map-hint__line">Pincez pour zoomer</span>
        <span className="map-hint__line">Glissez pour naviguer</span>
      </span>
      <span className="map-hint__desktop">Molette pour zoomer · Clic-glisser pour naviguer</span>
    </div>
  )
}

export function MapLoading() {
  return (
    <div className="map-overlay map-overlay--loading">
      <div className="map-overlay__spinner" style={{ borderTopColor: P.accent }} />
      <div className="map-overlay__text">Chargement de la carte…</div>
    </div>
  )
}

export function MapError({ message }: { message: string }) {
  return (
    <div className="map-overlay map-overlay--error">
      {message}
    </div>
  )
}
