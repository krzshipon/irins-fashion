"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Phone, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLocalization } from "@/context/LocalizationContext";
import styles from "./register.module.css";

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();
    const { dictionary: t } = useLocalization();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError(t.auth.register.passwordsDoNotMatch);
            setIsLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError(t.auth.register.passwordTooShort);
            setIsLoading(false);
            return;
        }

        // BD Mobile validation (01XXXXXXXXX - 11 digits starting with 01)
        const phoneRegex = /^01[3-9]\d{8}$/;
        if (!phoneRegex.test(formData.mobile)) {
            setError(t.auth.register.invalidMobile);
            setIsLoading(false);
            return;
        }

        try {
            await register({
                name: formData.name,
                mobile: formData.mobile,
                password: formData.password,
            });
            router.push("/account/overview");
        } catch (err) {
            setError(t.auth.register.registrationFailed);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.wrapper}>
                {/* Header */}
                <div className={styles.header}>
                    <h2 className={styles.title}>{t.auth.register.title}</h2>
                    <p className={styles.subtitle}>
                        {t.auth.register.subtitle}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>{t.auth.register.fullName}</label>
                        <div className={styles.inputWrapper}>
                            <User className={styles.inputIcon} size={18} />
                            <input
                                type="text"
                                required
                                placeholder={t.auth.register.fullNamePlaceholder}
                                className={styles.input}
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>{t.auth.register.mobileNumber}</label>
                        <div className={styles.inputWrapper}>
                            <Phone className={styles.inputIcon} size={18} />
                            <input
                                type="tel"
                                required
                                placeholder={t.auth.register.mobilePlaceholder}
                                className={styles.input}
                                value={formData.mobile}
                                onChange={(e) =>
                                    setFormData({ ...formData, mobile: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>{t.auth.register.password}</label>
                        <div className={styles.inputWrapper}>
                            <Lock className={styles.inputIcon} size={18} />
                            <input
                                type="password"
                                required
                                placeholder={t.auth.register.passwordPlaceholder}
                                className={styles.input}
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>{t.auth.register.confirmPassword}</label>
                        <div className={styles.inputWrapper}>
                            <Lock className={styles.inputIcon} size={18} />
                            <input
                                type="password"
                                required
                                placeholder={t.auth.register.confirmPasswordPlaceholder}
                                className={styles.input}
                                value={formData.confirmPassword}
                                onChange={(e) =>
                                    setFormData({ ...formData, confirmPassword: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={styles.submitBtn}
                    >
                        {isLoading ? t.auth.register.creatingAccount : t.auth.register.createAccount}
                        {!isLoading && <ArrowRight size={16} />}
                    </button>

                    <p className={styles.terms}>
                        {t.auth.register.termsPrefix}{" "}
                        <Link href="/policy/privacy" className={styles.termsLink}>
                            {t.auth.register.privacyPolicy}
                        </Link>{" "}
                        {t.auth.register.and}{" "}
                        <Link href="/policy/terms" className={styles.termsLink}>
                            {t.auth.register.termsOfService}
                        </Link>
                    </p>
                </form>

                {/* Footer */}
                <div className={styles.footer}>
                    <p className={styles.footerText}>
                        {t.auth.register.hasAccount}{" "}
                        <Link href="/login" className={styles.loginLink}>
                            {t.auth.register.signIn}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
