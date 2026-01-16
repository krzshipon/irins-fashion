"use client";

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import ProductCard from '@/components/common/ProductCard';
import Skeleton from '@/components/common/Skeleton';
import { Product } from '@/services/api/types';
import { getProductsBySlug } from '@/services/api/products';
import { useLocalization } from '@/context/LocalizationContext';
import styles from './CategoryProductRow.module.css';

interface CategoryProductRowProps {
    titleKey?: string;
    title?: string;
    categorySlug: string;
    link: string;
    index: number;
}

export default function CategoryProductRow({ titleKey, title, categorySlug, link, index }: CategoryProductRowProps) {
    const { t } = useLocalization();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { products: fetchedProducts } = await getProductsBySlug(categorySlug);
                setProducts(fetchedProducts.slice(0, 4));
            } catch (error) {
                console.error("Failed to fetch products for category:", categorySlug, error);
            } finally {
                setIsLoading(false);
            }
        };

        // Stagger loading based on index (one by one effect)
        const timeoutId = setTimeout(() => {
            fetchProducts();
        }, index * 800); // 800ms delay per row

        return () => clearTimeout(timeoutId);
    }, [categorySlug, index]);

    if (!isLoading && products.length === 0) return null;

    return (
        <section className={`container ${styles.section}`}>
            <div className={styles.header}>
                <h2 className={styles.title}>{title || (titleKey ? t(titleKey) : '')}</h2>
                <Link href={link} className={styles.moreLink}>
                    {t('common.seeMore')}
                </Link>
            </div>

            <div className={styles.grid}>
                {isLoading ? (
                    // Skeleton Loading State
                    Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} style={{
                            background: 'var(--color-surface)',
                            borderRadius: 'var(--radius-md)',
                            overflow: 'hidden',
                            boxShadow: 'var(--shadow-sm)'
                        }}>
                            <Skeleton height={350} width="100%" />
                            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                <Skeleton height={12} width="40%" />
                                <Skeleton height={20} width="80%" />
                                <Skeleton height={16} width="30%" />
                            </div>
                        </div>
                    ))
                ) : (
                    products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                )}
            </div>
        </section>
    );
}
