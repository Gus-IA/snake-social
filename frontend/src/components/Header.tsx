import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/AuthModal";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-border/50 bg-card/30 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="text-3xl">🐍</div>
        <div>
          <h1 className="font-pixel text-xl sm:text-2xl text-primary neon-text tracking-wider">
            SNAKE
          </h1>
          <p className="text-[10px] text-muted-foreground tracking-widest uppercase">
            Arcade Edition
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-secondary/30 bg-secondary/10">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-secondary cyan-text font-mono">
                {user.username}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={logout} className="font-pixel text-[10px]">
              LOG OUT
            </Button>
          </>
        ) : (
          <AuthModal />
        )}
      </div>
    </header>
  );
};

export default Header;
