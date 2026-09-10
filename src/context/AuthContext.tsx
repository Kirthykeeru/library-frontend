import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import * as authApi from "../api/auth";
import { getMyMemberProfile } from "../api/members";
import type { Member, RegisterPayload, User } from "../api/types";

interface AuthContextValue {
  user: User | null;
  memberProfile: Member | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [memberProfile, setMemberProfile] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadCurrentUser() {
    try {
      const me = await authApi.getMe();
      setUser(me);
      // Only students have a linked member profile; staff simply won't
      // have one, which getMyMemberProfile represents as null.
      const profile = await getMyMemberProfile();
      setMemberProfile(profile);
    } catch {
      localStorage.removeItem("token");
      setUser(null);
      setMemberProfile(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (localStorage.getItem("token")) {
      loadCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  async function login(username: string, password: string) {
    const token = await authApi.login(username, password);
    localStorage.setItem("token", token);
    await loadCurrentUser();
  }

  async function register(payload: RegisterPayload) {
    await authApi.register(payload);
    await login(payload.username, payload.password);
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
    setMemberProfile(null);
  }

  return (
    <AuthContext.Provider value={{ user, memberProfile, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
