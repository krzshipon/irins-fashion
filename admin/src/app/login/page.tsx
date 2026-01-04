"use client";

import { useState, useEffect } from "react";
import { Loader2, Lock, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const REMEMBER_KEY = "admin_remembered_credentials";

export default function LoginPage() {
    const { login } = useAuth();
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Load remembered credentials on mount
    useEffect(() => {
        const remembered = localStorage.getItem(REMEMBER_KEY);
        if (remembered) {
            try {
                const { identifier: savedId, password: savedPass } = JSON.parse(remembered);
                setIdentifier(savedId || "");
                setPassword(savedPass || "");
                setRememberMe(true);
            } catch {
                localStorage.removeItem(REMEMBER_KEY);
            }
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login(identifier, password);

            // Save or clear credentials based on checkbox
            if (rememberMe) {
                localStorage.setItem(REMEMBER_KEY, JSON.stringify({ identifier, password }));
            } else {
                localStorage.removeItem(REMEMBER_KEY);
            }
        } catch (err: any) {
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black opacity-80" />
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-emerald-900/20 to-transparent rounded-full blur-3xl transform rotate-12" />
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-emerald-900/20 to-transparent rounded-full blur-3xl transform -rotate-12" />
            </div>

            <div className="z-10 w-full max-w-md p-8">
                <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 transform transition-all hover:scale-[1.01]">
                    <div className="text-center mb-10">
                        <h1 className="font-playfair text-4xl font-bold text-white mb-2">Irins Fashion</h1>
                        <p className="text-gray-400 text-sm tracking-wide uppercase">Admin Portal</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Email or User ID"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 text-white placeholder-gray-500 pl-11 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                                    required
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 text-white placeholder-gray-500 pl-11 pr-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Remember Me Checkbox */}
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 rounded border-white/20 bg-black/20 text-emerald-500 focus:ring-emerald-500/50 focus:ring-offset-0 cursor-pointer"
                            />
                            <label htmlFor="remember-me" className="ml-2 text-sm text-gray-400 cursor-pointer select-none">
                                Remember my credentials
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium py-3.5 rounded-xl transition-all transform active:scale-95 shadow-lg shadow-emerald-900/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-500 text-xs">
                            Protected System • Authorized Personnel Only
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
