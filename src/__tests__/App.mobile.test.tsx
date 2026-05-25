import "@/__tests__/helpers/setupMapMock";
import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { MAP_CIV_ROME } from "@/__tests__/helpers/mapViewMock";
import {
  clickMapBackground,
  expectDetailCiv,
  getExplorerSidebar,
  renderApp,
} from "@/__tests__/helpers/renderApp";
import {
  setDesktopViewport,
  setMobileViewport,
} from "@/__tests__/helpers/viewport";

beforeEach(() => {
  localStorage.clear();
  setMobileViewport();
});

afterEach(() => {
  setDesktopViewport();
});

function getThemesMenuButton() {
  return screen.getByRole("button", { name: /thèmes/i });
}

function getMobileHeaderHints() {
  return document.querySelectorAll(".app-header__hint--mobile-only");
}

describe("App — mobile header", () => {
  it("shows theme picker hint on mobile when explorer is idle", () => {
    renderApp();

    const hints = getMobileHeaderHints();
    expect(hints.length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByText(/sélectionne un thème pour révéler les connexions/i),
    ).toBeInTheDocument();
  });

  it("shows mystère hint on mobile when fog mode is active", () => {
    renderApp();

    fireEvent.click(screen.getByRole("button", { name: /^mystère$/i }));

    expect(
      within(document.querySelector(".app-header")!).getByText(
        /clique sur un point mystère pour le découvrir/i,
      ),
    ).toBeInTheDocument();
  });

  it("exposes the ☰ Thèmes control only in explorer mode", () => {
    renderApp();
    expect(getThemesMenuButton()).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^comparer$/i }));
    expect(
      screen.queryByRole("button", { name: /thèmes/i }),
    ).not.toBeInTheDocument();
  });
});

describe("App — mobile themes drawer", () => {
  it("opens the off-canvas sidebar and shows a dismiss backdrop", () => {
    renderApp();

    const menuBtn = getThemesMenuButton();
    fireEvent.click(menuBtn);

    expect(menuBtn).toHaveAttribute("aria-expanded", "true");
    expect(document.getElementById("explorer-sidebar")).toHaveClass(
      "explorer-sidebar--open",
    );
    expect(
      screen.getByRole("button", { name: /fermer le menu/i }),
    ).toBeInTheDocument();
  });

  it("closes the drawer after selecting a theme (onNavigate)", () => {
    renderApp();

    fireEvent.click(getThemesMenuButton());
    const sidebar = getExplorerSidebar();
    fireEvent.click(within(sidebar).getByText("Agriculture"));

    expect(getThemesMenuButton()).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById("explorer-sidebar")).not.toHaveClass(
      "explorer-sidebar--open",
    );
    expect(screen.getByText("agriculture")).toBeInTheDocument();
  });

  it("closes the drawer after selecting a zoom region", () => {
    renderApp();

    fireEvent.click(getThemesMenuButton());
    const sidebar = getExplorerSidebar();
    fireEvent.click(within(sidebar).getByText("Europe"));

    expect(getThemesMenuButton()).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById("explorer-sidebar")).not.toHaveClass(
      "explorer-sidebar--open",
    );
  });

  it("closes the drawer when a map point is selected", async () => {
    renderApp();

    fireEvent.click(getThemesMenuButton());
    expect(document.getElementById("explorer-sidebar")).toHaveClass(
      "explorer-sidebar--open",
    );

    fireEvent.click(screen.getByTestId("map-civ-rome"));

    await expectDetailCiv();
    expect(getThemesMenuButton()).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById("explorer-sidebar")).not.toHaveClass(
      "explorer-sidebar--open",
    );
  });
});

describe("App — mobile detail bottom sheet", () => {
  it("shows a backdrop to dismiss the detail sheet", async () => {
    renderApp();

    fireEvent.click(screen.getByTestId("map-civ-rome"));
    await expectDetailCiv();

    expect(
      screen.getByRole("button", { name: /fermer la fiche/i }),
    ).toBeInTheDocument();
    expect(document.querySelector(".detail-panel")).toBeInTheDocument();
  });

  it("closes the detail sheet via the backdrop", async () => {
    renderApp();

    fireEvent.click(screen.getByTestId("map-civ-rome"));
    await expectDetailCiv();

    fireEvent.click(screen.getByRole("button", { name: /fermer la fiche/i }));

    await waitFor(() => {
      expect(screen.queryByText(MAP_CIV_ROME.summary)).not.toBeInTheDocument();
    });
  });
});

describe("App — mobile podcast overlay", () => {
  it("shows podcast backdrop in explorer mode", async () => {
    renderApp();

    fireEvent.click(
      screen.getByRole("button", { name: /écouter le podcast/i }),
    );

    const backdrop = screen.getByRole("button", {
      name: /fermer le panneau podcast/i,
    });
    expect(backdrop).toHaveClass("app-backdrop--podcast-inline");
    expect(document.getElementById("podcast-panel")).toBeInTheDocument();
  });

  it("dismisses podcast via map background tap", async () => {
    const { container } = renderApp();

    fireEvent.click(
      screen.getByRole("button", { name: /écouter le podcast/i }),
    );
    clickMapBackground(container);

    await waitFor(() => {
      expect(document.getElementById("podcast-panel")).not.toBeInTheDocument();
    });
  });
});

describe("App — mobile compare layout", () => {
  it("keeps the same header height when switching explorer and compare", () => {
    renderApp();

    const header = document.querySelector(".app-header");
    expect(header).toBeTruthy();

    const explorerHeight = header!.getBoundingClientRect().height;
    fireEvent.click(screen.getByRole("button", { name: /^comparer$/i }));
    const compareHeight = header!.getBoundingClientRect().height;

    expect(Math.abs(compareHeight - explorerHeight)).toBeLessThanOrEqual(0.5);
  });

  it("shows a short compare hint on mobile to stabilize header height", () => {
    renderApp();

    fireEvent.click(screen.getByRole("button", { name: /^comparer$/i }));

    expect(
      screen.getByText(/compare deux modes de subsistance sur la carte/i),
    ).toBeInTheDocument();
    expect(
      document.querySelector(".app-header__mobile-hint"),
    ).toBeInTheDocument();
  });

  it("stacks compare panel under the map without the themes drawer", () => {
    renderApp();

    fireEvent.click(screen.getByRole("button", { name: /^comparer$/i }));

    expect(document.querySelector(".app-body--compare")).toBeInTheDocument();
    expect(document.getElementById("compare-panel")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /thèmes/i }),
    ).not.toBeInTheDocument();
    expect(document.querySelector(".explorer-sidebar-shell")).toHaveClass(
      "explorer-sidebar-shell--hidden",
    );
  });
});
