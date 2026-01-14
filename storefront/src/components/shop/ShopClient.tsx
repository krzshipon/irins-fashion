"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/common/ProductCard';
import SortSelect from '@/components/category/SortSelect';
import styles from '@/app/shop/shop.module.css'; // Importing from app dir as it was co-located
import { Product, Category } from '@/services/api/types';
import { useLocalization } from '@/context/LocalizationContext';
import { SortOption } from '@/services/api/products';
import ProductGridSkeleton from '@/components/common/ProductGridSkeleton';

interface ShopClientProps {
    initialProducts: Product[];
    categories: Category[];
}

export default function ShopClient({ initialProducts, categories }: ShopClientProps) {
    const { dictionary: t, locale } = useLocalization();
    const router = useRouter();
    const searchParams = useSearchParams();

    // URL Params
    const collectionParam = searchParams?.get('collection');
    const sortParam = searchParams?.get('sort') as SortOption | null;
    const categoriesParam = searchParams?.get('categories');
    const minPriceParam = searchParams?.get('minPrice');
    const maxPriceParam = searchParams?.get('maxPrice');

    // Local state for UI inputs (synced with URL)
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        categoriesParam ? categoriesParam.split(',') : []
    );
    const [minPrice, setMinPrice] = useState(minPriceParam || '');
    const [maxPrice, setMaxPrice] = useState(maxPriceParam || '');
    const [isNew, setIsNew] = useState(collectionParam === 'new');

    // We can assume loading is false initially as we possess server data
    // But when validating filter changes (client navigation), Next.js might suspend or we might want a manual loading state if we were fetching client side.
    // Since we rely on Router push -> Server Refresh, we might want to show loading indicator during transition if possible, 
    // or just rely on Suspense boundary in parent. 
    // For now, let's treat `products` as reactive to props.

    const products = initialProducts;

    // Sync state with URL if it changes externally (e.g. back button)
    useEffect(() => {
        setSelectedCategories(categoriesParam ? categoriesParam.split(',') : []);
        setMinPrice(minPriceParam || '');
        setMaxPrice(maxPriceParam || '');
        setIsNew(collectionParam === 'new');
    }, [categoriesParam, minPriceParam, maxPriceParam, collectionParam]);

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

    const toggleCategory = (categoryName: string) => {
        const newCategories = selectedCategories.includes(categoryName)
            ? selectedCategories.filter(c => c !== categoryName)
            : [...selectedCategories, categoryName];

        // Optimistic update
        setSelectedCategories(newCategories);
        updateUrlParams({ categories: newCategories.length > 0 ? newCategories.join(',') : null });
    };

    const handlePriceFilter = () => {
        updateUrlParams({
            minPrice: minPrice || null,
            maxPrice: maxPrice || null
        });
    };

    const clearFilters = () => {
        const params = new URLSearchParams(searchParams?.toString() || '');
        params.delete('categories');
        params.delete('minPrice');
        params.delete('maxPrice');
        // Do not clear collection if it's 'new' context? Original logic had a check.
        // "if (params.get('collection') === 'new')" -> mostly we want to clear ALL filters shown in sidebar.
        // Let's stick to cleaning all explicit filters.

        router.push(`?${params.toString()}`);
    };

    const handleStatusFilter = (checked: boolean) => {
        setIsNew(checked);
        updateUrlParams({ collection: checked ? 'new' : null });
    };

    return (
        <div className={`container ${styles.page}`}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.breadcrumbs}>
                    <Link href="/">{t.nav.home}</Link> / <span className={styles.active}>{t.nav.shop}</span>
                </div>
                <h1 className={styles.title}>{t.nav.shop}</h1>
            </header>

            <div className={styles.contentWrapper}>
                {/* Sidebar */}
                <aside className={styles.sidebar}>
                    <h3 className={styles.filterTitle}>{t.shop.filter}</h3>

                    {/* Category Filter */}
                    <div className={styles.section}>
                        <h4 className={styles.sectionTitle}>{t.shop.categories}</h4>
                        <div className={styles.categoryList}>
                            {categories.map(category => (
                                <label key={category.id} className={styles.categoryItem}>
                                    <input
                                        type="checkbox"
                                        className={styles.checkbox}
                                        checked={selectedCategories.includes(category.name)}
                                        onChange={() => toggleCategory(category.name)}
                                    />
                                    <span className={styles.categoryIcon}>{category.icon || '📦'}</span>
                                    <span>
                                        {locale === 'bn'
                                            ? category.localizedNames?.bn || category.name
                                            : category.name}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Price Filter */}
                    <div className={styles.section}>
                        <h4 className={styles.sectionTitle}>{t.shop.price}</h4>
                        <div className={styles.inputGroup}>
                            <input
                                type="number"
                                placeholder={t.shop.min}
                                className={styles.input}
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                onBlur={handlePriceFilter}
                                onKeyDown={(e) => e.key === 'Enter' && handlePriceFilter()}
                            />
                            <span>-</span>
                            <input
                                type="number"
                                placeholder={t.shop.max}
                                className={styles.input}
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                onBlur={handlePriceFilter}
                                onKeyDown={(e) => e.key === 'Enter' && handlePriceFilter()}
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className={styles.section}>
                        <h4 className={styles.sectionTitle}>{t.shop.status}</h4>
                        <label className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                className={styles.checkbox}
                                checked={isNew}
                                onChange={(e) => handleStatusFilter(e.target.checked)}
                            />
                            {t.products.newArrival}
                        </label>
                    </div>

                    {/* Clear Filters */}
                    {(selectedCategories.length > 0 || minPrice || maxPrice || isNew) && (
                        <button
                            className={styles.clearBtn}
                            onClick={clearFilters}
                        >
                            {t.shop.clearAllFilters}
                        </button>
                    )}
                </aside>

                {/* Main Content */}
                <div className={styles.main}>
                    {/* Toolbar */}
                    <div className={styles.toolbar}>
                        <div className={styles.count}>
                            {`${products.length} ${t.orders.items}`}
                        </div>
                        <SortSelect />
                    </div>

                    {/* Product Grid */}
                    {products.length > 0 ? (
                        <div className={styles.grid}>
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.empty}>
                            <p>{t.shop.noProductsFound}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
