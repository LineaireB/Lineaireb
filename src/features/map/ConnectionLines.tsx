import { CIVILISATIONS } from '@/data/civilisations'
import { createProjection } from '@/lib/geo'
import type { Civilisation } from '@/types/civilisation'
import type { TagId } from '@/types/theme'
import type { MapDimensions, MapTransform } from '@/types/map'

interface ConnectionLinesProps {
  dims: MapDimensions
  transform: MapTransform
  selectedTheme: string | null
  relevantTags: TagId[]
  isDiscovered: (civ: Civilisation) => boolean
}

export default function ConnectionLines({
  dims,
  transform,
  selectedTheme,
  relevantTags,
  isDiscovered,
}: ConnectionLinesProps) {
  if (!selectedTheme) return null

  const projection = createProjection(dims.w, dims.h)
  const active = CIVILISATIONS.filter(
    (c) => relevantTags.some((t) => c.tags.includes(t)) && isDiscovered(c),
  )

  return active.flatMap((a, i) =>
    active.slice(i + 1).map((b) => {
      const shared = a.tags.filter(
        (t) => b.tags.includes(t) && relevantTags.includes(t),
      ).length
      if (!shared) return null

      const [ax, ay] = projection([a.lng, a.lat]) as [number, number]
      const [bx, by] = projection([b.lng, b.lat]) as [number, number]

      return (
        <line
          key={`${a.id}-${b.id}`}
          x1={ax}
          y1={ay}
          x2={bx}
          y2={by}
          stroke={`rgba(232,132,58,${Math.min(0.08 * shared, 0.35)})`}
          strokeWidth={shared / transform.k}
          strokeDasharray={`${4 / transform.k},${4 / transform.k}`}
        />
      )
    }),
  )
}
