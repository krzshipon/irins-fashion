"use client";

import { useState, useEffect } from 'react';
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
    const [products, setProducts] = useState<Product[]>([]);
    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);

    // Derived state for the initial render / fast interaction
    const [minPrice, setMinPrice] = useState(minPriceParam || '');
    const [maxPrice, setMaxPrice] = useState(maxPriceParam || '');
    const [isNew, setIsNew] = useState(isNewParam);
    const [sortOption, setSortOption] = useState<SortOption | ''>(sortParam || '');

    // Sync State with URL changes
    useEffect(() => {
        setMinPrice(minPriceParam || '');
        setMaxPrice(maxPriceParam || '');
        setIsNew(isNewParam);
        setSortOption(sortParam || '');
    }, [minPriceParam, maxPriceParam, isNewParam, sortParam]);

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const { products: fetchedProducts, category: fetchedCategory } = await getProductsBySlug(
                slug,
                {
                    minPrice: minPriceParam ? Number(minPriceParam) : undefined,
                    maxPrice: maxPriceParam ? Number(maxPriceParam) : undefined,
                    isNew: isNewParam,
                },
                sortParam || undefined
            );

            setProducts(fetchedProducts);
            setCategory(fetchedCategory);
            setLoading(false);
        };
        fetchData();
    }, [slug, minPriceParam, maxPriceParam, isNewParam, sortParam]);

    // Construct a fallback category object if we have data or if loading
    // If loading and no category yet, we might want to show a skeleton or just wait.
    // For now, let's render what we can.

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
                            {loading ? 'Loading...' : `${products.length} Products Found`}
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
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            {products.length === 0 && (
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
