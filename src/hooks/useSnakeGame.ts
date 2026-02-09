import { useState, useCallback, useEffect, useRef } from "react";
import type { Position, Direction, GameMode } from "@/services/api";

export const GRID_SIZE = 20;
const TICK_MS = 120;

function randomPosition(exclude: Position[] = []): Position {
  let pos: Position;
  do {
    pos = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
  } while (exclude.some((p) => p.x === pos.x && p.y === pos.y));
  return pos;
}

const OPPOSITE: Record<Direction, Direction> = {
  UP: "DOWN",
  DOWN: "UP",
  LEFT: "RIGHT",
  RIGHT: "LEFT",
};

export function moveSnake(
  snake: Position[],
  direction: Direction,
  mode: GameMode,
  food: Position
): { newSnake: Position[]; ate: boolean; dead: boolean } {
  const head = snake[0];
  let newHead: Position;

  switch (direction) {
    case "UP":
      newHead = { x: head.x, y: head.y - 1 };
      break;
    case "DOWN":
      newHead = { x: head.x, y: head.y + 1 };
      break;
    case "LEFT":
      newHead = { x: head.x - 1, y: head.y };
      break;
    case "RIGHT":
      newHead = { x: head.x + 1, y: head.y };
      break;
  }

  // Wall collision
  if (mode === "walls") {
    if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
      return { newSnake: snake, ate: false, dead: true };
    }
  } else {
    // pass-through: wrap around
    newHead.x = ((newHead.x % GRID_SIZE) + GRID_SIZE) % GRID_SIZE;
    newHead.y = ((newHead.y % GRID_SIZE) + GRID_SIZE) % GRID_SIZE;
  }

  // Self collision (check against body, not tail if not eating)
  const ate = newHead.x === food.x && newHead.y === food.y;
  const body = ate ? snake : snake.slice(0, -1);
  if (body.some((p) => p.x === newHead.x && p.y === newHead.y)) {
    return { newSnake: snake, ate: false, dead: true };
  }

  const newSnake = [newHead, ...(ate ? snake : snake.slice(0, -1))];
  return { newSnake, ate, dead: false };
}

export function useSnakeGame(mode: GameMode = "walls") {
  const initialSnake: Position[] = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ];

  const [snake, setSnake] = useState<Position[]>(initialSnake);
  const [food, setFood] = useState<Position>(() => randomPosition(initialSnake));
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>(mode);

  const directionRef = useRef(direction);
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);
  directionRef.current = direction;
  snakeRef.current = snake;
  foodRef.current = food;

  const changeDirection = useCallback((newDir: Direction) => {
    setDirection((prev) => {
      if (OPPOSITE[newDir] === prev) return prev;
      return newDir;
    });
  }, []);

  const tick = useCallback(() => {
    const { newSnake, ate, dead } = moveSnake(
      snakeRef.current,
      directionRef.current,
      gameMode,
      foodRef.current
    );
    if (dead) {
      setGameOver(true);
      setIsPlaying(false);
      return;
    }
    setSnake(newSnake);
    if (ate) {
      setScore((s) => s + 10);
      setFood(randomPosition(newSnake));
    }
  }, [gameMode]);

  // Game loop
  useEffect(() => {
    if (!isPlaying || gameOver) return;
    const id = setInterval(tick, TICK_MS);
    return () => clearInterval(id);
  }, [isPlaying, gameOver, tick]);

  // Keyboard controls
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const keyMap: Record<string, Direction> = {
        ArrowUp: "UP",
        ArrowDown: "DOWN",
        ArrowLeft: "LEFT",
        ArrowRight: "RIGHT",
        w: "UP",
        s: "DOWN",
        a: "LEFT",
        d: "RIGHT",
      };
      const dir = keyMap[e.key];
      if (dir) {
        e.preventDefault();
        changeDirection(dir);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [changeDirection]);

  const start = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const reset = useCallback(() => {
    setSnake(initialSnake);
    setFood(randomPosition(initialSnake));
    setDirection("RIGHT");
    setScore(0);
    setGameOver(false);
    setIsPlaying(false);
  }, []);

  const switchMode = useCallback((m: GameMode) => {
    setGameMode(m);
    setSnake(initialSnake);
    setFood(randomPosition(initialSnake));
    setDirection("RIGHT");
    setScore(0);
    setGameOver(false);
    setIsPlaying(false);
  }, []);

  return {
    snake,
    food,
    direction,
    score,
    gameOver,
    isPlaying,
    gameMode,
    start,
    reset,
    changeDirection,
    switchMode,
  };
}
