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

    const getShippingCost = () => {
        return shippingDetails.deliveryZone === 'inside_dhaka'
            ? shippingRates.insideDhaka
            : shippingRates.outsideDhaka;
    };

    const calculateTotal = () => {
        return calculateSubtotal() + getShippingCost();
    };

    const handlePlaceOrder = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        const subtotal = calculateSubtotal();
        const shippingCost = getShippingCost();
        const total = subtotal + shippingCost;

        const order: Order = {
            items: checkoutItems,
            subtotal,
            shippingCost,
            total,
            shippingDetails,
            paymentMethod: 'cod'
        };

        try {
            const response = await submitOrder(order);
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
                            onChange={setShippingDetails}
                            errors={errors}
                            shippingRates={shippingRates}
                            divisions={divisions}
                        />
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
