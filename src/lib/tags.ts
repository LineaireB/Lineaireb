/**
 * Theme taxonomy helpers: resolve tag trees, human labels, and civ filtering.
 * All tag ids must exist in `src/data/themes.ts`.
 */
import { CIVILIZATIONS } from '@/data/civilizations'
import { THEMES } from '@/data/themes'
import type { Civilization } from '@/types/civilization'
import type { TagId, ThemeNode } from '@/types/theme'
import type { SubsistenceTag } from '@/types/map'

/** Collect all leaf tag ids under a theme node (includes the node key when provided). */
export function getAllTags(node: ThemeNode, prefix = ''): TagId[] {
  const tags: TagId[] = []
  if (prefix) tags.push(prefix as TagId)
  if (node.children) {
    for (const [k, v] of Object.entries(node.children)) {
      tags.push(...getAllTags(v, k))
    }
  }
  return tags
}

/** Tags to highlight when a theme branch is selected in explorer mode. */
export function getRelevantTags(key: string | null): TagId[] {
  if (!key) return []

  const find = (obj: Record<string, ThemeNode>, k: string): ThemeNode | null => {
    for (const [id, v] of Object.entries(obj)) {
      if (id === k) return v
      if (v.children) {
        const found = find(v.children, k)
        if (found) return found
      }
    }
    return null
  }

  const node = find(THEMES, key)
  return node ? getAllTags(node, key) : []
}

/** Display label for a tag id (falls back to the raw id). */
export function getTagLabel(tagId: TagId): string {
  const findLabel = (obj: Record<string, ThemeNode>, k: string): string | null => {
    for (const [id, v] of Object.entries(obj)) {
      if (id === k) return v.label
      if (v.children) {
        const found = findLabel(v.children, k)
        if (found) return found
      }
    }
    return null
  }

  return findLabel(THEMES, tagId) ?? tagId
}

/** Every valid tag id declared in the theme tree (for data validation tests). */
export function getAllThemeTagIds(): TagId[] {
  return Object.values(THEMES).flatMap((node) => getAllTags(node))
}

/** Civilizations tagged with both subsistence modes in compare mode. */
export function getHybridCivs(compareA: SubsistenceTag, compareB: SubsistenceTag): Civilization[] {
  return CIVILIZATIONS.filter(
    (c) => c.tags.includes(compareA) && c.tags.includes(compareB),
  )
}

export function countCivsForTheme(node: ThemeNode, nodeKey: string): number {
  const tags = getAllTags(node, nodeKey)
  return CIVILIZATIONS.filter((c) => tags.some((t) => c.tags.includes(t))).length
}

export function isCivActive(
  civ: Civilization,
  mode: 'explorer' | 'compare',
  selectedTheme: string | null,
  relevantTags: TagId[],
): boolean {
  if (mode === 'compare') return true
  if (!selectedTheme) return true
  return relevantTags.some((t) => civ.tags.includes(t))
}
