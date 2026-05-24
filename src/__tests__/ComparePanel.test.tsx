import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { COMPARISONS } from "@/data/comparisons";
import ComparePanel from "@/features/compare/ComparePanel";
import { getHybridCivs } from "@/lib/tags";
import { MAP_CIV_MAYAS } from "@/__tests__/helpers/mapViewMock";

describe("ComparePanel", () => {
  const defaultProps = {
    compareA: "chasse_cueillette" as const,
    compareB: "agriculture" as const,
    dataA: COMPARISONS.chasse_cueillette,
    dataB: COMPARISONS.agriculture,
    onSelectCiv: vi.fn(),
    hybridsHighlightToken: 0,
  };

  it("renders comparison title and dimension labels", () => {
    render(<ComparePanel {...defaultProps} />);
    expect(screen.getByText("Comparaison")).toBeInTheDocument();
    expect(screen.getByText("Organisation politique")).toBeInTheDocument();
    expect(
      screen.getByText(COMPARISONS.chasse_cueillette.label),
    ).toBeInTheDocument();
    expect(screen.getByText(COMPARISONS.agriculture.label)).toBeInTheDocument();
  });

  it("lists hybrid civilizations when both modes overlap", () => {
    render(
      <ComparePanel
        {...defaultProps}
        compareA="agriculture"
        compareB="agroforesterie"
        dataA={COMPARISONS.agriculture}
        dataB={COMPARISONS.agroforesterie}
      />,
    );

    expect(screen.getByText("Cas hybrides")).toBeInTheDocument();
    const hybrids = getHybridCivs("agriculture", "agroforesterie");
    for (const civ of hybrids) {
      expect(
        screen.getByRole("button", { name: new RegExp(civ.label, "i") }),
      ).toBeInTheDocument();
    }
  });

  it("calls onSelectCiv when a hybrid row is clicked", () => {
    const onSelectCiv = vi.fn();
    render(
      <ComparePanel
        {...defaultProps}
        compareA="agriculture"
        compareB="agroforesterie"
        dataA={COMPARISONS.agriculture}
        dataB={COMPARISONS.agroforesterie}
        onSelectCiv={onSelectCiv}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: new RegExp(MAP_CIV_MAYAS.label, "i"),
      }),
    );
    expect(onSelectCiv).toHaveBeenCalledWith(
      expect.objectContaining({ id: "mayas" }),
    );
  });

  it("highlights hybrids section when hybridsHighlightToken changes", async () => {
    const hybrids = getHybridCivs("agriculture", "agroforesterie");
    if (hybrids.length === 0) return;

    const { rerender } = render(
      <ComparePanel
        {...defaultProps}
        compareA="agriculture"
        compareB="agroforesterie"
        dataA={COMPARISONS.agriculture}
        dataB={COMPARISONS.agroforesterie}
        hybridsHighlightToken={0}
      />,
    );

    rerender(
      <ComparePanel
        {...defaultProps}
        compareA="agriculture"
        compareB="agroforesterie"
        dataA={COMPARISONS.agriculture}
        dataB={COMPARISONS.agroforesterie}
        hybridsHighlightToken={1}
      />,
    );

    await waitFor(() => {
      expect(document.getElementById("compare-panel-hybrids")).toHaveClass(
        "compare-panel__hybrids--highlight",
      );
    });
  });
});
