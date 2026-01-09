"use client";

import Link from 'next/link';
import ProductCard from '@/components/common/ProductCard';
import { Product } from '@/services/api/types';
import styles from './CategoryProductRow.module.css';
import { useLocalization } from '@/context/LocalizationContext';

interface CategoryProductRowProps {
    titleKey?: string; // Made optional
    title?: string;    // Direct title override
    categorySlug: string; // e.g. 'hijab' for fetching products
    link: string; // Link to the full collection
}

import { useEffect, useState, useRef } from 'react';
import { getProductsBySlug } from '@/services/api/products';

export default function CategoryProductRow({ titleKey, title, categorySlug, link }: CategoryProductRowProps) {
    const { t } = useLocalization();
    const [products, setProducts] = useState<Product[]>([]);
    const hasFetched = useRef<string | null>(null);

    useEffect(() => {
        // Prevent duplicate fetches (React Strict Mode calls useEffect twice in dev)
        if (hasFetched.current === categorySlug) return;

        const fetchProducts = async () => {
            hasFetched.current = categorySlug;
            // Use getProductsBySlug which fetches by category slug
            // Backend currently doesn't support 'limit' via this helper, so we slice client-side for now
            const { products: fetchedProducts } = await getProductsBySlug(categorySlug);
            setProducts(fetchedProducts.slice(0, 4));
        };
        fetchProducts();
    }, [categorySlug]);

    if (products.length === 0) return null;

    return (
        <section className={`container ${styles.section}`}>
            <div className={styles.header}>
                <h2 className={styles.title}>{title || (titleKey ? t(titleKey) : '')}</h2>
                <Link href={link} className={styles.moreLink}>
                    {t('common.seeMore')}
                </Link>
            </div>

            <div className={styles.grid}>
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}
