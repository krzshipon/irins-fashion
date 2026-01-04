"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/services/api/types";
import { authService } from "@/services/api/auth.service";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (mobile: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Initialize auth state
    useEffect(() => {
        const initAuth = async () => {
            try {
                const user = await authService.getProfile();
                setUser(user);
            } catch (error) {
                console.error("Failed to restore session", error);
            } finally {
                setLoading(false);
            }
        };
        initAuth();
    }, []);

    const login = async (mobile: string) => {
        const response = await authService.login(mobile);
        setUser(response.user);
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
    };

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
