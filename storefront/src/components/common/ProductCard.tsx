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

    return (
        <div className={styles.card}>
            <div style={{ position: 'relative', height: '350px' }}>
                <Link href={`/product/${product.sku}`} style={{ display: 'block', height: '100%', width: '100%' }}>
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        style={{ objectFit: 'cover' }}
                    />
                    {/* Render Badges */}
                    {product.badges && product.badges.length > 0 && (
                        <div style={{
                            position: 'absolute',
                            top: '10px',
                            left: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '5px',
                            zIndex: 10
                        }}>
                            {product.badges.map((badge, index) => {
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
                    )}
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
                        addToCart(product, {
                            selectedColor: product.colors?.[0],
                            selectedSize: product.sizes?.[0]
                        });
                    }}
                >
                    <ShoppingBag size={20} />
                </button>
            </div>
            <Link href={`/product/${product.sku}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className={styles.cardContent}>
                    <div className={styles.cardCategory}>{product.category}</div>
                    <h3 className={styles.cardTitle}>{product.name}</h3>
                    <div className={styles.cardPrice}>
                        {product.currency} {product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                </div>
            </Link>
        </div>
    );
}
