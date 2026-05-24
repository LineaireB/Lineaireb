import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TOTAL } from "@/data/civilizations";
import ExplorerSidebar from "@/features/explorer/ExplorerSidebar";

describe("ExplorerSidebar (mobile drawer)", () => {
  const baseProps = {
    visible: true,
    open: true,
    fogMode: false,
    discoveredCount: 0,
    total: TOTAL,
    selectedTheme: null as string | null,
    onSelectTheme: vi.fn(),
    activeGeo: null as string | null,
    onRegionClick: vi.fn(),
    onToggle: vi.fn(),
  };

  it("applies open class when open prop is true", () => {
    render(<ExplorerSidebar {...baseProps} />);
    expect(document.getElementById("explorer-sidebar")).toHaveClass(
      "explorer-sidebar--open",
    );
  });

  it("calls onNavigate after theme selection (closes mobile drawer)", () => {
    const onNavigate = vi.fn();
    const onSelectTheme = vi.fn();
    render(
      <ExplorerSidebar
        {...baseProps}
        onSelectTheme={onSelectTheme}
        onNavigate={onNavigate}
      />,
    );

    fireEvent.click(screen.getByText("Agriculture"));
    expect(onSelectTheme).toHaveBeenCalledWith("agriculture");
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });

  it("calls onToggle when the side tab is clicked", () => {
    const onToggle = vi.fn();
    render(<ExplorerSidebar {...baseProps} open={false} onToggle={onToggle} />);

    fireEvent.click(screen.getByRole("button", { name: /afficher les filtres/i }));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("calls onNavigate after region selection", () => {
    const onNavigate = vi.fn();
    const onRegionClick = vi.fn();
    render(
      <ExplorerSidebar
        {...baseProps}
        onRegionClick={onRegionClick}
        onNavigate={onNavigate}
      />,
    );

    fireEvent.click(screen.getByText("Europe"));
    expect(onRegionClick).toHaveBeenCalled();
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });
});
