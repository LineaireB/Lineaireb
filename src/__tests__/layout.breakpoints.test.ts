import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  BREAKPOINT_DESKTOP_MIN,
  BREAKPOINT_FOOTER_STACK_MAX,
  BREAKPOINT_HEADER_NARROW_MAX,
  BREAKPOINT_HEADER_WIDE_MIN,
  BREAKPOINT_MOBILE_MAX,
} from '@/lib/breakpoints'

const LAYOUT_DIR = join(process.cwd(), 'src/styles/layout')

function readLayoutCss(filename: string) {
  return readFileSync(join(LAYOUT_DIR, filename), 'utf8')
}

describe('layout CSS breakpoint contract', () => {
  const desktopBreakpointFiles = [
    'explorer.css',
    'panels-detail.css',
    'panels-podcast.css',
    'compare.css',
    'map.css',
    'shell.css',
    'header.css',
  ]

  it('uses the shared 900px desktop breakpoint in layout modules', () => {
    for (const file of desktopBreakpointFiles) {
      const css = readLayoutCss(file)
      expect(css, file).toMatch(new RegExp(`${BREAKPOINT_DESKTOP_MIN}px`))
    }
  })

  it('uses mobile max-width 899px where bottom sheets apply', () => {
    for (const file of ['panels-detail.css', 'panels-podcast.css', 'map.css']) {
      const css = readLayoutCss(file)
      expect(css, file).toContain(`${BREAKPOINT_MOBILE_MAX}px`)
    }
  })

  it('hides the themes menu button from 900px in header.css', () => {
    const css = readLayoutCss('header.css')
    expect(css).toContain('.app-header__menu-btn')
    expect(css).toMatch(/min-width:\s*900px[\s\S]*\.app-header__menu-btn[\s\S]*display:\s*none/)
  })

  it('hides mobile hint slot from 900px in header.css', () => {
    const css = readLayoutCss('header.css')
    expect(css).toMatch(
      /min-width:\s*900px[\s\S]*\.app-header__mobile-hint[\s\S]*display:\s*none/,
    )
  })

  it('uses header narrow/wide breakpoints in header.css', () => {
    const css = readLayoutCss('header.css')
    expect(css).toContain(`${BREAKPOINT_HEADER_NARROW_MAX}px`)
    expect(css).toContain(`${BREAKPOINT_HEADER_WIDE_MIN}px`)
  })

  it('stacks footer on very narrow screens', () => {
    const css = readLayoutCss('footer.css')
    expect(css).toContain(`${BREAKPOINT_FOOTER_STACK_MAX}px`)
  })

  it('documents breakpoints in tokens.css', () => {
    const tokens = readFileSync(join(process.cwd(), 'src/styles/tokens.css'), 'utf8')
    expect(tokens).toContain(`--bp-tablet: ${BREAKPOINT_DESKTOP_MIN}px`)
    expect(tokens).toContain(`--bp-header-narrow: ${BREAKPOINT_HEADER_NARROW_MAX}px`)
  })

  it('overlays the explorer filter drawer on desktop with a toggle tab', () => {
    const css = readLayoutCss('explorer.css')
    expect(css).toMatch(
      /min-width:\s*900px[\s\S]*\.explorer-sidebar-shell[\s\S]*position:\s*absolute/,
    )
    expect(css).toContain('.explorer-sidebar__tab')
  })

  it('uses the same desktop side panel width for explorer and compare', () => {
    const detail = readLayoutCss('panels-detail.css')
    const compare = readLayoutCss('compare.css')
    expect(detail).toMatch(/min-width:\s*900px[\s\S]*width:\s*var\(--panel-side-width\)/)
    expect(compare).toMatch(/min-width:\s*900px[\s\S]*width:\s*var\(--panel-side-width\)/)
  })
})
