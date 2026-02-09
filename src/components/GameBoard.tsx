import React from "react";
import type { Position } from "@/services/api";
import { GRID_SIZE } from "@/hooks/useSnakeGame";

interface GameBoardProps {
  snake: Position[];
  food: Position;
  className?: string;
}

const GameBoard: React.FC<GameBoardProps> = ({ snake, food, className = "" }) => {
  const cells: React.ReactNode[] = [];

  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const isHead = snake[0]?.x === x && snake[0]?.y === y;
      const isBody = !isHead && snake.some((p) => p.x === x && p.y === y);
      const isFood = food.x === x && food.y === y;

      let cellClass = "game-cell";
      if (isHead) cellClass += " snake-head";
      else if (isBody) cellClass += " snake-body";
      else if (isFood) cellClass += " food-cell";

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
      className={`grid border border-border rounded-md overflow-hidden neon-border ${className}`}
      style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1rem)` }}
      data-testid="game-board"
    >
      {cells}
    </div>
  );
};

export default GameBoard;
