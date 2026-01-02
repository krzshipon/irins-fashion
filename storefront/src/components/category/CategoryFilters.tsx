"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './CategoryFilters.module.css';

export default function CategoryFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
    const [isNew, setIsNew] = useState(searchParams.get('isNew') === 'true');

    useEffect(() => {
        // Sync local state when URL params change (e.g. navigation)
        setMinPrice(searchParams.get('minPrice') || '');
        setMaxPrice(searchParams.get('maxPrice') || '');
        setIsNew(searchParams.get('isNew') === 'true');
    }, [searchParams]);

    const updateFilters = (key: string, value: string | boolean) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, String(value));
        } else {
            params.delete(key);
        }
        router.push(`?${params.toString()}`);
    };

    const handlePriceBlur = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (minPrice) params.set('minPrice', minPrice);
        else params.delete('minPrice');

        if (maxPrice) params.set('maxPrice', maxPrice);
        else params.delete('maxPrice');

        router.push(`?${params.toString()}`);
    };

    return (
        <aside className={styles.sidebar}>
            <h3 className={styles.title}>Filter</h3>

            <div className={styles.section}>
                <h4 className={styles.sectionTitle}>Price (BDT)</h4>
                <div className={styles.inputGroup}>
                    <input
                        type="number"
                        placeholder="Min"
                        className={styles.input}
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        onBlur={handlePriceBlur}
                        onKeyDown={(e) => e.key === 'Enter' && handlePriceBlur()}
                    />
                    <span>-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        className={styles.input}
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        onBlur={handlePriceBlur}
                        onKeyDown={(e) => e.key === 'Enter' && handlePriceBlur()}
                    />
                </div>
            </div>

            <div className={styles.section}>
                <h4 className={styles.sectionTitle}>Status</h4>
                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={isNew}
                        onChange={(e) => {
                            setIsNew(e.target.checked);
                            updateFilters('isNew', e.target.checked);
                        }}
                    />
                    New Arrivals
                </label>
            </div>
        </aside>
    );
}
