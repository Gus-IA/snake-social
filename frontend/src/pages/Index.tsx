import React, { useState } from "react";
import Header from "@/components/Header";
import SnakeGame from "@/components/SnakeGame";
import Leaderboard from "@/components/Leaderboard";
import WatchMode from "@/components/WatchMode";

type Tab = "play" | "leaderboard" | "watch";

const Index: React.FC = () => {
  const [tab, setTab] = useState<Tab>("play");

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "play", label: "PLAY", icon: "🎮" },
    { id: "leaderboard", label: "RANKS", icon: "🏆" },
    { id: "watch", label: "WATCH", icon: "👁" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Tab navigation */}
      <nav className="flex justify-center gap-1 py-5 px-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`
              relative px-6 py-3 font-pixel text-xs sm:text-sm tracking-wider transition-all duration-200
              ${tab === t.id
                ? "text-primary neon-text border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground border-b-2 border-transparent"
              }
            `}
          >
            <span className="mr-2">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>

      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {/* Content */}
      <main className="flex-1 flex justify-center px-4 py-8">
        <div className="w-full max-w-5xl">
          {tab === "play" && <SnakeGame />}
          {tab === "leaderboard" && <Leaderboard />}
          {tab === "watch" && <WatchMode />}
        </div>
      </main>
    </div>
  );
};

export default Index;
