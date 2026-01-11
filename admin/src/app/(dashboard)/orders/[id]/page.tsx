"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
    ChevronLeft,
    Printer,
    Download,
    CheckCircle,
    Clock,
    AlertCircle,
    MapPin,
    Phone,
    Calendar,
    CreditCard,
    Package,
    Truck,
    XCircle,
} from "lucide-react";
import { useDialog } from "@/components/Dialog";
import { ordersService, AdminOrder } from "@/services/orders.service";

const ORDER_STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

const STATUS_LABELS: Record<string, string> = {
    PENDING: "Pending",
    PROCESSING: "Processing",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
};

const STATUS_ICONS: Record<string, React.ElementType> = {
    PENDING: Clock,
    PROCESSING: Package,
    SHIPPED: Truck,
    DELIVERED: CheckCircle,
    CANCELLED: XCircle,
};

export default function OrderDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;
    const { showConfirm, showSuccess, showLoading, showError } = useDialog();
    const [order, setOrder] = useState<AdminOrder | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const data = await ordersService.getOne(id as string);
            setOrder(data);
        } catch (error) {
            console.error('Failed to fetch order:', error);
            showError("Error", "Failed to fetch order details");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = (newStatus: string) => {
        if (!order || newStatus === order.status) return;

        showConfirm(
            "Update Order Status",
            `Are you sure you want to change the status to ${STATUS_LABELS[newStatus]}?`,
            async () => {
                showLoading("Updating Order", "Please wait...");
                try {
                    await ordersService.updateStatus(order.id, newStatus);
                    setOrder(prev => prev ? { ...prev, status: newStatus } : null);
                    showSuccess("Status Updated", `Order status has been updated to ${STATUS_LABELS[newStatus]}.`);
                } catch (error) {
                    showError("Error", "Failed to update order status");
                }
            }
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "DELIVERED": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
            case "SHIPPED": return "text-purple-400 bg-purple-500/10 border-purple-500/20";
            case "PROCESSING": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
            case "CANCELLED": return "text-red-400 bg-red-500/10 border-red-500/20";
            default: return "text-amber-400 bg-amber-500/10 border-amber-500/20";
        }
    };

    // Generate timeline from status
    const generateTimeline = (order: AdminOrder) => {
        const statusOrder = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];
        const currentIndex = statusOrder.indexOf(order.status);
        const orderDate = new Date(order.createdAt);

        if (order.status === "CANCELLED") {
            return [
                { status: "Order Placed", date: orderDate.toLocaleString(), completed: true },
                { status: "Cancelled", date: "Order was cancelled", completed: true },
            ];
        }

        return [
            { status: "Order Placed", date: orderDate.toLocaleString(), completed: currentIndex >= 0 },
            { status: "Processing", date: currentIndex >= 1 ? new Date(orderDate.getTime() + 3600000).toLocaleString() : "Pending", completed: currentIndex >= 1 },
            { status: "Shipped", date: currentIndex >= 2 ? new Date(orderDate.getTime() + 86400000).toLocaleString() : "Pending", completed: currentIndex >= 2 },
            { status: "Delivered", date: currentIndex >= 3 ? new Date(orderDate.getTime() + 86400000 * 3).toLocaleString() : "Pending", completed: currentIndex >= 3 },
        ];
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-20 text-gray-400">Order not found</div>
        );
    }

    const timeline = generateTimeline(order);
    const shipping = order.shippingAddressSnapshot;
    const StatusIcon = STATUS_ICONS[order.status] || Clock;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold text-white font-playfair">Order {order.id}</h1>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                <StatusIcon size={12} />
                                {STATUS_LABELS[order.status]}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                            <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock size={14} />
                                {new Date(order.createdAt).toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors text-sm font-medium">
                        <Printer size={16} />
                        Print
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors text-sm font-medium">
                        <Download size={16} />
                        Invoice
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Order Items & Timeline */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
                        <div className="p-6 border-b border-white/10">
                            <h3 className="font-bold text-white">Order Items ({order.items.length})</h3>
                        </div>
                        <div className="divide-y divide-white/5">
                            {order.items.map((item) => (
                                <div key={item.id} className="p-6 flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gray-700/50 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                                        {item.productImage ? (
                                            <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                                        ) : (
                                            <Package className="w-8 h-8 text-gray-500" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-white">{item.productName}</h4>
                                        {item.variantSnapshot && (
                                            <p className="text-sm text-gray-500">
                                                {item.variantSnapshot.size} / {item.variantSnapshot.color}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white font-medium">৳{item.price.toLocaleString()} × {item.quantity}</p>
                                        <p className="text-emerald-400 font-bold">৳{(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 bg-black/20">
                            <div className="space-y-2 max-w-xs ml-auto">
                                <div className="flex justify-between text-gray-400 text-sm">
                                    <span>Subtotal</span>
                                    <span>৳{order.subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-400 text-sm">
                                    <span>Shipping</span>
                                    <span>৳{order.shippingCost.toLocaleString()}</span>
                                </div>
                                {order.discount > 0 && (
                                    <div className="flex justify-between text-green-400 text-sm">
                                        <span>Discount</span>
                                        <span>-৳{order.discount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-white font-bold pt-2 border-t border-white/10 text-lg">
                                    <span>Total</span>
                                    <span>৳{order.total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                        <h3 className="font-bold text-white mb-6">Order History</h3>
                        <div className="space-y-6 relative before:absolute before:left-3.5 before:top-2 before:h-full before:w-[2px] before:bg-white/10">
                            {timeline.map((event, idx) => (
                                <div key={idx} className="relative flex items-start gap-4">
                                    <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center border-2 ${event.completed
                                        ? "bg-emerald-500 border-emerald-500 text-white"
                                        : "bg-gray-800 border-gray-600 text-gray-500"
                                        }`}>
                                        <CheckCircle size={14} />
                                    </div>
                                    <div>
                                        <p className={`font-medium ${event.completed ? "text-white" : "text-gray-500"}`}>
                                            {event.status}
                                        </p>
                                        <p className="text-sm text-gray-500">{event.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Status & Customer Info */}
                <div className="space-y-6">
                    {/* Status Update */}
                    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                        <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Update Status</h3>
                        <div className="space-y-3">
                            <label className="block text-xs text-gray-500">Change Status</label>
                            <div className="relative">
                                <select
                                    value={order.status}
                                    onChange={(e) => handleStatusUpdate(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white appearance-none focus:outline-none focus:border-emerald-500/50"
                                >
                                    {ORDER_STATUSES.map(status => (
                                        <option key={status} value={status}>{STATUS_LABELS[status]}</option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                    <AlertCircle size={16} />
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Customer will be notified upon status change.
                            </p>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                        <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Customer</h3>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                                {shipping?.fullName?.[0] || 'G'}
                            </div>
                            <div>
                                <h4 className="text-white font-medium text-sm">{shipping?.fullName || 'Guest'}</h4>
                                <p className="text-xs text-gray-500">{order.user ? 'Registered Customer' : 'Guest Order'}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Phone size={16} className="text-gray-500 mt-0.5" />
                                <span className="text-sm text-gray-300">{shipping?.phone || '-'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                        <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Delivery</h3>
                        <div className="flex items-start gap-3 mb-4">
                            <MapPin size={16} className="text-gray-500 mt-0.5" />
                            <div className="text-sm text-gray-300">
                                <p>{shipping?.address || '-'}</p>
                                <p>{shipping?.division || '-'}</p>
                                {shipping?.notes && (
                                    <p className="text-gray-500 mt-2 text-xs">Note: {shipping.notes}</p>
                                )}
                            </div>
                        </div>
                        <div className="pt-4 border-t border-white/10">
                            <h4 className="text-xs text-gray-500 mb-2">Payment Info</h4>
                            <div className="flex items-center gap-2">
                                <CreditCard size={16} className="text-gray-400" />
                                <span className="text-sm text-white font-medium uppercase">{order.paymentMethod}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
