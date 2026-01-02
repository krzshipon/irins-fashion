import { getAboutPageContent } from '@/services/api/company';
import Image from 'next/image';
import styles from './about.module.css';

export const metadata = {
    title: 'About Us | Irin\'s Fashion',
    description: 'Learn more about the story and mission behind Irin\'s Fashion.',
};

export default async function AboutPage() {
    const content = await getAboutPageContent();

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
