import { describe, expect, it } from "vitest";
import {
  COMPARISONS,
  DIMENSIONS,
  SUBSISTENCE_LABELS,
  SUBSISTENCE_TAGS,
} from "@/data/comparisons";
import type { ComparisonData, SubsistenceTag } from "@/types/map";

describe("comparison data integrity", () => {
  const tags = SUBSISTENCE_TAGS as SubsistenceTag[];

  it("defines COMPARISONS for every subsistence tag", () => {
    for (const tag of tags) {
      expect(COMPARISONS[tag], `missing comparison for ${tag}`).toBeDefined();
    }
    expect(Object.keys(COMPARISONS).sort()).toEqual([...tags].sort());
  });

  it("maps every tag to a non-empty label", () => {
    for (const tag of tags) {
      expect(SUBSISTENCE_LABELS[tag].length).toBeGreaterThan(0);
      expect(COMPARISONS[tag].label).toBe(SUBSISTENCE_LABELS[tag]);
    }
  });

  it("fills every dimension field on each comparison entry", () => {
    const keys = DIMENSIONS.map((d) => d.key);
    for (const tag of tags) {
      const row = COMPARISONS[tag] as ComparisonData;
      for (const key of keys) {
        expect(typeof row[key], `${tag}.${key}`).toBe("string");
        expect(row[key].length).toBeGreaterThan(0);
      }
      expect(row.color.length).toBeGreaterThan(0);
    }
  });

  it("uses unique human-readable dimension labels", () => {
    const labels = DIMENSIONS.map((d) => d.label);
    expect(new Set(labels).size).toBe(labels.length);
  });
});
