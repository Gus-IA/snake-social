import React, { useEffect, useState } from "react";
import { api, type LeaderboardEntry, type GameMode } from "@/services/api";

const Leaderboard: React.FC = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [filter, setFilter] = useState<GameMode | "all">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .getLeaderboard(filter === "all" ? undefined : filter)
      .then(setEntries)
      .finally(() => setLoading(false));
  }, [filter]);

  const filters = [
    { id: "all" as const, label: "All Modes", icon: "⚡" },
    { id: "walls" as const, label: "Walls", icon: "🧱" },
    { id: "pass-through" as const, label: "Pass-Through", icon: "🌀" },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-4xl mb-2">🏆</div>
        <h2 className="font-pixel text-lg sm:text-xl text-secondary cyan-text">
          LEADERBOARD
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Top players across all time</p>
      </div>

      {/* Filters */}
      <div className="flex justify-center gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`
              px-4 py-2 rounded-lg text-sm font-mono transition-all duration-200
              ${filter === f.id
                ? "bg-primary/10 border border-primary text-primary neon-border"
                : "border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
              }
            `}
          >
            <span className="mr-1.5">{f.icon}</span>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground text-sm py-12">Loading...</p>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden bg-card/30">
          <table className="w-full text-sm" data-testid="leaderboard-table">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left w-16">Rank</th>
                <th className="px-4 py-3 text-left">Player</th>
                <th className="px-4 py-3 text-right">Score</th>
                <th className="px-4 py-3 text-right">Mode</th>
                <th className="px-4 py-3 text-right hidden sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <tr
                  key={e.id}
                  className={`
                    border-t border-border/50 transition-colors hover:bg-muted/20
                    ${i < 3 ? "text-primary" : "text-foreground"}
                  `}
                >
                  <td className="px-4 py-3.5 font-pixel text-sm">
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                  </td>
                  <td className="px-4 py-3.5 font-mono font-medium">{e.username}</td>
                  <td className="px-4 py-3.5 text-right font-mono tabular-nums font-semibold">
                    {e.score.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border border-border bg-muted/30">
                      {e.mode === "walls" ? "🧱" : "🌀"} {e.mode}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right text-muted-foreground text-xs hidden sm:table-cell">
                    {e.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
