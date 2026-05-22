import { createContext, useContext, useState, ReactNode } from 'react';

type AuthState = {
  loggedIn: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <AuthContext.Provider
      value={{ loggedIn, login: () => setLoggedIn(true), logout: () => setLoggedIn(false) }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
