"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import {
    AlertTriangle,
    CheckCircle,
    XCircle,
    Info,
    X,
    Loader2,
} from "lucide-react";

// Dialog Types
type DialogType = "confirm" | "success" | "error" | "info" | "loading";

interface DialogConfig {
    type: DialogType;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void | Promise<void>;
    onCancel?: () => void;
    showCancel?: boolean;
}

interface DialogContextType {
    showDialog: (config: DialogConfig) => void;
    showConfirm: (title: string, message: string, onConfirm: () => void | Promise<void>) => void;
    showSuccess: (title: string, message: string) => void;
    showError: (title: string, message: string) => void;
    showInfo: (title: string, message: string) => void;
    showLoading: (title: string, message: string) => void;
    hideDialog: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

const ICON_MAP: Record<DialogType, { icon: React.ElementType; color: string; bgColor: string }> = {
    confirm: { icon: AlertTriangle, color: "text-amber-400", bgColor: "bg-amber-500/10" },
    success: { icon: CheckCircle, color: "text-green-400", bgColor: "bg-green-500/10" },
    error: { icon: XCircle, color: "text-red-400", bgColor: "bg-red-500/10" },
    info: { icon: Info, color: "text-blue-400", bgColor: "bg-blue-500/10" },
    loading: { icon: Loader2, color: "text-emerald-400", bgColor: "bg-emerald-500/10" },
};

export function DialogProvider({ children }: { children: ReactNode }) {
    const [dialog, setDialog] = useState<DialogConfig | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const showDialog = useCallback((config: DialogConfig) => {
        setDialog(config);
    }, []);

    const hideDialog = useCallback(() => {
        setDialog(null);
        setIsLoading(false);
    }, []);

    const showConfirm = useCallback((title: string, message: string, onConfirm: () => void | Promise<void>) => {
        setDialog({
            type: "confirm",
            title,
            message,
            confirmText: "Confirm",
            cancelText: "Cancel",
            showCancel: true,
            onConfirm,
        });
    }, []);

    const showSuccess = useCallback((title: string, message: string) => {
        setDialog({
            type: "success",
            title,
            message,
            confirmText: "OK",
            showCancel: false,
        });
    }, []);

    const showError = useCallback((title: string, message: string) => {
        setDialog({
            type: "error",
            title,
            message,
            confirmText: "OK",
            showCancel: false,
        });
    }, []);

    const showInfo = useCallback((title: string, message: string) => {
        setDialog({
            type: "info",
            title,
            message,
            confirmText: "OK",
            showCancel: false,
        });
    }, []);

    const showLoading = useCallback((title: string, message: string) => {
        setDialog({
            type: "loading",
            title,
            message,
            showCancel: false,
        });
    }, []);

    const handleConfirm = async () => {
        if (dialog?.onConfirm) {
            setIsLoading(true);
            try {
                await dialog.onConfirm();
            } finally {
                setIsLoading(false);
            }
        }
        hideDialog();
    };

    const handleCancel = () => {
        dialog?.onCancel?.();
        hideDialog();
    };

    return (
        <DialogContext.Provider value={{ showDialog, showConfirm, showSuccess, showError, showInfo, showLoading, hideDialog }}>
            {children}

            {/* Dialog Overlay */}
            {dialog && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={dialog.type !== "loading" ? handleCancel : undefined}
                    />

                    {/* Dialog */}
                    <div className="relative bg-gray-800 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md p-6 mx-4 animate-in fade-in zoom-in-95 duration-200">
                        {/* Close Button (except for loading) */}
                        {dialog.type !== "loading" && (
                            <button
                                onClick={handleCancel}
                                className="absolute top-4 right-4 p-1 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X size={18} />
                            </button>
                        )}

                        {/* Icon */}
                        <div className="flex justify-center mb-4">
                            {(() => {
                                const config = ICON_MAP[dialog.type];
                                const Icon = config.icon;
                                return (
                                    <div className={`p-4 rounded-full ${config.bgColor}`}>
                                        <Icon
                                            size={32}
                                            className={`${config.color} ${dialog.type === "loading" ? "animate-spin" : ""}`}
                                        />
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Content */}
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold text-white mb-2">{dialog.title}</h3>
                            <p className="text-gray-400 text-sm">{dialog.message}</p>
                        </div>

                        {/* Actions (except for loading) */}
                        {dialog.type !== "loading" && (
                            <div className="flex items-center justify-center gap-3">
                                {dialog.showCancel && (
                                    <button
                                        onClick={handleCancel}
                                        disabled={isLoading}
                                        className="px-5 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors font-medium text-sm disabled:opacity-50"
                                    >
                                        {dialog.cancelText || "Cancel"}
                                    </button>
                                )}
                                <button
                                    onClick={handleConfirm}
                                    disabled={isLoading}
                                    className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2 disabled:opacity-50 ${dialog.type === "error"
                                            ? "bg-red-600 hover:bg-red-500 text-white"
                                            : dialog.type === "confirm"
                                                ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
                                                : "bg-white/10 hover:bg-white/20 text-white"
                                        }`}
                                >
                                    {isLoading && <Loader2 size={16} className="animate-spin" />}
                                    {dialog.confirmText || "OK"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </DialogContext.Provider>
    );
}

export function useDialog() {
    const context = useContext(DialogContext);
    if (!context) {
        throw new Error("useDialog must be used within a DialogProvider");
    }
    return context;
}
