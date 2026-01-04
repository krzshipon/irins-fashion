"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Search,
    Filter,
    Eye,
    Package,
    ChevronLeft,
    ChevronRight,
    Clock,
    CheckCircle,
    Truck,
    XCircle,
} from "lucide-react";

// Mock data - will be replaced with API calls
const MOCK_ORDERS = [
    {
        id: "ORD-7829-XJ",
        customer: { name: "Fatima Ahmed", phone: "01712345678" },
        items: 3,
        total: 12600,
        status: "DELIVERED",
        createdAt: "2026-01-01T10:30:00Z",
    },
    {
        id: "ORD-9921-MC",
        customer: { name: "Aisha Rahman", phone: "01798765432" },
        items: 1,
        total: 4560,
        status: "PROCESSING",
        createdAt: "2026-01-04T14:15:00Z",
    },
    {
        id: "ORD-8845-KP",
        customer: { name: "Sara Khan", phone: "01655555555" },
        items: 2,
        total: 8900,
        status: "SHIPPED",
        createdAt: "2026-01-03T09:45:00Z",
    },
    {
        id: "ORD-6632-RT",
        customer: { name: "Maryam Ali", phone: "01877777777" },
        items: 4,
        total: 15200,
        status: "PENDING",
        createdAt: "2026-01-04T16:30:00Z",
    },
    {
        id: "ORD-5521-ZN",
        customer: { name: "Khadija Begum", phone: "01933333333" },
        items: 1,
        total: 3500,
        status: "CANCELLED",
        createdAt: "2026-01-02T11:20:00Z",
    },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    PENDING: { label: "Pending", color: "bg-amber-50 text-amber-700", icon: Clock },
    PROCESSING: { label: "Processing", color: "bg-blue-50 text-blue-700", icon: Package },
    SHIPPED: { label: "Shipped", color: "bg-purple-50 text-purple-700", icon: Truck },
    DELIVERED: { label: "Delivered", color: "bg-green-50 text-green-700", icon: CheckCircle },
    CANCELLED: { label: "Cancelled", color: "bg-red-50 text-red-700", icon: XCircle },
};

export default function OrdersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string>("");
    const [orders] = useState(MOCK_ORDERS);

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = !selectedStatus || order.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-playfair">Orders</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        View and manage customer orders ({orders.length} orders)
                    </p>
                </div>
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-2 flex-wrap">
                <button
                    onClick={() => setSelectedStatus("")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!selectedStatus
                        ? "bg-gray-900 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                        }`}
                >
                    All Orders
                </button>
                {Object.entries(STATUS_CONFIG).map(([status, config]) => {
                    const count = orders.filter(o => o.status === status).length;
                    return (
                        <button
                            key={status}
                            onClick={() => setSelectedStatus(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${selectedStatus === status
                                ? "bg-gray-900 text-white"
                                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                                }`}
                        >
                            {config.label}
                            <span className={`px-1.5 py-0.5 rounded text-xs ${selectedStatus === status ? "bg-white/20" : "bg-gray-100"}`}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Filters Bar */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex flex-wrap items-center gap-4">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by order ID or customer..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Order ID
                                </th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Items
                                </th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredOrders.map((order) => {
                                const statusConfig = STATUS_CONFIG[order.status];
                                const StatusIcon = statusConfig.icon;
                                return (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-mono font-semibold text-gray-900 text-sm">{order.id}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">{order.customer.name}</p>
                                                <p className="text-xs text-gray-500">{order.customer.phone}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-600">{order.items} items</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-semibold text-gray-900">৳{order.total.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                                                <StatusIcon size={14} />
                                                {statusConfig.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-600">{formatDate(order.createdAt)}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/orders/${order.id}`}
                                                    className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                >
                                                    <Eye size={16} />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredOrders.length}</span> of{" "}
                        <span className="font-medium">{orders.length}</span> orders
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50" disabled>
                            <ChevronLeft size={18} />
                        </button>
                        <button className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm font-medium">1</button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50" disabled>
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
