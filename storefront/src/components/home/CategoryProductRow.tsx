"use client";

import Link from 'next/link';
import ProductCard from '@/components/common/ProductCard';
import { Product } from '@/services/api/types';
import { useLocalization } from '@/context/LocalizationContext';
import styles from './CategoryProductRow.module.css';

interface CategoryProductRowProps {
    titleKey?: string;
    title?: string;
    categorySlug: string;
    link: string;
    index: number;
    products: Product[];
}

export default function CategoryProductRow({ titleKey, title, link, products }: CategoryProductRowProps) {
    const { t } = useLocalization();

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
