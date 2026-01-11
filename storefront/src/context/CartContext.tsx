"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/services/api/types';
import { getEffectivePrice } from '@/lib/priceUtils';

export interface CartItem extends Product {
    quantity: number;
    selectedColor?: string;
    selectedSize?: string;
    cartItemId: string; // Unique ID for the cart entry (e.g. product-id-color-size)
    effectivePrice: number; // Discounted price for this variant
    originalPrice: number; // Price before discount (variant or base)
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Product, options?: { selectedColor?: string; selectedSize?: string }) => void;
    updateQuantity: (cartItemId: string, quantity: number) => void;
    removeFromCart: (cartItemId: string) => void;
    clearCart: () => void;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    // Initialize from local storage on mount
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true);
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            try {
                setCartItems(JSON.parse(storedCart));
            } catch (error) {
                console.error("Failed to parse cart from local storage", error);
            }
        }
    }, []);

    // Persist to local storage on change
    useEffect(() => {
        if (isMounted) {
            localStorage.setItem('cart', JSON.stringify(cartItems));
        }
    }, [cartItems, isMounted]);

    const generateCartItemId = (productId: string, color?: string, size?: string) => {
        return `${productId}-${color || 'default'}-${size || 'default'}`;
    };

    const addToCart = (product: Product, options?: { selectedColor?: string; selectedSize?: string }) => {
        const { selectedColor, selectedSize } = options || {};
        const cartItemId = generateCartItemId(product.id, selectedColor, selectedSize);

        // Calculate effective price based on variant and discount
        const { effectivePrice, originalPrice } = getEffectivePrice(product, selectedColor, selectedSize);

        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.cartItemId === cartItemId);
            if (existingItem) {
                return prevItems.map(item =>
                    item.cartItemId === cartItemId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevItems, {
                    ...product,
                    quantity: 1,
                    selectedColor,
                    selectedSize,
                    cartItemId,
                    effectivePrice,
                    originalPrice
                }];
            }
        });
    };

    const updateQuantity = (cartItemId: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(cartItemId);
            return;
        }

        setCartItems(prevItems =>
            prevItems.map(item =>
                item.cartItemId === cartItemId ? { ...item, quantity } : item
            )
        );
    };

    const removeFromCart = (cartItemId: string) => {
        setCartItems(prevItems => prevItems.filter(item => item.cartItemId !== cartItemId));
    };

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
