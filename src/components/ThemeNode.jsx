import { useState } from 'react'
import { CIVILISATIONS } from '../data/civilisations.js'
import { getAllTags } from '../data/themes.js'
import { P } from '../data/palette.js'

export default function ThemeNode({ nodeKey, node, depth = 0, selected, onSelect }) {
  const [open, setOpen] = useState(depth === 0)
  const hasChildren = node.children && Object.keys(node.children).length > 0
  const isSel = selected === nodeKey
  const count = CIVILISATIONS.filter(c => getAllTags(node, nodeKey).some(t => c.tags.includes(t))).length

  return (
    <div style={{ marginLeft: depth * 10 }}>
      <div
        onClick={() => { if (hasChildren) setOpen(!open); onSelect(isSel ? null : nodeKey) }}
        style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '4px 8px', borderRadius: 5, cursor: 'pointer',
          background: isSel ? 'rgba(232,132,58,0.15)' : 'transparent',
          border: isSel ? '1px solid rgba(232,132,58,0.35)' : '1px solid transparent',
          color: isSel ? P.accent : depth === 0 ? P.sand : P.textDim,
          fontSize: depth === 0 ? 12 : 11, fontWeight: depth === 0 ? 600 : 400,
          transition: 'all 0.15s', marginBottom: 2, userSelect: 'none',
        }}
      >
        {hasChildren && (
          <span style={{ fontSize: 7, opacity: 0.5, transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>▶</span>
        )}
        {!hasChildren && <span style={{ width: 7 }} />}
        <span style={{ flex: 1 }}>{node.label}</span>
        <span style={{ fontSize: 9, opacity: 0.35, background: 'rgba(255,255,255,0.04)', borderRadius: 3, padding: '1px 4px', color: P.textDim }}>{count}</span>
      </div>
      {hasChildren && open && Object.entries(node.children).map(([k, v]) => (
        <ThemeNode key={k} nodeKey={k} node={v} depth={depth + 1} selected={selected} onSelect={onSelect} />
      ))}
    </div>
  )
}
