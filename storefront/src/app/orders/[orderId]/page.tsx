"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useLocalization } from '@/context/LocalizationContext';
import { useAuth } from '@/context/AuthContext';

// Mock order data - in production this would come from API
const getMockOrder = (orderId: string) => ({
    id: orderId,
    userId: 'usr_guest', // For guest orders, this would be null or a guest user ID
    status: 'processing',
    createdAt: new Date().toISOString(),
    items: [
        {
            id: '1',
            cartItemId: '1',
            sku: 'abaya-1',
            currency: 'BDT',
            name: 'Elegant Abaya Collection',
            image: '/images/product-abaya.png',
            price: 4500,
            originalPrice: 5000,
            discount: { type: 'flat' as const, value: 500 },
            quantity: 2,
            selectedSize: 'M',
            selectedColor: 'Black',
            size: 'M',
            color: 'Black'
        },
        {
            id: '2',
            cartItemId: '2',
            sku: 'hijab-1',
            currency: 'BDT',
            name: 'Premium Hijab Set',
            image: '/images/products/hijab-navy.png',
            price: 1850,
            quantity: 1,
            selectedSize: 'One Size',
            selectedColor: 'Navy',
            size: 'One Size',
            color: 'Navy'
        },
    ],
    subtotal: 10850,
    shippingCost: 80,
    total: 10930,
    shippingDetails: {
        fullName: 'Fatima Ahmed',
        phone: '01712345678',
        email: 'fatima@example.com',
        address: '123 Gulshan Avenue',
        city: 'Dhaka',
        postalCode: '1212',
        deliveryZone: 'inside_dhaka' as const,
        notes: ''
    },
    paymentMethod: 'cod' as const,
});

type OrderStatus = 'processing' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

