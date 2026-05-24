/**
 * Layout breakpoints — keep aligned with `--bp-*` in src/styles/tokens.css
 * and @media rules under src/styles/layout/.
 */
export const BREAKPOINT_DESKTOP_MIN = 900;
export const BREAKPOINT_MOBILE_MAX = BREAKPOINT_DESKTOP_MIN - 1;

export const BREAKPOINT_HEADER_WIDE_MIN = 1001;
export const BREAKPOINT_HEADER_NARROW_MAX = 1000;

export const BREAKPOINT_FOOTER_STACK_MAX = 480;

export function isDesktopViewport(width = window.innerWidth): boolean {
  return width >= BREAKPOINT_DESKTOP_MIN;
}

export function isMobileViewport(width = window.innerWidth): boolean {
  return width <= BREAKPOINT_MOBILE_MAX;
}

export function isHeaderWideViewport(width = window.innerWidth): boolean {
  return width >= BREAKPOINT_HEADER_WIDE_MIN;
}
