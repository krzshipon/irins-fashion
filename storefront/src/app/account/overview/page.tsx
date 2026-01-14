"use client";

import { useEffect, useState } from "react";
import { User, Package, MapPin, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext"; // Import useAuth
import { orderService } from "@/services/api/order.service";
import { addressesService } from "@/services/api/addresses.service";
import type { Order } from "@/services/api/types";
import Link from "next/link";
import styles from "../pages.module.css";

export default function OverviewPage() {
    const { user, loading: authLoading } = useAuth();
    const [recentOrder, setRecentOrder] = useState<Order | null>(null);
    const [defaultAddress, setDefaultAddress] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [orders, addresses] = await Promise.all([
                    orderService.getOrders(),
                    addressesService.getAll()
                ]);
                setRecentOrder(orders[0] || null);
                const def = addresses.find((a: any) => a.isDefault) || addresses[0] || null;
                setDefaultAddress(def);
            } catch (error) {
                console.error("Failed to load overview data", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            loadData();
        } else if (!authLoading) {
            setLoading(false);
        }
    }, [user, authLoading]);

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
                        <Link href="/account/profile" className={styles.cardAction}>Edit</Link>
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
                        {defaultAddress ? (
                            <>
                                <p className={styles.addressTitle}>{defaultAddress.label}</p>
                                <p>{defaultAddress.address}</p>
                                <p>{defaultAddress.division}</p>
                                <p className="text-sm text-text-muted mt-1">{defaultAddress.phone}</p>
                            </>
                        ) : (
                            <p className="text-text-muted">No default address set.</p>
                        )}
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
                                    <img
                                        src={item.productImage || '/images/placeholder-product.png'}
                                        alt={item.productName}
                                        className={styles.orderItemImage}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/images/placeholder-product.png';
                                        }}
                                    />
                                    <span className={styles.orderItemQty}>x{item.quantity}</span>
                                </div>
                            ))}
                        </div>
                        <div className={styles.orderFooter}>
                            <p className={styles.orderTotal}>Total: ৳{recentOrder.total.toLocaleString()}</p>
                            <Link href={`/orders/${recentOrder.id}`} className={styles.trackBtn}>Track Order</Link>
                        </div>
                    </div>
                ) : (
                    <div className={styles.emptyState}>No orders found.</div>
                )}
            </div>
        </div>
    );
}
