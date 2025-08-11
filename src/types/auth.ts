import { IUser } from '@/api/users/types';

export interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
}

export interface AuthContextType extends AuthState {
  login: (token: string, user: IUser) => void;
  logout: () => void;
  updateUser: (user: IUser) => void;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: IUser;
  accessToken: string;
}
