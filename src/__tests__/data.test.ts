import { describe, expect, it } from 'vitest'
import { CIVILISATIONS, TOTAL } from '@/data/civilisations'
import { REGIONS } from '@/data/constants'
import { getAllThemeTagIds, getHybridCivs, getRelevantTags, getTagLabel } from '@/lib/tags'
import { computeRegionTransform } from '@/lib/geo'

describe('tags', () => {
  it('getRelevantTags returns subtree tags', () => {
    const tags = getRelevantTags('subsistance')
    expect(tags).toContain('agriculture')
    expect(tags).toContain('peche')
  })

  it('getTagLabel returns human label', () => {
    expect(getTagLabel('agriculture')).toBe('Agriculture')
  })

  it('getHybridCivs finds overlapping subsistence modes', () => {
    const hybrids = getHybridCivs('agriculture', 'agroforesterie')
    expect(hybrids.some((c) => c.id === 'mayas')).toBe(true)
  })
})

describe('civilisations data integrity', () => {
  const validTags = new Set(getAllThemeTagIds())
  const regionKeys = new Set(REGIONS.map((r) => r.key))

  it('TOTAL matches array length', () => {
    expect(TOTAL).toBe(CIVILISATIONS.length)
  })

  it('every tag exists in THEMES', () => {
    for (const civ of CIVILISATIONS) {
      for (const tag of civ.tags) {
        expect(validTags.has(tag), `${civ.id} tag ${tag}`).toBe(true)
      }
    }
  })

  it('every geo key has a REGIONS entry', () => {
    for (const civ of CIVILISATIONS) {
      if (civ.geo) {
        expect(regionKeys.has(civ.geo), `${civ.id} geo ${civ.geo}`).toBe(true)
      }
    }
  })

  it('coordinates are within valid bounds', () => {
    for (const civ of CIVILISATIONS) {
      expect(civ.lng).toBeGreaterThanOrEqual(-180)
      expect(civ.lng).toBeLessThanOrEqual(180)
      expect(civ.lat).toBeGreaterThanOrEqual(-90)
      expect(civ.lat).toBeLessThanOrEqual(90)
    }
  })

  it('ids are unique', () => {
    const ids = CIVILISATIONS.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('geo', () => {
  it('computeRegionTransform returns valid transform for each region', () => {
    const dims = { w: 800, h: 500 }
    for (const region of REGIONS) {
      const t = computeRegionTransform(dims, region)
      expect(Number.isFinite(t.x)).toBe(true)
      expect(Number.isFinite(t.y)).toBe(true)
      expect(t.k).toBeGreaterThan(0)
    }
  })

  it('monde region resets to identity', () => {
    const t = computeRegionTransform({ w: 800, h: 500 }, REGIONS.find((r) => r.key === 'monde')!)
    expect(t).toEqual({ x: 0, y: 0, k: 1 })
  })
})
