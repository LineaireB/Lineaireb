import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  PANEL_ANIM_MS,
  useAnimatedPresence,
} from "@/hooks/useAnimatedPresence";

describe("useAnimatedPresence", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("opens visible content after requestAnimationFrame", async () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string | null }) => useAnimatedPresence(value),
      { initialProps: { value: null as string | null } },
    );

    expect(result.current.visible).toBeNull();
    expect(result.current.isClosing).toBe(false);

    rerender({ value: "rome" });
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(result.current.visible).toBe("rome");
    expect(result.current.isClosing).toBe(false);
  });

  it("keeps content visible while closing then clears after duration", async () => {
    const onClosingChange = vi.fn();
    const onAfterClose = vi.fn();
    const { result, rerender } = renderHook(
      ({ value }: { value: string | null }) =>
        useAnimatedPresence(value, {
          onClosingChange,
          onAfterClose,
          durationMs: PANEL_ANIM_MS,
        }),
      { initialProps: { value: "rome" as string | null } },
    );

    await act(async () => {
      await vi.runAllTimersAsync();
    });
    expect(result.current.visible).toBe("rome");

    rerender({ value: null });
    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(onClosingChange).toHaveBeenCalledWith(true);
    expect(result.current.visible).toBe("rome");
    expect(result.current.isClosing).toBe(true);

    act(() => {
      vi.advanceTimersByTime(PANEL_ANIM_MS);
    });

    expect(result.current.visible).toBeNull();
    expect(result.current.isClosing).toBe(false);
    expect(onAfterClose).toHaveBeenCalledTimes(1);
  });

  it("dismiss triggers closing without clearing value immediately", async () => {
    const { result } = renderHook(() => useAnimatedPresence("rome"));

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    act(() => {
      result.current.dismiss();
    });

    expect(result.current.isClosing).toBe(true);
    expect(result.current.visible).toBe("rome");
  });
});
