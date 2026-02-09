// Centralized mock backend API service
// All backend calls go through here. Replace with real API calls when backend is ready.

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  score: number;
  mode: GameMode;
  date: string;
}

export interface ActivePlayer {
  id: string;
  username: string;
  score: number;
  mode: GameMode;
  startedAt: string;
}

export interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  score: number;
  gameOver: boolean;
}

export type GameMode = "pass-through" | "walls";
export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
export interface Position {
  x: number;
  y: number;
}

// Mock data
const MOCK_USERS: Record<string, { user: User; password: string }> = {
  "demo@snake.io": {
    user: { id: "1", username: "SnakeMaster", email: "demo@snake.io" },
    password: "demo123",
  },
};

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { id: "1", username: "PixelViper", score: 2450, mode: "walls", date: "2026-02-09" },
  { id: "2", username: "NeonByte", score: 1980, mode: "pass-through", date: "2026-02-08" },
  { id: "3", username: "GridRunner", score: 1750, mode: "walls", date: "2026-02-08" },
  { id: "4", username: "ByteSnake", score: 1620, mode: "pass-through", date: "2026-02-07" },
  { id: "5", username: "CyberCoil", score: 1400, mode: "walls", date: "2026-02-07" },
  { id: "6", username: "ArcadeKing", score: 1280, mode: "pass-through", date: "2026-02-06" },
  { id: "7", username: "RetroFang", score: 1150, mode: "walls", date: "2026-02-06" },
  { id: "8", username: "SnakeMaster", score: 1050, mode: "pass-through", date: "2026-02-05" },
  { id: "9", username: "GlitchWorm", score: 920, mode: "walls", date: "2026-02-05" },
  { id: "10", username: "VectorSlide", score: 800, mode: "pass-through", date: "2026-02-04" },
];

const MOCK_ACTIVE_PLAYERS: ActivePlayer[] = [
  { id: "p1", username: "PixelViper", score: 340, mode: "walls", startedAt: "2026-02-09T14:20:00Z" },
  { id: "p2", username: "NeonByte", score: 180, mode: "pass-through", startedAt: "2026-02-09T14:25:00Z" },
  { id: "p3", username: "GridRunner", score: 520, mode: "walls", startedAt: "2026-02-09T14:15:00Z" },
];

// Simulate network delay
const delay = (ms: number = 300) => new Promise((res) => setTimeout(res, ms));

let nextUserId = 100;

export const api = {
  // Auth
  async login(email: string, password: string): Promise<User> {
    await delay();
    const entry = MOCK_USERS[email];
    if (entry && entry.password === password) {
      return entry.user;
    }
    throw new Error("Invalid email or password");
  },

  async signup(email: string, password: string, username: string): Promise<User> {
    await delay();
    if (MOCK_USERS[email]) {
      throw new Error("Email already registered");
    }
    const user: User = { id: String(++nextUserId), username, email };
    MOCK_USERS[email] = { user, password };
    return user;
  },

  async logout(): Promise<void> {
    await delay(100);
  },

  // Leaderboard
  async getLeaderboard(mode?: GameMode): Promise<LeaderboardEntry[]> {
    await delay();
    if (mode) {
      return MOCK_LEADERBOARD.filter((e) => e.mode === mode);
    }
    return [...MOCK_LEADERBOARD];
  },

  async submitScore(score: number, mode: GameMode, username: string): Promise<LeaderboardEntry> {
    await delay();
    const entry: LeaderboardEntry = {
      id: String(Date.now()),
      username,
      score,
      mode,
      date: new Date().toISOString().split("T")[0],
    };
    MOCK_LEADERBOARD.push(entry);
    MOCK_LEADERBOARD.sort((a, b) => b.score - a.score);
    return entry;
  },

  // Watch mode
  async getActivePlayers(): Promise<ActivePlayer[]> {
    await delay();
    return MOCK_ACTIVE_PLAYERS.map((p) => ({
      ...p,
      score: p.score + Math.floor(Math.random() * 30),
    }));
  },

  async getPlayerGameState(playerId: string): Promise<GameState | null> {
    await delay(100);
    const player = MOCK_ACTIVE_PLAYERS.find((p) => p.id === playerId);
    if (!player) return null;
    // Return a dummy state — actual simulation happens in the watch component
    return {
      snake: [{ x: 10, y: 10 }],
      food: { x: 5, y: 5 },
      direction: "RIGHT",
      score: player.score,
      gameOver: false,
    };
  },
};
