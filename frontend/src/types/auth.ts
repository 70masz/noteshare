export interface User {
    username: string;
    role: 'USER' | 'ADMIN';
}
  
export interface AuthResponse {
    username: string;
    role: 'USER' | 'ADMIN';
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
}

export interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}