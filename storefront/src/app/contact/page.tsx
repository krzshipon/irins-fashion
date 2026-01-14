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

    const contactInfo = await getContactInfo(locale);
    const t = dictionaries[locale] || dictionaries['en'];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>{t.company.contact.title}</h1>
                <p className={styles.intro}>{t.company.contact.intro}</p>
            </div>

            <div className={styles.grid}>
                {/* Contact Information Card */}
                <div className={styles.infoCard}>
                    <h2 className={styles.cardTitle}>{t.company.contact.getInTouch}</h2>

                    <div className={styles.infoItem}>
                        <span className={styles.icon}>📍</span>
                        <div className={styles.details}>
                            <h3>{t.company.contact.address}</h3>
                            <p>{contactInfo.address}</p>
                        </div>
                    </div>

                    <div className={styles.infoItem}>
                        <span className={styles.icon}>📞</span>
                        <div className={styles.details}>
                            <h3>{t.company.contact.phone}</h3>
                            <p><a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a></p>
                        </div>
                    </div>

                    <div className={styles.infoItem}>
                        <span className={styles.icon}>✉️</span>
                        <div className={styles.details}>
                            <h3>{t.company.contact.email}</h3>
                            <p><a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a></p>
                        </div>
                    </div>
                </div>

                {/* Contact Form - Client Component for Interactivity, OR keep as simple HTML form if no logic?
                    The original was just a mock form. 
                    We can render the form inputs on server. 
                    If we want it to work, we'd wrap it in a client component or use Server Actions.
                    For now, since it was static/mock, we keep it as Server Component HTML. 
                */}
                <div className={styles.formCard}>
                    <h2 className={styles.cardTitle}>{t.company.contact.sendMessage}</h2>
                    <form className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name">{t.company.contact.form.name}</label>
                            <input type="text" id="name" name="name" placeholder={t.company.contact.form.namePlaceholder} required />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email">{t.company.contact.form.email}</label>
                            <input type="email" id="email" name="email" placeholder={t.company.contact.form.emailPlaceholder} required />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="message">{t.company.contact.form.message}</label>
                            <textarea id="message" name="message" rows={5} placeholder={t.company.contact.form.messagePlaceholder} required></textarea>
                        </div>

                        <button type="submit" className={styles.submitBtn}>{t.company.contact.form.send}</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
