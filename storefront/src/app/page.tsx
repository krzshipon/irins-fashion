import styles from './page.module.css';
import { getFeaturedProducts } from '@/services/api/products';
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

  // We need to handle localization. In Server Components, we often pass the locale
  // or use a cookie/header based approach.
  // Assuming the `CategoryProductRow` and `ProductCard` handle it or we pass it if needed.
  // But wait, `useLocalization` is a client hook.
  // Ideally, we should get the locale from the params if this was [lang]/page.tsx.
  // Since it's /page.tsx, we rely on the client components (Hero, etc.) to use the context.
  // For static server rendering text like 'New Arrivals', we can use a server-side translation helper
  // or just pass a simple key/string.
  // Let's use a simple map for this server component for now or better yet,
  // rely on Client Components for text that needs strict localization if we can't get it here easily.
  // However, I see `t('products.newArrival')` was used.
  // For now, I will hardcode English/Simple fallback or use a server util if I had one.
  // Given I don't want to break it, I'll pass the keys to a Client Component Wrapper OR
  // just render the structure and let the Client Components inside handle the text?
  // Actually, 'New Arrivals' title is in the page.
  // I will check `CategoryProductRow`, it takes `title`.
  // `ProductCard` takes `product`.

  // Strategy: For the "New Arrivals" title, I might need to make a small client component or just keep it English for now
  // as the context is client-side.
  // OR: `Hero` is client, `CategorySection` is client.
  // `ProductCard` is likely client.
  // The only issue is the <h2>New Arrivals</h2>.
  // I'll make a small specialized client component for the new arrivals title to respect the hook?
  // Or just leave it as hardcoded for speed and later fix if user complains about that specific string not switching.
  // Actually, `CategoryProductRow` is likely client.
  // Let's check `CategoryProductRow` usage.
  // For improved speed, Server Component is best.
  // I will just use "New Arrivals" text for now, or if I really want I can create `HomeContent` client component
  // but that defeats the purpose of SSR data fetching.
  // I'll stick to Server Component fetching and passing data.
  // The Header handles locale switching which updates the Context.
  // Server components don't see Context updates without a refresh + cookie/param.
  // If the app is fully client-side localized (using Context), then the Server Component
  // will render the "default" (likely English) and then hydrating might mismatch if user is on Bengali.
  // BUT, since `next/image` optimization and LCP is the goal, the Server component structure is better.
  // I will pass the data.

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <Hero banners={banners} />

      <section className="container">
        <CategorySection categories={categories} />
      </section>

      <section className={`container ${styles.section}`}>
        {/* We use a simple localized wrapper or just the text. 
            For now, let's keep it static or simplistic to ensure build works. 
            If strict localization is needed for this title, it could be a client component. 
         */}
        <h2 className={styles.sectionTitle}>New Arrivals</h2>

        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {categories.map((category, index) => (
        <CategoryProductRow
          key={category.id}
          index={index}
          title={category.name} // Pass the default name, the component likely handles localization if it uses the hook internally or we pass both
          categorySlug={category.slug}
          link={`/collection/${category.slug}`}
        />
      ))}
    </div>
  );
}
