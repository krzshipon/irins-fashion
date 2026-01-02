"use client";

import Link from 'next/link';
import ProductCard from '@/components/common/ProductCard';
import { Product } from '@/services/api/types';
import styles from './CategoryProductRow.module.css';
import { useLocalization } from '@/context/LocalizationContext';

interface CategoryProductRowProps {
    titleKey: string;
    categorySlug: string; // e.g. 'hijab' for fetching products
    link: string; // Link to the full collection
}

import { useEffect, useState } from 'react';
import { getProductsByCategory } from '@/services/api/products';

export default function CategoryProductRow({ titleKey, categorySlug, link }: CategoryProductRowProps) {
    const { t } = useLocalization();
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const data = await getProductsByCategory(categorySlug, 4); // Limit 4
            setProducts(data);
        };
        fetchProducts();
    }, [categorySlug]);

    if (products.length === 0) return null;

    return (
        <section className={`container ${styles.section}`}>
            <div className={styles.header}>
                <h2 className={styles.title}>{t(titleKey)}</h2>
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
