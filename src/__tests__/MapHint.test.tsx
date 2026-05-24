import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MapHint } from "@/features/map/ZoomControls";

describe("MapHint (mobile vs desktop copy)", () => {
  it("renders touch gestures hint for mobile", () => {
    render(<MapHint />);
    expect(screen.getByText("Pincez pour zoomer")).toBeInTheDocument();
    expect(screen.getByText("Glissez pour naviguer")).toBeInTheDocument();
  });

  it("renders desktop wheel hint (hidden via CSS on small screens)", () => {
    render(<MapHint />);
    expect(
      screen.getByText(/molette pour zoomer · clic-glisser pour naviguer/i),
    ).toBeInTheDocument();
  });

  it("marks touch and desktop blocks with layout classes", () => {
    const { container } = render(<MapHint />);
    expect(container.querySelector(".map-hint__touch")).toBeInTheDocument();
    expect(container.querySelector(".map-hint__desktop")).toBeInTheDocument();
  });
});
