import { create } from 'zustand';
import { authService } from '@/services/auth';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithOtp: (phone: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: !!localStorage.getItem('auth_token'),
  user: null,
  loading: false,
  error: null,

  login: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const response = await authService.loginWithEmail(email, password);
      
      if (response.status) {
        localStorage.setItem('auth_token', response.token);
        set({ 
          isAuthenticated: true, 
          user: response.user_details,
          loading: false 
        });
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred',
        loading: false 
      });
    }
  },

  loginWithOtp: async (phone: string, otp: string) => {
    try {
      set({ loading: true, error: null });
      const response = await authService.verifyOtp(phone, otp);
      
      if (response.status && response.token) {
        localStorage.setItem('auth_token', response.token);
        set({ 
          isAuthenticated: true,
          loading: false 
        });
      } else {
        throw new Error(response.message || 'OTP verification failed');
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An error occurred',
        loading: false 
      });
    }
  },

  logout: async () => {
    try {
      set({ loading: true });
      await authService.logout();
      localStorage.removeItem('auth_token');
      set({ 
        isAuthenticated: false, 
        user: null,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Logout failed',
        loading: false 
      });
    }
  },

  clearError: () => set({ error: null }),
}));