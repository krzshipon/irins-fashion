"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Phone, Lock, Check } from "lucide-react";
import { authService } from "@/services/api/auth.service";
import styles from "./forgot-password.module.css";

type Step = "phone" | "otp" | "password" | "success";

export default function ForgotPasswordPage() {
    const router = useRouter();
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
            setError(err instanceof Error ? err.message : "Failed to send OTP");
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
            setError("Please enter the complete OTP");
            setIsLoading(false);
            return;
        }

        try {
            const result = await authService.verifyOTP(mobile, otpString);
            setResetToken(result.resetToken);
            setStep("password");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Invalid OTP");
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
            setError(err instanceof Error ? err.message : "Failed to resend OTP");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            setIsLoading(false);
            return;
        }

        try {
            await authService.resetPassword(resetToken, password);
            setStep("success");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to reset password");
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
                            <h2 className={styles.title}>Forgot Password?</h2>
                            <p className={styles.subtitle}>
                                Enter your mobile number and we&apos;ll send you a verification code
                            </p>
                        </div>

                        <form onSubmit={handlePhoneSubmit} className={styles.card}>
                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>Mobile Number</label>
                                <div className={styles.inputWrapper}>
                                    <Phone className={styles.inputIcon} size={18} />
                                    <input
                                        type="tel"
                                        required
                                        placeholder="01XXXXXXXXX"
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
                                {isLoading ? "Sending OTP..." : "Send OTP"}
                                {!isLoading && <ArrowRight size={16} />}
                            </button>

                            <Link href="/login" className={styles.backBtn}>
                                <ArrowLeft size={16} />
                                Back to Login
                            </Link>
                        </form>
                    </>
                )}

                {/* Step 2: OTP Verification */}
                {step === "otp" && (
                    <>
                        <div className={styles.header}>
                            <h2 className={styles.title}>Verify OTP</h2>
                            <p className={styles.subtitle}>
                                Enter the 6-digit code sent to<br />
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
                                    Didn&apos;t receive the code?{" "}
                                </span>
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={resendTimer > 0 || isLoading}
                                    className={styles.resendBtn}
                                >
                                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                                </button>
                            </div>

                            {error && <div className={styles.error}>{error}</div>}

                            <button
                                type="submit"
                                disabled={isLoading || otp.join("").length !== 6}
                                className={styles.submitBtn}
                            >
                                {isLoading ? "Verifying..." : "Verify OTP"}
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
                                Change Number
                            </button>
                        </form>
                    </>
                )}

                {/* Step 3: New Password */}
                {step === "password" && (
                    <>
                        <div className={styles.header}>
                            <h2 className={styles.title}>Create New Password</h2>
                            <p className={styles.subtitle}>
                                Enter a new password for your account
                            </p>
                        </div>

                        <form onSubmit={handlePasswordSubmit} className={styles.card}>
                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>New Password</label>
                                <div className={styles.inputWrapper}>
                                    <Lock className={styles.inputIcon} size={18} />
                                    <input
                                        type="password"
                                        required
                                        placeholder="At least 6 characters"
                                        className={styles.input}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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
                                {isLoading ? "Resetting..." : "Reset Password"}
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
                            <h3 className={styles.successTitle}>Password Reset Successful!</h3>
                            <p className={styles.successMessage}>
                                Your password has been updated. Redirecting to login...
                            </p>
                            <Link href="/login" className={styles.submitBtn}>
                                Go to Login
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                )}

                {step !== "success" && (
                    <div className={styles.footer}>
                        <p className={styles.footerText}>
                            Remember your password?{" "}
                            <Link href="/login" className={styles.loginLink}>
                                Sign in
                            </Link>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
