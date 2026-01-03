"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/services/api/types';
import styles from './ProductDetails.module.css';
import { useCart } from '@/context/CartContext';
import { useLocalization } from '@/context/LocalizationContext';

interface ProductInfoProps {
    product: Product;
    selectedColor: string | null;
    onColorSelect: (color: string) => void;
    initialSize?: string | null;
}

export default function ProductInfo({ product, selectedColor, onColorSelect, initialSize }: ProductInfoProps) {
    const router = useRouter();
    const { dictionary: t } = useLocalization();
    const [selectedSize, setSelectedSize] = useState<string | null>(() => {
        if (initialSize && product.sizes?.includes(initialSize)) {
            return initialSize;
        }
        return product.sizes ? product.sizes[0] : null;
    });

    // Standalone quantity state - works for both Add to Cart and Order Now
    const [quantity, setQuantity] = useState(1);

    const { addToCart, cartItems } = useCart();

    // Update size if URL param changes
    const [prevInitialSize, setPrevInitialSize] = useState(initialSize);
    if (initialSize !== prevInitialSize) {
        setPrevInitialSize(initialSize);
        if (initialSize && product.sizes?.includes(initialSize)) {
            setSelectedSize(initialSize);
        }
    }

    // Check if this variant is already in cart
    const existingCartItem = cartItems.find(item =>
        item.id === product.id &&
        item.selectedColor === (selectedColor || undefined) &&
        item.selectedSize === (selectedSize || undefined)
    );
    const inCartQuantity = existingCartItem?.quantity || 0;

    const handleQuantityChange = (delta: number) => {
        setQuantity(prev => Math.max(1, prev + delta));
    };

    const handleAddToCart = () => {
        if (!selectedColor && product.colors && product.colors.length > 0) {
            alert('Please select a color');
            return;
        }

        // Add the selected quantity to cart
        for (let i = 0; i < quantity; i++) {
            addToCart(product, {
                selectedColor: selectedColor || undefined,
                selectedSize: selectedSize || undefined
            });
        }

        // Reset quantity after adding
        setQuantity(1);
    };

    const handleOrderNow = () => {
        if (!selectedColor && product.colors && product.colors.length > 0) {
            alert('Please select a color');
            return;
        }

        // Store direct order item with selected quantity in sessionStorage
        const directOrderItem = {
            id: product.id,
            sku: product.sku,
            name: product.name,
            price: product.price,
            currency: product.currency,
            image: product.image,
            quantity: quantity, // Use selected quantity
            selectedColor: selectedColor || undefined,
            selectedSize: selectedSize || undefined,
            cartItemId: `direct-${product.id}-${selectedColor || 'nocolor'}-${selectedSize || 'nosize'}`,
        };

        sessionStorage.setItem('directOrder', JSON.stringify(directOrderItem));
        router.push('/checkout?direct=true');
    };

    // Helper for color values
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
                    {product.originalPrice && product.originalPrice > product.price && (
                        <span style={{
                            textDecoration: 'line-through',
                            color: '#6b7280',
                            fontSize: '0.8em',
                            marginRight: '12px',
                            fontWeight: 'normal'
                        }}>
                            {product.currency} {product.originalPrice.toLocaleString()}
                        </span>
                    )}
                    <span style={{
                        color: product.originalPrice ? '#dc2626' : 'inherit',
                        fontWeight: product.originalPrice ? 'bold' : '500'
                    }}>
                        {product.currency} {product.price.toLocaleString()}
                    </span>
                    {product.discount && (
                        <span style={{
                            marginLeft: '12px',
                            backgroundColor: '#fee2e2',
                            color: '#991b1b',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '0.5em',
                            verticalAlign: 'middle',
                            fontWeight: '600'
                        }}>
                            {product.discount.type === 'percentage'
                                ? `${product.discount.value}% OFF`
                                : `${product.currency} ${product.discount.value} OFF`
                            }
                        </span>
                    )}
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

            {/* Standalone Quantity Selector */}
            <div className={styles.quantitySection}>
                <label className={styles.optionLabel}>
                    {t.products.quantity || 'Quantity'}:
                </label>
                <div className={styles.quantitySelector}>
                    <button
                        className={styles.qtyBtn}
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                    >
                        −
                    </button>
                    <span className={styles.qtyValue}>{quantity}</span>
                    <button
                        className={styles.qtyBtn}
                        onClick={() => handleQuantityChange(1)}
                    >
                        +
                    </button>
                </div>
            </div>

            {/* Action Buttons - Always show both */}
            <div className={styles.actions}>
                <button
                    className={styles.addToCartBtn}
                    onClick={handleAddToCart}
                >
                    {t.products.addToCart}
                </button>
                <button
                    className={styles.orderNowBtn}
                    onClick={handleOrderNow}
                >
                    {t.products.orderNow}
                </button>
            </div>

            {/* Cart indicator */}
            {inCartQuantity > 0 && (
                <p className={styles.cartIndicator}>
                    ✓ {inCartQuantity} {t.products.alreadyInCart || 'already in cart'}
                </p>
            )}
        </div>
    );
}
