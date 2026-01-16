"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, ArrowRight, Truck, CheckCircle2, Clock, XCircle } from "lucide-react";
import { orderService } from "@/services/api/order.service";
import type { Order } from "@/services/api/types";
import styles from "./orders.module.css";
import { useLocalization } from "@/context/LocalizationContext";
import Skeleton from "@/components/common/Skeleton";

type TabStatus = 'all' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export default function OrdersPage() {
    const { dictionary: t } = useLocalization();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabStatus>('all');

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

    const filteredOrders = activeTab === 'all'
        ? orders
        : orders.filter(order => order.status.toLowerCase() === activeTab);

    const tabs = [
        { id: 'all', label: 'All Orders' },
        { id: 'processing', label: 'Processing' },
        { id: 'shipped', label: 'On The Way' },
        { id: 'delivered', label: 'Completed' },
        { id: 'cancelled', label: 'Cancelled' },
    ];

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'processing': return <Clock size={14} />;
            case 'confirmed': return <CheckCircle2 size={14} />;
            case 'shipped': return <Truck size={14} />;
            case 'delivered': return <Package size={14} />;
            case 'cancelled': return <XCircle size={14} />;
            default: return <Clock size={14} />;
        }
    };

    if (loading) {
        return (
            <div className={styles.page}>
                <div className={styles.header}>
                    <Skeleton width={180} height={36} style={{ marginBottom: '8px' }} />
                    <Skeleton width={250} height={20} />
                </div>

                <div className={styles.tabs} style={{ marginBottom: '24px' }}>
                    {[1, 2, 3, 4, 5].map(i => (
                        <Skeleton key={i} width={100} height={40} borderRadius={20} style={{ marginRight: '12px' }} />
                    ))}
                </div>

                <div className={styles.list}>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div>
                                    <Skeleton width={120} height={20} style={{ marginBottom: '4px' }} />
                                    <Skeleton width={180} height={16} />
                                </div>
                                <Skeleton width={100} height={24} borderRadius={12} />
                            </div>
                            <div className={styles.cardBody}>
                                <div className={styles.items} style={{ display: 'flex', gap: '12px' }}>
                                    <Skeleton width={70} height={70} borderRadius={8} />
                                    <Skeleton width={70} height={70} borderRadius={8} />
                                    <Skeleton width={70} height={70} borderRadius={8} />
                                </div>
                                <div className={styles.summary} style={{ marginTop: '16px' }}>
                                    <div>
                                        <Skeleton width={100} height={14} style={{ marginBottom: '4px' }} />
                                        <Skeleton width={80} height={20} />
                                    </div>
                                    <Skeleton width={140} height={40} borderRadius={8} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>My Orders</h1>
                <p className={styles.subtitle}>Track and manage your recent purchases</p>
            </div>

            {/* Status Tabs */}
            <div className={styles.tabs}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabStatus)}
                        className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {filteredOrders.length === 0 ? (
                <div className={styles.empty}>
                    <Package size={48} className={styles.emptyIcon} />
                    <p className={styles.emptyText}>No {activeTab !== 'all' ? activeTab : ''} orders found.</p>
                </div>
            ) : (
                <div className={styles.list}>
                    {filteredOrders.map((order) => (
                        <div key={order.id} className={styles.card}>
                            {/* Card Header */}
                            <div className={styles.cardHeader}>
                                <div>
                                    <div className={styles.orderId}>Order #{order.id}</div>
                                    <div className={styles.orderDate}>
                                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </div>
                                </div>
                                <div className={`${styles.badge} ${styles[order.status.toLowerCase()] || styles.processing}`}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        {getStatusIcon(order.status)}
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className={styles.cardBody}>
                                {/* Items Horizontal Scroll */}
                                <div className={styles.items}>
                                    {order.items.map((item) => (
                                        <div key={item.id} style={{ position: 'relative', width: '70px', height: '70px', flexShrink: 0 }}>
                                            <Image
                                                src={item.productImage || "/images/placeholder-product.png"}
                                                alt={item.productName}
                                                className={styles.itemImage}
                                                title={`${item.productName} x${item.quantity}`}
                                                fill
                                                sizes="70px"
                                            />
                                        </div>
                                    ))}
                                    {order.items.length > 5 && (
                                        <div style={{
                                            width: '70px',
                                            height: '70px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: '#f9fafb',
                                            borderRadius: '8px',
                                            border: '1px solid #e5e5e5',
                                            color: '#6b7280',
                                            fontSize: '14px',
                                            fontWeight: '600'
                                        }}>
                                            +{order.items.length - 5}
                                        </div>
                                    )}
                                </div>

                                {/* Footer Summary */}
                                <div className={styles.summary}>
                                    <div>
                                        <p className={styles.totalLabel}>Total Amount</p>
                                        <p className={styles.totalAmount}>৳{order.total.toLocaleString()}</p>
                                    </div>
                                    <Link href={`/orders/${order.id}`} className={styles.button}>
                                        View Order Details
                                        <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
