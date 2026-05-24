import { vi } from 'vitest'
import {
  BREAKPOINT_DESKTOP_MIN,
  BREAKPOINT_FOOTER_STACK_MAX,
  BREAKPOINT_HEADER_NARROW_MAX,
  BREAKPOINT_HEADER_WIDE_MIN,
  BREAKPOINT_MOBILE_MAX,
} from '@/lib/breakpoints'

function queryMatches(width: number, query: string): boolean {
  const minMatch = query.match(/\(min-width:\s*(\d+)px\)/)
  if (minMatch) {
    return width >= Number(minMatch[1])
  }

  const maxMatch = query.match(/\(max-width:\s*(\d+)px\)/)
  if (maxMatch) {
    return width <= Number(maxMatch[1])
  }

  return false
}

/** Simulate viewport width for tests (innerWidth + matchMedia). */
export function setViewportWidth(width: number) {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: 812,
  })

  window.matchMedia = vi.fn().mockImplementation((query: string) => {
    const matches = queryMatches(width, query)
    return {
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }
  })

  window.dispatchEvent(new Event('resize'))
}

export const VIEWPORT_MOBILE = 390
export const VIEWPORT_DESKTOP = BREAKPOINT_DESKTOP_MIN

export function setMobileViewport() {
  setViewportWidth(VIEWPORT_MOBILE)
}

export function setDesktopViewport() {
  setViewportWidth(VIEWPORT_DESKTOP)
}

export {
  BREAKPOINT_DESKTOP_MIN,
  BREAKPOINT_FOOTER_STACK_MAX,
  BREAKPOINT_HEADER_NARROW_MAX,
  BREAKPOINT_HEADER_WIDE_MIN,
  BREAKPOINT_MOBILE_MAX,
}
