import styles from './page.module.css';
import { getFeaturedProducts, getProductsBySlug } from '@/services/api/products';
import { getCategories } from '@/services/api/categories';
import { getHeroBanners } from '@/services/api/marketing';
import CategorySection from '@/components/home/CategorySection';
import CategoryProductRow from '@/components/home/CategoryProductRow';
import ProductCard from '@/components/common/ProductCard';
import Hero from '@/components/home/Hero';

// Server Component - Async Function
export default async function Home() {
  // Parallel Data Fetching
  const [products, banners, categories] = await Promise.all([
    getFeaturedProducts(),
    getHeroBanners(),
    getCategories(),
  ]);

  // Fetch products for each category in parallel
  // This replaces the client-side fetching in CategoryProductRow
  const categoryProductsData = await Promise.all(
    categories.map(cat => getProductsBySlug(cat.slug))
  );

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <Hero banners={banners} />

      <section className="container">
        <CategorySection categories={categories} />
      </section>

      <section className={`container ${styles.section}`}>
        <h2 className={styles.sectionTitle}>New Arrivals</h2>

        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {categories.map((category, index) => {
        // Find the fetched data for this category
        // Since Promise.all preserves order, we can use the index directly
        const productsData = categoryProductsData[index];
        const displayProducts = productsData?.products.slice(0, 4) || [];

        return (
          <CategoryProductRow
            key={category.id}
            index={index}
            title={category.name}
            categorySlug={category.slug}
            link={`/collection/${category.slug}`}
            products={displayProducts}
          />
        );
      })}
    </div>
  );
}
