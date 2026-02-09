import { describe, it, expect } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Leaderboard from "@/components/Leaderboard";

describe("Leaderboard", () => {
  it("renders title", async () => {
    render(<Leaderboard />);
    expect(screen.getByText("LEADERBOARD")).toBeInTheDocument();
  });

  it("renders entries after loading", async () => {
    render(<Leaderboard />);
    await waitFor(() => {
      expect(screen.getByTestId("leaderboard-table")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("PixelViper")).toBeInTheDocument();
    });
  });

  it("filters by mode", async () => {
    render(<Leaderboard />);
    await waitFor(() => {
      expect(screen.getByTestId("leaderboard-table")).toBeInTheDocument();
    });

    // Click walls filter button
    fireEvent.click(screen.getByText("Walls"));

    await waitFor(() => {
      expect(screen.queryByText("NeonByte")).not.toBeInTheDocument();
    });
  });
});
