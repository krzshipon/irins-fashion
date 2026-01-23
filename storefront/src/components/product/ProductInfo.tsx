"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/services/api/types';
import styles from './ProductDetails.module.css';
import { useCart } from '@/context/CartContext';
import { useLocalization } from '@/context/LocalizationContext';
import { getLocalizedContent } from '@/lib/localizationUtils';
import { applyDiscount } from '@/lib/priceUtils';
import dynamic from 'next/dynamic';

const SizeChartModal = dynamic(() => import('./SizeChartModal'), {
    loading: () => null
});

interface ProductInfoProps {
    product: Product;
    selectedColor: string | null;
    onColorSelect: (color: string) => void;
    initialSize?: string | null;
}

export default function ProductInfo({ product, selectedColor, onColorSelect, initialSize }: ProductInfoProps) {
    const router = useRouter();
    const { locale, dictionary: t } = useLocalization();

    const localizedName = getLocalizedContent(product.localizedNames, locale, product.name);
    const localizedDescription = getLocalizedContent(product.localizedDescriptions, locale, product.description || '');

    // --- Helper Logic for Variants ---

    // Get the currently selected color object
    const currentColor = product.colors?.find(c => c.name === selectedColor);

    // Get available sizes based on current color variants
    const availableSizes = currentColor ? currentColor.variants : [];

    const [selectedSize, setSelectedSize] = useState<string | null>(() => {
        // Try to respect initialSize strictly first
        if (initialSize) {
            // Validate against current variant if exists
            if (currentColor) {
                if (currentColor.variants.some(v => v.size === initialSize)) return initialSize;
            }
        }

        // Default to first available size
        if (currentColor && currentColor.variants.length > 0) {
            return currentColor.variants[0].size;
        }
        return null;
    });

    // Determine effectively selected variant details
    const currentVariant = currentColor?.variants.find(v => v.size === selectedSize);

    // Calculate Base Price (before discount) - from variant or product
    const basePrice = (() => {
        if (currentVariant && currentVariant.price) {
            return Number(currentVariant.price);
        }
        return product.price;
    })();

    // Apply discount to get the display/cart price
    const currentPrice = applyDiscount(basePrice, product.discount);

    // Calculate SKU
    const currentSku = currentVariant?.sku || product.sku;

    // Standalone quantity state
    const [quantity, setQuantity] = useState(1);
    const { addToCart, cartItems } = useCart();

    // Effect: When Color changes, ensure Size is valid
    useEffect(() => {
        if (currentColor && selectedSize && !currentColor.variants.some(v => v.size === selectedSize)) {
            if (currentColor.variants.length > 0) {
                setSelectedSize(currentColor.variants[0].size);
            } else {
                setSelectedSize(null);
            }
        } else if (currentColor && !selectedSize && currentColor.variants.length > 0) {
            setSelectedSize(currentColor.variants[0].size);
        }
    }, [selectedColor, currentColor, selectedSize]);

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
        if (product.colors?.length && !selectedColor) {
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

        setQuantity(1);
    };

    const handleOrderNow = () => {
        if (product.colors?.length && !selectedColor) {
            alert('Please select a color');
            return;
        }

        // Helper to find primary image
        const primaryImage = product.images.find(img => img.isPrimary)?.url || product.images[0]?.url || '/images/placeholder-product.png';

        const directOrderItem = {
            id: product.id,
            sku: currentSku,
            name: product.name,
            price: currentPrice, // Discounted price
            effectivePrice: currentPrice, // For cart compatibility
            originalPrice: basePrice, // Before discount
            currency: product.currency,
            image: primaryImage,
            quantity: quantity,
            selectedColor: selectedColor || undefined,
            selectedSize: selectedSize || undefined,
            cartItemId: `direct-${product.id}-${selectedColor || 'nocolor'}-${selectedSize || 'nosize'}`,
            discount: product.discount, // Include discount info
        };

        sessionStorage.setItem('directOrder', JSON.stringify(directOrderItem));
        router.push('/checkout?direct=true');
    };

    // Helper for color values
    const getColorHex = (colorName: string) => {
        const color = product.colors?.find(c => c.name === colorName);
        if (color && color.code) return color.code;
        return 'var(--color-border)'; // Default fallback
    };

    // Derived lists for rendering
    const colorsToRender = product.colors?.map(c => c.name) || [];

    // Size Chart Modal State
    const [showSizeChart, setShowSizeChart] = useState(false);

    return (
        <div className={styles.infoContainer}>
            <div className={styles.header}>
                <div className={styles.category}>{product.category?.name}</div>
                <h1 className={styles.title}>{localizedName}</h1>

                {/* Badges */}
                {product.badges && product.badges.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                        {product.badges.map((badge, idx) => {
                            let backgroundColor = '#000000';
                            let color = '#ffffff';
                            switch (badge.type) {
                                case 'new': backgroundColor = 'var(--color-primary)'; break;
                                case 'discount': backgroundColor = 'var(--color-error)'; break;
                                case 'bestseller': backgroundColor = 'var(--color-warning)'; break;
                                case 'custom': backgroundColor = badge.color || '#000'; color = badge.textColor || '#fff'; break;
                            }
                            return (
                                <span key={idx} style={{
                                    backgroundColor, color, padding: '4px 8px', borderRadius: '4px',
                                    fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase'
                                }}>
                                    {badge.text}
                                </span>
                            );
                        })}
                    </div>
                )}

                <div className={styles.price}>
                    {/* Show crossed-out price when there's a discount OR originalPrice */}
                    {(product.discount || (product.originalPrice && product.originalPrice > currentPrice)) && (
                        <span style={{
                            textDecoration: 'line-through',
                            color: 'var(--color-text-muted)',
                            fontSize: '0.8em',
                            marginRight: '12px',
                            fontWeight: 'normal'
                        }}>
                            {product.currency} {(product.discount ? basePrice : product.originalPrice)?.toLocaleString()}
                        </span>
                    )}
                    <span style={{
                        color: (product.discount || product.originalPrice) ? 'var(--color-error)' : 'inherit',
                        fontWeight: (product.discount || product.originalPrice) ? 'bold' : '500'
                    }}>
                        {product.currency} {currentPrice?.toLocaleString() || 'N/A'}
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
                    <p>{localizedDescription}</p>
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

            {/* Sizes Section */}
            {availableSizes && availableSizes.length > 0 && (
                <div className={styles.optionsSection}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label className={styles.optionLabel}>
                            Size: <span className="font-semibold text-gray-900">{selectedSize}</span>
                        </label>
                        {product.sizeChart && (
                            <button
                                onClick={() => setShowSizeChart(true)}
                                style={{
                                    fontSize: '14px', textDecoration: 'underline', color: '#666',
                                    border: 'none', background: 'none', cursor: 'pointer'
                                }}
                            >
                                Size Guide
                            </button>
                        )}
                    </div>
                    <div className={styles.swatchGrid}>
                        {availableSizes.map((variant: any) => {
                            const sizeName = variant.size;
                            const isOutOfStock = variant.stock && parseInt(variant.stock) <= 0;
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

            {/* Size Chart Modal */}
            {showSizeChart && product.sizeChart && (
                <SizeChartModal
                    imageUrl={product.sizeChart}
                    onClose={() => setShowSizeChart(false)}
                />
            )}
        </div>
    );
}
