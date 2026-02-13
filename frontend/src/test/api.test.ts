import { describe, it, expect, vi, beforeEach } from "vitest";
import { api } from "@/services/api";
import { AuthService } from "@/client/services/AuthService";
import { LeaderboardService } from "@/client/services/LeaderboardService";
import { GameService } from "@/client/services/GameService";
import { ApiError } from "@/client/core/ApiError";
import { GameMode } from "@/client/models/GameMode";
import { GameState } from "@/client/models/GameState";

// Mock the generated services
vi.mock("@/client/services/AuthService");
vi.mock("@/client/services/LeaderboardService");
vi.mock("@/client/services/GameService");

describe("API Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("login", () => {
    it("succeeds with valid credentials", async () => {
      const mockUser = { id: "1", username: "SnakeMaster", email: "demo@snake.io" };
      vi.mocked(AuthService.postAuthLogin).mockResolvedValue(mockUser);

      const user = await api.login("demo@snake.io", "demo123");
      expect(user.username).toBe("SnakeMaster");
      expect(user.email).toBe("demo@snake.io");
      expect(AuthService.postAuthLogin).toHaveBeenCalledWith({ email: "demo@snake.io", password: "demo123" });
    });

    it("fails with invalid credentials", async () => {
      const request = { method: 'POST', url: '/auth/login' };
      const response = {
          url: '/auth/login',
          ok: false,
          status: 401,
          statusText: 'Unauthorized',
          body: { message: 'Invalid credentials' }
      };
      const error = new ApiError(request as any, response as any, "Invalid credentials");
      vi.mocked(AuthService.postAuthLogin).mockRejectedValue(error);

      await expect(api.login("demo@snake.io", "wrong")).rejects.toThrow("Invalid credentials");
    });
  });

  describe("signup", () => {
    it("creates a new user", async () => {
      const mockUser = { id: "2", username: "TestPlayer", email: "test@snake.io" };
      vi.mocked(AuthService.postAuthSignup).mockResolvedValue(mockUser);

      const user = await api.signup("test@snake.io", "pass123", "TestPlayer");
      expect(user.username).toBe("TestPlayer");
      expect(AuthService.postAuthSignup).toHaveBeenCalledWith({ email: "test@snake.io", password: "pass123", username: "TestPlayer" });
    });

    it("fails with existing email", async () => {
      const request = { method: 'POST', url: '/auth/signup' };
      const response = {
          url: '/auth/signup',
          ok: false,
          status: 400,
          statusText: 'Bad Request',
          body: { message: 'Email already registered' }
      };
      const error = new ApiError(request as any, response as any, "Email already registered");
      vi.mocked(AuthService.postAuthSignup).mockRejectedValue(error);

      await expect(api.signup("demo@snake.io", "pass", "X")).rejects.toThrow("Email already registered");
    });
  });

  describe("leaderboard", () => {
    it("returns all entries", async () => {
      const mockEntries = [{ id: "1", username: "P1", score: 100, mode: GameMode.WALLS, date: "2024-01-01" }];
      vi.mocked(LeaderboardService.getLeaderboard).mockResolvedValue(mockEntries);

      const entries = await api.getLeaderboard();
      expect(entries).toEqual(mockEntries);
    });

    it("filters by mode", async () => {
      const mockEntries = [{ id: "1", username: "P1", score: 100, mode: GameMode.WALLS, date: "2024-01-01" }];
      vi.mocked(LeaderboardService.getLeaderboard).mockResolvedValue(mockEntries);

      await api.getLeaderboard(GameMode.WALLS);
      expect(LeaderboardService.getLeaderboard).toHaveBeenCalledWith(GameMode.WALLS);
    });

    it("submits a score", async () => {
      const mockEntry = { id: "2", username: "TestUser", score: 999, mode: GameMode.WALLS, date: "2024-01-01" };
      vi.mocked(LeaderboardService.postLeaderboard).mockResolvedValue(mockEntry);

      const entry = await api.submitScore(999, GameMode.WALLS, "TestUser");
      expect(entry).toEqual(mockEntry);
      expect(LeaderboardService.postLeaderboard).toHaveBeenCalledWith({ score: 999, mode: GameMode.WALLS, username: "TestUser" });
    });
  });

  describe("watch mode", () => {
    it("returns active players", async () => {
      const mockPlayers = [{ id: "p1", username: "P1", score: 50, mode: GameMode.WALLS, startedAt: "now" }];
      vi.mocked(GameService.getGamesActive).mockResolvedValue(mockPlayers);

      const players = await api.getActivePlayers();
      expect(players).toEqual(mockPlayers);
    });

    it("returns game state for valid player", async () => {
      const mockState = {
          snake: [{ x: 0, y: 0 }],
          food: { x: 1, y: 1 },
          direction: GameState.direction.UP,
          score: 10,
          gameOver: false
      };
      vi.mocked(GameService.getGames).mockResolvedValue(mockState);

      const state = await api.getPlayerGameState("p1");
      expect(state).toEqual(mockState);
    });

    it("returns null for invalid player", async () => {
       const request = { method: 'GET', url: '/games/nonexistent' };
       const response = {
          url: '/games/nonexistent',
          ok: false,
          status: 404,
          statusText: 'Not Found',
          body: { message: 'Player or game not found' }
       };
       const error = new ApiError(request as any, response as any, "Player or game not found");
      vi.mocked(GameService.getGames).mockRejectedValue(error);

      const state = await api.getPlayerGameState("nonexistent");
      expect(state).toBeNull();
    });
  });

  describe("logout", () => {
    it("resolves without error", async () => {
      vi.mocked(AuthService.postAuthLogout).mockResolvedValue(undefined);
      await expect(api.logout()).resolves.toBeUndefined();
    });
  });
});
