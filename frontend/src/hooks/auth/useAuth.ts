import { useState, useCallback } from 'react';
import { LoginRequest, RegisterRequest } from '../../types/auth';
import * as authService from '../../services/authService';
import { useAuthContext } from './useAuthContext';

export const useAuth = () => {
  const { user, setUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const login = useCallback(async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await authService.login(credentials);
      setUser({ username: response.username, role: response.role });
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  const register = useCallback(async (data: RegisterRequest) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await authService.register(data);
      setUser({ username: response.username, role: response.role });
    } catch (err) {
      setError('Registration failed. Please try a different username.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      setError('Logout failed.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  return { user, isLoading, error, login, register, logout };
};