import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { THEMES } from "@/data/themes";
import ThemeTree from "@/features/explorer/ThemeTree";
import { countCivsForTheme } from "@/lib/tags";

describe("ThemeTree", () => {
  it("renders root label and civ count for a theme branch", () => {
    render(
      <ThemeTree
        nodeKey="subsistance"
        node={THEMES.subsistance}
        selected={null}
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByText("Mode de subsistance")).toBeInTheDocument();
    expect(
      screen.getByText(
        String(countCivsForTheme(THEMES.subsistance, "subsistance")),
      ),
    ).toBeInTheDocument();
  });

  it("selects a child theme on click", () => {
    const onSelect = vi.fn();
    render(
      <ThemeTree
        nodeKey="subsistance"
        node={THEMES.subsistance}
        selected={null}
        onSelect={onSelect}
      />,
    );

    fireEvent.click(screen.getByText("Agriculture"));
    expect(onSelect).toHaveBeenCalledWith("agriculture");
  });

  it("clears selection when clicking the already selected row", () => {
    const onSelect = vi.fn();
    render(
      <ThemeTree
        nodeKey="agriculture"
        node={THEMES.subsistance.children!.agriculture}
        selected="agriculture"
        onSelect={onSelect}
      />,
    );

    fireEvent.click(screen.getByText("Agriculture"));
    expect(onSelect).toHaveBeenCalledWith(null);
  });

  it("toggles chevron when clicking a parent with children", () => {
    render(
      <ThemeTree
        nodeKey="subsistance"
        node={THEMES.subsistance}
        selected={null}
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByText("Agroforesterie")).toBeInTheDocument();
    const row = screen
      .getByText("Mode de subsistance")
      .closest(".theme-tree__row")!;
    fireEvent.click(row);
    expect(screen.queryByText("Agroforesterie")).not.toBeInTheDocument();
    fireEvent.click(row);
    expect(screen.getByText("Agroforesterie")).toBeInTheDocument();
  });
});
