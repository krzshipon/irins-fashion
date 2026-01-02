"use client";

import { useState } from 'react';
import { Product } from '@/services/api/types';
import styles from './ProductDetails.module.css';
import { useCart } from '@/context/CartContext';

interface ProductInfoProps {
    product: Product;
    selectedColor: string | null;
    onColorSelect: (color: string) => void;
    initialSize?: string | null;
}

export default function ProductInfo({ product, selectedColor, onColorSelect, initialSize }: ProductInfoProps) {
    const [selectedSize, setSelectedSize] = useState<string | null>(() => {
        if (initialSize && product.sizes?.includes(initialSize)) {
            return initialSize;
        }
        return product.sizes ? product.sizes[0] : null;
    });
    const { addToCart, cartItems, updateQuantity } = useCart();

    // Update size if URL param changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const [prevInitialSize, setPrevInitialSize] = useState(initialSize);
    if (initialSize !== prevInitialSize) {
        setPrevInitialSize(initialSize);
        if (initialSize && product.sizes?.includes(initialSize)) {
            setSelectedSize(initialSize);
        }
    }

    const handleAddToCart = () => {
        if (!selectedColor && product.colors && product.colors.length > 0) {
            alert('Please select a color');
            return;
        }

        addToCart(product, {
            selectedColor: selectedColor || undefined,
            selectedSize: selectedSize || undefined
        });
    };

    // Helper for color values (this would ideally come from a theme or backend)
    const getColorValue = (colorName: string) => {
        const map: Record<string, string> = {
            'Emerald': '#046A38',
            'Dusty Rose': '#CBA7AA',
            'Black': '#000000',
            'Navy': '#000080',
            'Beige': '#F5F5DC',
            'Gold': '#FFD700',
            'White': '#FFFFFF'
        };
        return map[colorName] || '#CCCCCC';
    };

    return (
        <div className={styles.infoContainer}>
            <div className={styles.header}>
                <div className={styles.category}>{product.category}</div>
                <h1 className={styles.title}>{product.name}</h1>
                <div className={styles.price}>
                    {product.currency} {product.price.toLocaleString()}
                </div>
            </div>

            <div className={styles.divider} />

            {product.description && (
                <div className={styles.description}>
                    <p>{product.description}</p>
                </div>
            )}

            {product.colors && product.colors.length > 0 && (
                <div className={styles.optionsSection}>
                    <label className={styles.optionLabel}>
                        Color: <span>{selectedColor}</span>
                    </label>
                    <div className={styles.swatchGrid}>
                        {product.colors.map(color => (
                            <button
                                key={color}
                                className={`${styles.colorButton} ${selectedColor === color ? styles.activeColor : ''}`}
                                style={{ backgroundColor: getColorValue(color) }}
                                onClick={() => onColorSelect(color)}
                                title={color}
                                aria-label={`Select color ${color}`}
                            />
                        ))}
                    </div>
                </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
                <div className={styles.optionsSection}>
                    <label className={styles.optionLabel}>
                        Size: <span>{selectedSize}</span>
                    </label>
                    <div className={styles.swatchGrid}>
                        {product.sizes.map(size => (
                            <button
                                key={size}
                                className={`${styles.sizeButton} ${selectedSize === size ? styles.activeSize : ''}`}
                                onClick={() => setSelectedSize(size)}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className={styles.actions}>
                {(() => {
                    const existingCartItem = cartItems.find(item =>
                        item.id === product.id &&
                        item.selectedColor === (selectedColor || undefined) &&
                        item.selectedSize === (selectedSize || undefined)
                    );

                    if (existingCartItem) {
                        return (
                            <div className={styles.quantityControl}>
                                <button
                                    className={styles.qtyBtn}
                                    onClick={() => updateQuantity(existingCartItem.cartItemId, existingCartItem.quantity - 1)}
                                >-</button>
                                <span className={styles.qtyValue}>{existingCartItem.quantity}</span>
                                <button
                                    className={styles.qtyBtn}
                                    onClick={() => updateQuantity(existingCartItem.cartItemId, existingCartItem.quantity + 1)}
                                >+</button>
                            </div>
                        );
                    }

                    return (
                        <button
                            className={styles.addToCartBtn}
                            onClick={handleAddToCart}
                        >
                            Add to Cart
                        </button>
                    );
                })()}
            </div>
        </div>
    );
}
