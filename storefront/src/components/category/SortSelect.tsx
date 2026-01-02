"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import styles from './SortSelect.module.css';

export default function SortSelect() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get('sort') || 'newest';

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSort = e.target.value;
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', newSort);
        router.push(`?${params.toString()}`);
    };

    return (
        <div className={styles.container}>
            <label htmlFor="sort" className={styles.label}>Sort by:</label>
            <select
                id="sort"
                className={styles.select}
                value={currentSort}
                onChange={handleSortChange}
            >
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
            </select>
        </div>
    );
}
