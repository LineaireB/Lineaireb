import { describe, expect, it } from 'vitest'
import { zoomIdentity } from 'd3-zoom'
import { REGIONS } from '@/data/constants'
import {
  computeRegionTransform,
  createProjection,
  projectPoint,
  transformToD3Identity,
} from '@/lib/geo'

describe('createProjection', () => {
  it('projects lng/lat inside the canvas bounds', () => {
    const projection = createProjection(800, 500)
    const [x, y] = projectPoint(projection, 2.5, 48.5)
    expect(x).toBeGreaterThanOrEqual(0)
    expect(x).toBeLessThanOrEqual(800)
    expect(y).toBeGreaterThanOrEqual(0)
    expect(y).toBeLessThanOrEqual(500)
  })
})

describe('computeRegionTransform', () => {
  const dims = { w: 800, h: 500 }

  it('returns identity for monde preset', () => {
    const monde = REGIONS.find((r) => r.key === 'monde')!
    expect(computeRegionTransform(dims, monde)).toEqual({ x: 0, y: 0, k: 1 })
  })

  it('returns finite transform for every region preset', () => {
    for (const region of REGIONS) {
      const t = computeRegionTransform(dims, region)
      expect(Number.isFinite(t.x)).toBe(true)
      expect(Number.isFinite(t.y)).toBe(true)
      expect(t.k).toBeGreaterThan(0)
    }
  })

  it('uses a higher scale for regional zoom than monde', () => {
    const monde = REGIONS.find((r) => r.key === 'monde')!
    const europe = REGIONS.find((r) => r.key === 'europe')!
    expect(computeRegionTransform(dims, europe).k).toBeGreaterThan(
      computeRegionTransform(dims, monde).k,
    )
  })
})

describe('transformToD3Identity', () => {
  it('maps MapTransform to a D3 zoom identity', () => {
    const transform = { x: 12, y: -8, k: 2.5 }
    const d3 = transformToD3Identity(transform)
    expect(d3.x).toBe(12)
    expect(d3.y).toBe(-8)
    expect(d3.k).toBe(2.5)
    expect(d3.toString()).toBe(zoomIdentity.translate(12, -8).scale(2.5).toString())
  })
})
