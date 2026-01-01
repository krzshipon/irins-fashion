"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/services/api/types';

interface CartItem extends Product {
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Product) => void;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    // Initialize from local storage on mount
    useEffect(() => {
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

    const addToCart = (product: Product) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevItems, { ...product, quantity: 1 }];
            }
        });
    };

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, cartCount }}>
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
