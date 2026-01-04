"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Phone } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import styles from "./login.module.css";

const REMEMBER_KEY = "storefront_remembered_credentials";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ mobile: "", password: "" });
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");

    // Load remembered credentials on mount
    useEffect(() => {
        const remembered = localStorage.getItem(REMEMBER_KEY);
        if (remembered) {
            try {
                const { mobile, password } = JSON.parse(remembered);
                setFormData({ mobile: mobile || "", password: password || "" });
                setRememberMe(true);
            } catch {
                localStorage.removeItem(REMEMBER_KEY);
            }
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            // Use AuthContext login to update global state
            await login(formData.mobile, formData.password);

            // Save or clear credentials based on checkbox
            if (rememberMe) {
                localStorage.setItem(REMEMBER_KEY, JSON.stringify(formData));
            } else {
                localStorage.removeItem(REMEMBER_KEY);
            }

            router.push("/account/overview");
        } catch (err) {
            setError("Invalid mobile number or password.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.wrapper}>
                {/* Header */}
                <div className={styles.header}>
                    <h2 className={styles.title}>Welcome Back</h2>
                    <p className={styles.subtitle}>
                        Sign in to access your orders and profile
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Mobile Number</label>
                        <div className={styles.inputWrapper}>
                            <Phone className={styles.inputIcon} size={18} />
                            <input
                                type="tel"
                                required
                                placeholder="017..."
                                className={styles.input}
                                value={formData.mobile}
                                onChange={(e) =>
                                    setFormData({ ...formData, mobile: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Password</label>
                        <div className={styles.inputWrapper}>
                            <Lock className={styles.inputIcon} size={18} />
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                className={styles.input}
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                            />
                        </div>
                        <div className={styles.forgotLink}>
                            <Link href="/forgot-password" className={styles.forgotBtn}>
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    {/* Remember Me */}
                    <div className={styles.rememberRow}>
                        <input
                            id="remember-me"
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className={styles.rememberCheckbox}
                        />
                        <label htmlFor="remember-me" className={styles.rememberLabel}>
                            Remember my credentials
                        </label>
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={styles.submitBtn}
                    >
                        {isLoading ? "Signing in..." : "Sign in"}
                        {!isLoading && <ArrowRight size={16} />}
                    </button>
                </form>

                {/* Footer */}
                <div className={styles.footer}>
                    <p className={styles.footerText}>
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className={styles.signupLink}>
                            Create one now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
