import React from 'react';
import { CartItem } from '@/context/CartContext';
import { useLocalization } from '@/context/LocalizationContext';
import Image from 'next/image';

interface OrderSummaryProps {
    items: CartItem[];
    subtotal: number;
    shippingCost: number;
    discount?: number;
    couponCode?: string;
    total: number;
    onPlaceOrder: () => void;
    isSubmitting: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ items, subtotal, shippingCost, discount, couponCode, total, onPlaceOrder, isSubmitting }) => {
    const { dictionary: t } = useLocalization();

    return (
        <div>
            {/* Header */}
            <h2 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#111',
                marginBottom: '24px',
                paddingBottom: '16px',
                borderBottom: '2px solid #e5e5e5',
            }}>
                Order Summary
            </h2>

            {/* Product Items */}
            <div style={{ marginBottom: '24px' }}>
                {items.map((item) => {
                    // Use effectivePrice if available, fallback to price for backward compatibility
                    const itemPrice = (item as any).effectivePrice ?? item.price;
                    const itemOriginalPrice = (item as any).originalPrice ?? item.price;
                    const hasDiscount = itemOriginalPrice > itemPrice;
                    const itemTotal = itemPrice * item.quantity;
                    return (
                        <div key={item.cartItemId} style={{
                            display: 'flex',
                            gap: '16px',
                            marginBottom: '20px',
                            paddingBottom: '20px',
                            borderBottom: '1px solid #e5e5e5',
                        }}>
                            <div style={{
                                position: 'relative',
                                width: '80px',
                                height: '100px',
                                flexShrink: 0,
                                borderRadius: '8px',
                                overflow: 'hidden',
                                border: '2px solid #e5e5e5',
                                backgroundColor: '#f5f5f5',
                            }}>
                                <Image
                                    src={item.images?.find(img => img.isPrimary)?.url || item.images?.[0]?.url || '/placeholder.png'}
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
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#111', marginBottom: '4px' }}>
                                        {item.name}
                                    </h3>
                                    <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>
                                        {item.selectedSize} / {item.selectedColor}
                                    </p>
                                    {/* Price × Quantity breakdown */}
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                                        {hasDiscount && (
                                            <span style={{
                                                textDecoration: 'line-through',
                                                marginRight: '6px',
                                                color: '#9ca3af'
                                            }}>
                                                ৳ {itemOriginalPrice.toLocaleString()}
                                            </span>
                                        )}
                                        ৳ {itemPrice.toLocaleString()} × {item.quantity}
                                        {item.discount && (
                                            <span style={{
                                                backgroundColor: '#fee2e2',
                                                color: '#991b1b',
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                fontSize: '10px',
                                                fontWeight: '600'
                                            }}>
                                                {item.discount.type === 'percentage'
                                                    ? `${item.discount.value}% OFF`
                                                    : `-৳ ${item.discount.value}`
                                                }
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {/* Item Total */}
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '15px', fontWeight: '700', color: '#111' }}>
                                        ৳ {itemTotal.toLocaleString()}
                                    </p>
                                    {hasDiscount && (
                                        <p style={{ fontSize: '12px', color: '#16a34a', fontWeight: '600' }}>
                                            Save ৳ {((itemOriginalPrice - itemPrice) * item.quantity).toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pricing */}
            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>{t.checkout.subtotal}</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#111' }}>৳ {subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>{t.checkout.shippingFee}</span>
                    {shippingCost === 0 ? (
                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#16a34a' }}>
                            ✓ {t.checkout.freeShipping || 'FREE'}
                        </span>
                    ) : (
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#111' }}>৳ {shippingCost}</span>
                    )}
                </div>

                {/* Discount */}
                {(discount || 0) > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', color: '#16a34a' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ fontSize: '14px' }}>{t.checkout.coupon?.discount || 'Discount'}</span>
                            {couponCode && (
                                <span style={{
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    marginLeft: '8px',
                                    padding: '2px 6px',
                                    backgroundColor: '#dcfce7',
                                    borderRadius: '4px',
                                    border: '1px solid #86efac',
                                    color: '#15803d'
                                }}>
                                    {couponCode}
                                </span>
                            )}
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: '600' }}>- ৳ {discount}</span>
                    </div>
                )}
            </div>

            {/* Total */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '20px',
                borderTop: '3px solid #111',
                marginBottom: '24px',
            }}>
                <span style={{ fontSize: '16px', fontWeight: '700', color: '#111' }}>{t.checkout.total}</span>
                <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '24px', fontWeight: '800', color: '#111' }}>৳ {total.toLocaleString()}</span>
                    <span style={{ display: 'block', fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase' }}>BDT</span>
                </div>
            </div>

            {/* Place Order Button */}
            <button
                onClick={onPlaceOrder}
                disabled={isSubmitting}
                style={{
                    width: '100%',
                    padding: '18px',
                    backgroundColor: isSubmitting ? '#9ca3af' : '#111',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.2s, transform 0.1s',
                }}
                onMouseEnter={(e) => {
                    if (!isSubmitting) {
                        e.currentTarget.style.backgroundColor = '#333';
                    }
                }}
                onMouseLeave={(e) => {
                    if (!isSubmitting) {
                        e.currentTarget.style.backgroundColor = '#111';
                    }
                }}
            >
                {isSubmitting ? 'Processing...' : t.checkout.placeOrder}
            </button>

            {/* Trust Links */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '16px',
                marginTop: '20px',
                fontSize: '12px',
                color: '#9ca3af',
            }}>
                <span>Returns</span>
                <span>•</span>
                <span>Privacy</span>
                <span>•</span>
                <span>Terms</span>
            </div>
        </div>
    );
};
