'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { getCurrentUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Initialize auth state when app loads
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token && !isAuthenticated) {
        getCurrentUser();
      }
    }
  }, [getCurrentUser, isAuthenticated]);

  return <>{children}</>;
}