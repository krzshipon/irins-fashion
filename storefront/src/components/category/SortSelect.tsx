"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useLocalization } from '@/context/LocalizationContext';
import styles from './SortSelect.module.css';

export default function SortSelect() {
    const { dictionary: t } = useLocalization();
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSort = searchParams?.get('sort') || 'newest';

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSort = e.target.value;
        const params = new URLSearchParams(searchParams?.toString() || '');
        params.set('sort', newSort);
        router.push(`?${params.toString()}`);
    };

    return (
        <div className={styles.container}>
            <label htmlFor="sort" className={styles.label}>{t.shop.sortBy}</label>
            <select
                id="sort"
                className={styles.select}
                value={currentSort}
                onChange={handleSortChange}
            >
                <option value="newest">{t.shop.newestArrivals}</option>
                <option value="price_asc">{t.shop.priceLowToHigh}</option>
                <option value="price_desc">{t.shop.priceHighToLow}</option>
            </select>
        </div>
    );
}
