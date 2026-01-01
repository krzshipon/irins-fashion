import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ProductCard from '@/components/common/ProductCard';
import { getProductsBySlug } from '@/services/api/products';
import styles from './page.module.css';

import CategoryFilters from '@/components/category/CategoryFilters';
import SortSelect from '@/components/category/SortSelect';

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
    const sort = resolvedSearchParams.sort as any;

    const { categoryName, products } = await getProductsBySlug(slug, { minPrice, maxPrice, isNew }, sort);

    if (!categoryName) {
        notFound();
    }

    return (
        <div className={`container ${styles.page}`}>
            <header className={styles.header}>
                <div className={styles.breadcrumbs}>
                    <span>Home</span> / <span>Collection</span> / <span className={styles.active}>{categoryName}</span>
                </div>
                <h1 className={styles.title}>{categoryName} Collection</h1>
            </header>

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
