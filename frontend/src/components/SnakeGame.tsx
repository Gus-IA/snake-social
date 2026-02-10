import React from "react";
import { useSnakeGame } from "@/hooks/useSnakeGame";
import GameBoard from "@/components/GameBoard";
import { useAuth } from "@/contexts/AuthContext";
import { api, type GameMode } from "@/services/api";
import { Button } from "@/components/ui/button";

const SnakeGame: React.FC = () => {
  const { snake, food, score, gameOver, isPlaying, gameMode, start, reset, switchMode } =
    useSnakeGame("walls");
  const { user } = useAuth();

  const handleGameOver = async () => {
    if (user && score > 0) {
      try {
        await api.submitScore(score, gameMode, user.username);
      } catch {
        // silent fail for mock
      }
    }
  };

  React.useEffect(() => {
    if (gameOver) handleGameOver();
  }, [gameOver]);

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 justify-center">
      {/* Left panel — stats & controls */}
      <div className="flex flex-col items-center lg:items-end gap-6 lg:w-48">
        {/* Mode selector */}
        <div className="flex flex-col gap-2 w-full">
          <span className="font-pixel text-[10px] text-muted-foreground text-center lg:text-right uppercase tracking-widest">
            Game Mode
          </span>
          {(["walls", "pass-through"] as GameMode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`
                w-full px-4 py-3 rounded-lg border text-left transition-all duration-200 font-mono text-sm
                ${gameMode === m
                  ? "border-primary bg-primary/10 text-primary neon-border"
                  : "border-border bg-muted/30 text-muted-foreground hover:border-foreground/30"
                }
              `}
            >
              <span className="mr-2">{m === "walls" ? "🧱" : "🌀"}</span>
              {m === "walls" ? "Walls" : "Pass-Through"}
              <p className="text-[10px] mt-1 opacity-60">
                {m === "walls" ? "Hit wall = game over" : "Wrap around edges"}
              </p>
            </button>
          ))}
        </div>

        {/* Score display */}
        <div className="w-full p-4 rounded-lg border border-border bg-card/50 text-center lg:text-right">
          <span className="text-[10px] font-pixel text-muted-foreground tracking-widest">SCORE</span>
          <div className="font-pixel text-3xl text-primary neon-text mt-1">
            {String(score).padStart(4, "0")}
          </div>
        </div>

        {/* Controls hint */}
        <div className="hidden lg:block w-full p-3 rounded-lg border border-border/50 bg-muted/20">
          <p className="text-[10px] text-muted-foreground text-center mb-2 tracking-widest font-pixel">CONTROLS</p>
          <div className="grid grid-cols-3 gap-1 max-w-[6rem] mx-auto">
            <div />
            <div className="bg-muted/50 rounded text-center text-xs text-muted-foreground py-1 border border-border/50">W</div>
            <div />
            <div className="bg-muted/50 rounded text-center text-xs text-muted-foreground py-1 border border-border/50">A</div>
            <div className="bg-muted/50 rounded text-center text-xs text-muted-foreground py-1 border border-border/50">S</div>
            <div className="bg-muted/50 rounded text-center text-xs text-muted-foreground py-1 border border-border/50">D</div>
          </div>
        </div>
      </div>

      {/* Game board */}
      <div className="relative">
        <GameBoard snake={snake} food={food} cellSize="lg" />

        {/* Overlays */}
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/85 rounded-lg backdrop-blur-sm">
            <div className="text-5xl mb-4">{gameMode === "walls" ? "🧱" : "🌀"}</div>
            <h3 className="font-pixel text-sm text-primary neon-text mb-2">
              {gameMode === "walls" ? "WALLS MODE" : "PASS-THROUGH"}
            </h3>
            <p className="text-xs text-muted-foreground mb-6 max-w-[200px] text-center">
              {gameMode === "walls"
                ? "Don't hit the walls or yourself!"
                : "Edges wrap around. Avoid yourself!"}
            </p>
            <Button onClick={start} size="lg" className="font-pixel text-sm px-8 py-3">
              ▶ START
            </Button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/85 rounded-lg backdrop-blur-sm">
            <div className="text-5xl mb-3">💀</div>
            <h3 className="font-pixel text-lg text-destructive mb-1">GAME OVER</h3>
            <p className="font-pixel text-2xl text-primary neon-text mb-6">{score}</p>
            {user && <p className="text-xs text-muted-foreground mb-2">Score submitted!</p>}
            <Button onClick={reset} size="lg" className="font-pixel text-sm px-8 py-3">
              ↻ RETRY
            </Button>
          </div>
        )}
      </div>

      {/* Right panel — info */}
      <div className="hidden lg:flex flex-col gap-6 lg:w-48">
        <div className="p-4 rounded-lg border border-border bg-card/50">
          <span className="text-[10px] font-pixel text-muted-foreground tracking-widest">STATUS</span>
          <div className="flex items-center gap-2 mt-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isPlaying ? "bg-primary animate-pulse" : gameOver ? "bg-destructive" : "bg-muted-foreground"}`} />
            <span className="text-sm font-mono">
              {isPlaying ? "Playing" : gameOver ? "Game Over" : "Ready"}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-border bg-card/50">
          <span className="text-[10px] font-pixel text-muted-foreground tracking-widest">LENGTH</span>
          <div className="font-pixel text-2xl text-secondary cyan-text mt-1">
            {snake.length}
          </div>
        </div>

        {user && (
          <div className="p-4 rounded-lg border border-border bg-card/50">
            <span className="text-[10px] font-pixel text-muted-foreground tracking-widest">PLAYER</span>
            <div className="text-sm text-secondary cyan-text mt-1 font-mono truncate">
              {user.username}
            </div>
          </div>
        )}

        <p className="text-[10px] text-muted-foreground text-center lg:hidden">
          Arrow keys or WASD to move
        </p>
      </div>
    </div>
  );
};

export default SnakeGame;
