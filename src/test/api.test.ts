import { describe, it, expect, vi, beforeEach } from "vitest";
import { api } from "@/services/api";

describe("API Service", () => {
  describe("login", () => {
    it("succeeds with valid credentials", async () => {
      const user = await api.login("demo@snake.io", "demo123");
      expect(user.username).toBe("SnakeMaster");
      expect(user.email).toBe("demo@snake.io");
    });

    it("fails with invalid credentials", async () => {
      await expect(api.login("demo@snake.io", "wrong")).rejects.toThrow("Invalid email or password");
    });

    it("fails with unknown email", async () => {
      await expect(api.login("unknown@x.com", "123")).rejects.toThrow("Invalid email or password");
    });
  });

  describe("signup", () => {
    it("creates a new user", async () => {
      const email = `test${Date.now()}@snake.io`;
      const user = await api.signup(email, "pass123", "TestPlayer");
      expect(user.username).toBe("TestPlayer");
      expect(user.email).toBe(email);
    });

    it("fails with existing email", async () => {
      await expect(api.signup("demo@snake.io", "pass", "X")).rejects.toThrow("Email already registered");
    });
  });

  describe("leaderboard", () => {
    it("returns all entries", async () => {
      const entries = await api.getLeaderboard();
      expect(entries.length).toBeGreaterThan(0);
    });

    it("filters by mode", async () => {
      const entries = await api.getLeaderboard("walls");
      expect(entries.every((e) => e.mode === "walls")).toBe(true);
    });

    it("submits a score", async () => {
      const entry = await api.submitScore(999, "walls", "TestUser");
      expect(entry.score).toBe(999);
      expect(entry.mode).toBe("walls");
    });
  });

  describe("watch mode", () => {
    it("returns active players", async () => {
      const players = await api.getActivePlayers();
      expect(players.length).toBeGreaterThan(0);
      expect(players[0]).toHaveProperty("username");
      expect(players[0]).toHaveProperty("score");
    });

    it("returns game state for valid player", async () => {
      const state = await api.getPlayerGameState("p1");
      expect(state).not.toBeNull();
      expect(state!.snake).toBeDefined();
      expect(state!.food).toBeDefined();
    });

    it("returns null for invalid player", async () => {
      const state = await api.getPlayerGameState("nonexistent");
      expect(state).toBeNull();
    });
  });

  describe("logout", () => {
    it("resolves without error", async () => {
      await expect(api.logout()).resolves.toBeUndefined();
    });
  });
});
