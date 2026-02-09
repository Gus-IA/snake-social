import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import GameBoard from "@/components/GameBoard";
import type { Position } from "@/services/api";

describe("GameBoard", () => {
  const snake: Position[] = [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }];
  const food: Position = { x: 10, y: 10 };

  it("renders the grid", () => {
    render(<GameBoard snake={snake} food={food} />);
    expect(screen.getByTestId("game-board")).toBeInTheDocument();
  });

  it("renders snake head", () => {
    render(<GameBoard snake={snake} food={food} />);
    const head = screen.getByTestId("cell-5-5");
    expect(head.dataset.cellType).toBe("head");
  });

  it("renders snake body", () => {
    render(<GameBoard snake={snake} food={food} />);
    expect(screen.getByTestId("cell-4-5").dataset.cellType).toBe("body");
    expect(screen.getByTestId("cell-3-5").dataset.cellType).toBe("body");
  });

  it("renders food", () => {
    render(<GameBoard snake={snake} food={food} />);
    expect(screen.getByTestId("cell-10-10").dataset.cellType).toBe("food");
  });

  it("renders empty cells", () => {
    render(<GameBoard snake={snake} food={food} />);
    expect(screen.getByTestId("cell-0-0").dataset.cellType).toBe("empty");
  });

  it("renders correct number of cells", () => {
    render(<GameBoard snake={snake} food={food} />);
    // 20x20 = 400 cells
    const board = screen.getByTestId("game-board");
    expect(board.children).toHaveLength(400);
  });
});
