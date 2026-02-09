import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AuthModal: React.FC = () => {
  const { login, signup, isLoading, error, clearError } = useAuth();
  const [open, setOpen] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignup) {
        await signup(email, password, username);
      } else {
        await login(email, password);
      }
      setOpen(false);
      resetForm();
    } catch {
      // error is set in context
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setUsername("");
    clearError();
  };

  const toggle = () => {
    setIsSignup(!isSignup);
    clearError();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="font-pixel text-[10px]">
          LOG IN
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border neon-border max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-pixel text-sm text-primary neon-text">
            {isSignup ? "SIGN UP" : "LOG IN"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isSignup && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Username</Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="SnakeMaster"
                required
                className="bg-muted border-border"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="demo@snake.io"
              required
              className="bg-muted border-border"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              required
              className="bg-muted border-border"
            />
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <Button type="submit" disabled={isLoading} className="font-pixel text-xs">
            {isLoading ? "..." : isSignup ? "CREATE ACCOUNT" : "ENTER"}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            {isSignup ? "Already have an account?" : "No account?"}{" "}
            <button type="button" onClick={toggle} className="text-secondary underline">
              {isSignup ? "Log in" : "Sign up"}
            </button>
          </p>
          {!isSignup && (
            <p className="text-[10px] text-center text-muted-foreground">
              Demo: demo@snake.io / demo123
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
