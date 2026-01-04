"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './CategorySection.module.css';
import { getCategories } from '@/services/api/categories';
import { Category } from '@/services/api/types';
import { useLocalization } from '@/context/LocalizationContext';

export default function CategorySection() {
    const { t } = useLocalization();
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error("Failed to load categories", error);
            }
        };
        fetchCategories();
    }, []);

    if (categories.length === 0) return null;

    return (
        <section className={`container ${styles.section}`}>
            <h2 className={styles.title}>{t('section.categories')}</h2>

            <div className={styles.grid}>
                {categories.map((category) => (
                    <Link href={`/collection/${category.slug}`} key={category.id} className={styles.item}>
                        <div className={styles.imageContainer}>
                            <Image
                                src={category.image || '/images/placeholder-category.png'}
                                alt={category.name}
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                        <span className={styles.label}>{t(`categories.${category.slug}`) || category.name}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
