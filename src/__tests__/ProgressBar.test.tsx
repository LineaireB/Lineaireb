import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MILESTONES } from "@/data/constants";
import { TOTAL } from "@/data/civilizations";
import ProgressBar from "@/features/fog/ProgressBar";

describe("ProgressBar", () => {
  it("shows count and total", () => {
    render(<ProgressBar count={3} total={TOTAL} />);
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText(`/${TOTAL}`)).toBeInTheDocument();
  });

  it("shows milestone message when count matches a milestone key", () => {
    render(<ProgressBar count={1} total={TOTAL} />);
    expect(screen.getByText(MILESTONES[1])).toBeInTheDocument();
  });

  it("shows completion milestone at full discovery", () => {
    render(<ProgressBar count={19} total={19} />);
    expect(screen.getByText(MILESTONES[19])).toBeInTheDocument();
  });

  it("hides milestone text between milestone thresholds", () => {
    render(<ProgressBar count={2} total={TOTAL} />);
    expect(screen.queryByText(MILESTONES[1])).not.toBeInTheDocument();
    expect(screen.queryByText(MILESTONES[4])).not.toBeInTheDocument();
  });
});
