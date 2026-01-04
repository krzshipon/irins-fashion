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

    // --- Helper Logic for Variants ---

    // Get the currently selected color variant object
    const currentVariant = product.variants?.find(v => v.colorName === selectedColor);

    // Get available sizes based on current variant
    const availableSizes = currentVariant ? currentVariant.sizes : [];

    const [selectedSize, setSelectedSize] = useState<string | null>(() => {
        // Try to respect initialSize strictly first
        if (initialSize) {
            // Validate against current variant if exists
            if (currentVariant) {
                if (currentVariant.sizes.some(s => s.size === initialSize)) return initialSize;
            }
        }

        // Default to first available size
        if (currentVariant && currentVariant.sizes.length > 0) {
            return currentVariant.sizes[0].size;
        }
        return null; // No fallback to legacy product.sizes
    });

    // Determine effectively selected size details (if using variants)
    const currentSizeVariant = currentVariant?.sizes.find(s => s.size === selectedSize);

    // Calculate Price (Base or Override)
    const currentPrice = (() => {
        if (currentSizeVariant && currentSizeVariant.price) {
            return parseFloat(currentSizeVariant.price);
        }
        return product.price;
    })();

    // Calculate SKU
    const currentSku = currentSizeVariant?.sku || product.sku;

    // Standalone quantity state
    const [quantity, setQuantity] = useState(1);
    const { addToCart, cartItems } = useCart();

    // Effect: When Color changes, ensure Size is valid
    // We don't use useEffect for this to avoid double-render, but we need to handle it in the parent or derived state.
    // However, since selectedColor comes from props, we should react to it.
    // A better pattern here is to reset size in the onColorSelect handler in the parent,
    // but since we control size state locally here, we use an effect or simple memoization.

    // Simple effect to validate size on color change
    if (currentVariant && selectedSize && !currentVariant.sizes.some(s => s.size === selectedSize)) {
        // If current size is invalid for new color, switch to first available
        if (currentVariant.sizes.length > 0) {
            setSelectedSize(currentVariant.sizes[0].size);
        } else {
            setSelectedSize(null);
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
        if (product.variants?.length && !selectedColor) {
            alert('Please select a color');
            return;
        }

        // Add the selected quantity to cart
        for (let i = 0; i < quantity; i++) {
            addToCart({
                ...product,
                price: currentPrice, // Add with correct price
                sku: currentSku
            }, {
                selectedColor: selectedColor || undefined,
                selectedSize: selectedSize || undefined
            });
        }

        setQuantity(1);
    };

    const handleOrderNow = () => {
        if (product.variants?.length && !selectedColor) {
            alert('Please select a color');
            return;
        }

        const directOrderItem = {
            id: product.id,
            sku: currentSku,
            name: product.name,
            price: currentPrice, // Use dynamic price
            currency: product.currency,
            image: product.image,
            quantity: quantity,
            selectedColor: selectedColor || undefined,
            selectedSize: selectedSize || undefined,
            cartItemId: `direct-${product.id}-${selectedColor || 'nocolor'}-${selectedSize || 'nosize'}`,
        };

        sessionStorage.setItem('directOrder', JSON.stringify(directOrderItem));
        router.push('/checkout?direct=true');
    };

    // Helper for color values - uses Variant Hex only
    const getColorHex = (colorName: string) => {
        // Check new variants only
        const variant = product.variants?.find(v => v.colorName === colorName);
        if (variant && variant.colorCode) return variant.colorCode;
        return '#CCCCCC'; // Default fallback
    };

    // Derived lists for rendering
    const colorsToRender = product.variants?.map(v => v.colorName) || [];

    return (
        <div className={styles.infoContainer}>
            <div className={styles.header}>
                <div className={styles.category}>{product.category}</div>
                <h1 className={styles.title}>{product.name}</h1>
                <div className={styles.price}>
                    {product.originalPrice && product.originalPrice > currentPrice && (
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
                        {product.currency} {currentPrice.toLocaleString()}
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

            {colorsToRender && colorsToRender.length > 0 && (
                <div className={styles.optionsSection}>
                    <label className={styles.optionLabel}>
                        Color: <span className="font-semibold text-gray-900">{selectedColor}</span>
                    </label>
                    <div className={styles.swatchGrid}>
                        {colorsToRender.map(color => (
                            <button
                                key={color}
                                className={`${styles.colorButton} ${selectedColor === color ? styles.activeColor : ''}`}
                                style={{ backgroundColor: getColorHex(color) }}
                                onClick={() => onColorSelect(color)}
                                title={color}
                                aria-label={`Select color ${color}`}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Sizes Section - Handles SizeVariant[] only */}
            {availableSizes && availableSizes.length > 0 && (
                <div className={styles.optionsSection}>
                    <label className={styles.optionLabel}>
                        Size: <span className="font-semibold text-gray-900">{selectedSize}</span>
                    </label>
                    <div className={styles.swatchGrid}>
                        {availableSizes.map((sizeItem: any) => {
                            // Extract size name depending on type - now only expecting object but keeping safe access
                            const sizeName = sizeItem.size;
                            // Check stock if variant
                            const isOutOfStock = sizeItem.stock && parseInt(sizeItem.stock) <= 0;

                            return (
                                <button
                                    key={sizeName}
                                    className={`${styles.sizeButton} ${selectedSize === sizeName ? styles.activeSize : ''} ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={() => !isOutOfStock && setSelectedSize(sizeName)}
                                    disabled={isOutOfStock}
                                    title={isOutOfStock ? 'Out of Stock' : ''}
                                >
                                    {sizeName}
                                </button>
                            );
                        })}
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
                <div className={styles.cartIndicator}>
                    ✓ {inCartQuantity} {t.products.alreadyInCart || 'already in cart'}
                </div>
            )}
        </div>
    );
}
