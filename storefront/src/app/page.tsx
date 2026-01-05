"use client";

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { getFeaturedProducts } from '@/services/api/products';
import { getCategories } from '@/services/api/categories';
import { getHeroBanners } from '@/services/api/marketing';
import { Product, Banner, Category } from '@/services/api/types';
import { useLocalization } from '@/context/LocalizationContext';
import CategorySection from '@/components/home/CategorySection';
import CategoryProductRow from '@/components/home/CategoryProductRow';
import ProductCard from '@/components/common/ProductCard';

export default function Home() {
  const { t, locale } = useLocalization();
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    // Prevent duplicate fetches (React Strict Mode calls useEffect twice in dev)
    if (hasFetched.current) return;
    hasFetched.current = true;

    const loadData = async () => {
      try {
        const [productsData, bannersData, categoriesData] = await Promise.all([
          getFeaturedProducts(),
          getHeroBanners(),
          getCategories(),
        ]);
        setProducts(productsData);
        setBanners(bannersData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (loading) {
    return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div className={styles.home}>
      {banners.length > 0 && (
        <section className={styles.heroWrapper}>
          {banners.map((banner, index) => {
            // Use localized text based on current locale
            const title = locale === 'bn' && banner.titleBn ? banner.titleBn : banner.title;
            const subtitle = locale === 'bn' && banner.subtitleBn ? banner.subtitleBn : banner.subtitle;

            return (
              <div
                key={banner.id}
                className={`${styles.heroSlide} ${index === currentSlide ? styles.active : ''}`}
                style={{ backgroundImage: `url(${banner.image})` }}
              >
                <div className={styles.heroOverlay} />
                <div className={styles.heroContent}>
                  <h1 className={styles.heroTitle}>{title}</h1>
                  <p className={styles.heroSubtitle}>{subtitle}</p>
                  <Link href={banner.link} className={`btn btn-primary`}>
                    {t('hero.cta')}
                  </Link>
                </div>
              </div>
            );
          })}

          <div className={styles.dots}>
            {banners.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ''}`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </section>
      )}

      <section className="container">
        <CategorySection categories={categories} />
      </section>

      <section className={`container ${styles.section}`}>
        <h2 className={styles.sectionTitle}>{t('products.newArrival')}</h2>

        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {categories.map((category) => (
        <CategoryProductRow
          key={category.id}
          title={category.localizedNames?.[locale] || category.name}
          categorySlug={category.slug}
          link={`/collection/${category.slug}`}
        />
      ))}
    </div>
  );
}
