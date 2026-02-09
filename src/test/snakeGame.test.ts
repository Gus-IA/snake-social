import { describe, it, expect } from "vitest";
import { moveSnake } from "@/hooks/useSnakeGame";
import type { Position, Direction } from "@/services/api";

describe("moveSnake", () => {
  const baseSnake: Position[] = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ];
  const food: Position = { x: 15, y: 15 };

  describe("basic movement", () => {
    it("moves right", () => {
      const { newSnake, ate, dead } = moveSnake(baseSnake, "RIGHT", "walls", food);
      expect(dead).toBe(false);
      expect(ate).toBe(false);
      expect(newSnake[0]).toEqual({ x: 11, y: 10 });
      expect(newSnake).toHaveLength(3);
    });

    it("moves left", () => {
      const snake: Position[] = [{ x: 10, y: 10 }, { x: 11, y: 10 }, { x: 12, y: 10 }];
      const { newSnake } = moveSnake(snake, "LEFT", "walls", food);
      expect(newSnake[0]).toEqual({ x: 9, y: 10 });
    });

    it("moves up", () => {
      const snake: Position[] = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
      const { newSnake } = moveSnake(snake, "UP", "walls", food);
      expect(newSnake[0]).toEqual({ x: 10, y: 9 });
    });

    it("moves down", () => {
      const snake: Position[] = [{ x: 10, y: 10 }, { x: 10, y: 9 }, { x: 10, y: 8 }];
      const { newSnake } = moveSnake(snake, "DOWN", "walls", food);
      expect(newSnake[0]).toEqual({ x: 10, y: 11 });
    });
  });

  describe("eating food", () => {
    it("grows when eating food", () => {
      const foodPos: Position = { x: 11, y: 10 };
      const { newSnake, ate, dead } = moveSnake(baseSnake, "RIGHT", "walls", foodPos);
      expect(ate).toBe(true);
      expect(dead).toBe(false);
      expect(newSnake).toHaveLength(4);
      expect(newSnake[0]).toEqual({ x: 11, y: 10 });
    });
  });

  describe("walls mode", () => {
    it("dies when hitting right wall", () => {
      const snake: Position[] = [{ x: 19, y: 10 }, { x: 18, y: 10 }, { x: 17, y: 10 }];
      const { dead } = moveSnake(snake, "RIGHT", "walls", food);
      expect(dead).toBe(true);
    });

    it("dies when hitting left wall", () => {
      const snake: Position[] = [{ x: 0, y: 10 }, { x: 1, y: 10 }, { x: 2, y: 10 }];
      const { dead } = moveSnake(snake, "LEFT", "walls", food);
      expect(dead).toBe(true);
    });

    it("dies when hitting top wall", () => {
      const snake: Position[] = [{ x: 10, y: 0 }, { x: 10, y: 1 }, { x: 10, y: 2 }];
      const { dead } = moveSnake(snake, "UP", "walls", food);
      expect(dead).toBe(true);
    });

    it("dies when hitting bottom wall", () => {
      const snake: Position[] = [{ x: 10, y: 19 }, { x: 10, y: 18 }, { x: 10, y: 17 }];
      const { dead } = moveSnake(snake, "DOWN", "walls", food);
      expect(dead).toBe(true);
    });
  });

  describe("pass-through mode", () => {
    it("wraps around right edge", () => {
      const snake: Position[] = [{ x: 19, y: 10 }, { x: 18, y: 10 }, { x: 17, y: 10 }];
      const { newSnake, dead } = moveSnake(snake, "RIGHT", "pass-through", food);
      expect(dead).toBe(false);
      expect(newSnake[0]).toEqual({ x: 0, y: 10 });
    });

    it("wraps around left edge", () => {
      const snake: Position[] = [{ x: 0, y: 10 }, { x: 1, y: 10 }, { x: 2, y: 10 }];
      const { newSnake, dead } = moveSnake(snake, "LEFT", "pass-through", food);
      expect(dead).toBe(false);
      expect(newSnake[0]).toEqual({ x: 19, y: 10 });
    });

    it("wraps around top edge", () => {
      const snake: Position[] = [{ x: 10, y: 0 }, { x: 10, y: 1 }, { x: 10, y: 2 }];
      const { newSnake, dead } = moveSnake(snake, "UP", "pass-through", food);
      expect(dead).toBe(false);
      expect(newSnake[0]).toEqual({ x: 10, y: 19 });
    });

    it("wraps around bottom edge", () => {
      const snake: Position[] = [{ x: 10, y: 19 }, { x: 10, y: 18 }, { x: 10, y: 17 }];
      const { newSnake, dead } = moveSnake(snake, "DOWN", "pass-through", food);
      expect(dead).toBe(false);
      expect(newSnake[0]).toEqual({ x: 10, y: 0 });
    });
  });

  describe("self collision", () => {
    it("dies when hitting itself", () => {
      // Snake going down, body forms a U-shape, turning right into itself
      const snake: Position[] = [
        { x: 5, y: 6 },
        { x: 5, y: 5 },
        { x: 6, y: 5 },
        { x: 6, y: 6 },
        { x: 6, y: 7 },
      ];
      // Moving RIGHT from {5,6} goes to {6,6} which is part of the body
      const { dead } = moveSnake(snake, "RIGHT", "walls", food);
      expect(dead).toBe(true);
    });
  });
});
