"use client";

import Link from 'next/link';
import Image from 'next/image';
import styles from '@/app/page.module.css'; // Reusing styles for now to ensure consistency
import { Product } from '@/services/api/types';
import { useLocalization } from '@/context/LocalizationContext';
import { useCart } from '@/context/CartContext';

import { ShoppingBag } from 'lucide-react';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { t } = useLocalization();
    const { addToCart, cartItems } = useCart();

    // Helper to get primary image
    const primaryImage = product.images.find(img => img.isPrimary)?.url || product.images[0]?.url || '/images/placeholder-product.png';

    // Helper to get default variant for cart (first color, first size)
    const defaultColor = product.colors?.[0];
    const defaultVariant = defaultColor?.variants?.[0];

    return (
        <div className={styles.card}>
            <div style={{ position: 'relative', height: '350px' }}>
                <Link href={`/product/${product.slug}`} style={{ display: 'block', height: '100%', width: '100%' }}>
                    <Image
                        src={primaryImage}
                        alt={product.name}
                        fill
                        style={{ objectFit: 'cover' }}
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
                            <div style={{
                                position: 'absolute',
                                top: '10px',
                                left: '10px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '5px',
                                zIndex: 10
                            }}>
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
                                        <span key={index} style={{
                                            backgroundColor,
                                            color,
                                            padding: '4px 8px',
                                            fontSize: '10px',
                                            fontWeight: 'bold',
                                            borderRadius: '4px',
                                            textTransform: 'uppercase',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }}>
                                            {badge.text}
                                        </span>
                                    );
                                })}
                            </div>
                        );
                    })()}
                </Link>
                <button
                    className={styles.addToCartBtn}
                    title={t('products.addToCart')}
                    aria-label={t('products.addToCart')}
                    style={{
                        backgroundColor: cartItems.some(item => item.id === product.id) ? '#046A38' : undefined,
                        color: cartItems.some(item => item.id === product.id) ? '#ffffff' : undefined
                    }}
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
            <Link href={`/product/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className={styles.cardContent}>
                    <div className={styles.cardCategory}>{product.category?.name}</div>
                    <h3 className={styles.cardTitle}>{product.name}</h3>
                    <div className={styles.cardPrice}>
                        {product.originalPrice && product.originalPrice > product.price && (
                            <span style={{
                                textDecoration: 'line-through',
                                color: '#9ca3af',
                                fontSize: '0.9em',
                                marginRight: '8px'
                            }}>
                                {product.currency} {product.originalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                        )}
                        <span style={{
                            color: product.originalPrice ? '#dc2626' : 'inherit',
                            fontWeight: product.originalPrice ? 'bold' : 'normal'
                        }}>
                            {product.currency} {product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
}
