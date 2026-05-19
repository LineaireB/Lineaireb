import { useState, useRef, useEffect } from 'react'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'

import { P, epColor, COMPARE_COLORS } from './data/palette.js'
import { THEMES } from './data/themes.js'
import { getRelevantTags } from './data/themes.js'
import { CIVILISATIONS, TOTAL } from './data/civilisations.js'
import { COMPARAISONS, SUBSISTANCE_TAGS, SUBSISTANCE_LABELS } from './data/comparaisons.js'
import { MILESTONES, REGIONS } from './data/constants.js'

import ThemeNode       from './components/ThemeNode.jsx'
import ProgressBar     from './components/ProgressBar.jsx'
import DiscoveryToast  from './components/DiscoveryToast.jsx'
import PanneauDetail   from './components/PanneauDetail.jsx'
import PanneauComparaison from './components/PanneauComparaison.jsx'

// ── Persistance localStorage ──────────────────────────────────────────────
const STORAGE_KEY = 'lineaireb-discovered'
function loadDiscovered() {
  try { return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')) } catch { return new Set() }
}
function saveDiscovered(set) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...set])) } catch {}
}

export default function App() {
  const [mode, setMode]                   = useState('explorer')
  const [selectedTheme, setSelectedTheme] = useState(null)
  const [selectedCiv, setSelectedCiv]     = useState(null)
  const [hoveredCiv, setHoveredCiv]       = useState(null)
  const [compareA, setCompareA]           = useState('chasse_cueillette')
  const [compareB, setCompareB]           = useState('agriculture')
  const [worldData, setWorldData]         = useState(null)
  const [loading, setLoading]             = useState(true)
  const [mapError, setMapError]           = useState(null)
  const [transform, setTransform]         = useState({ x: 0, y: 0, k: 1 })
  const [zoomLevel, setZoomLevel]         = useState(1)
  const [activeGeo, setActiveGeo]         = useState(null)
  const [discovered, setDiscovered]       = useState(() => loadDiscovered())
  const [revealAnim, setRevealAnim]       = useState(new Set())
  const [toast, setToast]                 = useState(null)
  const [fogMode, setFogMode]             = useState(false)

  const containerRef = useRef(null)
  const svgRef       = useRef(null)
  const zoomRef      = useRef(null)
  const [dims, setDims] = useState({ w: 800, h: 500 })

  // Mesure container
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) setDims({ w: containerRef.current.clientWidth, h: containerRef.current.clientHeight })
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [mode])

  // Chargement carte monde
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const topo = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(r => r.json())
        setWorldData(topojson.feature(topo, topo.objects.countries))
        setLoading(false)
      } catch (e) {
        setMapError('Carte indisponible — vérifie ta connexion.')
        setLoading(false)
      }
    }
    load()
  }, [])

  // Init D3 zoom
  useEffect(() => {
    if (!svgRef.current || loading) return
    const zoom = d3.zoom()
      .scaleExtent([0.8, 20])
      .on('zoom', (ev) => {
        setTransform({ x: ev.transform.x, y: ev.transform.y, k: ev.transform.k })
        setZoomLevel(Math.round(ev.transform.k * 10) / 10)
      })
    zoomRef.current = zoom
    d3.select(svgRef.current).call(zoom)
    return () => d3.select(svgRef.current).on('.zoom', null)
  }, [loading, dims])

  const projection = d3.geoNaturalEarth1().fitSize([dims.w, dims.h], { type: 'Sphere' })
  const geoPath    = d3.geoPath(projection)

  const resetZoom = () => { if (!svgRef.current || !zoomRef.current) return; d3.select(svgRef.current).transition().duration(600).call(zoomRef.current.transform, d3.zoomIdentity) }
  const zoomIn    = () => { if (!svgRef.current || !zoomRef.current) return; d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 1.6) }
  const zoomOut   = () => { if (!svgRef.current || !zoomRef.current) return; d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 0.625) }

  const zoomToRegion = (r) => {
    setActiveGeo(r.key === activeGeo ? null : r.key)
    if (!svgRef.current || !zoomRef.current) return
    if (r.key === 'monde') { d3.select(svgRef.current).transition().duration(700).call(zoomRef.current.transform, d3.zoomIdentity); return }
    const proj = d3.geoNaturalEarth1().fitSize([dims.w, dims.h], { type: 'Sphere' })
    const [px, py] = proj([r.lng, r.lat])
    const tx = dims.w / 2 - r.zoom * px
    const ty = dims.h / 2 - r.zoom * py
    d3.select(svgRef.current).transition().duration(700).call(zoomRef.current.transform, d3.zoomIdentity.translate(tx, ty).scale(r.zoom))
  }

  const relevantTags = getRelevantTags(selectedTheme)
  const isActive     = (civ) => mode === 'comparer' || !selectedTheme || relevantTags.some(t => civ.tags.includes(t))
  const isDiscovered = (civ) => !fogMode || discovered.has(civ.id)

  const handleCivClick = (civ) => {
    if (fogMode && !discovered.has(civ.id)) {
      const newSet = new Set([...discovered, civ.id])
      setDiscovered(newSet)
      saveDiscovered(newSet)
      setRevealAnim(prev => new Set([...prev, civ.id]))
      setTimeout(() => setRevealAnim(prev => { const n = new Set(prev); n.delete(civ.id); return n }), 800)
    }
    setToast(civ)
    setSelectedCiv(selectedCiv?.id === civ.id ? null : civ)
  }

  const resetFog = () => {
    setDiscovered(new Set())
    setSelectedCiv(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const getCivCompareColor = (civ) => {
    if (mode !== 'comparer') return null
    const inA = civ.tags.includes(compareA), inB = civ.tags.includes(compareB)
    if (inA && inB) return P.accent
    if (inA) return COMPARE_COLORS[0]
    if (inB) return COMPARE_COLORS[1]
    return null
  }

  const dataA = COMPARAISONS[compareA]
  const dataB = COMPARAISONS[compareB]
  const civBoth = CIVILISATIONS.filter(c => c.tags.includes(compareA) && c.tags.includes(compareB))

  const dotR   = Math.max(2, 5 / transform.k)
  const haloR  = Math.max(4, 12 / transform.k)
  const strokeW = Math.max(0.5, 1.5 / transform.k)
  const discoveredCount = discovered.size

  const renderConnections = () => {
    if (mode !== 'explorer' || !selectedTheme) return null
    const active = CIVILISATIONS.filter(c => relevantTags.some(t => c.tags.includes(t)) && isDiscovered(c))
    return active.flatMap((a, i) => active.slice(i + 1).map(b => {
      const shared = a.tags.filter(t => b.tags.includes(t) && relevantTags.includes(t)).length
      if (!shared) return null
      const [ax, ay] = projection([a.lng, a.lat])
      const [bx, by] = projection([b.lng, b.lat])
      return <line key={`${a.id}-${b.id}`} x1={ax} y1={ay} x2={bx} y2={by} stroke={`rgba(232,132,58,${Math.min(0.08 * shared, 0.35)})`} strokeWidth={shared / transform.k} strokeDasharray={`${4 / transform.k},${4 / transform.k}`} />
    }))
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: P.bg, color: P.textMain, overflow: 'hidden' }}>

      {/* ── Header ────────────────────────────────────────────────────── */}
      <div style={{ padding: '10px 20px', borderBottom: `1px solid ${P.border}`, display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(20,10,3,0.98)', flexShrink: 0, zIndex: 10 }}>
        <div>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 17, color: P.accent, letterSpacing: '0.12em' }}>LINÉAIRE B</div>
          <div style={{ fontSize: 9, color: P.textFaint, letterSpacing: '0.25em', textTransform: 'uppercase' }}>Carte des épisodes</div>
        </div>
        <div style={{ width: 1, height: 28, background: P.border }} />

        {/* Mode switcher */}
        <div style={{ display: 'flex', gap: 4, background: P.sidebar, borderRadius: 8, padding: 3, border: `1px solid ${P.borderFaint}` }}>
          {[['explorer', 'Explorer'], ['comparer', 'Comparer']].map(([m, l]) => (
            <button key={m} className="mode-btn" onClick={() => setMode(m)}
              style={{ padding: '4px 12px', borderRadius: 6, fontSize: 10, letterSpacing: '0.1em', background: mode === m ? P.accent : 'transparent', color: mode === m ? P.bg : P.textFaint, fontWeight: mode === m ? 600 : 400 }}>
              {l}
            </button>
          ))}
        </div>

        {/* Fog toggle */}
        <button className="mode-btn" onClick={() => setFogMode(!fogMode)}
          style={{ padding: '4px 10px', borderRadius: 6, fontSize: 9, letterSpacing: '0.1em', background: fogMode ? 'rgba(232,132,58,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${fogMode ? P.accentDim : P.borderFaint}`, color: fogMode ? P.accent : P.textFaint }}>
          {fogMode ? '🌫 Brouillard ON' : '☀ Tout révélé'}
        </button>

        {fogMode && discoveredCount > 0 && (
          <button className="mode-btn" onClick={resetFog}
            style={{ padding: '4px 8px', borderRadius: 6, fontSize: 9, background: 'transparent', border: `1px solid ${P.borderFaint}`, color: P.textFaint }}>
            ↺ Réinitialiser
          </button>
        )}

        {/* Comparaison selects */}
        {mode === 'comparer' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: COMPARE_COLORS[0] }} />
            <select value={compareA} onChange={e => setCompareA(e.target.value)}>
              {SUBSISTANCE_TAGS.filter(t => t !== compareB).map(t => <option key={t} value={t}>{SUBSISTANCE_LABELS[t]}</option>)}
            </select>
            <span style={{ color: P.textFaint, fontSize: 12 }}>vs</span>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: COMPARE_COLORS[1] }} />
            <select value={compareB} onChange={e => setCompareB(e.target.value)}>
              {SUBSISTANCE_TAGS.filter(t => t !== compareA).map(t => <option key={t} value={t}>{SUBSISTANCE_LABELS[t]}</option>)}
            </select>
            {civBoth.length > 0 && <span style={{ fontSize: 9, color: P.accent }}>● {civBoth.length} hybrides</span>}
          </div>
        )}

        {mode === 'explorer' && selectedTheme && (
          <div style={{ fontSize: 11, color: P.textDim }}>
            Filtre : <span style={{ color: P.accent }}>{selectedTheme}</span>
            <span onClick={() => setSelectedTheme(null)} style={{ marginLeft: 8, cursor: 'pointer', color: P.textFaint }}>✕</span>
          </div>
        )}
        {mode === 'explorer' && !selectedTheme && (
          <div style={{ fontSize: 10, color: P.textFaint, fontStyle: 'italic' }}>
            {fogMode ? 'Clique sur un point mystère pour le découvrir' : 'Sélectionne un thème pour révéler les connexions'}
          </div>
        )}
      </div>

      {/* ── Corps ─────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Sidebar */}
        {mode === 'explorer' && (
          <div style={{ width: 215, borderRight: `1px solid ${P.border}`, overflowY: 'auto', background: P.sidebar, flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
            <ProgressBar count={fogMode ? discoveredCount : TOTAL} total={TOTAL} />
            <div style={{ padding: '14px 10px', flex: 1 }}>
              <div style={{ fontSize: 8, letterSpacing: '0.25em', color: P.textFaint, textTransform: 'uppercase', marginBottom: 10, paddingLeft: 8, fontFamily: "'Cinzel',serif" }}>
                Thèmes des épisodes
              </div>
              {Object.entries(THEMES).map(([k, v]) => (
                <ThemeNode key={k} nodeKey={k} node={v} depth={0} selected={selectedTheme} onSelect={setSelectedTheme} />
              ))}

              {/* Filtre géo */}
              <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${P.borderFaint}` }}>
                <div style={{ fontSize: 8, letterSpacing: '0.25em', color: P.textFaint, textTransform: 'uppercase', marginBottom: 8, paddingLeft: 8, fontFamily: "'Cinzel',serif" }}>
                  Zoom région
                </div>
                {REGIONS.map(r => {
                  const civCount = CIVILISATIONS.filter(c => c.geo === r.key).length
                  return (
                    <div key={r.key} onClick={() => zoomToRegion(r)}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', borderRadius: 5, cursor: 'pointer', background: activeGeo === r.key ? 'rgba(232,132,58,0.15)' : 'transparent', border: activeGeo === r.key ? '1px solid rgba(232,132,58,0.35)' : '1px solid transparent', color: activeGeo === r.key ? P.accent : P.textDim, fontSize: 11, marginBottom: 2, transition: 'all 0.15s', userSelect: 'none' }}>
                      <span style={{ flex: 1 }}>{r.label}</span>
                      {civCount > 0 && <span style={{ fontSize: 9, opacity: 0.4, background: 'rgba(255,255,255,0.04)', borderRadius: 3, padding: '1px 4px' }}>{civCount}</span>}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Carte SVG ─────────────────────────────────────────────── */}
        <div ref={containerRef} style={{ flex: 1, position: 'relative', overflow: 'hidden', background: P.ocean }}>
          {loading && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, background: P.bg, zIndex: 5 }}>
              <div style={{ width: 28, height: 28, border: `2px solid ${P.borderFaint}`, borderTopColor: P.accent, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <div style={{ fontSize: 11, color: P.textFaint, fontFamily: "'Cinzel',serif", letterSpacing: '0.1em' }}>Chargement de la carte…</div>
            </div>
          )}
          {mapError && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: P.terra, fontFamily: "'Cinzel',serif", zIndex: 5 }}>
              {mapError}
            </div>
          )}

          {toast && <DiscoveryToast civ={toast} onClose={() => setToast(null)} />}

          {!loading && (
            <svg ref={svgRef} width={dims.w} height={dims.h} style={{ display: 'block', userSelect: 'none' }}>
              <g transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}>
                {/* Fond */}
                <path d={geoPath({ type: 'Sphere' })} fill={P.ocean} />
                <path d={geoPath(d3.geoGraticule10())} fill="none" stroke={P.graticule} strokeWidth={0.4 / transform.k} />
                {worldData && worldData.features.map((f, i) => (
                  <path key={i} d={geoPath(f)} fill={P.land} stroke={P.landStroke} strokeWidth={0.4 / transform.k} />
                ))}
                <path d={geoPath({ type: 'Sphere' })} fill="none" stroke={P.sphere} strokeWidth={1 / transform.k} />

                {renderConnections()}

                {/* Nœuds */}
                {CIVILISATIONS.map(civ => {
                  const [px, py] = projection([civ.lng, civ.lat])
                  const disc     = isDiscovered(civ)
                  const isAnim   = revealAnim.has(civ.id)
                  const cmpColor = getCivCompareColor(civ)
                  const active   = mode === 'comparer' ? !!cmpColor : isActive(civ)
                  const isSel    = selectedCiv?.id === civ.id
                  const isHov    = hoveredCiv === civ.id
                  const color    = mode === 'comparer' ? (cmpColor || P.borderFaint) : epColor(civ.episode)
                  const r        = isSel ? dotR * 1.6 : dotR

                  if (!disc && fogMode) {
                    return (
                      <g key={civ.id} className="fog-node"
                        onClick={() => handleCivClick(civ)}
                        onMouseEnter={() => setHoveredCiv(civ.id)}
                        onMouseLeave={() => setHoveredCiv(null)}
                        style={{ opacity: active || mode === 'comparer' ? 1 : 0.4 }}
                      >
                        <circle className="fog-ring" cx={px} cy={py} r={haloR * 1.2} fill="rgba(232,132,58,0.04)" stroke="rgba(232,132,58,0.15)" strokeWidth={0.8 / transform.k} style={{ opacity: isHov ? 0.6 : 0.25, transition: 'opacity 0.3s' }} />
                        <circle cx={px} cy={py} r={r} fill="rgba(40,25,10,0.9)" stroke="rgba(232,132,58,0.3)" strokeWidth={strokeW} strokeDasharray={`${2 / transform.k},${2 / transform.k}`} />
                        <text x={px} y={py} textAnchor="middle" dominantBaseline="central" fill="rgba(232,132,58,0.4)" fontSize={6 / transform.k} fontFamily="Georgia,serif">?</text>
                        {isHov && (
                          <g transform={`translate(${px},${py}) scale(${1 / transform.k})`}>
                            <rect x={-60} y={-40} width={120} height={28} rx={5} fill="rgba(12,6,0,0.92)" stroke="rgba(232,132,58,0.3)" strokeWidth={1} />
                            <text x={0} y={-24} textAnchor="middle" fill="rgba(232,132,58,0.6)" fontSize={8} fontFamily="Cinzel,serif">Site inconnu</text>
                            <text x={0} y={-13} textAnchor="middle" fill={P.textFaint} fontSize={7} fontFamily="Georgia,serif">Clique pour découvrir</text>
                          </g>
                        )}
                      </g>
                    )
                  }

                  return (
                    <g key={civ.id} style={{ opacity: active ? 1 : 0.07, cursor: 'pointer', animation: isAnim ? 'pulse 0.6s ease' : 'none' }}
                      onClick={() => handleCivClick(civ)}
                      onMouseEnter={() => setHoveredCiv(civ.id)}
                      onMouseLeave={() => setHoveredCiv(null)}
                    >
                      {isAnim && <circle cx={px} cy={py} r={haloR * 2} fill="none" stroke={color} strokeWidth={2 / transform.k} opacity={0.6} style={{ animation: 'reveal 0.8s ease-out forwards' }} />}
                      {active && <circle cx={px} cy={py} r={isSel ? haloR * 1.4 : haloR} fill={color} fillOpacity={0.12} />}
                      <circle cx={px} cy={py} r={r} fill={active ? color : P.borderFaint} stroke={isSel ? '#fff' : active ? color : P.borderFaint} strokeWidth={strokeW} style={{ filter: active ? `drop-shadow(0 0 ${4 / transform.k}px ${color})` : 'none', animation: isSel ? 'glow 1.8s infinite' : 'none', transition: 'r 0.3s' }} />
                      {(isHov || isSel) && (
                        <g transform={`translate(${px},${py}) scale(${1 / transform.k})`}>
                          <rect x={-72} y={-60} width={144} height={52} rx={6} fill="rgba(20,10,3,0.94)" stroke={`${color}66`} strokeWidth={1} />
                          <text x={0} y={-40} textAnchor="middle" fill={P.sand} fontSize={10} fontFamily="Cinzel,serif">{civ.label}</text>
                          <text x={0} y={-25} textAnchor="middle" fill={color} fontSize={8} fontFamily="Georgia,serif" opacity={0.9}>{civ.periode}</text>
                          <text x={0} y={-14} textAnchor="middle" fill={P.textFaint} fontSize={7} fontFamily="Georgia,serif">{civ.episode}</text>
                        </g>
                      )}
                    </g>
                  )
                })}
              </g>
            </svg>
          )}

          {/* Contrôles zoom */}
          {!loading && (
            <div style={{ position: 'absolute', bottom: 20, right: 16, display: 'flex', flexDirection: 'column', gap: 4, zIndex: 5 }}>
              <button className="zoom-btn" onClick={zoomIn}   style={{ width: 32, height: 32, background: 'rgba(20,10,3,0.88)', border: `1px solid ${P.border}`, color: P.sand, borderRadius: 6, fontSize: 18, fontWeight: 300 }}>+</button>
              <button className="zoom-btn" onClick={zoomOut}  style={{ width: 32, height: 32, background: 'rgba(20,10,3,0.88)', border: `1px solid ${P.border}`, color: P.sand, borderRadius: 6, fontSize: 18, fontWeight: 300 }}>−</button>
              <button className="zoom-btn" onClick={resetZoom} style={{ width: 32, height: 32, background: 'rgba(20,10,3,0.88)', border: `1px solid ${P.border}`, color: P.textDim, borderRadius: 6, fontSize: 12 }}>⌂</button>
              <div style={{ textAlign: 'center', fontSize: 8, color: P.textFaint, fontFamily: "'Cinzel',serif", marginTop: 2 }}>×{zoomLevel}</div>
            </div>
          )}

          <div style={{ position: 'absolute', bottom: 8, left: 12, fontSize: 8, color: P.textFaint, fontFamily: "'Cinzel',serif", letterSpacing: '0.08em' }}>
            Molette pour zoomer · Clic-glisser pour naviguer
          </div>
        </div>

        {/* Panneau comparaison */}
        {mode === 'comparer' && dataA && dataB && (
          <PanneauComparaison
            compareA={compareA} compareB={compareB}
            dataA={dataA} dataB={dataB}
            onSelectCiv={setSelectedCiv}
          />
        )}

        {/* Panneau détail */}
        <PanneauDetail
          civ={selectedCiv}
          relevantTags={relevantTags}
          onClose={() => setSelectedCiv(null)}
          onTagClick={(t) => { setSelectedTheme(t); setMode('explorer') }}
        />
      </div>
    </div>
  )
}
