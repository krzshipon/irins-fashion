import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ProductCard from '@/components/common/ProductCard';
import { getProductsBySlug, SortOption } from '@/services/api/products';
import styles from './page.module.css';

import CategoryFilters from '@/components/category/CategoryFilters';
import SortSelect from '@/components/category/SortSelect';
import CategoryHeader from '@/components/category/CategoryHeader';

// Type for the page props
type Props = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Generate SEO Metadata dynamically
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const { categoryName } = await getProductsBySlug(slug);

    if (!categoryName) {
        return {
            title: 'Category Not Found | Irin\'s Fashion',
        };
    }

    return {
        title: `Shop ${categoryName}s - Premium Collection | Irin's Fashion`,
        description: `Explore our exclusive collection of ${categoryName}s. curated for style and modesty.`,
    };
}

export default async function CategoryPage({ params, searchParams }: Props) {
    const { slug } = await params;
    const resolvedSearchParams = await searchParams;

    const minPrice = resolvedSearchParams.minPrice ? Number(resolvedSearchParams.minPrice) : undefined;
    const maxPrice = resolvedSearchParams.maxPrice ? Number(resolvedSearchParams.maxPrice) : undefined;
    const isNew = resolvedSearchParams.isNew === 'true';
    const sort = resolvedSearchParams.sort as SortOption;

    const { categoryName, products, category } = await getProductsBySlug(slug, { minPrice, maxPrice, isNew }, sort);

    if (!categoryName) {
        notFound();
    }

    // Prepare a fallback category object if only name is returned (legacy/mock support)
    const categoryObj = category || { name: categoryName, localizedNames: {} };

    return (
        <div className={`container ${styles.page}`}>
            <CategoryHeader category={categoryObj} />

            <div className={styles.contentWrapper}>
                <div className={styles.sidebar}>
                    <CategoryFilters />
                </div>

                <div className={styles.main}>
                    <div className={styles.toolbar}>
                        <div className={styles.count}>{products.length} Products Found</div>
                        <SortSelect />
                    </div>

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
                </div>
            </div>
        </div>
    );
}
