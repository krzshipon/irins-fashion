"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, User, Mail, Phone, Check, Save } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import styles from "./profile.module.css";

export default function ProfilePage() {
    const { user, updateProfile } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
    });

    // Initialize form with user data
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                mobile: user.mobile || "",
            });
        }
    }, [user]);

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccess(false);

        // Validate
        if (!formData.name.trim()) {
            setError("Name is required");
            setIsLoading(false);
            return;
        }

        // BD Mobile validation
        const phoneRegex = /^01[3-9]\d{8}$/;
        if (formData.mobile && !phoneRegex.test(formData.mobile)) {
            setError("Please enter a valid BD mobile number (01XXXXXXXXX)");
            setIsLoading(false);
            return;
        }

        // Email validation
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError("Please enter a valid email address");
            setIsLoading(false);
            return;
        }

        try {
            await updateProfile({
                name: formData.name,
                email: formData.email,
                mobile: formData.mobile,
            });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Edit Profile</h1>
                <Link href="/account/overview" className={styles.backBtn}>
                    <ArrowLeft size={18} />
                    Back to Overview
                </Link>
            </div>

            {/* Avatar Section */}
            <div className={styles.avatarSection}>
                <div className={styles.avatarLarge}>
                    {getInitials(formData.name || "User")}
                </div>
                <div className={styles.avatarInfo}>
                    <h3>{formData.name || "Your Name"}</h3>
                    <p>Member since {new Date().getFullYear()}</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className={styles.form}>
                {success && (
                    <div className={styles.successMessage}>
                        <Check size={16} />
                        Profile updated successfully!
                    </div>
                )}

                {error && <div className={styles.errorMessage}>{error}</div>}

                <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}>
                        <User size={18} className={styles.sectionIcon} />
                        Personal Information
                    </h3>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Full Name *</label>
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
                        <label className={styles.label}>Email Address</label>
                        <div className={styles.inputWrapper}>
                            <Mail className={styles.inputIcon} size={18} />
                            <input
                                type="email"
                                placeholder="your@email.com"
                                className={styles.input}
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                            />
                        </div>
                        <p className={styles.inputHint}>
                            Used for order confirmations and updates
                        </p>
                    </div>
                </div>

                <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}>
                        <Phone size={18} className={styles.sectionIcon} />
                        Contact Information
                    </h3>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Mobile Number</label>
                        <div className={styles.inputWrapper}>
                            <Phone className={styles.inputIcon} size={18} />
                            <input
                                type="tel"
                                placeholder="01XXXXXXXXX"
                                className={styles.input}
                                value={formData.mobile}
                                onChange={(e) =>
                                    setFormData({ ...formData, mobile: e.target.value })
                                }
                            />
                        </div>
                        <p className={styles.inputHint}>
                            Used for delivery updates and account recovery
                        </p>
                    </div>
                </div>

                <div className={styles.formActions}>
                    <Link href="/account/overview" className={styles.cancelBtn}>
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={styles.saveBtn}
                    >
                        {isLoading ? "Saving..." : "Save Changes"}
                        {!isLoading && <Save size={16} />}
                    </button>
                </div>
            </form>
        </div>
    );
}
