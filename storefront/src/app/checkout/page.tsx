"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useLocalization } from '@/context/LocalizationContext';
import { ShippingForm } from '@/components/checkout/ShippingForm';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { ShippingDetails, Order } from '@/types/checkout';
import { submitOrder } from '@/services/api/checkout';

const CheckoutPage = () => {
    const router = useRouter();
    const { cartItems, cartCount, clearCart } = useCart();
    const { dictionary: t } = useLocalization();

    const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: ''
    });

    const [errors, setErrors] = useState<Partial<Record<keyof ShippingDetails, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted && cartCount === 0 && !isSuccess) {
            router.push('/cart');
        }
    }, [cartCount, isMounted, router, isSuccess]);

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof ShippingDetails, string>> = {};
        const requiredFields: (keyof ShippingDetails)[] = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode'];

        requiredFields.forEach(field => {
            if (!shippingDetails[field] || shippingDetails[field].trim() === '') {
                newErrors[field] = 'Required';
            }
        });

        if (shippingDetails.email && !/\S+@\S+\.\S+/.test(shippingDetails.email)) {
            newErrors.email = 'Invalid email';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handlePlaceOrder = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        const subtotal = calculateSubtotal();
        const total = subtotal;

        const order: Order = {
            items: cartItems,
            subtotal,
            total,
            shippingDetails,
            paymentMethod: 'cod'
        };

        try {
            const response = await submitOrder(order);
            if (response.success) {
                setIsSuccess(true);
                clearCart();
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
    if (cartCount === 0) return null;

    return (
        <div style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
            {/* Centered Container */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
                {/* Page Title */}
                <h1 style={{
                    fontSize: '32px',
                    fontWeight: '600',
                    color: '#111',
                    marginBottom: '40px',
                    fontFamily: 'serif'
                }}>
                    {t.checkout.title}
                </h1>

                {/* Two Column Layout */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '40px'
                }} className="lg:!grid-cols-[1fr_420px]">
                    {/* Left Column - Form */}
                    <div>
                        <ShippingForm
                            value={shippingDetails}
                            onChange={setShippingDetails}
                            errors={errors}
                        />
                    </div>

                    {/* Right Column - Order Summary */}
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
                                items={cartItems}
                                subtotal={calculateSubtotal()}
                                total={calculateSubtotal()}
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
