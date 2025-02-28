import axios from 'axios';

// API endpoints for different microservices
const API_ENDPOINTS = {
  auth: 'https://dyul6kzwjh.execute-api.ap-south-1.amazonaws.com/dev/v1',
  users: 'https://25ht13iic8.execute-api.ap-south-1.amazonaws.com/dev/v1'
};

// Create instances for each service
const createAxiosInstance = (baseURL: string) => {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export const authApi = createAxiosInstance(API_ENDPOINTS.auth);
export const usersApi = createAxiosInstance(API_ENDPOINTS.users);

export default authApi; // Default export for backward compatibility