import { beforeEach, describe, expect, it, vi } from 'vitest'
import { clearDiscovered, loadDiscovered, saveDiscovered } from '@/lib/storage'

const STORAGE_KEY = 'lineaireb-discovered'

describe('discovery storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('loadDiscovered returns empty set when storage is empty', () => {
    expect(loadDiscovered()).toEqual(new Set())
  })

  it('round-trips ids through save and load', () => {
    saveDiscovered(new Set(['rome', 'mayas']))
    expect(loadDiscovered()).toEqual(new Set(['rome', 'mayas']))
    expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(['rome', 'mayas']))
  })

  it('loadDiscovered returns empty set on invalid JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{not-json')
    expect(loadDiscovered()).toEqual(new Set())
  })

  it('clearDiscovered removes persisted data', () => {
    saveDiscovered(new Set(['rome']))
    clearDiscovered()
    expect(loadDiscovered()).toEqual(new Set())
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('saveDiscovered swallows localStorage errors', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded')
    })
    expect(() => saveDiscovered(new Set(['rome']))).not.toThrow()
    vi.restoreAllMocks()
  })
})
