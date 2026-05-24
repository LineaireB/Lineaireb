import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDiscovery } from "@/features/fog/useDiscovery";
import { MAP_CIV_ROME } from "@/__tests__/helpers/mapViewMock";

describe("useDiscovery", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("treats every civ as discovered when fog mode is off", () => {
    const { result } = renderHook(() => useDiscovery(false));
    expect(result.current.isDiscovered(MAP_CIV_ROME)).toBe(true);
    expect(result.current.discoveredCount).toBe(0);
  });

  it("hides undiscovered civs in fog mode", () => {
    const { result } = renderHook(() => useDiscovery(true));
    expect(result.current.isDiscovered(MAP_CIV_ROME)).toBe(false);
  });

  it("marks a civ as discovered and persists to localStorage", () => {
    const { result } = renderHook(() => useDiscovery(true));

    act(() => {
      result.current.discover(MAP_CIV_ROME);
    });

    expect(result.current.isDiscovered(MAP_CIV_ROME)).toBe(true);
    expect(result.current.discoveredCount).toBe(1);
    expect(JSON.parse(localStorage.getItem("lineaireb-discovered")!)).toContain(
      "rome",
    );
  });

  it("does not increment count when discovering the same civ twice", () => {
    const { result } = renderHook(() => useDiscovery(true));

    act(() => {
      result.current.discover(MAP_CIV_ROME);
      result.current.discover(MAP_CIV_ROME);
    });

    expect(result.current.discoveredCount).toBe(1);
  });

  it("adds civ id to revealAnim then removes it after animation", () => {
    const { result } = renderHook(() => useDiscovery(true));

    act(() => {
      result.current.discover(MAP_CIV_ROME);
    });
    expect(result.current.revealAnim.has("rome")).toBe(true);

    act(() => {
      vi.advanceTimersByTime(650);
    });
    expect(result.current.revealAnim.has("rome")).toBe(false);
  });

  it("resetFog clears memory and storage", () => {
    const { result } = renderHook(() => useDiscovery(true));

    act(() => {
      result.current.discover(MAP_CIV_ROME);
      result.current.resetFog();
    });

    expect(result.current.discoveredCount).toBe(0);
    expect(result.current.isDiscovered(MAP_CIV_ROME)).toBe(false);
    expect(localStorage.getItem("lineaireb-discovered")).toBeNull();
  });

  it("hydrates from localStorage on mount", () => {
    localStorage.setItem("lineaireb-discovered", JSON.stringify(["rome"]));
    const { result } = renderHook(() => useDiscovery(true));
    expect(result.current.isDiscovered(MAP_CIV_ROME)).toBe(true);
    expect(result.current.discoveredCount).toBe(1);
  });
});
