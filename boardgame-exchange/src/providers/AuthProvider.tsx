// src/providers/AuthProvider.tsx
import { ReactNode, useState, useEffect, useContext } from 'react';
import { AuthContext, AuthContextData, User } from '../context/AuthContext';
import { authService } from '../services/api';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('jwt_token');
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          localStorage.removeItem('jwt_token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await authService.login({ login: email, password });
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const register = async (email: string, password: string) => {
    try {
      await authService.register({ email, password });
      await login(email, password);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const contextValue: AuthContextData = {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}