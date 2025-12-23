'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Use setTimeout to avoid the cascading setState warning
    // This schedules the state update for after the current render cycle
    const timer = setTimeout(() => {
      const auth = sessionStorage.getItem('isAuthenticated');
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const login = (password: string) => {
    // Simple password check - In production, use proper authentication
    if (password === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('isAuthenticated', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('isAuthenticated');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
