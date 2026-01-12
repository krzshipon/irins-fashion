"use client";

import { useState, useEffect } from "react";
import {
    Search,
    Edit,
    ChevronLeft,
    ChevronRight,
    User,
    Shield,
    ShieldCheck,
    Trash2,
    CheckCircle,
    XCircle,
    RefreshCw
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useDialog } from "@/components/Dialog";
import EditUserModal from "@/components/users/EditUserModal";
import { usersService, AdminUser } from "@/services/users.service";

const ROLE_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    CUSTOMER: { label: "Customer", color: "bg-blue-500/10 text-blue-400", icon: User },
    ADMIN: { label: "Admin", color: "bg-purple-500/10 text-purple-400", icon: Shield },
    SUPERADMIN: { label: "Super Admin", color: "bg-amber-500/10 text-amber-400", icon: ShieldCheck },
};

export default function UsersPage() {
    const { user: currentUser } = useAuth();
    const { showConfirm, showSuccess, showError } = useDialog();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [editingUser, setEditingUser] = useState<any>(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await usersService.getAll({
                role: selectedRole || undefined,
                search: searchQuery || undefined,
                page,
                limit: 10
            });
            // Filter out SUPERADMIN for non-SUPERADMIN users on client side if needed, 
            // but relying on backend is better. For now showing all as per API.
            setUsers(data.users);
            setTotalPages(data.totalPages);
            setTotalUsers(data.total);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            showError("Error", "Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [selectedRole, page]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (page === 1) {
                fetchUsers();
            } else {
                setPage(1);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleDelete = (id: string, role: string) => {
        if (role === 'SUPERADMIN') return;

        showConfirm(
            "Delete User",
            "Are you sure you want to delete this user? This action cannot be undone.",
            async () => {
                try {
                    await usersService.delete(id);
                    setUsers(users.filter(u => u.id !== id));
                    setTotalUsers(prev => prev - 1);
                    showSuccess("User Deleted", "The user has been deleted successfully.");
                } catch (error: any) {
                    showError("Error", error.message || "Failed to delete user");
                }
            }
        );
    };

    const handleSaveUser = async (updatedData: any) => {
        try {
            // Check if role changed
            if (editingUser && updatedData.role !== editingUser.role) {
                await usersService.updateRole(updatedData.id, updatedData.role);
            }

            // Check if other fields changed (basic stats update)
            await usersService.update(updatedData.id, {
                name: updatedData.name,
                email: updatedData.email,
                mobile: updatedData.mobile,
                // isActive: updatedData.isActive // Not supported by backend yet
            });

            // Update local state
            setUsers(users.map(u => u.id === updatedData.id ? { ...u, ...updatedData } : u));

            // If isActive changed explicitly (mock support)
            if (editingUser && updatedData.isActive !== editingUser.isActive) {
                // handle mock status update call if needed
            }

            showSuccess("User Updated", "User information has been updated successfully.");
            setEditingUser(null);
        } catch (error: any) {
            showError("Error", error.message || "Failed to update user");
        }
    };

    const toggleStatus = (user: AdminUser) => {
        if (user.role === 'SUPERADMIN') return;

        const newStatus = !user.isActive;
        const action = newStatus ? "activate" : "deactivate";

        showConfirm(
            `${newStatus ? "Activate" : "Deactivate"} User`,
            `Are you sure you want to ${action} this user?`,
            async () => {
                try {
                    await usersService.updateStatus(user.id, newStatus);
                    setUsers(users.map(u => u.id === user.id ? { ...u, isActive: newStatus } : u));
                    showSuccess("Status Updated", `User has been ${newStatus ? "activated" : "deactivated"} successfully.`);
                } catch (error: any) {
                    showError("Error", "Failed to update status");
                }
            }
        );
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatTime = (dateString: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white font-playfair">Users</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Manage customers and admin users ({totalUsers} users)
                    </p>
                </div>
                <button
                    onClick={() => fetchUsers()}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-gray-400 rounded-lg hover:bg-white/10 transition-colors text-sm"
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Role Tabs */}
            <div className="flex items-center gap-2 flex-wrap">
                <button
                    onClick={() => { setSelectedRole(""); setPage(1); }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!selectedRole
                        ? "bg-white text-gray-900"
                        : "bg-gray-800/50 text-gray-400 hover:bg-white/5 border border-white/10"
                        }`}
                >
                    All Users
                </button>
                {Object.entries(ROLE_CONFIG).map(([role, config]) => {
                    // Hide Super Admin tab for non-super admins
                    if (role === 'SUPERADMIN' && currentUser?.role !== 'SUPERADMIN') return null;

                    const Icon = config.icon;
                    return (
                        <button
                            key={role}
                            onClick={() => { setSelectedRole(role); setPage(1); }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${selectedRole === role
                                ? "bg-white text-gray-900"
                                : "bg-gray-800/50 text-gray-400 hover:bg-white/5 border border-white/10"
                                }`}
                        >
                            <Icon size={16} />
                            {config.label}
                        </button>
                    );
                })}
            </div>

            {/* Filters Bar */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-white/10 p-4">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/30 focus:outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-black/20 border-b border-white/10">
                                    <tr>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            Total Spent
                                        </th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            Joined
                                        </th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            Last Login
                                        </th>
                                        <th className="text-right px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {users.map((user) => {
                                        // Hide SUPERADMIN from normal admins if required filter missed by backend
                                        if (user.role === 'SUPERADMIN' && currentUser?.role !== 'SUPERADMIN') return null;

                                        const roleConfig = ROLE_CONFIG[user.role] || ROLE_CONFIG.CUSTOMER;
                                        const RoleIcon = roleConfig.icon;
                                        return (
                                            <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold uppercase">
                                                            {(user.name || user.mobile || '?').charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-white text-sm">{user.name || 'No Name'}</p>
                                                            <p className="text-xs text-gray-500">{user.email || user.mobile}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${roleConfig.color}`}>
                                                        <RoleIcon size={14} />
                                                        {roleConfig.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => toggleStatus(user)}
                                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${user.isActive
                                                            ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                                            : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                                            }`}
                                                    >
                                                        {user.isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                                        {user.isActive ? 'Active' : 'Inactive'}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-semibold text-white">
                                                        {user.totalSpent > 0 ? `৳${user.totalSpent.toLocaleString()}` : '-'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-400">{formatDate(user.createdAt)}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="text-sm text-gray-400">{user.lastLogin ? formatDate(user.lastLogin) : '-'}</p>
                                                        <p className="text-xs text-gray-500">{user.lastLogin ? formatTime(user.lastLogin) : ''}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => setEditingUser(user)}
                                                            className="p-2 text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        {user.role !== 'SUPERADMIN' && (
                                                            <button
                                                                onClick={() => handleDelete(user.id, user.role)}
                                                                className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {!loading && users.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                                No users found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-6 py-4 bg-black/20 border-t border-white/10 flex items-center justify-between">
                            <p className="text-sm text-gray-400">
                                Page <span className="font-medium text-white">{page}</span> of{" "}
                                <span className="font-medium text-white">{totalPages}</span> ({totalUsers} users)
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page <= 1}
                                    className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <button className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm font-medium">{page}</button>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page >= totalPages}
                                    className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <EditUserModal
                user={editingUser}
                isOpen={!!editingUser}
                onClose={() => setEditingUser(null)}
                onSave={handleSaveUser}
                currentUserRole={currentUser?.role || 'ADMIN'}
            />
        </div>
    );
}
