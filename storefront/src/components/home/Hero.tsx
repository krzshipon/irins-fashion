"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Hero.module.css';
import { Banner } from '@/services/api/types';
import { useLocalization } from '@/context/LocalizationContext';

interface HeroProps {
    banners: Banner[];
}

export default function Hero({ banners }: HeroProps) {
    const { t, locale } = useLocalization();
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        if (banners.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [banners.length]);

    if (!banners.length) return null;

    return (
        <section className={styles.heroWrapper}>
            {banners.map((banner, index) => {
                // Use localized text based on current locale
                const title = locale === 'bn' && banner.titleBn ? banner.titleBn : banner.title;
                const subtitle = locale === 'bn' && banner.subtitleBn ? banner.subtitleBn : (banner.subtitle || '');
                const buttonText = locale === 'bn' && banner.buttonTextBn ? banner.buttonTextBn : (banner.buttonText || t('hero.cta', 'Shop Now'));

                const isActive = index === currentSlide;

                return (
                    <div
                        key={banner.id}
                        className={`${styles.heroSlide} ${isActive ? styles.active : ''}`}
                        aria-hidden={!isActive}
                    >
                        {/* Optimized Image */}
                        <Image
                            src={banner.image}
                            alt={title || 'Banner'}
                            fill
                            priority={index === 0} // Load first image immediately
                            style={{ objectFit: 'cover' }}
                            sizes="100vw"
                            quality={90}
                        />

                        <div className={styles.heroOverlay} />
                        <div className={styles.heroContent}>
                            <h1 className={styles.heroTitle}>{title}</h1>
                            <p className={styles.heroSubtitle}>{subtitle}</p>
                            <Link href={banner.link} className="btn btn-primary">
                                {buttonText}
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
    );
}
