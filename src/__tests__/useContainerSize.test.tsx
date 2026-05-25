import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useContainerSize } from '@/hooks/useContainerSize'

function createSizedElement(width: number, height: number): HTMLDivElement {
  const el = document.createElement('div')
  Object.defineProperty(el, 'clientWidth', {
    configurable: true,
    get: () => width,
  })
  Object.defineProperty(el, 'clientHeight', {
    configurable: true,
    get: () => height,
  })
  return el
}

describe('useContainerSize', () => {
  let resizeCallback: ResizeObserverCallback | null = null

  beforeEach(() => {
    resizeCallback = null
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: ResizeObserverCallback) {
          resizeCallback = callback
        }
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns default dimensions before the container is measured', () => {
    const ref = { current: null as HTMLDivElement | null }
    const { result } = renderHook(() => useContainerSize(ref))

    expect(result.current).toEqual({ w: 800, h: 500 })
  })

  it('measures clientWidth and clientHeight when the ref is attached', () => {
    const ref = { current: createSizedElement(640, 480) }
    const { result } = renderHook(() => useContainerSize(ref))

    expect(result.current).toEqual({ w: 640, h: 480 })
  })

  it('remeasures when remeasureWhen changes', () => {
    let width = 900
    let height = 500
    const el = createSizedElement(width, height)
    Object.defineProperty(el, 'clientWidth', {
      configurable: true,
      get: () => width,
    })
    Object.defineProperty(el, 'clientHeight', {
      configurable: true,
      get: () => height,
    })

    const ref = { current: el }
    const { result, rerender } = renderHook(
      ({ mode }: { mode: string }) => useContainerSize(ref, mode),
      { initialProps: { mode: 'explorer' } },
    )

    expect(result.current).toEqual({ w: 900, h: 500 })

    width = 400
    height = 280
    rerender({ mode: 'compare' })

    expect(result.current).toEqual({ w: 400, h: 280 })
  })

  it('updates dimensions when ResizeObserver fires', () => {
    let width = 800
    let height = 500
    const el = createSizedElement(width, height)
    Object.defineProperty(el, 'clientWidth', {
      configurable: true,
      get: () => width,
    })
    Object.defineProperty(el, 'clientHeight', {
      configurable: true,
      get: () => height,
    })

    const ref = { current: el }
    const { result } = renderHook(() => useContainerSize(ref))

    expect(result.current).toEqual({ w: 800, h: 500 })

    width = 1024
    height = 768
    act(() => {
      resizeCallback?.([], {} as ResizeObserver)
    })

    expect(result.current).toEqual({ w: 1024, h: 768 })
  })
})
