"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import { getFeaturedProducts } from '@/services/api/products';
import { getHeroBanner } from '@/services/api/marketing';
import { Product, Banner } from '@/services/api/types';
import { useLocalization } from '@/context/LocalizationContext';

export default function Home() {
  const { t } = useLocalization();
  const [products, setProducts] = useState<Product[]>([]);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, bannerData] = await Promise.all([
          getFeaturedProducts(),
          getHeroBanner(),
        ]);
        setProducts(productsData);
        setBanner(bannerData);
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div className={styles.home}>
      {banner && (
        <section
          className={styles.hero}
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
        </section>
      )}

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
