"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductCard from '@/components/common/ProductCard';
import { getAllProducts, SortOption } from '@/services/api/products';
import { Product } from '@/services/api/types';
import { useLocalization } from '@/context/LocalizationContext';
import Link from 'next/link';
import SortSelect from '@/components/category/SortSelect';
import styles from './shop.module.css';

import { getCategories } from '@/services/api/categories';
import { Category } from '@/services/api/types';
import ProductGridSkeleton from '@/components/common/ProductGridSkeleton';
import ShopSkeleton from '@/components/shop/ShopSkeleton';

function ShopContent() {
    const { dictionary: t, locale } = useLocalization();
    const router = useRouter();
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
        const params = new URLSearchParams(searchParams?.toString() || '');
        params.delete('categories');
        params.delete('minPrice');
        params.delete('maxPrice');

        if (params.get('collection') === 'new') {
            // Context specific logic
        }
        router.push(`?${params.toString()}`);
    };

    const handleStatusFilter = (checked: boolean) => {
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
                            {loading ? t.common.loading : `${products.length} ${t.orders.items}`}
                        </div>
                        <SortSelect />
                    </div>

                    {/* Product Grid */}
                    {loading ? (
                        <ProductGridSkeleton />
                    ) : products.length > 0 ? (
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

export default function ShopPage() {
    return (
        <Suspense fallback={<ShopSkeleton />}>
            <ShopContent />
        </Suspense>
    );
}
