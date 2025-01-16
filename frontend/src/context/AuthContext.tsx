import { createContext, ReactNode, useState } from 'react';
import { AuthContextType, User } from '../types/auth';

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => undefined,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext };