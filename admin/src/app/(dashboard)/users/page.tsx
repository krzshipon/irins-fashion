"use client";

import { useState } from "react";
import {
    Search,
    Eye,
    Edit,
    ChevronLeft,
    ChevronRight,
    User,
    Shield,
    ShieldCheck,
} from "lucide-react";

// Mock data - will be replaced with API calls
const MOCK_USERS = [
    {
        id: "1",
        name: "Fatima Ahmed",
        email: "fatima@example.com",
        phone: "01712345678",
        role: "customer",
        ordersCount: 12,
        totalSpent: 45600,
        createdAt: "2025-06-15T10:30:00Z",
        lastLogin: "2026-01-04T14:30:00Z",
    },
    {
        id: "2",
        name: "Aisha Rahman",
        email: "aisha@example.com",
        phone: "01798765432",
        role: "customer",
        ordersCount: 5,
        totalSpent: 18900,
        createdAt: "2025-09-20T08:15:00Z",
        lastLogin: "2026-01-03T11:45:00Z",
    },
    {
        id: "3",
        name: "Admin User",
        email: "admin@irinsfashion.com",
        phone: "01700000000",
        role: "admin",
        ordersCount: 0,
        totalSpent: 0,
        createdAt: "2025-01-01T00:00:00Z",
        lastLogin: "2026-01-04T19:00:00Z",
    },
    {
        id: "4",
        name: "Super Admin",
        email: "superadmin@irinsfashion.com",
        phone: "01711111111",
        role: "superadmin",
        ordersCount: 0,
        totalSpent: 0,
        createdAt: "2025-01-01T00:00:00Z",
        lastLogin: "2026-01-04T20:30:00Z",
    },
];

const ROLE_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    customer: { label: "Customer", color: "bg-blue-500/10 text-blue-400", icon: User },
    admin: { label: "Admin", color: "bg-purple-500/10 text-purple-400", icon: Shield },
    superadmin: { label: "Super Admin", color: "bg-amber-500/10 text-amber-400", icon: ShieldCheck },
};

export default function UsersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [users] = useState(MOCK_USERS);

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.phone.includes(searchQuery);
        const matchesRole = !selectedRole || user.role === selectedRole;
        return matchesSearch && matchesRole;
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatTime = (dateString: string) => {
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
                        Manage customers and admin users ({users.length} users)
                    </p>
                </div>
            </div>

            {/* Role Tabs */}
            <div className="flex items-center gap-2 flex-wrap">
                <button
                    onClick={() => setSelectedRole("")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!selectedRole
                        ? "bg-white text-gray-900"
                        : "bg-gray-800/50 text-gray-400 hover:bg-white/5 border border-white/10"
                        }`}
                >
                    All Users
                </button>
                {Object.entries(ROLE_CONFIG).map(([role, config]) => {
                    const count = users.filter(u => u.role === role).length;
                    const Icon = config.icon;
                    return (
                        <button
                            key={role}
                            onClick={() => setSelectedRole(role)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${selectedRole === role
                                ? "bg-white text-gray-900"
                                : "bg-gray-800/50 text-gray-400 hover:bg-white/5 border border-white/10"
                                }`}
                        >
                            <Icon size={16} />
                            {config.label}
                            <span className={`px-1.5 py-0.5 rounded text-xs ${selectedRole === role ? "bg-gray-200" : "bg-white/10"}`}>
                                {count}
                            </span>
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
                                    Orders
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
                            {filteredUsers.map((user) => {
                                const roleConfig = ROLE_CONFIG[user.role];
                                const RoleIcon = roleConfig.icon;
                                return (
                                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white text-sm">{user.name}</p>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
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
                                            <span className="text-sm text-gray-400">{user.ordersCount}</span>
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
                                                <p className="text-sm text-gray-400">{formatDate(user.lastLogin)}</p>
                                                <p className="text-xs text-gray-500">{formatTime(user.lastLogin)}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                                    <Eye size={16} />
                                                </button>
                                                <button className="p-2 text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors">
                                                    <Edit size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-black/20 border-t border-white/10 flex items-center justify-between">
                    <p className="text-sm text-gray-400">
                        Showing <span className="font-medium text-white">1</span> to <span className="font-medium text-white">{filteredUsers.length}</span> of{" "}
                        <span className="font-medium text-white">{users.length}</span> users
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50" disabled>
                            <ChevronLeft size={18} />
                        </button>
                        <button className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm font-medium">1</button>
                        <button className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50" disabled>
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
