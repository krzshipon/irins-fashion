"use client";

import { useAuth } from "@/context/AuthContext";
import { ArrowUpRight, DollarSign, Package, ShoppingCart, Users } from "lucide-react";

const stats = [
    {
        name: "Total Revenue",
        value: "৳154,230",
        change: "+12.5%",
        trend: "up",
        icon: DollarSign,
        color: "emerald",
    },
    {
        name: "Total Orders",
        value: "450",
        change: "+8.2%",
        trend: "up",
        icon: ShoppingCart,
        color: "blue",
    },
    {
        name: "Active Products",
        value: "86",
        change: "-2",
        trend: "down",
        icon: Package,
        color: "purple",
    },
    {
        name: "New Customers",
        value: "2,420",
        change: "+14.8%",
        trend: "up",
        icon: Users,
        color: "amber",
    },
];

const colorMap: Record<string, { bg: string; text: string; iconBg: string }> = {
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', iconBg: 'bg-emerald-500/20' },
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', iconBg: 'bg-blue-500/20' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', iconBg: 'bg-purple-500/20' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', iconBg: 'bg-amber-500/20' },
};

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <div className="space-y-8">
            {/* Value Proposition Header */}
            <div>
                <h1 className="text-2xl font-bold text-white font-playfair">
                    Welcome back, {user?.name?.split(' ')[0]}
                </h1>
                <p className="text-gray-400 text-sm mt-1">Here's what's happening with your store today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    const colors = colorMap[stat.color];
                    return (
                        <div key={stat.name} className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-lg ${colors.iconBg}`}>
                                    <Icon className={`w-6 h-6 ${colors.text}`} />
                                </div>
                                <span className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                                    }`}>
                                    {stat.change}
                                    {stat.trend === 'up' && <ArrowUpRight size={14} className="ml-1" />}
                                </span>
                            </div>
                            <h3 className="text-gray-400 text-sm font-medium">{stat.name}</h3>
                            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-xl rounded-xl border border-white/10 p-6 min-h-[400px]">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-white">Revenue Analytics</h2>
                        <select className="bg-black/20 border border-white/10 text-sm text-gray-300 rounded-lg px-3 py-1.5 focus:ring-emerald-500/30 focus:border-emerald-500/30 focus:outline-none cursor-pointer">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                            <option>This Year</option>
                        </select>
                    </div>
                    <div className="h-64 flex items-center justify-center text-gray-500 bg-black/20 rounded-lg border border-dashed border-white/10">
                        Chart Visualization Placeholder
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                    <h2 className="text-lg font-bold text-white mb-6">Recent Orders</h2>
                    <div className="space-y-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-4 pb-4 border-b border-white/5 last:border-0 last:pb-0">
                                <div className="w-10 h-10 rounded-full bg-gray-700/50 flex items-center justify-center text-gray-300 font-bold text-xs">
                                    #{1000 + i}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-white">New Order</p>
                                    <p className="text-xs text-gray-500">2 minutes ago</p>
                                </div>
                                <span className="text-sm font-semibold text-emerald-400">+৳5,400</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
