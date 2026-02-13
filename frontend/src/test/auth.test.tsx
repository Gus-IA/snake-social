import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import React, { useEffect } from "react";

// Mock API
const mockUser = { id: "1", username: "SnakeMaster", email: "demo@snake.io" };

vi.mock("@/services/api", () => ({
  api: {
    login: vi.fn(async (email, password) => {
      if (email === "demo@snake.io" && password === "demo123") {
        return mockUser;
      }
      throw new Error("Invalid email or password");
    }),
    signup: vi.fn(async (email, password, username) => {
       if (email === "demo@snake.io") throw new Error("Email already registered");
       return { id: "2", username, email };
    }),
    logout: vi.fn(async () => {}),
  },
}));

// Helper component to test auth context
const TestConsumer: React.FC<{ action?: string }> = ({ action }) => {
  const { user, error, isLoading, login, signup, logout } = useAuth();

  useEffect(() => {
    if (action === "login") login("demo@snake.io", "demo123");
    if (action === "login-fail") login("demo@snake.io", "wrong").catch(() => {});
    if (action === "signup") signup(`new${Date.now()}@test.com`, "pass", "NewUser").catch(() => {});
  }, [action]);

  return (
    <div>
      <span data-testid="user">{user ? user.username : "none"}</span>
      <span data-testid="loading">{String(isLoading)}</span>
      <span data-testid="error">{error || "none"}</span>
      <button data-testid="logout" onClick={logout}>Logout</button>
    </div>
  );
};

describe("AuthContext", () => {
  it("starts with no user", () => {
    render(
      <AuthProvider><TestConsumer /></AuthProvider>
    );
    expect(screen.getByTestId("user").textContent).toBe("none");
  });

  it("logs in successfully", async () => {
    render(
      <AuthProvider><TestConsumer action="login" /></AuthProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toBe("SnakeMaster");
    });
  });

  it("shows error on failed login", async () => {
    render(
      <AuthProvider><TestConsumer action="login-fail" /></AuthProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId("error").textContent).toBe("Invalid email or password");
    });
  });

  it("logs out", async () => {
    render(
      <AuthProvider><TestConsumer action="login" /></AuthProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toBe("SnakeMaster");
    });
    fireEvent.click(screen.getByTestId("logout"));
    expect(screen.getByTestId("user").textContent).toBe("none");
  });

  it("throws when used outside provider", () => {
    expect(() => render(<TestConsumer />)).toThrow("useAuth must be used within AuthProvider");
  });
});
