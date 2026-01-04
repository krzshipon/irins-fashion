"use client";

import React, { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLocalization } from '@/context/LocalizationContext';

const SuccessContent = () => {
    const searchParams = useSearchParams();
    const orderId = searchParams?.get('orderId');
    const { dictionary: t } = useLocalization();
    const [copied, setCopied] = useState(false);

    // Save orderId to localStorage for guest order access (7 day expiration)
    useEffect(() => {
        if (orderId && typeof window !== 'undefined') {
            const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
            const now = Date.now();

            // Get existing orders and filter out expired ones
            const guestOrders: { orderId: string; createdAt: number }[] =
                JSON.parse(localStorage.getItem('guestOrders') || '[]');

            const validOrders = guestOrders.filter(
                order => now - order.createdAt < SEVEN_DAYS_MS
            );

            // Add new order if not already present
            if (!validOrders.some(order => order.orderId === orderId)) {
                validOrders.push({ orderId, createdAt: now });
            }

            localStorage.setItem('guestOrders', JSON.stringify(validOrders));
        }
    }, [orderId]);

    const handleCopyOrderId = async () => {
        if (orderId) {
            try {
                await navigator.clipboard.writeText(orderId);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    };

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
            {/* Main Success Card */}
            <div style={{
                backgroundColor: '#fff',
                borderRadius: '20px',
                border: '2px solid #e5e5e5',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            }}>
                <div className="lg:!flex">
                    {/* Left Section - Green Success */}
                    <div style={{
                        backgroundColor: '#ecfdf5',
                        padding: '48px 40px',
                        textAlign: 'center',
                        borderBottom: '2px solid #d1fae5',
                    }} className="lg:!w-[420px] lg:!border-b-0 lg:!border-r-2 lg:!border-[#d1fae5] lg:!flex lg:!flex-col lg:!justify-center">
                        <div style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            backgroundColor: '#10b981',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
                        }}>
                            <svg style={{ width: '50px', height: '50px', color: '#fff' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#065f46', marginBottom: '12px' }}>
                            {t.checkout.success.title}
                        </h1>
                        <p style={{ fontSize: '16px', color: '#047857', maxWidth: '300px', margin: '0 auto', lineHeight: '1.5' }}>
                            {t.checkout.success.message}
                        </p>
                    </div>

                    {/* Right Section - Order Details */}
                    <div style={{ padding: '40px', flex: 1 }}>
                        {orderId && (
                            <div style={{
                                backgroundColor: '#f9fafb',
                                border: '2px solid #e5e5e5',
                                borderRadius: '14px',
                                padding: '24px',
                                marginBottom: '24px',
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div>
                                            <span style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
                                                {t.checkout.success.orderId}
                                            </span>
                                            <span style={{ fontSize: '24px', fontWeight: '800', color: '#111', fontFamily: 'monospace' }}>
                                                #{orderId}
                                            </span>
                                        </div>
                                        {/* Small Copy Button */}
                                        <button
                                            onClick={handleCopyOrderId}
                                            title={copied ? t.checkout.success.copied : t.checkout.success.copyOrderId}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                width: '32px',
                                                height: '32px',
                                                backgroundColor: copied ? '#10b981' : '#fff',
                                                color: copied ? '#fff' : '#6b7280',
                                                border: `1px solid ${copied ? '#10b981' : '#d1d5db'}`,
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                marginTop: '6px',
                                            }}
                                        >
                                            {copied ? (
                                                <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <svg style={{ width: '16px', height: '16px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    <div style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '8px 16px', borderRadius: '24px', fontSize: '12px', fontWeight: '700' }}>
                                        {t.orders.status.processing}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div style={{
                            backgroundColor: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            borderRadius: '12px',
                            padding: '18px',
                            marginBottom: '24px',
                            display: 'flex',
                            gap: '12px',
                            alignItems: 'flex-start',
                        }}>
                            <svg style={{ width: '20px', height: '20px', color: '#3b82f6', flexShrink: 0, marginTop: '2px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p style={{ fontSize: '14px', color: '#1e40af', lineHeight: '1.5' }}>
                                {t.checkout.success.confirmationSent}
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
                            <div style={{ backgroundColor: '#f9fafb', padding: '18px', borderRadius: '10px', border: '1px solid #e5e5e5' }}>
                                <span style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '6px' }}>{t.checkout.success.paymentMethod}</span>
                                <span style={{ fontSize: '15px', fontWeight: '600', color: '#111' }}>{t.orders.cod}</span>
                            </div>
                            <div style={{ backgroundColor: '#f9fafb', padding: '18px', borderRadius: '10px', border: '1px solid #e5e5e5' }}>
                                <span style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '6px' }}>{t.checkout.success.status}</span>
                                <span style={{ fontSize: '15px', fontWeight: '600', color: '#f59e0b' }}>{t.orders.status.processing}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Link
                                href={`/orders/${orderId}`}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    padding: '18px',
                                    backgroundColor: '#111',
                                    color: '#fff',
                                    textDecoration: 'none',
                                    fontSize: '14px',
                                    fontWeight: '700',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    borderRadius: '10px',
                                    textAlign: 'center'
                                }}
                            >
                                <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                {t.checkout.success.viewOrderDetails}
                            </Link>

                            <div style={{ display: 'flex', gap: '12px' }} className="!flex-col sm:!flex-row">
                                <Link href="/" style={{ flex: 1, display: 'block', padding: '16px', backgroundColor: '#fff', color: '#111', textDecoration: 'none', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', border: '2px solid #e5e5e5', borderRadius: '10px', textAlign: 'center' }}>
                                    {t.checkout.success.backToHome}
                                </Link>
                                <Link href="/collection/all" style={{ flex: 1, display: 'block', padding: '16px', backgroundColor: '#fff', color: '#111', textDecoration: 'none', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', border: '2px solid #e5e5e5', borderRadius: '10px', textAlign: 'center' }}>
                                    {t.checkout.success.continueShopping}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trust Badges */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9ca3af' }}>
                    <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                    <span style={{ fontSize: '12px' }}>{t.trust.secure}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9ca3af' }}>
                    <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                    </svg>
                    <span style={{ fontSize: '12px' }}>{t.trust.freeDelivery}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9ca3af' }}>
                    <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    <span style={{ fontSize: '12px' }}>{t.trust.easyReturns}</span>
                </div>
            </div>
        </div>
    );
};

const SuccessPage = () => {
    const { dictionary: t } = useLocalization();

    return (
        <div style={{ backgroundColor: '#f9fafb' }}>
            <Suspense fallback={<div style={{ padding: '100px', textAlign: 'center', color: '#9ca3af' }}>{t.common.loading}</div>}>
                <SuccessContent />
            </Suspense>
        </div>
    );
};

export default SuccessPage;
