"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart, CartItem } from '@/context/CartContext';
import { useLocalization } from '@/context/LocalizationContext';
import { useAuth } from '@/context/AuthContext';
import { addressesService } from '@/services/api/addresses.service';
import { ShippingForm } from '@/components/checkout/ShippingForm';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { ShippingDetails, ShippingRates, Order } from '@/types/checkout';
import { submitOrder } from '@/services/api/checkout';
import { Division } from '@/services/api/divisions';
import { validateCoupon, calculateDiscount, Coupon } from '@/services/api/coupons';
import { Address } from '@/services/api/types';
import { MapPin, Plus, Check } from 'lucide-react';

interface CheckoutClientProps {
    initialShippingRates: ShippingRates;
    initialDivisions: Division[];
}

export default function CheckoutClient({ initialShippingRates, initialDivisions }: CheckoutClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { cartItems, cartCount, clearCart } = useCart();
    const { dictionary: t } = useLocalization();
    const { user } = useAuth();

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

    // Use props for initial state
    const [shippingRates] = useState<ShippingRates>(initialShippingRates);
    const [divisions] = useState<Division[]>(initialDivisions);

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

    // User Address State
    const [userAddresses, setUserAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [showNewAddressForm, setShowNewAddressForm] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        // Check for direct order item in sessionStorage
        if (isDirectOrder) {
            const storedItem = sessionStorage.getItem('directOrder');
            if (storedItem) {
                try {
                    setDirectOrderItem(JSON.parse(storedItem));
                } catch (e) {
                    console.error("Failed to parse direct order item", e);
                }
            }
        }
    }, [isDirectOrder]);

    // Fetch user addresses if logged in
    useEffect(() => {
        if (user) {
            const fetchAddresses = async () => {
                try {
                    const addresses = await addressesService.getAll();
                    setUserAddresses(addresses);

                    // Auto-select default address if exists
                    const defaultAddress = addresses.find(a => a.isDefault);
                    if (defaultAddress) {
                        selectAddress(defaultAddress);
                    } else if (addresses.length > 0) {
                        // Or select the first one if no default
                        selectAddress(addresses[0]);
                    } else {
                        // No addresses, show form
                        setShowNewAddressForm(true);
                    }
                } catch (error) {
                    console.error("Failed to fetch addresses", error);
                }
            };
            fetchAddresses();
        } else {
            // Guest user - always show form
            setShowNewAddressForm(true);
        }
    }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

    const selectAddress = (address: Address) => {
        setSelectedAddressId(address.id);
        setShowNewAddressForm(false);

        // Normalize division to match dropdown values (IDs)
        let normalizedDivision = address.division.toLowerCase();

        // Try to find a match in the divisions list
        const matchedDivision = divisions.find(d =>
            d.id.toLowerCase() === address.division.toLowerCase() ||
            d.name.toLowerCase() === address.division.toLowerCase()
        );

        if (matchedDivision) {
            normalizedDivision = matchedDivision.id;
        } else {
            // Handle spelling variations between stored addresses and system divisions
            if (address.division === 'Chattogram') normalizedDivision = 'chittagong';
            else if (address.division === 'Barishal') normalizedDivision = 'barisal';
            else if (address.division === 'Jashore') normalizedDivision = 'khulna';
            else if (address.division === 'Cumilla') normalizedDivision = 'chittagong';
        }

        setShippingDetails(prev => ({
            ...prev,
            fullName: address.recipientName,
            phone: address.phone,
            address: address.address,
            division: normalizedDivision,
            deliveryZone: (address.division.toLowerCase().includes('dhaka'))
                ? 'inside_dhaka'
                : 'outside_dhaka'
        }));
    };

    const handleNewAddressClick = () => {
        setSelectedAddressId(null);
        setShowNewAddressForm(true);
        setShippingDetails(prev => ({
            ...prev,
            fullName: '',
            phone: '',
            address: '',
            division: '',
            deliveryZone: 'outside_dhaka'
        }));
    };

    useEffect(() => {
        // Only redirect to cart if no items AND not a direct order
        if (isMounted && !isSuccess) {
            if (isDirectOrder && !directOrderItem) {
                // Direct order but no item found - redirect to home or stay? Better redirect home/cart
                // But initially directOrderItem is null. We need to wait for mount.
                // We handle this inside use effect after mount.
                // If directOrder is true, we checked sessionStorage. If still null, then invalid.
                // But wait, setDirectOrderItem is async? No.
                // However, sessionStorage read happens in useEffect.
                // So we should check this only after that effect runs?
                // The current logic might redirect prematurely?
                // `isMounted` is set true in the same effect? No, separate effect.
                // Let's rely on standard logic: if mounted and no direct item and no cart, then redirect.
                // But checking session storage should happen fast.
            } else if (!isDirectOrder && cartCount === 0) {
                router.push('/cart');
            }
        }
    }, [cartCount, isMounted, router, isSuccess, isDirectOrder, directOrderItem]);

    const checkoutItems: CartItem[] = isDirectOrder && directOrderItem
        ? [directOrderItem]
        : cartItems;

    const getItemPrice = (item: CartItem) => (item as any).effectivePrice ?? item.price;
    const subtotal = checkoutItems.reduce((total, item) => total + (getItemPrice(item) * item.quantity), 0);
    const FREE_SHIPPING_THRESHOLD = 5000;
    const isFreeShippingEligible = subtotal >= FREE_SHIPPING_THRESHOLD;

    useEffect(() => {
        if (isFreeShippingEligible && shippingDetails.deliveryZone !== 'free_shipping') {
            setShippingDetails(prev => ({ ...prev, deliveryZone: 'free_shipping' }));
        } else if (!isFreeShippingEligible && shippingDetails.deliveryZone === 'free_shipping') {
            setShippingDetails(prev => ({ ...prev, deliveryZone: 'outside_dhaka' }));
        }
    }, [isFreeShippingEligible, shippingDetails.deliveryZone]);

    const handleShippingChange = (newDetails: ShippingDetails) => {
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

        if (shippingDetails.phone) {
            const phoneRegex = /^01[3-9]\d{8}$/;
            if (!phoneRegex.test(shippingDetails.phone)) {
                newErrors.phone = 'Invalid BD mobile number (01XXXXXXXXX)';
            }
        }

        if (!shippingDetails.deliveryZone) {
            newErrors.deliveryZone = 'Please select a delivery zone';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const calculateSubtotal = () => {
        return checkoutItems.reduce((total, item) => total + (getItemPrice(item) * item.quantity), 0);
    };

    useEffect(() => {
        if (appliedCoupon) {
            const subtotal = calculateSubtotal();
            if (appliedCoupon.minOrderAmount && subtotal < appliedCoupon.minOrderAmount) {
                setAppliedCoupon(null);
                setCouponDiscount(0);
                setCouponError(`Min order ${appliedCoupon.minOrderAmount} required for this coupon`);
            } else {
                const discount = calculateDiscount(appliedCoupon, subtotal);
                setCouponDiscount(discount);
            }
        }
    }, [checkoutItems, appliedCoupon]); // eslint-disable-line react-hooks/exhaustive-deps

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
            setCouponInput('');
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
                if (!isDirectOrder) {
                    clearCart();
                }
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
        <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
                <h1 style={{
                    fontSize: '32px', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '40px', fontFamily: 'var(--font-family-display)'
                }}>
                    {t.checkout.title}
                </h1>

                <div className="lg:!grid-cols-[1fr_420px]" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }}>
                    <div>
                        {/* Address Selection */}
                        {user && userAddresses.length > 0 && (
                            <div style={{ marginBottom: '32px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: 'var(--color-text-main)' }}>Shipping Address</h3>
                                <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                                    {userAddresses.map((addr) => (
                                        <div
                                            key={addr.id}
                                            onClick={() => selectAddress(addr)}
                                            style={{
                                                border: selectedAddressId === addr.id ? '2px solid var(--color-text-main)' : '1px solid var(--color-border)',
                                                borderRadius: '12px', padding: '16px', cursor: 'pointer',
                                                backgroundColor: selectedAddressId === addr.id ? 'var(--color-surface-dim)' : 'var(--color-surface)',
                                                position: 'relative', transition: 'all 0.2s ease'
                                            }}
                                        >
                                            {selectedAddressId === addr.id && (
                                                <div style={{ position: 'absolute', top: '12px', right: '12px', color: 'var(--color-text-main)' }}><Check size={20} /></div>
                                            )}
                                            <div style={{ fontWeight: '600', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                                <MapPin size={16} /> {addr.label}
                                            </div>
                                            <p style={{ fontSize: '14px', color: 'var(--color-text-main)', marginBottom: '4px' }}>{addr.recipientName}</p>
                                            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>{addr.address}, {addr.division}</p>
                                            <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>{addr.phone}</p>
                                        </div>
                                    ))}
                                    <div
                                        onClick={handleNewAddressClick}
                                        style={{
                                            border: showNewAddressForm ? '2px solid var(--color-text-main)' : '1px dashed var(--color-border)',
                                            borderRadius: '12px', padding: '16px', cursor: 'pointer',
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                            backgroundColor: showNewAddressForm ? 'var(--color-surface-dim)' : 'var(--color-surface)',
                                            color: showNewAddressForm ? 'var(--color-text-main)' : 'var(--color-text-muted)', minHeight: '140px'
                                        }}
                                    >
                                        <Plus size={24} /> <span style={{ fontWeight: '600', fontSize: '14px' }}>Add New Address</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div style={{ animation: 'fadeIn 0.3s ease-out', marginTop: '32px' }}>
                            <ShippingForm
                                value={shippingDetails}
                                onChange={handleShippingChange}
                                errors={errors}
                                shippingRates={shippingRates}
                                divisions={divisions}
                                subtotal={calculateSubtotal()}
                            />
                        </div>
                    </div>

                    <div>
                        <div style={{
                            backgroundColor: 'var(--color-surface-dim)', borderRadius: '12px', padding: '32px',
                            border: '1px solid var(--color-border)', position: 'sticky', top: '20px'
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
