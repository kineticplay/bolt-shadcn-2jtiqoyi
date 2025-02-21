import axios from '@/lib/axios';

export interface LoginResponse {
  statusCode: number;
  token: string;
  user_details: {
    id: string;
    fullname: string;
    user_status: string;
    extraData: any;
    active_session_token: string;
  };
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

export const authService = {
  loginWithEmail: async (email: string, password: string) => {
    const response = await axios.post<LoginResponse>('/login', { email, password });
    return {
      status: response.data.statusCode === 200,
      message: '',
      token: response.data.token,
      user_details: response.data.user_details
    };
  },

  generateOtp: async (phone_number: string) => {
    const response = await axios.post<GenerateOtpResponse>('/generateOtp', { phone_number });
    return response.data;
  },

  verifyOtp: async (phone_number: string, otp: string) => {
    const response = await axios.post<VerifyOtpResponse>('/verifyOtp', { phone_number, otp });
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await axios.post('/forgotPassword', { email });
    return response.data;
  },

  resetPassword: async (resetLink: string, password: string) => {
    const response = await axios.post('/resetPassword', { resetLink, password });
    return response.data;
  },

  logout: async () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      await axios.post('/logout', { active_session_token: token });
      localStorage.removeItem('auth_token');
    }
  },
};