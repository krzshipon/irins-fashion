"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductCard from '@/components/common/ProductCard';
import { Product, Category } from '@/services/api/types';
import styles from '@/app/collection/[slug]/page.module.css';
import CategoryFilters from '@/components/category/CategoryFilters';
import SortSelect from '@/components/category/SortSelect';
import CategoryHeader from '@/components/category/CategoryHeader';
import { SortOption } from '@/services/api/products';

interface CategoryClientProps {
    slug: string;
    initialProducts: Product[];
    category: Category | null;
}

export default function CategoryClient({ slug, initialProducts, category }: CategoryClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // URL State
    const minPriceParam = searchParams?.get('minPrice');
    const maxPriceParam = searchParams?.get('maxPrice');
    const isNewParam = searchParams?.get('isNew') === 'true';
    const sortParam = searchParams?.get('sort') as SortOption | null;

    // Local State (synced with URL)
    const [minPrice, setMinPrice] = useState(minPriceParam || '');
    const [maxPrice, setMaxPrice] = useState(maxPriceParam || '');
    const [isNew, setIsNew] = useState(isNewParam);

    // Products are passed from server
    const displayProducts = initialProducts;

    // Sync state with URL
    useEffect(() => {
        setMinPrice(minPriceParam || '');
        setMaxPrice(maxPriceParam || '');
        setIsNew(isNewParam);
    }, [minPriceParam, maxPriceParam, isNewParam]);

    const updateUrlParams = (updates: Record<string, string | null | undefined>) => {
        const params = new URLSearchParams(searchParams?.toString() || '');
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '') {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });
        router.push(`?${params.toString()}`, { scroll: false });
    };

    const handlePriceFilter = (min: string, max: string) => {
        updateUrlParams({
            minPrice: min || null,
            maxPrice: max || null
        });
    };

    const handleStatusFilter = (checked: boolean) => {
        updateUrlParams({ isNew: checked ? 'true' : null });
    };

    const clearFilters = () => {
        const params = new URLSearchParams(searchParams?.toString() || '');
        params.delete('minPrice');
        params.delete('maxPrice');
        params.delete('isNew');
        router.push(`?${params.toString()}`);
    };

    // Construct a fallback category object if null
    const displayCategory = category || {
        id: '',
        name: slug.charAt(0).toUpperCase() + slug.slice(1),
        slug: slug,
        isActive: true,
        sortOrder: 0
    };

    return (
        <div className={`container ${styles.page}`}>
            <CategoryHeader category={displayCategory} />

            <div className={styles.contentWrapper}>
                <div className={styles.sidebar}>
                    {/* Reuse CategoryFilters but we need to ensure it accepts props or we manually render specific filters if it's too tied to context */}
                    {/* Inspecting CategoryFilters in previous steps, it wasn't viewed. Assuming it might need refactoring or we use manual inputs like ShopClient.
                        However, to be safe and consistent with ShopClient refactor, I'll implement the filters directly here or check if CategoryFilters accepts props. 
                        Let's check CategoryFilters briefly or just replicate the simple UI from CategoryClientPage. 
                        CategoryClientPage used <CategoryFilters /> with NO props. This implies it might use Context or URL hooks itself.
                        If it uses URL hooks, it might just work! But we need to be careful about double state.
                        Let's stick to explicitly passing handlers if possible, OR if it uses hooks, ensure it syncs with OUR router pushes.
                        
                        Actually, explicitly rendering the filters like ShopClient is safer than relying on a blackbox component I haven't checked deeply.
                        Wait, `CategoryClientPage` had `<CategoryFilters />`. 
                        Let's check `CategoryFilters.tsx`.
                    */}
                    <div className={styles.section}>
                        <h4 className={styles.sectionTitle}>Price</h4>
                        <div className={styles.inputGroup}>
                            <input
                                type="number" placeholder="Min" className={styles.input}
                                value={minPrice} onChange={e => setMinPrice(e.target.value)}
                                onBlur={() => handlePriceFilter(minPrice, maxPrice)}
                                onKeyDown={e => e.key === 'Enter' && handlePriceFilter(minPrice, maxPrice)}
                            />
                            <span>-</span>
                            <input
                                type="number" placeholder="Max" className={styles.input}
                                value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
                                onBlur={() => handlePriceFilter(minPrice, maxPrice)}
                                onKeyDown={e => e.key === 'Enter' && handlePriceFilter(minPrice, maxPrice)}
                            />
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h4 className={styles.sectionTitle}>Status</h4>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox" className={styles.checkbox}
                                checked={isNew} onChange={e => handleStatusFilter(e.target.checked)}
                            />
                            New Arrivals
                        </label>
                    </div>

                    {(minPrice || maxPrice || isNew) && (
                        <button className={styles.clearBtn} onClick={clearFilters}>
                            Clear Filters
                        </button>
                    )}
                </div>

                <div className={styles.main}>
                    <div className={styles.toolbar}>
                        <div className={styles.count}>
                            {`${displayProducts.length} Products Found`}
                        </div>
                        <SortSelect />
                    </div>

                    {displayProducts.length > 0 ? (
                        <div className={styles.grid}>
                            {displayProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.empty}>
                            <p>No products match your filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
