import type { LoginResponse, LogoutResponse, RegisterResponse, ForgotPassword, ProfileResponse } from '../types';
import request from './request';

export async function login(login: string, password: string): Promise<LoginResponse> {
  return request<LoginResponse>('/users/auth/login', 'POST', { login, password });
}

export async function logout(): Promise<LogoutResponse> {
  return request<LogoutResponse>('/users/auth/logout', 'POST');
}

export async function register(email: string, username: string, password: string): Promise<RegisterResponse> {
  return request<RegisterResponse>('/users/auth/signup', 'POST', { email, username, password });
}

export async function forgotPassword(email: string): Promise<ForgotPassword> {
  return request<ForgotPassword>('/users/auth/forgot-password', 'POST', { email });
}

export async function resetPassword(email: string, temporaryPassword: string, newPassword: string) {
  return request('/users/auth/reset-password', 'POST', { email, temporaryPassword, newPassword });
}

export async function getProfile(): Promise<ProfileResponse> {
  return request<ProfileResponse>('/users/auth/profile', 'GET');
}
