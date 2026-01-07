"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductCard from '@/components/common/ProductCard';
import { getAllProducts, SortOption } from '@/services/api/products';
import { Product } from '@/services/api/types';
import { useLocalization } from '@/context/LocalizationContext';
import Link from 'next/link';
import SortSelect from '@/components/category/SortSelect';
import styles from './shop.module.css';

import { getCategories } from '@/services/api/categories'; // Added import
import { Category } from '@/services/api/types'; // Added import

export default function ShopPage() {
    const { dictionary: t, lang } = useLocalization(); // Destructure lang
    const router = useRouter(); // Import useRouter
    const searchParams = useSearchParams();
    const collectionParam = searchParams?.get('collection');
    const sortParam = searchParams?.get('sort') as SortOption | null;
    const categoriesParam = searchParams?.get('categories');
    const minPriceParam = searchParams?.get('minPrice');
    const maxPriceParam = searchParams?.get('maxPrice');

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    // Initial State from URL
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        categoriesParam ? categoriesParam.split(',') : []
    );
    const [minPrice, setMinPrice] = useState(minPriceParam || '');
    const [maxPrice, setMaxPrice] = useState(maxPriceParam || '');
    const [isNew, setIsNew] = useState(collectionParam === 'new');
    const [sortOption, setSortOption] = useState<SortOption | ''>(sortParam || '');
    const [loading, setLoading] = useState(true);

    // Sync State with URL changes
    useEffect(() => {
        setSelectedCategories(categoriesParam ? categoriesParam.split(',') : []);
        setMinPrice(minPriceParam || '');
        setMaxPrice(maxPriceParam || '');
        setIsNew(collectionParam === 'new');
        setSortOption(sortParam || '');
    }, [collectionParam, sortParam, categoriesParam, minPriceParam, maxPriceParam]);

    // Fetch Categories on Mount
    useEffect(() => {
        const fetchCategoriesData = async () => {
            const data = await getCategories();
            const sorted = data.sort((a, b) => a.sortOrder - b.sortOrder);
            setCategories(sorted);
        };
        fetchCategoriesData();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const { products: fetchedProducts } = await getAllProducts(
                selectedCategories.length > 0 ? selectedCategories : undefined,
                {
                    minPrice: minPrice ? Number(minPrice) : undefined,
                    maxPrice: maxPrice ? Number(maxPrice) : undefined,
                    isNew: isNew || undefined,
                },
                sortOption || undefined
            );
            setProducts(fetchedProducts);
            setLoading(false);
        };
        fetchProducts();
    }, [selectedCategories, minPrice, maxPrice, isNew, sortOption]);

    const updateUrlParams = (updates: Record<string, string | null | undefined>) => {
        const params = new URLSearchParams(searchParams?.toString() || '');

        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '') {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });

        router.push(`?${params.toString()}`);
    };

    const toggleCategory = (categoryName: string) => {
        const newCategories = selectedCategories.includes(categoryName)
            ? selectedCategories.filter(c => c !== categoryName)
            : [...selectedCategories, categoryName];

        updateUrlParams({ categories: newCategories.length > 0 ? newCategories.join(',') : null });
    };

    const handlePriceFilter = () => {
        updateUrlParams({
            minPrice: minPrice || null,
            maxPrice: maxPrice || null
        });
    };

    const clearFilters = () => {
        // Clear everything but keep collection context if needed? 
        // User asked for "reset" when going to new collection, implying global reset or context switch.
        // "Clear All Filters" usually clears currently applied filters.
        // Let's clear: categories, minPrice, maxPrice. Keep collection if it's "New Arrivals" context? 
        // Actually, if I'm in "New Arrivals" page (collection=new), "Clear All" might mean clear that too OR clear additional filters.
        // Let's assume it clears "user applied" filters.

        const params = new URLSearchParams(searchParams?.toString() || '');
        params.delete('categories');
        params.delete('minPrice');
        params.delete('maxPrice');
        // If "isNew" is driven by collection=new, we might not want to clear 'collection' unless the user explicitly wants to leave that view.
        // But the "isNew" checkbox toggles 'isNew' state locally in the previous code which didn't seem to update URL 'collection'.
        // Wait, "Status" filter had a checkbox for "New Arrival".

        if (params.get('collection') === 'new') {
            // If we are in collection=new mode, maybe we don't clear it via "Clear All"? 
            // But the checkbox below effectively toggles it.
        }
        // Let's just clear specific filters for now.
        router.push(`?${params.toString()}`);
    };

    // Status Filter Handler
    const handleStatusFilter = (checked: boolean) => {
        // If checked, we might want to set collection=new or just a filter. 
        // The previous code used collection=new to initialize isNew.
        // Let's standarize on using 'collection' param for this since backend likely uses it or we mapped it.
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
                    <h3 className={styles.filterTitle}>Filter</h3>

                    {/* Category Filter */}
                    <div className={styles.section}>
                        <h4 className={styles.sectionTitle}>Categories</h4>
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
                                        {lang === 'bn'
                                            ? category.localizedNames?.bn || category.name
                                            : category.name}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Price Filter */}
                    <div className={styles.section}>
                        <h4 className={styles.sectionTitle}>Price (BDT)</h4>
                        <div className={styles.inputGroup}>
                            <input
                                type="number"
                                placeholder="Min"
                                className={styles.input}
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                onBlur={handlePriceFilter}
                                onKeyDown={(e) => e.key === 'Enter' && handlePriceFilter()}
                            />
                            <span>-</span>
                            <input
                                type="number"
                                placeholder="Max"
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
                        <h4 className={styles.sectionTitle}>Status</h4>
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
                            Clear All Filters
                        </button>
                    )}
                </aside>

                {/* Main Content */}
                <div className={styles.main}>
                    {/* Toolbar */}
                    <div className={styles.toolbar}>
                        <div className={styles.count}>
                            {loading ? t.common.loading : `${products.length} ${t.orders.items}`}
                        </div>
                        <SortSelect />
                    </div>

                    {/* Product Grid */}
                    {loading ? (
                        <div className={styles.loading}>
                            <div className={styles.spinner}></div>
                            <p>{t.common.loading}</p>
                        </div>
                    ) : products.length > 0 ? (
                        <div className={styles.grid}>
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.empty}>
                            <p>No products found matching your filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
