"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ProductCard from '@/components/common/ProductCard';
import { getProductsBySlug, SortOption } from '@/services/api/products';
import { Product, Category } from '@/services/api/types';
import styles from '@/app/collection/[slug]/page.module.css'; // Reusing styles
import CategoryFilters from '@/components/category/CategoryFilters';
import SortSelect from '@/components/category/SortSelect';
import CategoryHeader from '@/components/category/CategoryHeader';

interface CategoryClientPageProps {
    slug: string;
}

export default function CategoryClientPage({ slug }: CategoryClientPageProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // URL State
    const minPriceParam = searchParams?.get('minPrice');
    const maxPriceParam = searchParams?.get('maxPrice');
    const isNewParam = searchParams?.get('isNew') === 'true';
    const sortParam = searchParams?.get('sort') as SortOption | null;

    // Local State
    const [rawProducts, setRawProducts] = useState<Product[]>([]);
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch Data (Only on SLUG change)
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            // Fetch ALL products for this category (no filters passed to API)
            const { products: fetchedProducts, category: fetchedCategory } = await getProductsBySlug(slug);

            setRawProducts(fetchedProducts);
            setCategory(fetchedCategory);
            setLoading(false);
        };
        fetchData();
    }, [slug]);

    // Derived Display Products (Client-side Filtering & Sorting)
    const displayedProducts = useMemo(() => {
        let result = [...rawProducts];

        // 1. Filter by Price
        if (minPriceParam) {
            result = result.filter(p => p.price >= Number(minPriceParam));
        }
        if (maxPriceParam) {
            result = result.filter(p => p.price <= Number(maxPriceParam));
        }

        // 2. Filter by Status
        if (isNewParam) {
            // Ensure 'isNew' property is populated correctly by API or derived in transformation
            result = result.filter(p => p.isNew);
        }

        // 3. Sort
        if (sortParam) {
            result.sort((a, b) => {
                switch (sortParam) {
                    case 'price_asc':
                        return a.price - b.price;
                    case 'price_desc':
                        return b.price - a.price;
                    case 'newest':
                        // Assuming isNew is boolean, sort true first
                        return (Number(b.isNew) - Number(a.isNew));
                    // Or if you have createdAt, use that. But currently utilizing isNew flag.
                    default:
                        return 0;
                }
            });
        }

        return result;
    }, [rawProducts, minPriceParam, maxPriceParam, isNewParam, sortParam]);

    // Construct a fallback category object
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
                    <CategoryFilters />
                </div>

                <div className={styles.main}>
                    <div className={styles.toolbar}>
                        <div className={styles.count}>
                            {loading ? 'Loading...' : `${displayedProducts.length} Products Found`}
                        </div>
                        <SortSelect />
                    </div>

                    {loading ? (
                        <div className={styles.loading}>
                            <div className={styles.spinner}></div>
                            <p>Loading products...</p>
                        </div>
                    ) : (
                        <>
                            <div className={styles.grid}>
                                {displayedProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            {displayedProducts.length === 0 && (
                                <div className={styles.empty}>
                                    <p>No products match your filters.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
