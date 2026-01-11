"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Search,
    Eye,
    Package,
    ChevronLeft,
    ChevronRight,
    Clock,
    CheckCircle,
    Truck,
    XCircle,
    RefreshCw,
} from "lucide-react";
import { ordersService, AdminOrder } from "@/services/orders.service";
import { useDialog } from "@/components/Dialog";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    PENDING: { label: "Pending", color: "bg-amber-500/10 text-amber-400", icon: Clock },
    PROCESSING: { label: "Processing", color: "bg-blue-500/10 text-blue-400", icon: Package },
    SHIPPED: { label: "Shipped", color: "bg-purple-500/10 text-purple-400", icon: Truck },
    DELIVERED: { label: "Delivered", color: "bg-green-500/10 text-green-400", icon: CheckCircle },
    CANCELLED: { label: "Cancelled", color: "bg-red-500/10 text-red-400", icon: XCircle },
};

export default function OrdersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string>("");
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);
    const [stats, setStats] = useState<Record<string, number>>({});
    const { showError } = useDialog();

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await ordersService.getAll({
                status: selectedStatus || undefined,
                search: searchQuery || undefined,
                page,
                limit: 20,
            });
            setOrders(data.orders);
            setTotalPages(data.totalPages);
            setTotalOrders(data.total);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            showError("Error", "Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const data = await ordersService.getStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
        fetchStats();
    }, [selectedStatus, page]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (page === 1) {
                fetchOrders();
            } else {
                setPage(1);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getCustomerInfo = (order: AdminOrder) => {
        if (order.user) {
            return {
                name: order.user.name || order.shippingAddressSnapshot?.fullName || 'Guest',
                phone: order.user.mobile || order.shippingAddressSnapshot?.phone || '-',
            };
        }
        return {
            name: order.shippingAddressSnapshot?.fullName || 'Guest',
            phone: order.shippingAddressSnapshot?.phone || '-',
        };
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white font-playfair">Orders</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        View and manage customer orders ({totalOrders} orders)
                    </p>
                </div>
                <button
                    onClick={() => { fetchOrders(); fetchStats(); }}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-gray-400 rounded-lg hover:bg-white/10 transition-colors text-sm"
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Status Tabs */}
            <div className="flex items-center gap-2 flex-wrap">
                <button
                    onClick={() => { setSelectedStatus(""); setPage(1); }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!selectedStatus
                        ? "bg-white text-gray-900"
                        : "bg-gray-800/50 text-gray-400 hover:bg-white/5 border border-white/10"
                        }`}
                >
                    All Orders
                </button>
                {Object.entries(STATUS_CONFIG).map(([status, config]) => {
                    const count = stats[status.toLowerCase()] || 0;
                    return (
                        <button
                            key={status}
                            onClick={() => { setSelectedStatus(status); setPage(1); }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${selectedStatus === status
                                ? "bg-white text-gray-900"
                                : "bg-gray-800/50 text-gray-400 hover:bg-white/5 border border-white/10"
                                }`}
                        >
                            {config.label}
                            <span className={`px-1.5 py-0.5 rounded text-xs ${selectedStatus === status ? "bg-gray-200" : "bg-white/10"}`}>
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
                            placeholder="Search by order ID or customer..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/30 focus:outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Orders Table */}
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
                                            Order ID
                                        </th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            Items
                                        </th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            Total
                                        </th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="text-right px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {orders.map((order) => {
                                        const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
                                        const StatusIcon = statusConfig.icon;
                                        const customer = getCustomerInfo(order);
                                        return (
                                            <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4">
                                                    <span className="font-mono font-semibold text-white text-sm">{order.id}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-medium text-white text-sm">{customer.name}</p>
                                                        <p className="text-xs text-gray-500">{customer.phone}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-400">{order.items?.length || 0} items</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-semibold text-white">৳{order.total.toLocaleString()}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                                                        <StatusIcon size={14} />
                                                        {statusConfig.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-400">{formatDate(order.createdAt)}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={`/orders/${order.id}`}
                                                            className="p-2 text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                                                        >
                                                            <Eye size={16} />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {orders.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                                No orders found.
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
                                <span className="font-medium text-white">{totalPages}</span> ({totalOrders} orders)
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
        </div>
    );
}
