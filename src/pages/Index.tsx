import React, { useState } from "react";
import Header from "@/components/Header";
import SnakeGame from "@/components/SnakeGame";
import Leaderboard from "@/components/Leaderboard";
import WatchMode from "@/components/WatchMode";
import { Button } from "@/components/ui/button";

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
      <nav className="flex justify-center gap-2 py-4">
        {tabs.map((t) => (
          <Button
            key={t.id}
            variant={tab === t.id ? "default" : "outline"}
            size="sm"
            onClick={() => setTab(t.id)}
            className="font-pixel text-[10px]"
          >
            {t.icon} {t.label}
          </Button>
        ))}
      </nav>

      {/* Content */}
      <main className="flex-1 flex justify-center px-4 pb-8">
        {tab === "play" && <SnakeGame />}
        {tab === "leaderboard" && <Leaderboard />}
        {tab === "watch" && <WatchMode />}
      </main>
    </div>
  );
};

export default Index;
