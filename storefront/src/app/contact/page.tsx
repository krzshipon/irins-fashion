import { getContactInfo } from '@/services/api/company';
import { dictionaries, Locale } from '@/constants/locales';
import { cookies } from 'next/headers';
import styles from './contact.module.css';

export const metadata = {
    title: 'Contact Us | Irin\'s Fashion',
    description: 'Get in touch with us for any inquiries or support.',
};

export default async function ContactPage() {
    const cookieStore = await cookies();
    const locale = (cookieStore.get('NEXT_LOCALE')?.value as Locale) || 'en';

    // Fetch dynamic contact info (phone, email, address from API)
    const contactInfo = await getContactInfo(locale);
    // Get static static text from dictionary
    const t = dictionaries[locale] || dictionaries['en'];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>{t.contact.title}</h1>
                <p className={styles.intro}>{t.contact.intro}</p>
            </div>

            <div className={styles.grid}>
                {/* Contact Information Card */}
                <div className={styles.infoCard}>
                    <h2 className={styles.cardTitle}>{t.contact.getInTouch}</h2>

                    <div className={styles.infoItem}>
                        <span className={styles.icon}>📍</span>
                        <div className={styles.details}>
                            <h3>{t.contact.address}</h3>
                            <p>{contactInfo.address}</p>
                        </div>
                    </div>

                    <div className={styles.infoItem}>
                        <span className={styles.icon}>📞</span>
                        <div className={styles.details}>
                            <h3>{t.contact.phone}</h3>
                            <p><a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a></p>
                        </div>
                    </div>

                    <div className={styles.infoItem}>
                        <span className={styles.icon}>✉️</span>
                        <div className={styles.details}>
                            <h3>{t.contact.email}</h3>
                            <p><a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a></p>
                        </div>
                    </div>
                </div>

                {/* Contact Form - kept as server rendered HTML same as before */}
                <div className={styles.formCard}>
                    <h2 className={styles.cardTitle}>{t.contact.sendMessage}</h2>
                    <form className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name">{t.contact.form.name}</label>
                            <input type="text" id="name" name="name" placeholder={t.contact.form.namePlaceholder} required />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email">{t.contact.form.email}</label>
                            <input type="email" id="email" name="email" placeholder={t.contact.form.emailPlaceholder} required />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="message">{t.contact.form.message}</label>
                            <textarea id="message" name="message" rows={5} placeholder={t.contact.form.messagePlaceholder} required></textarea>
                        </div>

                        <button type="submit" className={styles.submitBtn}>{t.contact.form.send}</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
