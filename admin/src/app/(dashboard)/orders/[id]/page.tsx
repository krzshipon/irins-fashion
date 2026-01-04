"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ChevronLeft,
    Printer,
    Download,
    Truck,
    CheckCircle,
    Clock,
    AlertCircle,
    User,
    MapPin,
    Phone,
    Mail,
    Calendar,
    CreditCard,
    Package
} from "lucide-react";
import { useDialog } from "@/components/Dialog";

// Mock Data
const MOCK_ORDER = {
    id: "ORD-2024-001",
    date: "2024-03-20T10:30:00",
    status: "Processing",
    paymentStatus: "Paid",
    paymentMethod: "bKash",
    customer: {
        name: "Irin Sultana",
        email: "irin@example.com",
        phone: "+880 1711-223344",
        avatar: "I"
    },
    shippingAddress: {
        street: "House 12, Road 5, Sector 4",
        city: "Uttara",
        state: "Dhaka",
        zip: "1230",
        country: "Bangladesh"
    },
    items: [
        {
            id: "1",
            name: "Premium Silk Hijab - Midnight Blue",
            sku: "SKU-HJB-001",
            price: 1050,
            quantity: 2,
            image: "/images/hijab-blue.jpg"
        },
        {
            id: "2",
            name: "Classic Black Abaya",
            sku: "SKU-ABY-002",
            price: 4500,
            quantity: 1,
            image: "/images/abaya-black.jpg"
        }
    ],
    subtotal: 6600,
    shippingCost: 100,
    discount: 0,
    total: 6700,
    timeline: [
        { status: "Order Placed", date: "2024-03-20 10:30 AM", completed: true },
        { status: "Processing", date: "2024-03-20 11:00 AM", completed: true },
        { status: "Shipped", date: "Pending", completed: false },
        { status: "Delivered", date: "Pending", completed: false },
    ]
};

const ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function OrderDetailsPage() {
    const router = useRouter();
    const { showConfirm, showSuccess, showLoading } = useDialog();
    const [order, setOrder] = useState(MOCK_ORDER);

    const handleStatusUpdate = (newStatus: string) => {
        showConfirm(
            "Update Order Status",
            `Are you sure you want to change the status to ${newStatus}?`,
            async () => {
                showLoading("Updating Order", "Please wait...");
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                setOrder(prev => ({ ...prev, status: newStatus }));
                showSuccess("Status Updated", `Order status has been updated to ${newStatus}.`);
            }
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Delivered": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
            case "Shipped": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
            case "Processing": return "text-amber-400 bg-amber-500/10 border-amber-500/20";
            case "Cancelled": return "text-red-400 bg-red-500/10 border-red-500/20";
            default: return "text-gray-400 bg-gray-500/10 border-gray-500/20";
        }
    };

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
                            <h1 className="text-xl font-bold text-white font-playfair">Order #{order.id}</h1>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                {order.status}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                            <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {new Date(order.date).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock size={14} />
                                {new Date(order.date).toLocaleTimeString()}
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
                            <h3 className="font-bold text-white">Order Items</h3>
                        </div>
                        <div className="divide-y divide-white/5">
                            {order.items.map((item) => (
                                <div key={item.id} className="p-6 flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gray-700/50 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                                        <Package className="w-8 h-8 text-gray-500" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-white">{item.name}</h4>
                                        <p className="text-sm text-gray-500">{item.sku}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white font-medium">৳{item.price.toLocaleString()} x {item.quantity}</p>
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
                                <div className="flex justify-between text-gray-400 text-sm">
                                    <span>Discount</span>
                                    <span>-৳{order.discount.toLocaleString()}</span>
                                </div>
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
                            {order.timeline.map((event, idx) => (
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
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                    <AlertCircle size={16} />
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Customer will be notified via email upon status change.
                            </p>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                        <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Customer</h3>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                                {order.customer.avatar}
                            </div>
                            <div>
                                <h4 className="text-white font-medium text-sm">{order.customer.name}</h4>
                                <p className="text-xs text-gray-500">Customer since 2024</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Mail size={16} className="text-gray-500 mt-0.5" />
                                <span className="text-sm text-gray-300 break-all">{order.customer.email}</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone size={16} className="text-gray-500 mt-0.5" />
                                <span className="text-sm text-gray-300">{order.customer.phone}</span>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Delivery</h3>
                            <button className="text-emerald-400 text-xs hover:text-emerald-300">Edit</button>
                        </div>
                        <div className="flex items-start gap-3 mb-4">
                            <MapPin size={16} className="text-gray-500 mt-0.5" />
                            <div className="text-sm text-gray-300">
                                <p>{order.shippingAddress.street}</p>
                                <p>{order.shippingAddress.city} - {order.shippingAddress.zip}</p>
                                <p>{order.shippingAddress.state}, {order.shippingAddress.country}</p>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-white/10">
                            <h4 className="text-xs text-gray-500 mb-2">Payment Info</h4>
                            <div className="flex items-center gap-2">
                                <CreditCard size={16} className="text-gray-400" />
                                <span className="text-sm text-white font-medium">{order.paymentMethod}</span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-400 uppercase">
                                    {order.paymentStatus}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
