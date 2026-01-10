"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Phone, Lock, Check } from "lucide-react";
import { authService } from "@/services/api/auth.service";
import { useLocalization } from "@/context/LocalizationContext";
import styles from "./forgot-password.module.css";

type Step = "phone" | "otp" | "password" | "success";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const { dictionary: t } = useLocalization();
    const [step, setStep] = useState<Step>("phone");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Form data
    const [mobile, setMobile] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [resetToken, setResetToken] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // OTP resend timer
    const [resendTimer, setResendTimer] = useState(0);

    // OTP input refs
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Start resend timer when entering OTP step
    useEffect(() => {
        if (step === "otp" && resendTimer === 0) {
            setResendTimer(60);
        }
    }, [step, resendTimer]);

    // Countdown timer
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    // Auto-redirect after success
    useEffect(() => {
        if (step === "success") {
            const timer = setTimeout(() => {
                router.push("/login");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [step, router]);

    const getStepNumber = (s: Step): number => {
        const steps: Step[] = ["phone", "otp", "password", "success"];
        return steps.indexOf(s) + 1;
    };

    const handlePhoneSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            await authService.requestPasswordReset(mobile);
            setStep("otp");
        } catch (err) {
            setError(err instanceof Error ? err.message : t.auth.forgotPassword.failedToSendOtp);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) {
            value = value.slice(-1);
        }
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const otpString = otp.join("");
        if (otpString.length !== 6) {
            setError(t.auth.forgotPassword.completeOtp);
            setIsLoading(false);
            return;
        }

        try {
            const result = await authService.verifyOTP(mobile, otpString);
            setResetToken(result.resetToken);
            setStep("password");
        } catch (err) {
            setError(err instanceof Error ? err.message : t.auth.forgotPassword.invalidOtp);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (resendTimer > 0) return;

        setIsLoading(true);
        setError("");

        try {
            await authService.requestPasswordReset(mobile);
            setResendTimer(60);
            setOtp(["", "", "", "", "", ""]);
        } catch (err) {
            setError(err instanceof Error ? err.message : t.auth.forgotPassword.failedToResendOtp);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (password !== confirmPassword) {
            setError(t.auth.register.passwordsDoNotMatch);
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setError(t.auth.register.passwordTooShort);
            setIsLoading(false);
            return;
        }

        try {
            await authService.resetPassword(resetToken, password);
            setStep("success");
        } catch (err) {
            setError(err instanceof Error ? err.message : t.auth.forgotPassword.failedToResetPassword);
        } finally {
            setIsLoading(false);
        }
    };

    const renderProgressSteps = () => {
        const currentStep = getStepNumber(step);

        return (
            <div className={styles.progressContainer}>
                <div className={styles.progressSteps}>
                    {[1, 2, 3, 4].map((stepNum, idx) => (
                        <div key={stepNum} style={{ display: "flex", alignItems: "center" }}>
                            <div
                                className={`${styles.progressStep} ${stepNum < currentStep
                                    ? styles.progressStepCompleted
                                    : stepNum === currentStep
                                        ? styles.progressStepActive
                                        : styles.progressStepPending
                                    }`}
                            >
                                {stepNum < currentStep ? <Check size={16} /> : stepNum}
                            </div>
                            {idx < 3 && (
                                <div
                                    className={`${styles.progressLine} ${stepNum < currentStep ? styles.progressLineActive : ""
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className={styles.page}>
            <div className={styles.wrapper}>
                {renderProgressSteps()}

                {/* Step 1: Enter Phone */}
                {step === "phone" && (
                    <>
                        <div className={styles.header}>
                            <h2 className={styles.title}>{t.auth.forgotPassword.title}</h2>
                            <p className={styles.subtitle}>
                                {t.auth.forgotPassword.subtitle}
                            </p>
                        </div>

                        <form onSubmit={handlePhoneSubmit} className={styles.card}>
                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>{t.auth.forgotPassword.mobileNumber}</label>
                                <div className={styles.inputWrapper}>
                                    <Phone className={styles.inputIcon} size={18} />
                                    <input
                                        type="tel"
                                        required
                                        placeholder={t.auth.forgotPassword.mobilePlaceholder}
                                        className={styles.input}
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                    />
                                </div>
                            </div>

                            {error && <div className={styles.error}>{error}</div>}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={styles.submitBtn}
                            >
                                {isLoading ? t.auth.forgotPassword.sendingOtp : t.auth.forgotPassword.sendOtp}
                                {!isLoading && <ArrowRight size={16} />}
                            </button>

                            <Link href="/login" className={styles.backBtn}>
                                <ArrowLeft size={16} />
                                {t.auth.forgotPassword.backToLogin}
                            </Link>
                        </form>
                    </>
                )}

                {/* Step 2: OTP Verification */}
                {step === "otp" && (
                    <>
                        <div className={styles.header}>
                            <h2 className={styles.title}>{t.auth.forgotPassword.verifyOtpTitle}</h2>
                            <p className={styles.subtitle}>
                                {t.auth.forgotPassword.verifyOtpSubtitle}<br />
                                <strong>{mobile}</strong>
                            </p>
                        </div>

                        <form onSubmit={handleOtpSubmit} className={styles.card}>
                            <div className={styles.otpContainer}>
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => { otpRefs.current[index] = el; }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                        className={styles.otpInput}
                                        autoFocus={index === 0}
                                    />
                                ))}
                            </div>

                            <div className={styles.resendContainer}>
                                <span className={styles.resendText}>
                                    {t.auth.forgotPassword.didntReceiveCode}{" "}
                                </span>
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={resendTimer > 0 || isLoading}
                                    className={styles.resendBtn}
                                >
                                    {resendTimer > 0 ? `${t.auth.forgotPassword.resendIn} ${resendTimer}s` : t.auth.forgotPassword.resendOtp}
                                </button>
                            </div>

                            {error && <div className={styles.error}>{error}</div>}

                            <button
                                type="submit"
                                disabled={isLoading || otp.join("").length !== 6}
                                className={styles.submitBtn}
                            >
                                {isLoading ? t.auth.forgotPassword.verifying : t.auth.forgotPassword.verifyOtp}
                                {!isLoading && <ArrowRight size={16} />}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setStep("phone");
                                    setError("");
                                }}
                                className={styles.backBtn}
                            >
                                <ArrowLeft size={16} />
                                {t.auth.forgotPassword.changeNumber}
                            </button>
                        </form>
                    </>
                )}

                {/* Step 3: New Password */}
                {step === "password" && (
                    <>
                        <div className={styles.header}>
                            <h2 className={styles.title}>{t.auth.forgotPassword.newPasswordTitle}</h2>
                            <p className={styles.subtitle}>
                                {t.auth.forgotPassword.newPasswordSubtitle}
                            </p>
                        </div>

                        <form onSubmit={handlePasswordSubmit} className={styles.card}>
                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>{t.auth.forgotPassword.newPassword}</label>
                                <div className={styles.inputWrapper}>
                                    <Lock className={styles.inputIcon} size={18} />
                                    <input
                                        type="password"
                                        required
                                        placeholder={t.auth.register.passwordPlaceholder}
                                        className={styles.input}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>{t.auth.forgotPassword.confirmPassword}</label>
                                <div className={styles.inputWrapper}>
                                    <Lock className={styles.inputIcon} size={18} />
                                    <input
                                        type="password"
                                        required
                                        placeholder={t.auth.register.confirmPasswordPlaceholder}
                                        className={styles.input}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            {error && <div className={styles.error}>{error}</div>}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={styles.submitBtn}
                            >
                                {isLoading ? t.auth.forgotPassword.resetting : t.auth.forgotPassword.resetPassword}
                                {!isLoading && <ArrowRight size={16} />}
                            </button>
                        </form>
                    </>
                )}

                {/* Step 4: Success */}
                {step === "success" && (
                    <div className={styles.card}>
                        <div className={styles.successContainer}>
                            <div className={styles.successIcon}>
                                <Check size={40} />
                            </div>
                            <h3 className={styles.successTitle}>{t.auth.forgotPassword.successTitle}</h3>
                            <p className={styles.successMessage}>
                                {t.auth.forgotPassword.successMessage}
                            </p>
                            <Link href="/login" className={styles.submitBtn}>
                                {t.auth.forgotPassword.goToLogin}
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                )}

                {step !== "success" && (
                    <div className={styles.footer}>
                        <p className={styles.footerText}>
                            {t.auth.forgotPassword.rememberPassword}{" "}
                            <Link href="/login" className={styles.loginLink}>
                                {t.auth.register.signIn}
                            </Link>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
