import { describe, expect, it } from "vitest";
import { getCivTooltipLayout } from "@/features/map/mapTooltipLayout";

describe("getCivTooltipLayout", () => {
  it("returns positive width and height", () => {
    const layout = getCivTooltipLayout(
      "Empire romain",
      "27 av. J.-C. – 476",
      "Épisode 1",
    );
    expect(layout.width).toBeGreaterThanOrEqual(130);
    expect(layout.height).toBeGreaterThan(0);
  });

  it("places the tooltip above the anchor (negative rectY)", () => {
    const layout = getCivTooltipLayout("Rome", "I century", "Ep. 1");
    expect(layout.rectY).toBeLessThan(0);
    expect(layout.rectY + layout.height).toBeLessThanOrEqual(0);
  });

  it("wraps long labels into multiple lines", () => {
    const longLabel =
      "Civilisation avec un nom très long pour forcer le retour à la ligne automatique";
    const layout = getCivTooltipLayout(longLabel, "period", "episode");
    expect(layout.labelLines.length).toBeGreaterThan(1);
    expect(layout.height).toBeGreaterThan(40);
  });

  it("increases height when period text is longer", () => {
    const short = getCivTooltipLayout("Rome", "100", "Ep");
    const long = getCivTooltipLayout(
      "Rome",
      "2600–1900 av. J.-C. (very long period)",
      "Ep",
    );
    expect(long.height).toBeGreaterThanOrEqual(short.height);
  });

  it("orders vertical positions label → period → episode", () => {
    const layout = getCivTooltipLayout("Label", "Period", "Episode");
    expect(layout.labelY).toBeLessThan(layout.periodY);
    expect(layout.periodY).toBeLessThan(layout.episodeY);
  });
});
