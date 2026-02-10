import React from "react";
import type { Position } from "@/services/api";
import { GRID_SIZE } from "@/hooks/useSnakeGame";

interface GameBoardProps {
  snake: Position[];
  food: Position;
  className?: string;
  cellSize?: "sm" | "md" | "lg";
}

const CELL_SIZES = {
  sm: "w-4 h-4",
  md: "w-5 h-5 sm:w-6 sm:h-6",
  lg: "w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8",
};

const GRID_COLS = {
  sm: `repeat(${GRID_SIZE}, 1rem)`,
  md: `repeat(${GRID_SIZE}, minmax(1.25rem, 1.5rem))`,
  lg: `repeat(${GRID_SIZE}, minmax(1.5rem, 2rem))`,
};

const GameBoard: React.FC<GameBoardProps> = ({ snake, food, className = "", cellSize = "lg" }) => {
  const cells: React.ReactNode[] = [];
  const sizeClass = CELL_SIZES[cellSize];

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const isHead = snake[0]?.x === x && snake[0]?.y === y;
      const isBody = !isHead && snake.some((p) => p.x === x && p.y === y);
      const isFood = food.x === x && food.y === y;

      let cellClass = `${sizeClass} border border-border/10 transition-colors duration-75`;
      if (isHead) cellClass += " snake-head rounded-sm";
      else if (isBody) cellClass += " snake-body";
      else if (isFood) cellClass += " food-cell rounded-full";
      else cellClass += " bg-muted/20";

      cells.push(
        <div
          key={`${x}-${y}`}
          className={cellClass}
          data-testid={`cell-${x}-${y}`}
          data-cell-type={isHead ? "head" : isBody ? "body" : isFood ? "food" : "empty"}
        />
      );
    }
  }

  return (
    <div
      className={`inline-grid border-2 border-primary/30 rounded-lg overflow-hidden neon-border bg-background/50 ${className}`}
      style={{ gridTemplateColumns: GRID_COLS[cellSize] }}
      data-testid="game-board"
    >
      {cells}
    </div>
  );
};

export default GameBoard;
