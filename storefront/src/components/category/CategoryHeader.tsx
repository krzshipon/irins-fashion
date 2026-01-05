"use client";

import { useLocalization } from '@/context/LocalizationContext';
import styles from '@/app/collection/[slug]/page.module.css';

interface CategoryHeaderProps {
    category: {
        name: string;
        localizedNames?: Record<string, string>;
    };
}

export default function CategoryHeader({ category }: CategoryHeaderProps) {
    const { t, locale } = useLocalization();

    // Fallback to name if localized name is missing
    const displayName = category.localizedNames?.[locale] || category.name;

    return (
        <header className={styles.header}>
            <div className={styles.breadcrumbs}>
                <span>Home</span> / <span>Collection</span> / <span className={styles.active}>{displayName}</span>
            </div>
            <h1 className={styles.title}>{displayName} Collection</h1>
        </header>
    );
}
