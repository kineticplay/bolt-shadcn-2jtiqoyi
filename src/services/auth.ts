import { authApi } from '@/lib/axios';

export interface LoginResponse {
  status: boolean;
  message: string;
  token: string;
  user_details: {
    id: string;
    fullname: string;
    user_status: string;
    extraData: any;
    active_session_token: string;
  };
  user_role: any;
  case_state: any;
  user_kyc: any[];
  modules: any[];
}

export interface GenerateOtpResponse {
  status: boolean;
  message: string;
}

export interface VerifyOtpResponse {
  status: boolean;
  message: string;
  token?: string;
}

export interface ForgotPasswordResponse {
  status: boolean;
  message: string;
}

export const authService = {
  loginWithEmail: async (email: string, password: string) => {
    const response = await authApi.post<LoginResponse>('/login', { email, password });
    return {
      status: true,
      message: response.data.message || '',
      token: response.data.token,
      user_details: response.data.user_details
    };
  },

  generateOtp: async (phone_number: string) => {
    const response = await authApi.post<GenerateOtpResponse>('/generateOtp', { phone_number });
    return response.data;
  },

  verifyOtp: async (phone_number: string, otp: string) => {
    const response = await authApi.post<VerifyOtpResponse>('/verifyOtp', { phone_number, otp });
    return response.data;
  },

  forgotPassword: async (email: string) => {
    try {
      const response = await authApi.post<ForgotPasswordResponse>('/forgotPassword', { email });
      return {
        status: response.status === 200,
        message: response.data.message || 'Password reset link sent successfully'
      };
    } catch (error: any) {
      if (error.response?.status === 404) {
        return {
          status: false,
          message: 'No account found with this email address'
        };
      }
      if (error.response?.status === 429) {
        return {
          status: false,
          message: 'Too many requests. Please try again later.'
        };
      }
      return {
        status: false,
        message: 'Failed to send reset link. Please try again.'
      };
    }
  },

  resetPassword: async (token: string, password: string) => {
    try {
      const response = await authApi.post('/resetPassword', { 
        resetLink: token,
        password
      });
      return {
        status: response.status === 200,
        message: 'Password reset successfully'
      };
    } catch (error: any) {
      if (error.response?.status === 400) {
        return {
          status: false,
          message: 'Invalid or expired reset link'
        };
      }
      return {
        status: false,
        message: 'Failed to reset password. Please try again.'
      };
    }
  },

  logout: async () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      await authApi.post('/logout', { active_session_token: token });
      localStorage.removeItem('auth_token');
    }
  },
};