import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { backend } from 'declarations/backend';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);

  useEffect(() => {
    AuthClient.create().then(async (client) => {
      setAuthClient(client);
      const isAuthenticated = await client.isAuthenticated();
      setIsAuthenticated(isAuthenticated);
      if (isAuthenticated) {
        await ensureUserCreated();
      }
    });
  }, []);

  const ensureUserCreated = async () => {
    try {
      await backend.createUser("DefaultUser");
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const login = () => {
    authClient?.login({
      identityProvider: process.env.II_URL,
      onSuccess: async () => {
        setIsAuthenticated(true);
        await ensureUserCreated();
      },
    });
  };

  const logout = () => {
    authClient?.logout();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
