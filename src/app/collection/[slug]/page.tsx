import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ProductCard from '@/components/common/ProductCard';
import { getProductsBySlug } from '@/services/api/products';
import styles from './page.module.css';

// Type for the page props
type Props = {
    params: Promise<{ slug: string }>;
};

// Generate SEO Metadata dynamically
export async function generateMetadata({ params }: Props): Promise<Metadata> {
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

export default async function CategoryPage({ params }: Props) {
    const { slug } = await params;
    const { categoryName, products } = await getProductsBySlug(slug);

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
                <p className={styles.count}>{products.length} Products Found</p>
            </header>

            <div className={styles.grid}>
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {products.length === 0 && (
                <div className={styles.empty}>
                    <p>No products found in this category.</p>
                </div>
            )}
        </div>
    );
}
