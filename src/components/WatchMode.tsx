import React, { useEffect, useState, useRef, useCallback } from "react";
import { api, type ActivePlayer, type Position, type Direction, type GameMode } from "@/services/api";
import GameBoard from "@/components/GameBoard";
import { GRID_SIZE, moveSnake } from "@/hooks/useSnakeGame";
import { Button } from "@/components/ui/button";

function randomPosition(exclude: Position[] = []): Position {
  let pos: Position;
  do {
    pos = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
  } while (exclude.some((p) => p.x === pos.x && p.y === pos.y));
  return pos;
}

function aiDirection(snake: Position[], food: Position, currentDir: Direction): Direction {
  const head = snake[0];
  const dirs: Direction[] = ["UP", "DOWN", "LEFT", "RIGHT"];
  const opposite: Record<Direction, Direction> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };

  // Prefer moving toward food
  const preferred: Direction[] = [];
  if (food.x > head.x) preferred.push("RIGHT");
  if (food.x < head.x) preferred.push("LEFT");
  if (food.y > head.y) preferred.push("DOWN");
  if (food.y < head.y) preferred.push("UP");

  const candidates = [...preferred, currentDir, ...dirs].filter((d) => d !== opposite[currentDir]);

  for (const d of candidates) {
    const next = { ...head };
    if (d === "UP") next.y--;
    if (d === "DOWN") next.y++;
    if (d === "LEFT") next.x--;
    if (d === "RIGHT") next.x++;
    next.x = ((next.x % GRID_SIZE) + GRID_SIZE) % GRID_SIZE;
    next.y = ((next.y % GRID_SIZE) + GRID_SIZE) % GRID_SIZE;
    if (!snake.some((p) => p.x === next.x && p.y === next.y)) {
      return d;
    }
  }
  return currentDir;
}

const WatchMode: React.FC = () => {
  const [players, setPlayers] = useState<ActivePlayer[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulated game state for the watched player
  const [simSnake, setSimSnake] = useState<Position[]>([{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }]);
  const [simFood, setSimFood] = useState<Position>({ x: 5, y: 5 });
  const [simScore, setSimScore] = useState(0);
  const [simDir, setSimDir] = useState<Direction>("RIGHT");

  const snakeRef = useRef(simSnake);
  const foodRef = useRef(simFood);
  const dirRef = useRef(simDir);
  snakeRef.current = simSnake;
  foodRef.current = simFood;
  dirRef.current = simDir;

  useEffect(() => {
    api.getActivePlayers().then((p) => {
      setPlayers(p);
      setLoading(false);
    });
  }, []);

  // Run AI simulation when watching
  useEffect(() => {
    if (!selectedId) return;

    // Reset sim
    const initSnake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    const initFood = randomPosition(initSnake);
    setSimSnake(initSnake);
    setSimFood(initFood);
    setSimScore(0);
    setSimDir("RIGHT");
    snakeRef.current = initSnake;
    foodRef.current = initFood;
    dirRef.current = "RIGHT";

    const id = setInterval(() => {
      const newDir = aiDirection(snakeRef.current, foodRef.current, dirRef.current);
      dirRef.current = newDir;
      setSimDir(newDir);

      const { newSnake, ate, dead } = moveSnake(snakeRef.current, newDir, "pass-through", foodRef.current);
      if (dead) {
        // Restart the AI
        const restart = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
        const newFood = randomPosition(restart);
        setSimSnake(restart);
        setSimFood(newFood);
        setSimScore(0);
        setSimDir("RIGHT");
        snakeRef.current = restart;
        foodRef.current = newFood;
        dirRef.current = "RIGHT";
        return;
      }
      setSimSnake(newSnake);
      snakeRef.current = newSnake;
      if (ate) {
        const newFood = randomPosition(newSnake);
        setSimFood(newFood);
        foodRef.current = newFood;
        setSimScore((s) => s + 10);
      }
    }, 150);

    return () => clearInterval(id);
  }, [selectedId]);

  if (loading) return <p className="text-muted-foreground text-sm text-center">Loading players...</p>;

  return (
    <div className="w-full max-w-md">
      <h2 className="font-pixel text-sm text-accent mb-4 text-center" style={{ textShadow: "var(--accent-glow)" }}>
        👁 WATCH LIVE
      </h2>

      {!selectedId ? (
        <div className="space-y-2" data-testid="player-list">
          {players.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className="w-full flex items-center justify-between p-3 rounded-md border border-border bg-muted hover:border-primary transition-colors"
            >
              <div className="text-left">
                <span className="text-sm font-medium">{p.username}</span>
                <span className="ml-2 text-xs text-muted-foreground">{p.mode === "walls" ? "🧱" : "🌀"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-primary font-mono">{p.score} pts</span>
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 w-full">
            <Button variant="outline" size="sm" onClick={() => setSelectedId(null)} className="font-pixel text-[9px]">
              ← BACK
            </Button>
            <span className="text-sm">
              Watching: <strong>{players.find((p) => p.id === selectedId)?.username}</strong>
            </span>
          </div>
          <div className="font-pixel text-xs text-primary neon-text">SCORE: {simScore}</div>
          <GameBoard snake={simSnake} food={simFood} />
          <p className="text-[10px] text-muted-foreground">Live AI simulation</p>
        </div>
      )}
    </div>
  );
};

export default WatchMode;
