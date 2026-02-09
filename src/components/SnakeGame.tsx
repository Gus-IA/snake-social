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
    <div className="flex flex-col items-center gap-4">
      {/* Mode selector */}
      <div className="flex gap-2">
        {(["walls", "pass-through"] as GameMode[]).map((m) => (
          <Button
            key={m}
            variant={gameMode === m ? "default" : "outline"}
            size="sm"
            onClick={() => switchMode(m)}
            className="font-pixel text-[10px]"
          >
            {m === "walls" ? "🧱 Walls" : "🌀 Pass-Through"}
          </Button>
        ))}
      </div>

      {/* Score */}
      <div className="font-pixel text-sm text-primary neon-text">
        SCORE: {score}
      </div>

      {/* Board */}
      <div className="relative">
        <GameBoard snake={snake} food={food} />

        {/* Overlays */}
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 rounded-md">
            <h3 className="font-pixel text-xs text-primary neon-text mb-4">
              {gameMode === "walls" ? "🧱 WALLS MODE" : "🌀 PASS-THROUGH"}
            </h3>
            <Button onClick={start} className="font-pixel text-xs">
              ▶ START
            </Button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 rounded-md">
            <h3 className="font-pixel text-sm text-destructive mb-2">GAME OVER</h3>
            <p className="font-pixel text-xs text-primary neon-text mb-4">Score: {score}</p>
            <Button onClick={reset} className="font-pixel text-xs">
              ↻ RETRY
            </Button>
          </div>
        )}
      </div>

      {/* Controls hint */}
      <p className="text-xs text-muted-foreground">
        Arrow keys or WASD to move
      </p>
    </div>
  );
};

export default SnakeGame;
