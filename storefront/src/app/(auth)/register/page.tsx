"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Phone, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import styles from "./register.module.css";

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();
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
            setError("Passwords do not match.");
            setIsLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters.");
            setIsLoading(false);
            return;
        }

        // BD Mobile validation (01XXXXXXXXX - 11 digits starting with 01)
        const phoneRegex = /^01[3-9]\d{8}$/;
        if (!phoneRegex.test(formData.mobile)) {
            setError("Please enter a valid BD mobile number (01XXXXXXXXX).");
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
            setError("Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.wrapper}>
                {/* Header */}
                <div className={styles.header}>
                    <h2 className={styles.title}>Create Account</h2>
                    <p className={styles.subtitle}>
                        Join us for exclusive offers and faster checkout
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Full Name</label>
                        <div className={styles.inputWrapper}>
                            <User className={styles.inputIcon} size={18} />
                            <input
                                type="text"
                                required
                                placeholder="Your full name"
                                className={styles.input}
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Mobile Number</label>
                        <div className={styles.inputWrapper}>
                            <Phone className={styles.inputIcon} size={18} />
                            <input
                                type="tel"
                                required
                                placeholder="01XXXXXXXXX"
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
                                placeholder="At least 6 characters"
                                className={styles.input}
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                            />
                        </div>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Confirm Password</label>
                        <div className={styles.inputWrapper}>
                            <Lock className={styles.inputIcon} size={18} />
                            <input
                                type="password"
                                required
                                placeholder="Confirm your password"
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
                        {isLoading ? "Creating account..." : "Create Account"}
                        {!isLoading && <ArrowRight size={16} />}
                    </button>

                    <p className={styles.terms}>
                        By registering, you agree to our{" "}
                        <Link href="/policy/privacy" className={styles.termsLink}>
                            Privacy Policy
                        </Link>{" "}
                        and{" "}
                        <Link href="/policy/terms" className={styles.termsLink}>
                            Terms of Service
                        </Link>
                    </p>
                </form>

                {/* Footer */}
                <div className={styles.footer}>
                    <p className={styles.footerText}>
                        Already have an account?{" "}
                        <Link href="/login" className={styles.loginLink}>
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
