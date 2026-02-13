import { OpenAPI } from "@/client/core/OpenAPI";
import type { User } from "@/client/models/User";
import type { LeaderboardEntry } from "@/client/models/LeaderboardEntry";
import type { ActivePlayer } from "@/client/models/ActivePlayer";
import type { GameState } from "@/client/models/GameState";
import { GameMode } from "@/client/models/GameMode";
import type { Position } from "@/client/models/Position";
import { AuthService } from "@/client/services/AuthService";
import { LeaderboardService } from "@/client/services/LeaderboardService";
import { GameService } from "@/client/services/GameService";

// Configure base URL (Vite proxy handles /api -> localhost:3000)
OpenAPI.BASE = "/api";

export type { User, LeaderboardEntry, ActivePlayer, GameState, Position };
export { GameMode };
export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT"; 

export const api = {
  // Auth
  async login(email: string, password: string): Promise<User> {
    return AuthService.postAuthLogin({ email, password });
  },

  async signup(email: string, password: string, username: string): Promise<User> {
    return AuthService.postAuthSignup({ email, password, username });
  },

  async logout(): Promise<void> {
    return AuthService.postAuthLogout();
  },

  // Leaderboard
  async getLeaderboard(mode?: GameMode): Promise<LeaderboardEntry[]> {
    return LeaderboardService.getLeaderboard(mode);
  },

  async submitScore(score: number, mode: GameMode, username: string): Promise<LeaderboardEntry> {
    return LeaderboardService.postLeaderboard({ score, mode, username });
  },

  // Watch mode
  async getActivePlayers(): Promise<ActivePlayer[]> {
    return GameService.getGamesActive();
  },

  async getPlayerGameState(playerId: string): Promise<GameState | null> {
      try {
        return await GameService.getGames(playerId);
      } catch (error: any) {
          if (error.status === 404) return null;
          throw error;
      }
  },
};
