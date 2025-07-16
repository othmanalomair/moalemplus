import { create } from 'zustand';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '@/types/auth';
import { authApi } from '@/lib/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  getCurrentUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials: LoginRequest) => {
    set({ isLoading: true, error: null });
    try {
      const authResponse: AuthResponse = await authApi.login(credentials);
      authApi.storeAuthData(authResponse);
      set({ 
        user: authResponse.user, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'فشل في تسجيل الدخول';
      set({ 
        error: errorMessage, 
        isLoading: false, 
        isAuthenticated: false 
      });
      throw error;
    }
  },

  register: async (userData: RegisterRequest) => {
    set({ isLoading: true, error: null });
    try {
      const authResponse: AuthResponse = await authApi.register(userData);
      authApi.storeAuthData(authResponse);
      set({ 
        user: authResponse.user, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'فشل في إنشاء الحساب';
      set({ 
        error: errorMessage, 
        isLoading: false, 
        isAuthenticated: false 
      });
      throw error;
    }
  },

  logout: () => {
    authApi.logout().catch(() => {
      // Ignore logout API errors
    });
    authApi.clearAuthData();
    set({ 
      user: null, 
      isAuthenticated: false, 
      error: null 
    });
  },

  getCurrentUser: async () => {
    if (!authApi.isAuthenticated()) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    set({ isLoading: true });
    try {
      const user = await authApi.getCurrentUser();
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false 
      });
    } catch (error: any) {
      authApi.clearAuthData();
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false,
        error: 'انتهت صلاحية الجلسة'
      });
    }
  },

  clearError: () => set({ error: null }),
}));