"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/services/api/types";
import { authService } from "@/services/api/auth.service";

interface RegisterData {
    name: string;
    mobile: string;
    password: string;
}

interface UpdateProfileData {
    name?: string;
    email?: string;
    mobile?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (mobile: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    updateProfile: (data: UpdateProfileData) => Promise<void>;
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
            } catch {
                // Expected when not logged in - silently ignore
            } finally {
                setLoading(false);
            }
        };
        initAuth();
    }, []);

    const login = async (mobile: string, password: string) => {
        const response = await authService.login(mobile, password);
        setUser(response.user);
    };

    const register = async (data: RegisterData) => {
        const response = await authService.register(data);
        setUser(response.user);
    };

    const updateProfile = async (data: UpdateProfileData) => {
        const updatedUser = await authService.updateProfile(data);
        setUser(updatedUser);
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, updateProfile, logout }}>
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
