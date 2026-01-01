"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import { getFeaturedProducts } from '@/services/api/products';
import { getHeroBanners } from '@/services/api/marketing';
import { Product, Banner } from '@/services/api/types';
import { useLocalization } from '@/context/LocalizationContext';
import CategorySection from '@/components/home/CategorySection';

export default function Home() {
  const { t } = useLocalization();
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, bannersData] = await Promise.all([
          getFeaturedProducts(),
          getHeroBanners(),
        ]);
        setProducts(productsData);
        setBanners(bannersData);
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
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`${styles.heroSlide} ${index === currentSlide ? styles.active : ''}`}
              style={{ backgroundImage: `url(${banner.image})` }}
            >
              <div className={styles.heroOverlay} />
              <div className={styles.heroContent}>
                <h1 className={styles.heroTitle}>{banner.title}</h1>
                <p className={styles.heroSubtitle}>{banner.subtitle}</p>
                <Link href={banner.link} className={`btn btn-primary`}>
                  {t('hero.cta')}
                </Link>
              </div>
            </div>
          ))}

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
        <CategorySection />
      </section>

      <section className={`container ${styles.section}`}>
        <h2 className={styles.sectionTitle}>{t('products.newArrival')}</h2>

        <div className={styles.grid}>
          {products.map((product) => (
            <div key={product.id} className={styles.card}>
              <div style={{ position: 'relative', height: '350px' }}>
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardCategory}>{product.category}</div>
                <h3 className={styles.cardTitle}>{product.name}</h3>
                <div className={styles.cardPrice}>
                  {product.currency} {product.price.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
