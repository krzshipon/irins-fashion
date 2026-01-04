"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Loader2 } from "lucide-react";
import { orderService } from "@/services/api/order.service";
import type { Order } from "@/services/api/types";
import styles from "../pages.module.css";

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const data = await orderService.getOrders();
                setOrders(data);
            } catch (error) {
                console.error("Failed to load orders", error);
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
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
            <h1 className={styles.pageTitle}>My Orders</h1>

            {orders.length === 0 ? (
                <div className={styles.card}>
                    <div className={styles.emptyState}>
                        <Package size={48} className={styles.emptyIcon} />
                        <p>You haven&apos;t placed any orders yet.</p>
                    </div>
                </div>
            ) : (
                <div className={styles.orderList}>
                    {orders.map((order) => (
                        <div key={order.id} className={styles.orderCard}>
                            <div className={styles.orderHeader}>
                                <div className={styles.orderInfo}>
                                    <p className={styles.orderId}>{order.id}</p>
                                    <p className={styles.orderDate}>
                                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={styles.statusBadge}>{order.status}</span>
                            </div>
                            <div className={styles.orderBody}>
                                <div className={styles.orderItems}>
                                    {order.items.map((item) => (
                                        <div key={item.id} className={styles.orderItem}>
                                            <img src={item.productImage} alt={item.productName} className={styles.orderItemImage} />
                                            <span className={styles.orderItemQty}>x{item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.orderFooter}>
                                    <p className={styles.orderTotal}>Total: ৳{order.total.toLocaleString()}</p>
                                    <Link href={`/orders/${order.id}`} className={styles.trackBtn}>View Details</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
