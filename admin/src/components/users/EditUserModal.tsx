"use client";

import { useState, useEffect } from "react";
import { User, Shield, Mail, Phone, CheckCircle, XCircle, X, Save } from "lucide-react";
import { useDialog } from "@/components/Dialog";

interface EditUserModalProps {
    user: any;
    isOpen: boolean;
    onClose: () => void;
    onSave: (userData: any) => void;
    currentUserRole: string;
}

export default function EditUserModal({ user, isOpen, onClose, onSave, currentUserRole }: EditUserModalProps) {
    const { showSuccess, showLoading } = useDialog();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        role: "",
        isActive: true,
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
                isActive: user.isActive,
            });
        }
    }, [user]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        showLoading("Updating User", "Please wait...");

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        onSave({ ...user, ...formData });
        showSuccess("User Updated", "User information has been updated successfully.");
        onClose();
    };

    const isSuperAdminTarget = user.role === 'SUPERADMIN';
    const isSelf = false; // In a real app we'd check ID match

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Edit User</h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Mobile Number</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input
                                type="text"
                                value={formData.mobile}
                                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
                            <div className="relative">
                                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    disabled={isSuperAdminTarget}
                                    className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white appearance-none focus:outline-none focus:border-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="CUSTOMER">Customer</option>
                                    <option value="ADMIN">Admin</option>
                                    {currentUserRole === 'SUPERADMIN' && <option value="SUPERADMIN">Super Admin</option>}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                            <div className="relative">
                                {formData.isActive ? (
                                    <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" size={16} />
                                ) : (
                                    <XCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500" size={16} />
                                )}
                                <select
                                    value={formData.isActive ? "active" : "inactive"}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "active" })}
                                    disabled={isSuperAdminTarget}
                                    className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white appearance-none focus:outline-none focus:border-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {isSuperAdminTarget && (
                        <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-200">
                            <Shield size={14} className="shrink-0" />
                            <p>Super Admin users cannot be modified or deactivated.</p>
                        </div>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors font-medium text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-500 hover:to-teal-500 transition-all font-medium text-sm"
                        >
                            <Save size={16} />
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
