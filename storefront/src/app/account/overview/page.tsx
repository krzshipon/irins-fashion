"use client";

import { useEffect, useState } from "react";
import { User, Package, MapPin } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { orderService } from "@/services/api/order.service";
import { addressesService } from "@/services/api/addresses.service";
import type { Order } from "@/services/api/types";
import Link from "next/link";
import styles from "../pages.module.css";
import Skeleton from "@/components/common/Skeleton";

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
            <div className={styles.page}>
                <Skeleton width={150} height={32} style={{ marginBottom: '24px' }} />

                <div className={styles.grid}>
                    {/* Profile Card Skeleton */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <Skeleton width={120} height={24} />
                            <Skeleton width={40} height={20} />
                        </div>
                        <div className={styles.cardContent} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Skeleton width="80%" height={20} />
                            <Skeleton width="60%" height={20} />
                            <Skeleton width="70%" height={20} />
                        </div>
                    </div>

                    {/* Address Preview Skeleton */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <Skeleton width={140} height={24} />
                            <Skeleton width={60} height={20} />
                        </div>
                        <div className={styles.cardContent} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Skeleton width="50%" height={20} />
                            <Skeleton width="90%" height={40} />
                            <Skeleton width="40%" height={20} />
                        </div>
                    </div>
                </div>

                {/* Recent Order Skeleton */}
                <div className={styles.orderCard} style={{ marginTop: '24px' }}>
                    <div className={styles.orderHeader}>
                        <Skeleton width={130} height={24} />
                        <Skeleton width={70} height={20} />
                    </div>
                    <div className={styles.orderBody}>
                        <div className={styles.orderMetaRow}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <Skeleton width={100} height={20} />
                                <Skeleton width={150} height={16} />
                            </div>
                            <Skeleton width={80} height={24} borderRadius={12} />
                        </div>
                        <div className={styles.orderItems} style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} width={70} height={70} borderRadius={8} />
                            ))}
                        </div>
                        <div className={styles.orderFooter} style={{ marginTop: '16px', borderTop: '1px solid #eee', paddingTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
                            <Skeleton width={120} height={24} />
                            <Skeleton width={100} height={36} borderRadius={6} />
                        </div>
                    </div>
                </div>
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
