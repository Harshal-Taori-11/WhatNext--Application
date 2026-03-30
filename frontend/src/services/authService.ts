import api from './api';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types';

export const authService = {
  /**
   * Step 1: Send OTP to email
   */
  async sendOTP(email: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/send-otp', { email });
    return response.data;
  },

  /**
   * Step 2: Verify OTP
   */
  async verifyOTP(email: string, otp: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/verify-otp', { email, otp });
    return response.data;
  },

  /**
   * Resend OTP
   */
  async resendOTP(email: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/resend-otp', { email });
    return response.data;
  },

  /**
   * Step 3: Complete registration with profile
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.data.id,
        email: response.data.email,
        username: response.data.username,
        fullName: response.data.fullName,
      }));
    }
    return response.data;
  },

  /**
   * Login existing user
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.data.id,
        email: response.data.email,
        username: response.data.username,
        fullName: response.data.fullName,
      }));
    }
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },
};
