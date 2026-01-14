import { getAboutPageContent } from '@/services/api/company';
import { dictionaries, Locale } from '@/constants/locales';
import { cookies } from 'next/headers';
import Image from 'next/image';
import styles from './about.module.css';

export const metadata = {
    title: 'About Us | Irin\'s Fashion',
    description: 'Learn about our story, mission, and values.',
};

export default async function AboutPage() {
    const cookieStore = await cookies();
    const locale = (cookieStore.get('NEXT_LOCALE')?.value as Locale) || 'en';

    const content = await getAboutPageContent(locale);
    const t = dictionaries[locale] || dictionaries['en'];

    return (
        <div className={styles.container}>
            <div className={styles.heroSection}>
                <h1 className={styles.title}>{content.title}</h1>
            </div>

            <div className={styles.contentSection}>
                <div className={styles.textColumn}>
                    <section className={styles.section}>
                        <h2 className={styles.subtitle}>{t.about.ourStory}</h2>
                        <p className={styles.text}>{content.story}</p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.subtitle}>{t.about.ourMission}</h2>
                        <p className={styles.text}>{content.mission}</p>
                    </section>

                    <section className={styles.valuesSection}>
                        <h2 className={styles.subtitle}>{t.about.whyChooseUs}</h2>
                        <ul className={styles.valueList}>
                            <li>✨ {t.about.premiumQuality}</li>
                            <li>🪡 {t.about.craftsmanship}</li>
                            <li>🚚 {t.about.reliableDelivery}</li>
                            <li>💬 {t.about.customerSupport}</li>
                        </ul>
                    </section>
                </div>

                {content.imageUrl && (
                    <div className={styles.imageColumn}>
                        <div className={styles.imageWrapper}>
                            <Image
                                src={content.imageUrl}
                                alt={content.title}
                                fill
                                className={styles.image}
                                style={{ objectFit: 'cover' }}
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
