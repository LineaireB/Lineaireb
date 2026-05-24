import { describe, expect, it } from "vitest";
import { CIVILIZATIONS, TOTAL } from "@/data/civilizations";
import { REGIONS } from "@/data/constants";
import { getAllThemeTagIds } from "@/lib/tags";

describe("civilizations data integrity", () => {
  const validTags = new Set(getAllThemeTagIds());
  const regionKeys = new Set(REGIONS.map((r) => r.key));

  it("TOTAL matches array length", () => {
    expect(TOTAL).toBe(CIVILIZATIONS.length);
  });

  it("every tag exists in THEMES", () => {
    for (const civ of CIVILIZATIONS) {
      for (const tag of civ.tags) {
        expect(validTags.has(tag), `${civ.id} tag ${tag}`).toBe(true);
      }
    }
  });

  it("every geo key has a REGIONS entry", () => {
    for (const civ of CIVILIZATIONS) {
      if (civ.geo) {
        expect(regionKeys.has(civ.geo), `${civ.id} geo ${civ.geo}`).toBe(true);
      }
    }
  });

  it("coordinates are within valid bounds", () => {
    for (const civ of CIVILIZATIONS) {
      expect(civ.lng).toBeGreaterThanOrEqual(-180);
      expect(civ.lng).toBeLessThanOrEqual(180);
      expect(civ.lat).toBeGreaterThanOrEqual(-90);
      expect(civ.lat).toBeLessThanOrEqual(90);
    }
  });

  it("ids are unique", () => {
    const ids = CIVILIZATIONS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("requires non-empty label, period, and summary", () => {
    for (const civ of CIVILIZATIONS) {
      expect(civ.label.trim().length).toBeGreaterThan(0);
      expect(civ.period.trim().length).toBeGreaterThan(0);
      expect(civ.summary.trim().length).toBeGreaterThan(0);
    }
  });
});
