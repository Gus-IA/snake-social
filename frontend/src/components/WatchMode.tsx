import React, { useEffect, useState, useRef } from "react";
import { api, type ActivePlayer, type Position, type Direction } from "@/services/api";
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
    if (!snake.some((p) => p.x === next.x && p.y === next.y)) return d;
  }
  return currentDir;
}

const WatchMode: React.FC = () => {
  const [players, setPlayers] = useState<ActivePlayer[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
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
    api.getActivePlayers().then((p) => { setPlayers(p); setLoading(false); });
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    const initSnake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    const initFood = randomPosition(initSnake);
    setSimSnake(initSnake); setSimFood(initFood); setSimScore(0); setSimDir("RIGHT");
    snakeRef.current = initSnake; foodRef.current = initFood; dirRef.current = "RIGHT";

    const id = setInterval(() => {
      const newDir = aiDirection(snakeRef.current, foodRef.current, dirRef.current);
      dirRef.current = newDir; setSimDir(newDir);
      const { newSnake, ate, dead } = moveSnake(snakeRef.current, newDir, "pass-through", foodRef.current);
      if (dead) {
        const restart = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
        const nf = randomPosition(restart);
        setSimSnake(restart); setSimFood(nf); setSimScore(0); setSimDir("RIGHT");
        snakeRef.current = restart; foodRef.current = nf; dirRef.current = "RIGHT";
        return;
      }
      setSimSnake(newSnake); snakeRef.current = newSnake;
      if (ate) {
        const nf = randomPosition(newSnake);
        setSimFood(nf); foodRef.current = nf; setSimScore((s) => s + 10);
      }
    }, 150);
    return () => clearInterval(id);
  }, [selectedId]);

  if (loading) return <p className="text-muted-foreground text-sm text-center py-12">Loading players...</p>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-4xl mb-2">👁</div>
        <h2 className="font-pixel text-lg sm:text-xl text-accent" style={{ textShadow: "var(--accent-glow)" }}>
          WATCH LIVE
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Spectate active players in real-time</p>
      </div>

      {!selectedId ? (
        <div className="grid gap-3 max-w-md mx-auto" data-testid="player-list">
          {players.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-border bg-card/30 hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
            >
              <div className="text-left">
                <span className="text-base font-mono font-medium group-hover:text-primary transition-colors">{p.username}</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border border-border bg-muted/30">
                    {p.mode === "walls" ? "🧱 walls" : "🌀 pass-through"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-sm text-primary font-mono font-semibold">{p.score}</span>
                  <p className="text-[10px] text-muted-foreground">points</p>
                </div>
                <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-4 w-full max-w-md">
            <Button variant="outline" size="sm" onClick={() => setSelectedId(null)} className="font-pixel text-[10px]">
              ← BACK
            </Button>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-mono">
                Watching <strong className="text-primary">{players.find((p) => p.id === selectedId)?.username}</strong>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="p-3 rounded-lg border border-border bg-card/50 text-center">
              <span className="text-[10px] font-pixel text-muted-foreground">SCORE</span>
              <div className="font-pixel text-xl text-primary neon-text">{String(simScore).padStart(4, "0")}</div>
            </div>
            <div className="p-3 rounded-lg border border-border bg-card/50 text-center">
              <span className="text-[10px] font-pixel text-muted-foreground">LENGTH</span>
              <div className="font-pixel text-xl text-secondary cyan-text">{simSnake.length}</div>
            </div>
          </div>
          <GameBoard snake={simSnake} food={simFood} cellSize="lg" />
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Live AI simulation
          </p>
        </div>
      )}
    </div>
  );
};

export default WatchMode;
