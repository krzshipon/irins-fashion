"use client";

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLocalization } from '@/context/LocalizationContext';

const SuccessContent = () => {
    const searchParams = useSearchParams();
    const orderId = searchParams?.get('orderId');
    const { dictionary: t } = useLocalization();

    return (
        <div style={{
            maxWidth: '600px',
            margin: '0 auto',
            padding: '40px 24px',
        }}>
            {/* Main Success Card */}
            <div style={{
                backgroundColor: '#fff',
                borderRadius: '16px',
                border: '2px solid #e5e5e5',
                overflow: 'hidden',
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            }}>
                {/* Header Section - Green */}
                <div style={{
                    backgroundColor: '#ecfdf5',
                    padding: '40px 32px',
                    textAlign: 'center',
                    borderBottom: '2px solid #d1fae5',
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        backgroundColor: '#10b981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                    }}>
                        <svg
                            style={{ width: '40px', height: '40px', color: '#fff' }}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        color: '#065f46',
                        marginBottom: '8px',
                    }}>
                        {t.checkout.success.title}
                    </h1>
                    <p style={{
                        fontSize: '15px',
                        color: '#047857',
                    }}>
                        {t.checkout.success.message}
                    </p>
                </div>

                {/* Order Details Section */}
                <div style={{ padding: '32px' }}>
                    {/* Order ID */}
                    {orderId && (
                        <div style={{
                            backgroundColor: '#f9fafb',
                            border: '2px solid #e5e5e5',
                            borderRadius: '12px',
                            padding: '20px',
                            marginBottom: '24px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <div>
                                <span style={{
                                    display: 'block',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: '#9ca3af',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    marginBottom: '4px',
                                }}>
                                    {t.checkout.success.orderId}
                                </span>
                                <span style={{
                                    fontSize: '20px',
                                    fontWeight: '800',
                                    color: '#111',
                                    fontFamily: 'monospace',
                                }}>
                                    #{orderId}
                                </span>
                            </div>
                            <div style={{
                                backgroundColor: '#fef3c7',
                                color: '#92400e',
                                padding: '6px 12px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: '600',
                            }}>
                                Processing
                            </div>
                        </div>
                    )}

                    {/* Info Banner */}
                    <div style={{
                        backgroundColor: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        borderRadius: '10px',
                        padding: '16px',
                        marginBottom: '24px',
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'flex-start',
                    }}>
                        <svg style={{ width: '20px', height: '20px', color: '#3b82f6', flexShrink: 0, marginTop: '2px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <p style={{ fontSize: '14px', color: '#1e40af', fontWeight: '600', marginBottom: '4px' }}>
                                What happens next?
                            </p>
                            <p style={{ fontSize: '13px', color: '#3b82f6', lineHeight: '1.5' }}>
                                We&apos;ve sent a confirmation to your email. Our team will contact you shortly to confirm delivery details.
                            </p>
                        </div>
                    </div>

                    {/* Order Summary Quick View */}
                    <div style={{
                        borderTop: '1px solid #e5e5e5',
                        paddingTop: '24px',
                        marginBottom: '24px',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ fontSize: '14px', color: '#6b7280' }}>Payment Method</span>
                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#111' }}>Cash on Delivery</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '14px', color: '#6b7280' }}>Shipping</span>
                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#10b981' }}>FREE</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Link
                            href="/"
                            style={{
                                display: 'block',
                                padding: '16px',
                                backgroundColor: '#111',
                                color: '#fff',
                                textDecoration: 'none',
                                fontSize: '14px',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                borderRadius: '10px',
                                textAlign: 'center',
                            }}
                        >
                            {t.checkout.success.backToHome}
                        </Link>
                        <Link
                            href="/collection/all"
                            style={{
                                display: 'block',
                                padding: '16px',
                                backgroundColor: '#fff',
                                color: '#111',
                                textDecoration: 'none',
                                fontSize: '14px',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                border: '2px solid #e5e5e5',
                                borderRadius: '10px',
                                textAlign: 'center',
                            }}
                        >
                            {t.checkout.success.continueShopping}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Trust Badges Below Card */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '32px',
                marginTop: '32px',
                padding: '0 16px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9ca3af' }}>
                    <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                    <span style={{ fontSize: '12px' }}>Secure</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9ca3af' }}>
                    <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                    </svg>
                    <span style={{ fontSize: '12px' }}>Free Delivery</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9ca3af' }}>
                    <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    <span style={{ fontSize: '12px' }}>Easy Returns</span>
                </div>
            </div>
        </div>
    );
};

const SuccessPage = () => {
    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f9fafb',
            paddingTop: '40px',
            paddingBottom: '40px',
        }}>
            <Suspense fallback={
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                    color: '#9ca3af',
                }}>
                    Loading...
                </div>
            }>
                <SuccessContent />
            </Suspense>
        </div>
    );
};

export default SuccessPage;
