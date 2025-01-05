import { createContext } from 'react';
import { UserDTO } from '../types/user';

export type User = UserDTO;

export interface AuthContextData {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextData | undefined>(undefined);