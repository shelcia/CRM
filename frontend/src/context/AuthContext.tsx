import { createContext, useContext, useState } from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  type: string;
  token: string;
  companyId: string;
  company: string;
  permissions: string[];
}

const KEYS = {
  id: "CRM-id",
  name: "CRM-name",
  email: "CRM-email",
  type: "CRM-type",
  token: "CRM-token",
  companyId: "CRM-companyId",
  company: "CRM-company",
  permissions: "CRM-permissions",
} as const;

function readAuth(): AuthUser | null {
  const token = localStorage.getItem(KEYS.token);
  if (!token) return null;
  return {
    id: localStorage.getItem(KEYS.id) ?? "",
    name: localStorage.getItem(KEYS.name) ?? "",
    email: localStorage.getItem(KEYS.email) ?? "",
    type: localStorage.getItem(KEYS.type) ?? "",
    token,
    companyId: localStorage.getItem(KEYS.companyId) ?? "",
    company: localStorage.getItem(KEYS.company) ?? "",
    permissions: JSON.parse(localStorage.getItem(KEYS.permissions) ?? "[]"),
  };
}

function writeAuth(user: AuthUser): void {
  localStorage.setItem(KEYS.id, user.id);
  localStorage.setItem(KEYS.name, user.name);
  localStorage.setItem(KEYS.email, user.email);
  localStorage.setItem(KEYS.type, user.type);
  localStorage.setItem(KEYS.token, user.token);
  localStorage.setItem(KEYS.companyId, user.companyId);
  localStorage.setItem(KEYS.company, user.company);
  localStorage.setItem(KEYS.permissions, JSON.stringify(user.permissions));
}

interface AuthContextValue {
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
  patchUser: (partial: Partial<AuthUser>) => void;
  clearUser: () => void;
}

const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<AuthUser | null>(readAuth);

  const setUser = (u: AuthUser) => {
    writeAuth(u);
    setUserState(u);
  };

  const patchUser = (partial: Partial<AuthUser>) => {
    setUserState((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...partial };
      writeAuth(next);
      return next;
    });
  };

  const clearUser = () => {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
    setUserState(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, patchUser, clearUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
