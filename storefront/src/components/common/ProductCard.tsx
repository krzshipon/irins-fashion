"use client";

import Link from 'next/link';
import Image from 'next/image';
import styles from './ProductCard.module.css';
import { Product } from '@/services/api/types';
import { useLocalization } from '@/context/LocalizationContext';
import { useCart } from '@/context/CartContext';

import { ShoppingBag } from 'lucide-react';

import { getLocalizedContent } from '@/lib/localizationUtils';
import { applyDiscount } from '@/lib/priceUtils';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { dictionary: t, locale } = useLocalization();
    const { addToCart, cartItems } = useCart();

    // Helper to get primary image
    const primaryImage = product.images.find(img => img.isPrimary)?.url || product.images[0]?.url || '/images/placeholder-product.png';

    // Helper to get default variant for cart (first color, first size)
    const defaultColor = product.colors?.[0];
    const defaultVariant = defaultColor?.variants?.[0];

    const localizedName = getLocalizedContent(product.localizedNames, locale, product.name);
    // Assuming category also has localizedNames in the Future, but for now fallback to name
    // If category is populated, we might need similar logic if backend provides it
    // Use localized category name if available
    const categoryName = getLocalizedContent(product.category?.localizedNames, locale, product.category?.name || '');

    const isInCart = cartItems.some(item => item.id === product.id);

    return (
        <div className={styles.card}>
            <div className={styles.imageWrapper}>
                <Link href={`/product/${product.slug}`} className={styles.link}>
                    <Image
                        src={primaryImage}
                        alt={localizedName}
                        fill
                        className={styles.image}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Render Badges */}
                    {(() => {
                        const allBadges = [...(product.badges || [])];

                        // Auto-generate discount badge if discount exists but no discount badge is present
                        if (product.discount && !allBadges.some(b => b.type === 'discount')) {
                            const discountText = product.discount.type === 'percentage'
                                ? `${product.discount.value}% OFF`
                                : `৳${product.discount.value} OFF`;

                            // Create a temporary badge object for display
                            allBadges.push({
                                id: 'temp-discount',
                                productId: product.id,
                                type: 'discount',
                                text: discountText
                            });
                        }

                        if (allBadges.length === 0) return null;

                        return (
                            <div className={styles.badgesContainer}>
                                {allBadges.map((badge, index) => {
                                    let backgroundColor = '#000000';
                                    let color = '#ffffff';

                                    switch (badge.type) {
                                        case 'new':
                                            backgroundColor = '#046A38'; // Emerald Green
                                            break;
                                        case 'discount':
                                            backgroundColor = '#dc2626'; // Red
                                            break;
                                        case 'bestseller':
                                            backgroundColor = '#f59e0b'; // Amber
                                            break;
                                        case 'custom':
                                            backgroundColor = badge.color || '#000000';
                                            color = badge.textColor || '#ffffff';
                                            break;
                                    }

                                    return (
                                        <span key={index} className={styles.badge} style={{ backgroundColor, color }}>
                                            {badge.text}
                                        </span>
                                    );
                                })}
                            </div>
                        );
                    })()}
                </Link>
                <button
                    className={`${styles.addToCartBtn} ${isInCart ? styles.active : ''}`}
                    title={t.products.addToCart}
                    aria-label={t.products.addToCart}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Add to cart with default variant if available
                        addToCart(product, {
                            selectedColor: defaultColor?.name,
                            selectedSize: defaultVariant?.size
                        });
                    }}
                >
                    <ShoppingBag size={20} />
                </button>
            </div>
            <Link href={`/product/${product.slug}`} className={styles.link}>
                <div className={styles.cardContent}>
                    <div>
                        <div className={styles.cardCategory}>{categoryName}</div>
                        <h3 className={styles.cardTitle}>{localizedName}</h3>
                    </div>
                    <div className={styles.cardPrice}>
                        {(() => {
                            // Calculate discounted price
                            const displayPrice = applyDiscount(product.price, product.discount);
                            const hasDiscount = product.discount && displayPrice < product.price;
                            const hasOriginalPrice = product.originalPrice && product.originalPrice > product.price;

                            // Show original price crossed out if: has discount OR has originalPrice
                            const showCrossedOut = hasDiscount || hasOriginalPrice;
                            const crossedOutPrice = hasDiscount ? product.price : product.originalPrice;

                            return (
                                <span className={hasDiscount ? styles.discounted : ''}>
                                    {showCrossedOut && crossedOutPrice && (
                                        <span className={styles.crossedOutPrice}>
                                            {product.currency} {crossedOutPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </span>
                                    )}
                                    <span className={styles.priceValue}>
                                        {product.currency} {displayPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </span>
                                </span>
                            );
                        })()}
                    </div>
                </div>
            </Link>
        </div>
    );
}
