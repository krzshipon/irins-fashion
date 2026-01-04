"use client";

import { useEffect, useState } from "react";
import { User, Package, MapPin, Loader2 } from "lucide-react";
import { authService } from "@/services/api/auth.service";
import { orderService } from "@/services/api/order.service";
import type { User as UserType, Order } from "@/services/api/types";
import Link from "next/link";
import styles from "../pages.module.css";

export default function OverviewPage() {
    const [user, setUser] = useState<UserType | null>(null);
    const [recentOrder, setRecentOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [userData, orders] = await Promise.all([
                    authService.getProfile(),
                    orderService.getOrders()
                ]);
                setUser(userData);
                setRecentOrder(orders[0] || null);
            } catch (error) {
                console.error("Failed to load profile data", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return (
            <div className={styles.loading}>
                <Loader2 className={styles.loadingIcon} size={32} />
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <h1 className={styles.pageTitle}>Overview</h1>

            <div className={styles.grid}>
                {/* Profile Card */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>
                            <User size={18} className={styles.cardIcon} />
                            Profile Details
                        </h2>
                        <button className={styles.cardAction}>Edit</button>
                    </div>
                    <div className={styles.cardContent}>
                        <p><span className={styles.cardContentLabel}>Name:</span> {user?.name}</p>
                        <p><span className={styles.cardContentLabel}>Mobile:</span> {user?.mobile}</p>
                        <p><span className={styles.cardContentLabel}>Email:</span> {user?.email || 'N/A'}</p>
                    </div>
                </div>

                {/* Address Preview */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>
                            <MapPin size={18} className={styles.cardIcon} />
                            Default Address
                        </h2>
                        <Link href="/account/addresses" className={styles.cardAction}>Manage</Link>
                    </div>
                    <div className={styles.cardContent}>
                        <p className={styles.addressTitle}>Home</p>
                        <p>House 12, Road 5, Block A</p>
                        <p>Dhaka - 1209</p>
                    </div>
                </div>
            </div>

            {/* Recent Order */}
            <div className={styles.orderCard}>
                <div className={styles.orderHeader}>
                    <h2 className={styles.cardTitle}>
                        <Package size={18} className={styles.cardIcon} />
                        Recent Order
                    </h2>
                    <Link href="/account/orders" className={styles.cardAction}>View All</Link>
                </div>

                {recentOrder ? (
                    <div className={styles.orderBody}>
                        <div className={styles.orderMetaRow}>
                            <div className={styles.orderInfo}>
                                <p className={styles.orderId}>{recentOrder.id}</p>
                                <p className={styles.orderDate}>
                                    Placed on {new Date(recentOrder.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <span className={styles.statusBadge}>{recentOrder.status}</span>
                        </div>
                        <div className={styles.orderItems}>
                            {recentOrder.items.map((item) => (
                                <div key={item.id} className={styles.orderItem}>
                                    <img src={item.productImage} alt={item.productName} className={styles.orderItemImage} />
                                    <span className={styles.orderItemQty}>x{item.quantity}</span>
                                </div>
                            ))}
                        </div>
                        <div className={styles.orderFooter}>
                            <p className={styles.orderTotal}>Total: ৳{recentOrder.total.toLocaleString()}</p>
                            <button className={styles.trackBtn}>Track Order</button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.emptyState}>No orders found.</div>
                )}
            </div>
        </div>
    );
}
