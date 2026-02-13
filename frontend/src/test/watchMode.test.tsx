import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import WatchMode from "@/components/WatchMode";

// Mock API
const MOCK_PLAYERS = [
  { id: "p1", username: "PixelViper", score: 340, mode: "walls", startedAt: "2026-02-09T14:20:00Z" },
  { id: "p2", username: "NeonByte", score: 180, mode: "pass-through", startedAt: "2026-02-09T14:25:00Z" },
];

vi.mock("@/services/api", () => ({
  api: {
    getActivePlayers: vi.fn(async () => MOCK_PLAYERS),
    getPlayerGameState: vi.fn(async (id) => {
        if (id === "p1") return { snake: [], food: {x:0, y:0}, direction: "UP", score: 100, gameOver: false };
        return null;
    }),
  },
}));

describe("WatchMode", () => {
  it("renders title after loading", async () => {
    render(<WatchMode />);
    await waitFor(() => {
      expect(screen.getByText("WATCH LIVE")).toBeInTheDocument();
    });
  });

  it("shows player list after loading", async () => {
    render(<WatchMode />);
    await waitFor(() => {
      expect(screen.getByTestId("player-list")).toBeInTheDocument();
    });
    expect(screen.getByText("PixelViper")).toBeInTheDocument();
    expect(screen.getByText("NeonByte")).toBeInTheDocument();
  });

  it("shows game board when selecting a player", async () => {
    render(<WatchMode />);
    await waitFor(() => {
      expect(screen.getByText("PixelViper")).toBeInTheDocument();
    });

    screen.getByText("PixelViper").closest("button")!.click();

    await waitFor(() => {
      expect(screen.getByTestId("game-board")).toBeInTheDocument();
    });
  });
});
