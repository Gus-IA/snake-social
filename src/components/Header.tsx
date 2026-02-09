import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/AuthModal";
import { Button } from "@/components/ui/button";

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border">
      <h1 className="font-pixel text-lg text-primary neon-text tracking-wider">
        🐍 SNAKE
      </h1>
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-sm text-secondary cyan-text font-mono">
              {user.username}
            </span>
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
