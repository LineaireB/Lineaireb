import { describe, expect, it } from 'vitest'
import { CIVILIZATIONS } from '@/data/civilizations'
import { THEMES } from '@/data/themes'
import {
  countCivsForTheme,
  getAllTags,
  getAllThemeTagIds,
  getHybridCivs,
  getRelevantTags,
  getTagLabel,
  isCivActive,
} from '@/lib/tags'
import type { TagId } from '@/types/theme'

describe('getAllTags', () => {
  it('includes the root key and all descendant keys', () => {
    const tags = getAllTags(THEMES.subsistance, 'subsistance')
    expect(tags).toContain('subsistance')
    expect(tags).toContain('agriculture')
    expect(tags).toContain('peche')
  })

  it('returns only the prefix for a leaf node', () => {
    const leaf = THEMES.subsistance.children!.agriculture
    expect(getAllTags(leaf, 'agriculture')).toEqual(['agriculture'])
  })
})

describe('getRelevantTags', () => {
  it('returns empty array when key is null', () => {
    expect(getRelevantTags(null)).toEqual([])
  })

  it('returns empty array for unknown key', () => {
    expect(getRelevantTags('not_a_theme')).toEqual([])
  })

  it('returns subtree tags for a parent theme', () => {
    const tags = getRelevantTags('subsistance')
    expect(tags).toContain('agriculture')
    expect(tags).toContain('chasse_cueillette')
  })

  it('returns only the leaf for a child theme', () => {
    const tags = getRelevantTags('agriculture')
    expect(tags).toEqual(['agriculture'])
  })
})

describe('getTagLabel', () => {
  it('returns the theme label for a known tag', () => {
    expect(getTagLabel('agriculture')).toBe('Agriculture')
  })

  it('falls back to the raw id when unknown', () => {
    expect(getTagLabel('unknown_tag' as TagId)).toBe('unknown_tag')
  })
})

describe('getAllThemeTagIds', () => {
  it('lists every tag used in civilization data', () => {
    const valid = new Set(getAllThemeTagIds())
    for (const civ of CIVILIZATIONS) {
      for (const tag of civ.tags) {
        expect(valid.has(tag), `missing theme entry for ${tag}`).toBe(true)
      }
    }
  })
})

describe('getHybridCivs', () => {
  it('returns civs that have both subsistence tags', () => {
    const hybrids = getHybridCivs('agriculture', 'agroforesterie')
    expect(hybrids.every((c) => c.tags.includes('agriculture') && c.tags.includes('agroforesterie'))).toBe(
      true,
    )
    expect(hybrids.some((c) => c.id === 'mayas')).toBe(true)
  })

  it('returns empty when no civ matches both tags', () => {
    expect(getHybridCivs('peche', 'pastoralisme')).toEqual([])
  })

  it('is order-independent', () => {
    const ab = getHybridCivs('agriculture', 'agroforesterie').map((c) => c.id).sort()
    const ba = getHybridCivs('agroforesterie', 'agriculture').map((c) => c.id).sort()
    expect(ab).toEqual(ba)
  })
})

describe('countCivsForTheme', () => {
  it('counts civilizations matching any tag in the theme subtree', () => {
    const count = countCivsForTheme(THEMES.subsistance, 'subsistance')
    const manual = CIVILIZATIONS.filter((c) =>
      getRelevantTags('subsistance').some((t) => c.tags.includes(t)),
    ).length
    expect(count).toBe(manual)
    expect(count).toBeGreaterThan(0)
  })
})

describe('isCivActive', () => {
  const rome = CIVILIZATIONS.find((c) => c.id === 'rome')!

  it('always returns true in compare mode', () => {
    expect(isCivActive(rome, 'compare', 'agriculture', ['agriculture'])).toBe(true)
    expect(isCivActive(rome, 'compare', 'agriculture', [])).toBe(true)
  })

  it('returns true in explorer when no theme is selected', () => {
    expect(isCivActive(rome, 'explorer', null, [])).toBe(true)
  })

  it('returns true when civ shares a relevant tag', () => {
    expect(isCivActive(rome, 'explorer', 'empire', ['empire'])).toBe(true)
  })

  it('returns false when civ has none of the relevant tags', () => {
    expect(isCivActive(rome, 'explorer', 'pastoralisme', ['pastoralisme'])).toBe(false)
  })
})
