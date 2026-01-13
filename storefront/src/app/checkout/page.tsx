"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart, CartItem } from '@/context/CartContext';
import { useLocalization } from '@/context/LocalizationContext';
import { useAuth } from '@/context/AuthContext'; // Import useAuth
import { authService } from '@/services/api/auth.service'; // Import authService
import { addressesService } from '@/services/api/addresses.service'; // Import addressesService
import { ShippingForm } from '@/components/checkout/ShippingForm';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { ShippingDetails, ShippingRates, Order } from '@/types/checkout';
import { submitOrder, getShippingRates } from '@/services/api/checkout';
import { getDivisions, Division } from '@/services/api/divisions';
import { validateCoupon, calculateDiscount, Coupon } from '@/services/api/coupons';
import { Address } from '@/services/api/types'; // Import Address type
import { MapPin, Plus, Check } from 'lucide-react'; // Import icons

const CheckoutContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { cartItems, cartCount, clearCart } = useCart();
    const { dictionary: t } = useLocalization();
    const { user } = useAuth(); // Get user from auth context

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

    // User Address State
    const [userAddresses, setUserAddresses] = useState<Address[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [showNewAddressForm, setShowNewAddressForm] = useState(false);

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
    }, [user]);

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
            // System uses old spellings (chittagong, barisal) vs new (Chattogram, Barishal)
            if (address.division === 'Chattogram') normalizedDivision = 'chittagong';
            else if (address.division === 'Barishal') normalizedDivision = 'barisal';
            else if (address.division === 'Jashore') normalizedDivision = 'khulna'; // Example fallback if needed
            else if (address.division === 'Cumilla') normalizedDivision = 'chittagong';
        }

        setShippingDetails(prev => ({
            ...prev,
            fullName: address.recipientName,
            phone: address.phone,
            address: address.address,
            division: normalizedDivision,
            // Simple heuristic for zone based on city/division
            // In a real app, this would be more robust
            deliveryZone: (address.division.toLowerCase().includes('dhaka'))
                ? 'inside_dhaka'
                : 'outside_dhaka'
        }));
    };

    const handleNewAddressClick = () => {
        setSelectedAddressId(null);
        setShowNewAddressForm(true);
        // Optional: Clear form or keep previous values? 
        // Clearing is safer for a "New Address" intent
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

    // Helper to get effective price with fallback for backward compatibility
    const getItemPrice = (item: CartItem) => (item as any).effectivePrice ?? item.price;
    const subtotal = checkoutItems.reduce((total, item) => total + (getItemPrice(item) * item.quantity), 0);
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
        return checkoutItems.reduce((total, item) => total + (getItemPrice(item) * item.quantity), 0);
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
                        {/* Address Selection for Logged In Users */}
                        {user && userAddresses.length > 0 && (
                            <div style={{ marginBottom: '32px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#111' }}>Shipping Address</h3>

                                <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                                    {userAddresses.map((addr) => (
                                        <div
                                            key={addr.id}
                                            onClick={() => selectAddress(addr)}
                                            style={{
                                                border: selectedAddressId === addr.id ? '2px solid #111' : '1px solid #e5e5e5',
                                                borderRadius: '12px',
                                                padding: '16px',
                                                cursor: 'pointer',
                                                backgroundColor: selectedAddressId === addr.id ? '#fafafa' : '#fff',
                                                position: 'relative',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            {selectedAddressId === addr.id && (
                                                <div style={{ position: 'absolute', top: '12px', right: '12px', color: '#111' }}>
                                                    <Check size={20} />
                                                </div>
                                            )}
                                            <div style={{ fontWeight: '600', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                                <MapPin size={16} />
                                                {addr.label}
                                            </div>
                                            <p style={{ fontSize: '14px', color: '#374151', marginBottom: '4px' }}>{addr.recipientName}</p>
                                            <p style={{ fontSize: '14px', color: '#6b7280' }}>{addr.address}, {addr.division}</p>
                                            <p style={{ fontSize: '14px', color: '#6b7280' }}>{addr.phone}</p>
                                        </div>
                                    ))}

                                    <div
                                        onClick={handleNewAddressClick}
                                        style={{
                                            border: showNewAddressForm ? '2px solid #111' : '1px dashed #d1d5db',
                                            borderRadius: '12px',
                                            padding: '16px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            backgroundColor: showNewAddressForm ? '#fafafa' : '#fff',
                                            color: showNewAddressForm ? '#111' : '#6b7280',
                                            minHeight: '140px'
                                        }}
                                    >
                                        <Plus size={24} />
                                        <span style={{ fontWeight: '600', fontSize: '14px' }}>Add New Address</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Shipping Form - Always visible to show Payment Method, Zone, and Allow Editing */}
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

const CheckoutPage = () => {
    return (
        <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>}>
            <CheckoutContent />
        </Suspense>
    );
};

export default CheckoutPage;
