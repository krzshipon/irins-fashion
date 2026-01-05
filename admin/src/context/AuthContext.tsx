"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, authService } from "@/services/auth.service";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (identifier: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const initAuth = async () => {
            try {
                const user = await authService.getProfile();
                setUser(user);
            } catch (error) {
                // Not authenticated or not admin
                console.log('Not authenticated');
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    useEffect(() => {
        if (!loading) {
            if (!user && pathname !== '/login') {
                router.push('/login');
            } else if (user && pathname === '/login') {
                router.push('/');
            }
        }
    }, [user, loading, pathname, router]);

    const login = async (identifier: string, password: string) => {
        const response = await authService.login(identifier, password);
        // Allow both ADMIN and SUPERADMIN roles
        if (response.user.role !== 'ADMIN' && response.user.role !== 'SUPERADMIN') {
            throw new Error('Access denied: You are not an admin');
        }

        // Save token for API client
        if (response.access_token) {
            localStorage.setItem('authToken', response.access_token);
        }

        setUser(response.user);
        router.push('/');
    };

    const logout = async () => {
        await authService.logout();
        localStorage.removeItem('authToken');
        setUser(null);
        router.push('/login');
    };

    if (loading) {
        return <div className="flex h-screen w-full items-center justify-center bg-gray-50">Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
