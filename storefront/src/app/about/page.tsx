"use client";

import { useEffect, useState } from 'react';
import { getAboutPageContent } from '@/services/api/company';
import { AboutPageContent } from '@/services/api/types';
import { useLocalization } from '@/context/LocalizationContext'; // Ensure this path is correct
import Image from 'next/image';
import styles from './about.module.css';

export default function AboutPage() {
    const { locale } = useLocalization();
    const [content, setContent] = useState<AboutPageContent | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getAboutPageContent(locale);
                setContent(data);
            } catch (error) {
                console.error("Failed to fetch about content", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [locale]);

    if (loading || !content) {
        return <div className={styles.container} style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.heroSection}>
                <h1 className={styles.title}>{content.title}</h1>
            </div>

            <div className={styles.contentSection}>
                <div className={styles.textColumn}>
                    <section className={styles.section}>
                        <h2 className={styles.subtitle}>Our Story</h2>
                        <p className={styles.text}>{content.story}</p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.subtitle}>Our Mission</h2>
                        <p className={styles.text}>{content.mission}</p>
                    </section>

                    <section className={styles.valuesSection}>
                        <h2 className={styles.subtitle}>Why Choose Us?</h2>
                        <ul className={styles.valueList}>
                            <li>✨ Premium Quality Fabrics</li>
                            <li>🪡 Exquisite Craftsmanship</li>
                            <li>🚚 Reliable Delivery</li>
                            <li>💬 Dedicated Customer Support</li>
                        </ul>
                    </section>
                </div>

                {content.imageUrl && (
                    <div className={styles.imageColumn}>
                        <div className={styles.imageWrapper}>
                            <Image
                                src={content.imageUrl}
                                alt="About Irin's Fashion"
                                fill
                                className={styles.image}
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
