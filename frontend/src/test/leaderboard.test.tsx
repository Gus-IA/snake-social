import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Leaderboard from "@/components/Leaderboard";

// Mock API
const MOCK_LEADERBOARD = [
  { id: "1", username: "PixelViper", score: 2450, mode: "walls", date: "2026-02-09" },
  { id: "2", username: "NeonByte", score: 1980, mode: "pass-through", date: "2026-02-08" },
];

vi.mock("@/services/api", () => ({
  api: {
    getLeaderboard: vi.fn(async (mode) => {
      if (mode) return MOCK_LEADERBOARD.filter((e) => e.mode === mode);
      return MOCK_LEADERBOARD;
    }),
  },
}));

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
