import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import WatchMode from "@/components/WatchMode";

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
