'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType, AuthState } from '@/types/auth';
import { storage } from '@/utils/storage';
import { IUser } from '@/api/users/types';

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    accessToken: null,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      const token = storage.getAccessToken();
      const user = storage.getUser<IUser>();

      if (token && user) {
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          accessToken: token,
        });
      } else {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          accessToken: null,
        });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = (token: string, user: IUser) => {
    storage.setAccessToken(token);
    storage.setUser(user);
    setState({
      user,
      isAuthenticated: true,
      isLoading: false,
      accessToken: token,
    });
  };

  // Logout function
  const logout = () => {
    storage.removeAccessToken();
    storage.removeUser();
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
    });
  };

  // Update user function
  const updateUser = (user: IUser) => {
    storage.setUser(user);
    setState((prev) => ({
      ...prev,
      user,
    }));
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
