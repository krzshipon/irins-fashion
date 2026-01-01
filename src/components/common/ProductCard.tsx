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
    const { addToCart } = useCart();

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
                </Link>
                <button
                    className={styles.addToCartBtn}
                    title={t('products.addToCart')}
                    aria-label={t('products.addToCart')}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart(product);
                        // Optional: Add visual feedback (toast/animation) here
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
