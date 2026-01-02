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

    // Redirect if cart is empty, unless we just placed an order successfully
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
                newErrors[field] = 'This field is required';
            }
        });

        // Basic email validation
        if (shippingDetails.email && !/\S+@\S+\.\S+/.test(shippingDetails.email)) {
            newErrors.email = 'Invalid email address';
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
        const total = subtotal; // Free shipping for now

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
                setIsSuccess(true); // Set success flag BEFORE clearing cart
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

    if (cartCount === 0) {
        return null; // Will redirect via useEffect
    }

    return (
        <div className="min-h-screen bg-white py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-serif text-gray-900 mb-12 text-center md:text-left">{t.checkout.title}</h1>

                <div className="lg:grid lg:grid-cols-12 lg:gap-x-16 lg:items-start">
                    <div className="lg:col-span-7">
                        <ShippingForm
                            value={shippingDetails}
                            onChange={setShippingDetails}
                            errors={errors}
                        />
                    </div>

                    <div className="lg:col-span-5 mt-16 lg:mt-0 sticky top-4">
                        <OrderSummary
                            items={cartItems}
                            subtotal={calculateSubtotal()}
                            total={calculateSubtotal()} // + shipping if needed
                            onPlaceOrder={handlePlaceOrder}
                            isSubmitting={isSubmitting}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
