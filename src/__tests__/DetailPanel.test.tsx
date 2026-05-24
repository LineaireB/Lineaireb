import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DetailPanel from "@/components/DetailPanel";
import { MAP_CIV_ROME } from "@/__tests__/helpers/mapViewMock";

describe("DetailPanel", () => {
  it("shows empty placeholder when no civilization is selected", () => {
    render(
      <DetailPanel
        civ={null}
        fogMode={false}
        selectedTheme={null}
        relevantTags={[]}
        onClose={vi.fn()}
        onTagClick={vi.fn()}
      />,
    );

    expect(screen.getByText(/aucune sélection/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /sélectionne un thème ou clique sur un point de la carte/i,
      ),
    ).toBeInTheDocument();
  });

  it("shows fog hint when mystère mode is on and panel is empty", () => {
    render(
      <DetailPanel
        civ={null}
        fogMode
        selectedTheme={null}
        relevantTags={[]}
        onClose={vi.fn()}
        onTagClick={vi.fn()}
      />,
    );

    expect(screen.getByText(/point mystère/i)).toBeInTheDocument();
  });

  it("renders civilization content after open animation", async () => {
    render(
      <DetailPanel
        civ={MAP_CIV_ROME}
        fogMode={false}
        selectedTheme={null}
        relevantTags={[]}
        onClose={vi.fn()}
        onTagClick={vi.fn()}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText(MAP_CIV_ROME.label)).toBeInTheDocument();
    });
    expect(screen.getByText(MAP_CIV_ROME.period)).toBeInTheDocument();
  });

  it("calls onTagClick when a tag pill is clicked", async () => {
    const onTagClick = vi.fn();
    render(
      <DetailPanel
        civ={MAP_CIV_ROME}
        fogMode={false}
        selectedTheme={null}
        relevantTags={[]}
        onClose={vi.fn()}
        onTagClick={onTagClick}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("Empire")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Empire"));
    expect(onTagClick).toHaveBeenCalledWith("empire");
  });

  it("calls onClose when close button is clicked", async () => {
    const onClose = vi.fn();
    render(
      <DetailPanel
        civ={MAP_CIV_ROME}
        fogMode={false}
        selectedTheme={null}
        relevantTags={[]}
        onClose={onClose}
        onTagClick={vi.fn()}
      />,
    );

    await waitFor(() => {
      expect(document.querySelector(".detail-panel__close")).toBeTruthy();
    });

    fireEvent.click(document.querySelector(".detail-panel__close")!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
