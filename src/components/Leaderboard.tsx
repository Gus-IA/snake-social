import React, { useEffect, useState } from "react";
import { api, type LeaderboardEntry, type GameMode } from "@/services/api";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="w-full max-w-md">
      <h2 className="font-pixel text-sm text-secondary cyan-text mb-4 text-center">
        🏆 LEADERBOARD
      </h2>

      <div className="flex justify-center gap-2 mb-4">
        {(["all", "walls", "pass-through"] as const).map((m) => (
          <Button
            key={m}
            variant={filter === m ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(m)}
            className="font-pixel text-[9px]"
          >
            {m === "all" ? "ALL" : m === "walls" ? "🧱" : "🌀"} {m.toUpperCase()}
          </Button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground text-sm">Loading...</p>
      ) : (
        <div className="border border-border rounded-md overflow-hidden">
          <table className="w-full text-xs" data-testid="leaderboard-table">
            <thead>
              <tr className="bg-muted text-muted-foreground">
                <th className="p-2 text-left">#</th>
                <th className="p-2 text-left">Player</th>
                <th className="p-2 text-right">Score</th>
                <th className="p-2 text-right">Mode</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => (
                <tr
                  key={e.id}
                  className={`border-t border-border ${i < 3 ? "text-primary" : "text-foreground"}`}
                >
                  <td className="p-2 font-pixel text-[10px]">
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                  </td>
                  <td className="p-2">{e.username}</td>
                  <td className="p-2 text-right font-mono">{e.score}</td>
                  <td className="p-2 text-right">{e.mode === "walls" ? "🧱" : "🌀"}</td>
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
