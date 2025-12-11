'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useGetMe } from '@/features/auth/hooks';
import Cookies from 'js-cookie';
import { IUser } from '@/types/user';

interface AuthContextType {
  user: IUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refetch: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, refetch } = useGetMe();

  const user = data?.data || null;
  const hasToken =
    typeof window !== 'undefined' ? !!Cookies.get('accessToken') : false;
  const isAuthenticated = !!user && hasToken;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
