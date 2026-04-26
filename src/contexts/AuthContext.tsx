import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Shape of the user object returned by your backend
interface AuthUser {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'salesperson';
  token: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (data: AuthUser) => void;   // accepts the full backend response object
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Rehydrate from localStorage so user stays logged in on refresh
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (data: AuthUser) => {
    setUser(data);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};