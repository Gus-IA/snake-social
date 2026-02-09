import { describe, it, expect } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Leaderboard from "@/components/Leaderboard";

describe("Leaderboard", () => {
  it("renders title", async () => {
    render(<Leaderboard />);
    expect(screen.getByText("🏆 LEADERBOARD")).toBeInTheDocument();
  });

  it("renders entries after loading", async () => {
    render(<Leaderboard />);
    await waitFor(() => {
      expect(screen.getByTestId("leaderboard-table")).toBeInTheDocument();
    });
    // Should have player names
    await waitFor(() => {
      expect(screen.getByText("PixelViper")).toBeInTheDocument();
    });
  });

  it("filters by mode", async () => {
    render(<Leaderboard />);
    await waitFor(() => {
      expect(screen.getByTestId("leaderboard-table")).toBeInTheDocument();
    });

    // Click walls filter
    fireEvent.click(screen.getByText(/🧱 WALLS/i));

    await waitFor(() => {
      // NeonByte is pass-through only, should not appear
      expect(screen.queryByText("NeonByte")).not.toBeInTheDocument();
    });
  });
});
