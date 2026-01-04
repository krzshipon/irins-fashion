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
        color: "bg-emerald-500",
    },
    {
        name: "Total Orders",
        value: "450",
        change: "+8.2%",
        trend: "up",
        icon: ShoppingCart,
        color: "bg-blue-500",
    },
    {
        name: "Active Products",
        value: "86",
        change: "-2",
        trend: "down",
        icon: Package,
        color: "bg-purple-500",
    },
    {
        name: "New Customers",
        value: "2,420",
        change: "+14.8%",
        trend: "up",
        icon: Users,
        color: "bg-amber-500",
    },
];

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <div className="space-y-8">
            {/* Value Proposition Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 font-playfair">
                    Welcome back, {user?.name?.split(' ')[0]}
                </h1>
                <p className="text-gray-500 text-sm mt-1">Here's what's happening with your store today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.name} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                                    <Icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                                </div>
                                <span className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${stat.trend === 'up' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                    }`}>
                                    {stat.change}
                                    {stat.trend === 'up' && <ArrowUpRight size={14} className="ml-1" />}
                                </span>
                            </div>
                            <h3 className="text-gray-500 text-sm font-medium">{stat.name}</h3>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Recent Activity Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6 min-h-[400px]">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900">Revenue Analytics</h2>
                        <select className="bg-gray-50 border-none text-sm rounded-lg focus:ring-0 cursor-pointer">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                            <option>This Year</option>
                        </select>
                    </div>
                    <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        Chart Visualization Placeholder
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Orders</h2>
                    <div className="space-y-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs">
                                    #{1000 + i}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">New Order</p>
                                    <p className="text-xs text-gray-500">2 minutes ago</p>
                                </div>
                                <span className="text-sm font-semibold text-emerald-600">+৳5,400</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
