import { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { AuthResponse } from '../../types/auth';
import { useAuthContext } from './useAuthContext';

export function useAuthInit() {
  const { setUser } = useAuthContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data } = await api.get<AuthResponse>('/auth/me');
        setUser({ username: data.username, role: data.role });
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [setUser]);

  return loading;
}