"use client";

import { useState, useEffect } from 'react';
import ProductCard from '@/components/common/ProductCard';
import { getAllProducts, SortOption } from '@/services/api/products';
import { Product } from '@/services/api/types';
import { useLocalization } from '@/context/LocalizationContext';
import Link from 'next/link';
import SortSelect from '@/components/category/SortSelect';
import styles from './shop.module.css';

// Category icon mapping
const categoryIcons: Record<string, string> = {
    'Hijab': '🧕',
    'Abaya': '👗',
    'Dress': '👘',
    'Accessories': '👜',
};

export default function ShopPage() {
    const { dictionary: t } = useLocalization();
    const [products, setProducts] = useState<Product[]>([]);
    const [allCategories, setAllCategories] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [isNew, setIsNew] = useState(false);
    const [sortOption, setSortOption] = useState<SortOption | ''>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const { products, categories } = await getAllProducts(
                selectedCategories.length > 0 ? selectedCategories : undefined,
                {
                    minPrice: minPrice ? Number(minPrice) : undefined,
                    maxPrice: maxPrice ? Number(maxPrice) : undefined,
                    isNew: isNew || undefined,
                },
                sortOption || undefined
            );
            setProducts(products);
            setAllCategories(categories);
            setLoading(false);
        };
        fetchProducts();
    }, [selectedCategories, minPrice, maxPrice, isNew, sortOption]);

    const toggleCategory = (category: string) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const getCategoryLabel = (category: string): string => {
        switch (category.toLowerCase()) {
            case 'hijab': return t.categories.hijab;
            case 'abaya': return t.categories.abaya;
            case 'dress': return t.categories.dress;
            case 'accessories': return t.categories.accessories;
            default: return category;
        }
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
                            {allCategories.map(category => (
                                <label key={category} className={styles.categoryItem}>
                                    <input
                                        type="checkbox"
                                        className={styles.checkbox}
                                        checked={selectedCategories.includes(category)}
                                        onChange={() => toggleCategory(category)}
                                    />
                                    <span className={styles.categoryIcon}>{categoryIcons[category] || '📦'}</span>
                                    <span>{getCategoryLabel(category)}</span>
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
