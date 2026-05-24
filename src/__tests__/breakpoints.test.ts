import { afterEach, describe, expect, it } from "vitest";
import {
  BREAKPOINT_DESKTOP_MIN,
  BREAKPOINT_FOOTER_STACK_MAX,
  BREAKPOINT_HEADER_NARROW_MAX,
  BREAKPOINT_HEADER_WIDE_MIN,
  BREAKPOINT_MOBILE_MAX,
  isDesktopViewport,
  isHeaderWideViewport,
  isMobileViewport,
} from "@/lib/breakpoints";
import {
  setViewportWidth,
  VIEWPORT_DESKTOP,
  VIEWPORT_MOBILE,
} from "@/__tests__/helpers/viewport";

describe("breakpoints", () => {
  afterEach(() => {
    setViewportWidth(VIEWPORT_DESKTOP);
  });

  it("uses adjacent mobile/desktop thresholds", () => {
    expect(BREAKPOINT_MOBILE_MAX).toBe(BREAKPOINT_DESKTOP_MIN - 1);
    expect(BREAKPOINT_HEADER_WIDE_MIN).toBe(BREAKPOINT_HEADER_NARROW_MAX + 1);
  });

  it("classifies mobile viewport widths", () => {
    setViewportWidth(VIEWPORT_MOBILE);
    expect(isMobileViewport()).toBe(true);
    expect(isDesktopViewport()).toBe(false);
  });

  it("classifies desktop viewport widths", () => {
    setViewportWidth(VIEWPORT_DESKTOP);
    expect(isDesktopViewport()).toBe(true);
    expect(isMobileViewport()).toBe(false);
  });

  it("classifies header wide layout at 1001px and above", () => {
    setViewportWidth(BREAKPOINT_HEADER_WIDE_MIN);
    expect(isHeaderWideViewport()).toBe(true);

    setViewportWidth(BREAKPOINT_HEADER_NARROW_MAX);
    expect(isHeaderWideViewport()).toBe(false);
  });

  it("exposes footer stack breakpoint for narrow phones", () => {
    expect(BREAKPOINT_FOOTER_STACK_MAX).toBe(480);
  });
});
