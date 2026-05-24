import { act, fireEvent, render, screen } from "@testing-library/react";
import { PANEL_ANIM_MS } from "@/hooks/useAnimatedPresence";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import DiscoveryToast from "@/features/fog/DiscoveryToast";
import { MAP_CIV_ROME } from "@/__tests__/helpers/mapViewMock";

describe("DiscoveryToast", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders nothing when civ is null", () => {
    const { container } = render(
      <DiscoveryToast civ={null} onClose={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("shows discovery status with civ label after open animation", async () => {
    render(<DiscoveryToast civ={MAP_CIV_ROME} onClose={vi.fn()} />);

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText(MAP_CIV_ROME.label)).toBeInTheDocument();
    expect(screen.getByText(/découverte/i)).toBeInTheDocument();
  });

  it("calls onClose after auto-dismiss timeout", async () => {
    const onClose = vi.fn();
    render(<DiscoveryToast civ={MAP_CIV_ROME} onClose={onClose} />);

    await act(async () => {
      await vi.runOnlyPendingTimersAsync();
    });

    act(() => {
      vi.advanceTimersByTime(3200);
      vi.advanceTimersByTime(PANEL_ANIM_MS);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("dismisses early when clicked", async () => {
    const onClose = vi.fn();
    render(<DiscoveryToast civ={MAP_CIV_ROME} onClose={onClose} />);

    await act(async () => {
      await vi.runOnlyPendingTimersAsync();
    });

    fireEvent.click(screen.getByRole("status"));

    act(() => {
      vi.advanceTimersByTime(PANEL_ANIM_MS);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
