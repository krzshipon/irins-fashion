"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Phone } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLocalization } from "@/context/LocalizationContext";
import styles from "./login.module.css";

const REMEMBER_KEY = "storefront_remembered_credentials";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const { dictionary: t } = useLocalization();
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
            setError(t.auth.login.invalidCredentials);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.wrapper}>
                {/* Header */}
                <div className={styles.header}>
                    <h2 className={styles.title}>{t.auth.login.title}</h2>
                    <p className={styles.subtitle}>
                        {t.auth.login.subtitle}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>{t.auth.login.mobileNumber}</label>
                        <div className={styles.inputWrapper}>
                            <Phone className={styles.inputIcon} size={18} />
                            <input
                                type="tel"
                                required
                                placeholder={t.auth.login.mobilePlaceholder}
                                className={styles.input}
                                value={formData.mobile}
                                onChange={(e) =>
                                    setFormData({ ...formData, mobile: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>{t.auth.login.password}</label>
                        <div className={styles.inputWrapper}>
                            <Lock className={styles.inputIcon} size={18} />
                            <input
                                type="password"
                                required
                                placeholder={t.auth.login.passwordPlaceholder}
                                className={styles.input}
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                            />
                        </div>
                        <div className={styles.forgotLink}>
                            <Link href="/forgot-password" className={styles.forgotBtn}>
                                {t.auth.login.forgotPassword}
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
                            {t.auth.login.rememberMe}
                        </label>
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={styles.submitBtn}
                    >
                        {isLoading ? t.auth.login.signingIn : t.auth.login.signIn}
                        {!isLoading && <ArrowRight size={16} />}
                    </button>
                </form>

                {/* Footer */}
                <div className={styles.footer}>
                    <p className={styles.footerText}>
                        {t.auth.login.noAccount}{" "}
                        <Link href="/register" className={styles.signupLink}>
                            {t.auth.login.createAccount}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
