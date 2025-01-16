import { api } from './api';
import { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth';

export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/login', credentials);
  return data;
};

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const { data: response } = await api.post<AuthResponse>('/auth/register', data);
  return response;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};