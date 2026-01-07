"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
    const searchParams = useSearchParams();
    const collectionParam = searchParams?.get('collection');
    const sortParam = searchParams?.get('sort') as SortOption | null;

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]); // Changed type to Category[]
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [isNew, setIsNew] = useState(collectionParam === 'new');
    const [sortOption, setSortOption] = useState<SortOption | ''>(sortParam || '');
    const [loading, setLoading] = useState(true);

    // Sync isNew with collection param
    useEffect(() => {
        setIsNew(collectionParam === 'new');
    }, [collectionParam]);

    // Sync sortOption with sort param
    useEffect(() => {
        if (sortParam) {
            setSortOption(sortParam);
        }
    }, [sortParam]);

    // Fetch Categories on Mount
    useEffect(() => {
        const fetchCategoriesData = async () => {
            const data = await getCategories();
            // Sort by sortOrder
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

    const toggleCategory = (categoryName: string) => {
        setSelectedCategories(prev =>
            prev.includes(categoryName)
                ? prev.filter(c => c !== categoryName)
                : [...prev, categoryName]
        );
    };

    const handlePriceFilter = () => {
        // Trigger re-fetch (useEffect already listens to minPrice/maxPrice)
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
                                onChange={(e) => setIsNew(e.target.checked)}
                            />
                            {t.products.newArrival}
                        </label>
                    </div>

                    {/* Clear Filters */}
                    {(selectedCategories.length > 0 || minPrice || maxPrice || isNew) && (
                        <button
                            className={styles.clearBtn}
                            onClick={() => {
                                setSelectedCategories([]);
                                setMinPrice('');
                                setMaxPrice('');
                                setIsNew(false);
                            }}
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
