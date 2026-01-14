import { getAboutPageContent } from '@/services/api/company';
import { dictionaries, Locale } from '@/constants/locales'; // Import dictionaries to get static text
import Image from 'next/image';
import styles from './about.module.css';

// We can assume default locale is 'en' for now or get it from props/headers
// Since we don't have middleware passing locale in params here (it's root app), 
// we might default to 'en' or need a way to detect it.
// The previous code used `useLocalization`.
// For Server Components in app router without i18n routing (e.g. [lang]/about), 
// we usually rely on cookies or just default. 
// Given the current structure seems to rely on `useLocalization` context which is client-side,
// we might need to fetch the dictionary based on a default or hardcoded 'en' for server parts 
// OR keep it client side?
// Wait, `Navigation` usually handles locale. 
// The `LocalizationContext` reads from localStorage/cookies on Client. 
// For Server Components, we can't access localStorage. 
// If the app doesn't have [lang] in the path, we can't easily know the locale on the server 
// unless we check cookies.
// HOWEVER, checking `src/constants/locales.ts` might verify if we can just pick one.
// The previous page.tsx (Home) was converted to Server Component. How did it handle locale?
// It didn't! It displayed products which have English names by default or handled it inside components.
// ACTUALLY, checking `src/app/page.tsx` again...
// It fetches products. But for STATIC text (like "Our Story"), it needs the dictionary.
// If I convert to Server Component, I lose `useLocalization`.
// 
// OPTION 1: Keep it Client Component but use `getAboutPageContent` via a Server Action or just keep fetch?
// No, user wants optimization.
// 
// OPTION 2: Use cookies() to detect locale on server.
//
// Let's check `src/app/page.tsx` again to see how it renders text.
// It renders `<Hero/>` (Client) and product grids. It doesn't seem to render much static text directly 
// except maybe passing props.
//
// The About page has A LOT of static text ("Our Story", "Mission" etc).
// `getAboutPageContent` returns the TEXT content.
// So if I pass the locale to `getAboutPageContent`, it returns the translated text.
// The issue is *getting* the locale.
//
// Let's try to get the locale from cookies. `next/headers` -> cookies().get('NEXT_LOCALE')?.value.
// If not present, default to 'en'.

import { cookies } from 'next/headers';

export const metadata = {
    title: 'About Us | Irin\'s Fashion',
    description: 'Learn about our story, mission, and values.',
};

export default async function AboutPage() {
    const cookieStore = await cookies();
    const locale = (cookieStore.get('NEXT_LOCALE')?.value as Locale) || 'en';

    // Fetch content based on locale
    const content = await getAboutPageContent(locale);

    // We also need the static labels "Our Story", "Our Mission" etc.
    // The previous code got `t` from `useLocalization`.
    // `getAboutPageContent` returns the *dynamic* content (story, mission).
    // But the HEADERS "Our Story" are in `t.about.ourStory`.
    // We can import `dictionaries` directly and use it.
    const t = dictionaries[locale] || dictionaries['en'];

    return (
        <div className={styles.container}>
            <div className={styles.heroSection}>
                <h1 className={styles.title}>{content.title}</h1>
            </div>

            <div className={styles.contentSection}>
                <div className={styles.textColumn}>
                    <section className={styles.section}>
                        <h2 className={styles.subtitle}>{t.company.about.ourStory}</h2>
                        <p className={styles.text}>{content.story}</p>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.subtitle}>{t.company.about.ourMission}</h2>
                        <p className={styles.text}>{content.mission}</p>
                    </section>

                    <section className={styles.valuesSection}>
                        <h2 className={styles.subtitle}>{t.company.about.whyChooseUs}</h2>
                        <ul className={styles.valueList}>
                            <li>✨ {t.company.about.premiumQuality}</li>
                            <li>🪡 {t.company.about.craftsmanship}</li>
                            <li>🚚 {t.company.about.reliableDelivery}</li>
                            <li>💬 {t.company.about.customerSupport}</li>
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
