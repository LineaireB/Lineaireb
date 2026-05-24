import { useState } from 'react'
import { P } from '@/data/palette'
import { countCivsForTheme } from '@/lib/tags'
import type { ThemeNode } from '@/types/theme'

interface ThemeTreeProps {
  nodeKey: string
  node: ThemeNode
  depth?: number
  selected: string | null
  onSelect: (key: string | null) => void
}

export default function ThemeTree({
  nodeKey,
  node,
  depth = 0,
  selected,
  onSelect,
}: ThemeTreeProps) {
  const [open, setOpen] = useState(depth === 0)
  const hasChildren = node.children && Object.keys(node.children).length > 0
  const isSel = selected === nodeKey
  const count = countCivsForTheme(node, nodeKey)

  return (
    <div style={{ marginLeft: depth * 10 }}>
      <div
        className={`theme-tree__row ${isSel ? 'theme-tree__row--selected' : ''} ${depth === 0 ? 'theme-tree__row--depth-0' : 'theme-tree__row--depth-1'}`}
        onClick={() => {
          if (hasChildren) setOpen(!open)
          onSelect(isSel ? null : nodeKey)
        }}
        style={{ color: isSel ? P.accent : depth === 0 ? P.sand : P.textDim }}
      >
        {hasChildren ? (
          <span
            className="theme-tree__chevron"
            style={{ transform: open ? 'rotate(90deg)' : 'none' }}
          >
            ▶
          </span>
        ) : (
          <span style={{ width: 7 }} />
        )}
        <span style={{ flex: 1 }}>{node.label}</span>
        <span className="theme-tree__count">{count}</span>
      </div>
      {hasChildren && open &&
        Object.entries(node.children!).map(([k, v]) => (
          <ThemeTree
            key={k}
            nodeKey={k}
            node={v}
            depth={depth + 1}
            selected={selected}
            onSelect={onSelect}
          />
        ))}
    </div>
  )
}
