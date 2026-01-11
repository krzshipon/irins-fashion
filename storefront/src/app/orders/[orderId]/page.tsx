"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useLocalization } from '@/context/LocalizationContext';
import { useAuth } from '@/context/AuthContext';
import { orderService } from '@/services/api/order.service';

type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

interface OrderItem {
    id: string;
    productId: string;
    productName: string;
    productImage: string;
    price: number;
    quantity: number;
    variant?: { color?: string; size?: string };
}

interface Order {
    id: string;
    userId?: string;
    status: OrderStatus;
    createdAt: string;
    items: OrderItem[];
    subtotal: number;
    shippingCost: number;
    total: number;
    discount?: number;
    shippingAddress: {
        id: string;
        label: string;
        recipientName: string;
        address: string;
        division: string;
        phone: string;
        isDefault: boolean;
    };
}

const OrderDetailsPage = () => {
    const params = useParams();
    const orderId = params?.orderId as string;
    const { dictionary: t } = useLocalization();
    const { user, loading: authLoading } = useAuth();
    const [copied, setCopied] = useState(false);
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch order from API
    useEffect(() => {
        if (!orderId) return;

        const fetchOrder = async () => {
            try {
                setLoading(true);
                const fetchedOrder = await orderService.getOrderById(orderId);
                if (fetchedOrder) {
                    setOrder(fetchedOrder as unknown as Order);
                } else {
                    setError('Order not found');
                }
            } catch (err) {
                console.error('Failed to fetch order:', err);
                setError('Failed to load order');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    // Map backend status to display status
    const mapStatus = (status: string): OrderStatus => {
        const statusMap: Record<string, OrderStatus> = {
            'PENDING': 'PENDING',
            'PROCESSING': 'PROCESSING',
            'SHIPPED': 'SHIPPED',
            'DELIVERED': 'DELIVERED',
            'CANCELLED': 'CANCELLED',
        };
        return statusMap[status] || 'PENDING';
    };

    const getStatusConfig = (status: OrderStatus) => {
        const configs: Record<OrderStatus, { label: string; color: string; bgColor: string }> = {
            PENDING: { label: t.orders.status.processing, color: '#92400e', bgColor: '#fef3c7' },
            PROCESSING: { label: t.orders.status.confirmed, color: '#1e40af', bgColor: '#dbeafe' },
            SHIPPED: { label: t.orders.status.shipped, color: '#7c3aed', bgColor: '#ede9fe' },
            DELIVERED: { label: t.orders.status.delivered, color: '#065f46', bgColor: '#d1fae5' },
            CANCELLED: { label: t.orders.status.cancelled, color: '#991b1b', bgColor: '#fee2e2' },
        };
        return configs[status] || configs.PENDING;
    };

    const handleCopyOrderId = async () => {
        try {
            await navigator.clipboard.writeText(orderId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Show loading while fetching
    if (loading || authLoading) {
        return (
            <div style={{
                backgroundColor: '#f9fafb',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        border: '3px solid #e5e5e5',
                        borderTopColor: '#1b4d3e',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 16px',
                    }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>{t.common.loading}</p>
                </div>
            </div>
        );
    }

    // Show error or not found
    if (error || !order) {
        return (
            <div style={{
                backgroundColor: '#f9fafb',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
            }}>
                <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '20px',
                    border: '2px solid #e5e5e5',
                    padding: '48px',
                    textAlign: 'center',
                    maxWidth: '400px',
                }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        backgroundColor: '#fef2f2',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                    }}>
                        <svg style={{ width: '32px', height: '32px', color: '#dc2626' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111', marginBottom: '8px' }}>
                        {t.orders.accessDenied || 'Order Not Found'}
                    </h2>
                    <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px', lineHeight: '1.5' }}>
                        {error || 'Could not find this order. Please check your order ID.'}
                    </p>
                    <Link href="/" style={{
                        display: 'block',
                        padding: '14px 24px',
                        backgroundColor: '#111',
                        color: '#fff',
                        textDecoration: 'none',
                        borderRadius: '10px',
                        fontWeight: '600',
                        fontSize: '14px',
                    }}>
                        {t.common.backToHome}
                    </Link>
                </div>
            </div>
        );
    }

    const statusConfig = getStatusConfig(mapStatus(order.status));

    return (
        <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>
                {/* Back Link */}
                <Link href="/" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#6b7280',
                    textDecoration: 'none',
                    fontSize: '14px',
                    marginBottom: '24px',
                }}>
                    <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    {t.common.backToHome}
                </Link>

                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '32px',
                    flexWrap: 'wrap',
                    gap: '16px',
                }}>
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111', marginBottom: '8px' }}>
                            {t.orders.orderDetails}
                        </h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '16px', color: '#6b7280' }}>{t.orders.orderNumber}</span>
                            <span style={{ fontSize: '18px', fontWeight: '700', color: '#111', fontFamily: 'monospace' }}>#{orderId}</span>
                            <button
                                onClick={handleCopyOrderId}
                                title={copied ? t.checkout.success.copied : t.checkout.success.copyOrderId}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '28px',
                                    height: '28px',
                                    backgroundColor: copied ? '#10b981' : '#fff',
                                    color: copied ? '#fff' : '#6b7280',
                                    border: `1px solid ${copied ? '#10b981' : '#d1d5db'}`,
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                }}
                            >
                                {copied ? (
                                    <svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg style={{ width: '14px', height: '14px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '8px' }}>
                            {t.orders.placedOn} {formatDate(order.createdAt)}
                        </p>
                    </div>
                    <div style={{
                        backgroundColor: statusConfig.bgColor,
                        color: statusConfig.color,
                        padding: '10px 20px',
                        borderRadius: '24px',
                        fontSize: '14px',
                        fontWeight: '700',
                    }}>
                        {statusConfig.label}
                    </div>
                </div>

                {/* Order Tracking Timeline */}
                <div style={{
                    backgroundColor: '#fff',
                    borderRadius: '16px',
                    border: '2px solid #e5e5e5',
                    padding: '24px',
                    marginBottom: '24px',
                }}>
                    <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#111', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg style={{ width: '20px', height: '20px', color: '#1b4d3e' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {t.orders.trackOrder || 'Track Your Order'}
                    </h2>

                    {/* Progress Steps */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '16px' }}>
                        {/* Progress Line */}
                        <div style={{
                            position: 'absolute',
                            top: '20px',
                            left: '40px',
                            right: '40px',
                            height: '4px',
                            backgroundColor: '#e5e5e5',
                            zIndex: 0,
                        }} />
                        <div style={{
                            position: 'absolute',
                            top: '20px',
                            left: '40px',
                            width: order.status === 'PENDING' ? '0%'
                                : order.status === 'PROCESSING' ? '33%'
                                    : order.status === 'SHIPPED' ? '66%'
                                        : order.status === 'DELIVERED' ? 'calc(100% - 80px)'
                                            : '0%',
                            height: '4px',
                            backgroundColor: '#1b4d3e',
                            zIndex: 1,
                            transition: 'width 0.5s ease',
                        }} />

                        {/* Step 1 - Order Placed */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: '#1b4d3e',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '8px',
                            }}>
                                <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: '600', color: '#1b4d3e' }}>{t.orders.status.orderPlaced || 'Placed'}</span>
                        </div>

                        {/* Step 2 - Confirmed */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status) ? '#1b4d3e' : '#e5e5e5',
                                color: ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status) ? '#fff' : '#9ca3af',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '8px',
                            }}>
                                {['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status) ? (
                                    <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <span style={{ fontSize: '14px', fontWeight: '700' }}>2</span>
                                )}
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: '600', color: ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status) ? '#1b4d3e' : '#9ca3af' }}>
                                {t.orders.status.confirmed}
                            </span>
                        </div>

                        {/* Step 3 - Shipped */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: ['SHIPPED', 'DELIVERED'].includes(order.status) ? '#1b4d3e' : '#e5e5e5',
                                color: ['SHIPPED', 'DELIVERED'].includes(order.status) ? '#fff' : '#9ca3af',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '8px',
                            }}>
                                {['SHIPPED', 'DELIVERED'].includes(order.status) ? (
                                    <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <span style={{ fontSize: '14px', fontWeight: '700' }}>3</span>
                                )}
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: '600', color: ['SHIPPED', 'DELIVERED'].includes(order.status) ? '#1b4d3e' : '#9ca3af' }}>
                                {t.orders.status.shipped}
                            </span>
                        </div>

                        {/* Step 4 - Delivered */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: order.status === 'DELIVERED' ? '#1b4d3e' : '#e5e5e5',
                                color: order.status === 'DELIVERED' ? '#fff' : '#9ca3af',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '8px',
                            }}>
                                {order.status === 'DELIVERED' ? (
                                    <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <span style={{ fontSize: '14px', fontWeight: '700' }}>4</span>
                                )}
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: '600', color: order.status === 'DELIVERED' ? '#1b4d3e' : '#9ca3af' }}>
                                {t.orders.status.delivered}
                            </span>
                        </div>
                    </div>

                    {/* Current Status Description */}
                    <div style={{
                        marginTop: '20px',
                        padding: '16px',
                        backgroundColor: statusConfig.bgColor,
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                    }}>
                        <svg style={{ width: '24px', height: '24px', color: statusConfig.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <span style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: statusConfig.color }}>
                                {statusConfig.label}
                            </span>
                            <span style={{ fontSize: '13px', color: '#6b7280' }}>
                                {order.status === 'PENDING' && (t.orders.statusDesc?.processing || 'Your order is being prepared for shipment')}
                                {order.status === 'PROCESSING' && (t.orders.statusDesc?.confirmed || 'Order confirmed and ready to ship')}
                                {order.status === 'SHIPPED' && (t.orders.statusDesc?.shipped || 'Your order is on its way to you')}
                                {order.status === 'DELIVERED' && (t.orders.statusDesc?.delivered || 'Your order has been delivered successfully')}
                                {order.status === 'CANCELLED' && (t.orders.statusDesc?.cancelled || 'This order has been cancelled')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div style={{ display: 'grid', gap: '24px' }} className="lg:!grid-cols-[1fr_380px]">
                    {/* Left Column - Order Items */}
                    <div>
                        {/* Items Card */}
                        <div style={{
                            backgroundColor: '#fff',
                            borderRadius: '16px',
                            border: '2px solid #e5e5e5',
                            overflow: 'hidden',
                            marginBottom: '24px',
                        }}>
                            <div style={{
                                padding: '20px 24px',
                                borderBottom: '2px solid #e5e5e5',
                                backgroundColor: '#f9fafb',
                            }}>
                                <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#111' }}>
                                    {t.orders.items} ({order.items.length})
                                </h2>
                            </div>
                            <div style={{ padding: '24px' }}>
                                {order.items.map((item, index) => (
                                    <div key={item.id} style={{
                                        display: 'flex',
                                        gap: '20px',
                                        paddingBottom: index < order.items.length - 1 ? '20px' : 0,
                                        marginBottom: index < order.items.length - 1 ? '20px' : 0,
                                        borderBottom: index < order.items.length - 1 ? '1px solid #e5e5e5' : 'none',
                                    }}>
                                        <div style={{
                                            position: 'relative',
                                            width: '100px',
                                            height: '120px',
                                            borderRadius: '10px',
                                            overflow: 'hidden',
                                            border: '1px solid #e5e5e5',
                                            backgroundColor: '#f5f5f5',
                                            flexShrink: 0,
                                        }}>
                                            <Image
                                                src={item.productImage || '/images/placeholder.png'}
                                                alt={item.productName}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                            />
                                            <div style={{
                                                position: 'absolute',
                                                top: '-4px',
                                                right: '-4px',
                                                width: '24px',
                                                height: '24px',
                                                backgroundColor: '#111',
                                                color: '#fff',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '11px',
                                                fontWeight: '700',
                                                border: '2px solid #fff',
                                            }}>
                                                {item.quantity}
                                            </div>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111', marginBottom: '8px' }}>
                                                {item.productName}
                                            </h3>
                                            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                                                {item.variant?.size || '-'} / {item.variant?.color || '-'}
                                            </p>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontSize: '14px', color: '#9ca3af' }}>
                                                        ৳{item.price.toLocaleString()} × {item.quantity}
                                                    </span>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <span style={{ fontSize: '16px', fontWeight: '700', color: '#111', display: 'block' }}>
                                                        ৳{(item.price * item.quantity).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Address Card */}
                        <div style={{
                            backgroundColor: '#fff',
                            borderRadius: '16px',
                            border: '2px solid #e5e5e5',
                            overflow: 'hidden',
                        }}>
                            <div style={{
                                padding: '20px 24px',
                                borderBottom: '2px solid #e5e5e5',
                                backgroundColor: '#f9fafb',
                            }}>
                                <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#111' }}>
                                    {t.orders.shippingAddress}
                                </h2>
                            </div>
                            <div style={{ padding: '24px' }}>
                                <p style={{ fontSize: '16px', fontWeight: '600', color: '#111', marginBottom: '8px' }}>
                                    {order.shippingAddress.recipientName}
                                </p>
                                <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
                                    {order.shippingAddress.address}<br />
                                    {order.shippingAddress.division}
                                </p>
                                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e5e5' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                        <svg style={{ width: '16px', height: '16px', color: '#9ca3af' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <span style={{ fontSize: '14px', color: '#6b7280' }}>+88 {order.shippingAddress.phone}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div>
                        <div style={{
                            backgroundColor: '#fff',
                            borderRadius: '16px',
                            border: '2px solid #e5e5e5',
                            overflow: 'hidden',
                            position: 'sticky',
                            top: '24px',
                        }}>
                            <div style={{
                                padding: '20px 24px',
                                borderBottom: '2px solid #e5e5e5',
                                backgroundColor: '#f9fafb',
                            }}>
                                <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#111' }}>
                                    {t.orders.orderSummary}
                                </h2>
                            </div>
                            <div style={{ padding: '24px' }}>
                                <div style={{ marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <span style={{ fontSize: '14px', color: '#6b7280' }}>{t.orders.subtotal}</span>
                                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#111' }}>৳{order.subtotal.toLocaleString()}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <span style={{ fontSize: '14px', color: '#6b7280' }}>{t.orders.shipping}</span>
                                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#111' }}>৳{order.shippingCost}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '14px', color: '#6b7280' }}>{t.orders.deliveryZone}</span>
                                        <span style={{ fontSize: '13px', fontWeight: '500', color: '#6b7280' }}>
                                            {order.shippingAddress.division}
                                        </span>
                                    </div>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingTop: '20px',
                                    borderTop: '3px solid #111',
                                }}>
                                    <span style={{ fontSize: '16px', fontWeight: '700', color: '#111' }}>{t.orders.total}</span>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ fontSize: '24px', fontWeight: '800', color: '#111' }}>৳{order.total.toLocaleString()}</span>
                                        <span style={{ display: 'block', fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>BDT</span>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div style={{
                                    marginTop: '24px',
                                    padding: '16px',
                                    backgroundColor: '#f9fafb',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                }}>
                                    <svg style={{ width: '24px', height: '24px', color: '#6b7280' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                                    </svg>
                                    <div>
                                        <span style={{ display: 'block', fontSize: '12px', color: '#9ca3af' }}>{t.orders.paymentMethod}</span>
                                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#111' }}>{t.orders.cod}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Need Help Card */}
                        <div style={{
                            marginTop: '24px',
                            padding: '20px',
                            backgroundColor: '#fff',
                            borderRadius: '16px',
                            border: '2px solid #e5e5e5',
                            textAlign: 'center',
                        }}>
                            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                                {t.orders.needHelp}
                            </p>
                            <Link href="/contact" style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: '#111',
                                fontWeight: '600',
                                fontSize: '14px',
                                textDecoration: 'none',
                            }}>
                                {t.orders.contactSupport}
                                <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsPage;