const OrderDetailsPage = () => {
    const params = useParams();
    const orderId = params?.orderId as string;
    const { dictionary: t } = useLocalization();
    const { user, loading: authLoading } = useAuth();
    const [copied, setCopied] = useState(false);
    const [hasAccess, setHasAccess] = useState<boolean | null>(null);

    // Check access on mount
    useEffect(() => {
        if (authLoading) return;

        const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
        const now = Date.now();

        // Get guest orders from localStorage and filter expired ones
        const guestOrders: { orderId: string; createdAt: number }[] = typeof window !== 'undefined'
            ? JSON.parse(localStorage.getItem('guestOrders') || '[]')
            : [];

        const validOrderIds = guestOrders
            .filter(order => now - order.createdAt < SEVEN_DAYS_MS)
            .map(order => order.orderId);

        // In production, you would fetch the order and check ownership
        // For now, we check:
        // 1. If user is logged in (they can see their orders)
        // 2. If orderId is in validOrderIds (guest who placed the order within 7 days)
        const canAccess = user !== null || validOrderIds.includes(orderId);

        setHasAccess(canAccess);
    }, [orderId, user, authLoading]);

    // In production, fetch order from API
    const order = getMockOrder(orderId);

    const getStatusConfig = (status: OrderStatus) => {
        const configs: Record<OrderStatus, { label: string; color: string; bgColor: string }> = {
            processing: { label: t.orders.status.processing, color: '#92400e', bgColor: '#fef3c7' },
            confirmed: { label: t.orders.status.confirmed, color: '#1e40af', bgColor: '#dbeafe' },
            shipped: { label: t.orders.status.shipped, color: '#7c3aed', bgColor: '#ede9fe' },
            delivered: { label: t.orders.status.delivered, color: '#065f46', bgColor: '#d1fae5' },
            cancelled: { label: t.orders.status.cancelled, color: '#991b1b', bgColor: '#fee2e2' },
        };
        return configs[status] || configs.processing;
    };

    const statusConfig = getStatusConfig(order.status as OrderStatus);

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

    // Show loading while checking auth
    if (authLoading || hasAccess === null) {
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

    // Show access denied if no access
    if (!hasAccess) {
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
                        {t.orders.accessDeniedDesc || 'You don\'t have permission to view this order. Please log in or check your order ID.'}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Link href="/login" style={{
                            display: 'block',
                            padding: '14px 24px',
                            backgroundColor: '#111',
                            color: '#fff',
                            textDecoration: 'none',
                            borderRadius: '10px',
                            fontWeight: '600',
                            fontSize: '14px',
                        }}>
                            {t.common.login || 'Log In'}
                        </Link>
                        <Link href="/" style={{
                            display: 'block',
                            padding: '14px 24px',
                            backgroundColor: '#fff',
                            color: '#111',
                            textDecoration: 'none',
                            borderRadius: '10px',
                            fontWeight: '600',
                            fontSize: '14px',
                            border: '2px solid #e5e5e5',
                        }}>
                            {t.common.backToHome}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

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
                            width: order.status === 'processing' ? '0%'
                                : order.status === 'confirmed' ? '33%'
                                    : order.status === 'shipped' ? '66%'
                                        : order.status === 'delivered' ? 'calc(100% - 80px)'
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
                                backgroundColor: ['confirmed', 'shipped', 'delivered'].includes(order.status) ? '#1b4d3e' : '#e5e5e5',
                                color: ['confirmed', 'shipped', 'delivered'].includes(order.status) ? '#fff' : '#9ca3af',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '8px',
                            }}>
                                {['confirmed', 'shipped', 'delivered'].includes(order.status) ? (
                                    <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <span style={{ fontSize: '14px', fontWeight: '700' }}>2</span>
                                )}
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: '600', color: ['confirmed', 'shipped', 'delivered'].includes(order.status) ? '#1b4d3e' : '#9ca3af' }}>
                                {t.orders.status.confirmed}
                            </span>
                        </div>

                        {/* Step 3 - Shipped */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: ['shipped', 'delivered'].includes(order.status) ? '#1b4d3e' : '#e5e5e5',
                                color: ['shipped', 'delivered'].includes(order.status) ? '#fff' : '#9ca3af',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '8px',
                            }}>
                                {['shipped', 'delivered'].includes(order.status) ? (
                                    <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <span style={{ fontSize: '14px', fontWeight: '700' }}>3</span>
                                )}
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: '600', color: ['shipped', 'delivered'].includes(order.status) ? '#1b4d3e' : '#9ca3af' }}>
                                {t.orders.status.shipped}
                            </span>
                        </div>

                        {/* Step 4 - Delivered */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: order.status === 'delivered' ? '#1b4d3e' : '#e5e5e5',
                                color: order.status === 'delivered' ? '#fff' : '#9ca3af',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '8px',
                            }}>
                                {order.status === 'delivered' ? (
                                    <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <span style={{ fontSize: '14px', fontWeight: '700' }}>4</span>
                                )}
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: '600', color: order.status === 'delivered' ? '#1b4d3e' : '#9ca3af' }}>
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
                                {order.status === 'processing' && (t.orders.statusDesc?.processing || 'Your order is being prepared for shipment')}
                                {order.status === 'confirmed' && (t.orders.statusDesc?.confirmed || 'Order confirmed and ready to ship')}
                                {order.status === 'shipped' && (t.orders.statusDesc?.shipped || 'Your order is on its way to you')}
                                {order.status === 'delivered' && (t.orders.statusDesc?.delivered || 'Your order has been delivered successfully')}
                                {order.status === 'cancelled' && (t.orders.statusDesc?.cancelled || 'This order has been cancelled')}
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
                                                src={item.image}
                                                alt={item.name}
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
                                                {item.name}
                                            </h3>
                                            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                                                {item.size} / {item.color}
                                            </p>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontSize: '14px', color: '#9ca3af' }}>
                                                        {item.originalPrice && item.originalPrice > item.price && (
                                                            <span style={{
                                                                textDecoration: 'line-through',
                                                                marginRight: '6px',
                                                                color: '#9ca3af',
                                                                fontSize: '0.9em'
                                                            }}>
                                                                ৳{item.originalPrice.toLocaleString()}
                                                            </span>
                                                        )}
                                                        ৳{item.price.toLocaleString()} × {item.quantity}
                                                    </span>
                                                    {item.discount && (
                                                        <span style={{
                                                            marginTop: '4px',
                                                            backgroundColor: '#fee2e2',
                                                            color: '#991b1b',
                                                            padding: '2px 6px',
                                                            borderRadius: '4px',
                                                            fontSize: '11px',
                                                            fontWeight: '600',
                                                            width: 'fit-content'
                                                        }}>
                                                            {item.discount.type === 'percentage'
                                                                ? `${item.discount.value}% OFF`
                                                                : `-৳ ${item.discount.value}`
                                                            }
                                                        </span>
                                                    )}
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <span style={{ fontSize: '16px', fontWeight: '700', color: '#111', display: 'block' }}>
                                                        ৳{(item.price * item.quantity).toLocaleString()}
                                                    </span>
                                                    {item.originalPrice && item.originalPrice > item.price && (
                                                        <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: '600' }}>
                                                            Save ৳ {((item.originalPrice - item.price) * item.quantity).toLocaleString()}
                                                        </span>
                                                    )}
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
                                    {order.shippingDetails.fullName}
                                </p>
                                <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
                                    {order.shippingDetails.address}<br />
                                    {order.shippingDetails.city}, {order.shippingDetails.postalCode}
                                </p>
                                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e5e5' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                        <svg style={{ width: '16px', height: '16px', color: '#9ca3af' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <span style={{ fontSize: '14px', color: '#6b7280' }}>+88 {order.shippingDetails.phone}</span>
                                    </div>
                                    {order.shippingDetails.email && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <svg style={{ width: '16px', height: '16px', color: '#9ca3af' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <span style={{ fontSize: '14px', color: '#6b7280' }}>{order.shippingDetails.email}</span>
                                        </div>
                                    )}
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
                                            {order.shippingDetails.deliveryZone === 'inside_dhaka' ? t.orders.insideDhaka : t.orders.outsideDhaka}
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
