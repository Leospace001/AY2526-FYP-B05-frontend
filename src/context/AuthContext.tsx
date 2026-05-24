import React, { createContext, useState, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

// Keep your existing interfaces...
export interface DecodedToken {
    sub: string;
    roles: string[];
    email?: string;
    userId?: number;
    exp: number;
    iat: number;
}

interface AuthContextType {
    user: DecodedToken | null;
    login: (token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    
    // 1. Initialize state synchronously! 
    // This runs instantly before the first render, preventing the premature redirect.
    const [user, setUser] = useState<DecodedToken | null>(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                return jwtDecode<DecodedToken>(token);
            } catch (error) {
                localStorage.removeItem('token');
                return null;
            }
        }
        return null;
    });

    const login = (token: string) => {
        localStorage.setItem('token', token);
        const decoded = jwtDecode<DecodedToken>(token);
        setUser(decoded);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};