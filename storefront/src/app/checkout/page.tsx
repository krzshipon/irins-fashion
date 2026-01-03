"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart, CartItem } from '@/context/CartContext';
import { useLocalization } from '@/context/LocalizationContext';
import { ShippingForm } from '@/components/checkout/ShippingForm';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { ShippingDetails, ShippingRates, Order } from '@/types/checkout';
import { submitOrder, getShippingRates } from '@/services/api/checkout';
import { getDivisions, Division } from '@/services/api/divisions';
import { validateCoupon, calculateDiscount, Coupon } from '@/services/api/coupons';

const CheckoutPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { cartItems, cartCount, clearCart } = useCart();
    const { dictionary: t } = useLocalization();

    // Check if this is a direct order
    const isDirectOrder = searchParams?.get('direct') === 'true';
    const [directOrderItem, setDirectOrderItem] = useState<CartItem | null>(null);

    const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
        fullName: '',
        phone: '',
        address: '',
        division: '',
        deliveryZone: 'outside_dhaka',
        notes: '',
    });

    const [shippingRates, setShippingRates] = useState<ShippingRates>({
        insideDhaka: 80,
        outsideDhaka: 120,
    });

    const [divisions, setDivisions] = useState<Division[]>([]);
    const [errors, setErrors] = useState<Partial<Record<keyof ShippingDetails, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Coupon state
    const [couponInput, setCouponInput] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponError, setCouponError] = useState('');
    const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Fetch shipping rates and divisions on mount
        const fetchData = async () => {
            const [rates, divisionsList] = await Promise.all([
                getShippingRates(),
                getDivisions(),
            ]);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setShippingRates(rates);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setDivisions(divisionsList);
        };
        fetchData();

        // Check for direct order item in sessionStorage
        if (isDirectOrder) {
            const storedItem = sessionStorage.getItem('directOrder');
            if (storedItem) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setDirectOrderItem(JSON.parse(storedItem));
            }
        }
    }, [isDirectOrder]);

    useEffect(() => {
        // Only redirect to cart if no items AND not a direct order
        if (isMounted && !isSuccess) {
            if (isDirectOrder && !directOrderItem) {
                // Direct order but no item found - redirect to home
                router.push('/');
            } else if (!isDirectOrder && cartCount === 0) {
                router.push('/cart');
            }
        }
    }, [cartCount, isMounted, router, isSuccess, isDirectOrder, directOrderItem]);

    // Get the items to display based on order type
    const checkoutItems: CartItem[] = isDirectOrder && directOrderItem
        ? [directOrderItem]
        : cartItems;

    const subtotal = checkoutItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const FREE_SHIPPING_THRESHOLD = 5000;
    const isFreeShippingEligible = subtotal >= FREE_SHIPPING_THRESHOLD;

    // Auto-select/deselect free_shipping zone based on subtotal
    useEffect(() => {
        if (isFreeShippingEligible && shippingDetails.deliveryZone !== 'free_shipping') {
            // Auto-select free shipping when eligible
            setShippingDetails(prev => ({ ...prev, deliveryZone: 'free_shipping' }));
        } else if (!isFreeShippingEligible && shippingDetails.deliveryZone === 'free_shipping') {
            // Revert to outside_dhaka when no longer eligible
            setShippingDetails(prev => ({ ...prev, deliveryZone: 'outside_dhaka' }));
        }
    }, [isFreeShippingEligible, shippingDetails.deliveryZone]);

    // Handle shipping details change and clear specific field error
    const handleShippingChange = (newDetails: ShippingDetails) => {
        // Find which fields changed and clear their errors
        const changedFields = (Object.keys(newDetails) as (keyof ShippingDetails)[]).filter(
            key => newDetails[key] !== shippingDetails[key]
        );

        if (changedFields.length > 0 && Object.keys(errors).length > 0) {
            const newErrors = { ...errors };
            changedFields.forEach(field => {
                delete newErrors[field];
            });
            setErrors(newErrors);
        }

        setShippingDetails(newDetails);
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof ShippingDetails, string>> = {};
        const requiredFields: (keyof ShippingDetails)[] = ['fullName', 'phone', 'address', 'division'];

        requiredFields.forEach(field => {
            if (!shippingDetails[field] || shippingDetails[field].trim() === '') {
                newErrors[field] = 'Required';
            }
        });

        // BD Mobile validation (01XXXXXXXXX - 11 digits starting with 01)
        if (shippingDetails.phone) {
            const phoneRegex = /^01[3-9]\d{8}$/;
            if (!phoneRegex.test(shippingDetails.phone)) {
                newErrors.phone = 'Invalid BD mobile number (01XXXXXXXXX)';
            }
        }

        // Delivery zone validation
        if (!shippingDetails.deliveryZone) {
            newErrors.deliveryZone = 'Please select a delivery zone';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const calculateSubtotal = () => {
        return checkoutItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    // Update discount if subtotal changes while coupon is applied
    useEffect(() => {
        if (appliedCoupon) {
            const subtotal = calculateSubtotal();
            // Validate minimum amount again
            if (appliedCoupon.minOrderAmount && subtotal < appliedCoupon.minOrderAmount) {
                setAppliedCoupon(null);
                setCouponDiscount(0);
                setCouponError(`Min order ${appliedCoupon.minOrderAmount} required for this coupon`);
            } else {
                const discount = calculateDiscount(appliedCoupon, subtotal);
                setCouponDiscount(discount);
            }
        }
    }, [checkoutItems, appliedCoupon]);

    const handleApplyCoupon = async () => {
        if (!couponInput.trim()) return;

        setIsValidatingCoupon(true);
        setCouponError('');

        const subtotal = calculateSubtotal();
        const result = await validateCoupon(couponInput, subtotal);

        setIsValidatingCoupon(false);

        if (result.valid && result.coupon) {
            setAppliedCoupon(result.coupon);
            const discount = calculateDiscount(result.coupon, subtotal);
            setCouponDiscount(discount);
            setCouponInput(''); // Clear input on success
        } else {
            setCouponError(result.error || t.checkout.coupon?.invalid || 'Invalid coupon');
            setAppliedCoupon(null);
            setCouponDiscount(0);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponDiscount(0);
        setCouponInput('');
        setCouponError('');
    };

    const getShippingCost = () => {
        // Free shipping zone always has 0 cost
        if (shippingDetails.deliveryZone === 'free_shipping') {
            return 0;
        }
        return shippingDetails.deliveryZone === 'inside_dhaka'
            ? shippingRates.insideDhaka
            : shippingRates.outsideDhaka;
    };

    const calculateTotal = () => {
        return Math.max(0, calculateSubtotal() + getShippingCost() - couponDiscount);
    };

    const handlePlaceOrder = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        const subtotal = calculateSubtotal();
        const shippingCost = getShippingCost();
        const total = Math.max(0, subtotal + shippingCost - couponDiscount);

        const orderData: Order = {
            items: checkoutItems,
            subtotal,
            shippingCost,
            total,
            shippingDetails,
            paymentMethod: 'cod',
            couponDiscount,
            appliedCoupon: appliedCoupon ? { code: appliedCoupon.code, discountAmount: couponDiscount } : undefined,
        };
        try {
            const response = await submitOrder(orderData);
            if (response.success) {
                setIsSuccess(true);
                // Clear cart only if it's not a direct order
                if (!isDirectOrder) {
                    clearCart();
                }
                // Clear direct order from session storage
                if (isDirectOrder) {
                    sessionStorage.removeItem('directOrder');
                }
                router.push(`/checkout/success?orderId=${response.orderId}`);
            } else {
                alert('Failed to place order. Please try again.');
            }
        } catch (error) {
            console.error('Order submission failed:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isMounted) return null;
    if (checkoutItems.length === 0) return null;

    return (
        <div style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
                <h1 style={{
                    fontSize: '32px',
                    fontWeight: '600',
                    color: '#111',
                    marginBottom: '40px',
                    fontFamily: 'serif'
                }}>
                    {t.checkout.title}
                </h1>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '40px'
                }} className="lg:!grid-cols-[1fr_420px]">
                    <div>
                        <ShippingForm
                            value={shippingDetails}
                            onChange={handleShippingChange}
                            errors={errors}
                            shippingRates={shippingRates}
                            divisions={divisions}
                            subtotal={calculateSubtotal()}
                        />

                        {/* Coupon Section */}
                        <div style={{ marginTop: '24px', padding: '24px', backgroundColor: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e5e5' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#111' }}>{t.checkout.coupon?.title || 'Have a coupon?'}</h3>

                            {appliedCoupon ? (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#dcfce7', borderRadius: '8px', border: '1px solid #86efac' }}>
                                    <div>
                                        <p style={{ fontWeight: '600', color: '#15803d', fontSize: '14px' }}>
                                            {appliedCoupon.code}
                                        </p>
                                        <p style={{ fontSize: '12px', color: '#166534' }}>
                                            {t.checkout.coupon?.applied || 'Coupon applied!'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleRemoveCoupon}
                                        style={{
                                            padding: '6px 12px',
                                            fontSize: '13px',
                                            color: '#ef4444',
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                            fontWeight: '600',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {t.checkout.coupon?.remove || 'Remove'}
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <input
                                            type="text"
                                            value={couponInput}
                                            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                            placeholder={t.checkout.coupon?.placeholder || 'Enter coupon code'}
                                            style={{
                                                flex: 1,
                                                padding: '12px 16px',
                                                border: '2px solid #e5e5e5',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                outline: 'none'
                                            }}
                                        />
                                        <button
                                            onClick={handleApplyCoupon}
                                            disabled={isValidatingCoupon || !couponInput.trim()}
                                            style={{
                                                padding: '0 24px',
                                                backgroundColor: '#111',
                                                color: '#fff',
                                                fontWeight: '600',
                                                border: 'none',
                                                borderRadius: '8px',
                                                fontSize: '14px',
                                                cursor: (isValidatingCoupon || !couponInput.trim()) ? 'not-allowed' : 'pointer',
                                                opacity: (isValidatingCoupon || !couponInput.trim()) ? 0.7 : 1
                                            }}
                                        >
                                            {isValidatingCoupon ? '...' : (t.checkout.coupon?.apply || 'Apply')}
                                        </button>
                                    </div>
                                    {couponError && (
                                        <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '8px' }}>
                                            {couponError}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <div style={{
                            backgroundColor: '#f8f8f8',
                            borderRadius: '12px',
                            padding: '32px',
                            border: '1px solid #e5e5e5',
                            position: 'sticky',
                            top: '20px'
                        }}>
                            <OrderSummary
                                items={checkoutItems}
                                subtotal={calculateSubtotal()}
                                shippingCost={getShippingCost()}
                                discount={couponDiscount}
                                couponCode={appliedCoupon?.code}
                                total={calculateTotal()}
                                onPlaceOrder={handlePlaceOrder}
                                isSubmitting={isSubmitting}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
