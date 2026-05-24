/** Layout metrics for civ hover/selection tooltips on the SVG map. */

const MIN_WIDTH = 130
const MAX_WIDTH = 220
const PAD_X = 16
const GAP_ABOVE_DOT = 8
const LINE = { label: 13, meta: 12, episode: 11 } as const
const CHAR = { label: 6.2, meta: 5.2, episode: 4.8 } as const

function wrapWords(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let current = ''

  for (const word of words) {
    const next = current ? `${current} ${word}` : word
    if (next.length > maxChars && current) {
      lines.push(current)
      current = word
    } else {
      current = next
    }
  }

  if (current) lines.push(current)
  return lines.length > 0 ? lines : [text]
}

export interface MapTooltipLayout {
  width: number
  height: number
  rectX: number
  rectY: number
  labelLines: string[]
  labelY: number
  periodY: number
  episodeY: number
}

export function getCivTooltipLayout(
  label: string,
  period: string,
  episode: string,
): MapTooltipLayout {
  const labelLines = wrapWords(label, 22)
  const contentWidth = Math.max(
    ...labelLines.map((line) => line.length * CHAR.label),
    period.length * CHAR.meta,
    episode.length * CHAR.episode,
  )
  const width = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Math.ceil(contentWidth + PAD_X * 2)))
  const height =
    PAD_X + labelLines.length * LINE.label + LINE.meta + LINE.episode + PAD_X / 2
  const rectY = -(GAP_ABOVE_DOT + height)

  return {
    width,
    height,
    rectX: -width / 2,
    rectY,
    labelLines,
    labelY: rectY + PAD_X + 9,
    periodY: rectY + PAD_X + labelLines.length * LINE.label + 10,
    episodeY: rectY + PAD_X + labelLines.length * LINE.label + LINE.meta + 10,
  }
}
