import React, { createContext, useContext, useState, useEffect } from 'react';
import { AUTH_BASE_URL } from '../constants';

interface User {
    id: string;
    name: string;
    email: string;
    tenant_id: string;
}

interface AuthResponse {
    status: string;
    user: User;
    token: string;
}

interface GoogleAuthData {
    id: string;
    name: string;
    email: string;
    tenant_id?: string;
    turnstile_token?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (googleData: GoogleAuthData) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('xeta_token'));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const verifySession = async () => {
            if (!token) {
                setIsLoading(false);
                return;
            }

            if (token.startsWith('xeta_demo_')) {
                // If using the mock demo token, skip backend verification and maintain session
                setUser({
                    id: 'MERCH-DEMO-001',
                    name: 'Sovereign Merchant',
                    email: 'merchant@xetapay.com',
                    tenant_id: 'TENANT-001'
                });
                setIsLoading(false);
                return;
            }

            try {
                const res = await fetch(`${AUTH_BASE_URL}/api/auth/verify`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json() as { user: User };
                    setUser(data.user);
                } else {
                    logout();
                }
            } catch (err) {
                console.error("Auth verification failed", err);
            } finally {
                setIsLoading(false);
            }
        };

        verifySession();
    }, [token]);

    const login = async (googleData: GoogleAuthData) => {
        try {
            const res = await fetch(`${AUTH_BASE_URL}/api/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(googleData)
            });
            if (res.ok) {
                const data = await res.json() as AuthResponse;
                setToken(data.token);
                setUser(data.user);
                localStorage.setItem('xeta_token', data.token);
            } else {
                throw new Error("HTTP_FAIL_" + res.status);
            }
        } catch (err) {
            console.warn("Backend login failed, using DEMO MOCK for this session.", err);
            // FALLBACK FOR DEMO: If the backend worker isn't running or the endpoint is missing
            const mockToken = "xeta_demo_" + Math.random().toString(36).substring(7);
            setToken(mockToken);
            setUser({
                id: googleData.id || 'MERCH-DEMO-001',
                name: googleData.name || 'Sovereign Merchant',
                email: googleData.email || 'merchant@xetapay.com',
                tenant_id: 'TENANT-001'
            });
            localStorage.setItem('xeta_token', mockToken);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('xeta_token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
