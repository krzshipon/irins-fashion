"use client";

import { useLocalization } from '@/context/LocalizationContext';
import styles from './page.module.css';

export default function PrivacyPolicyPage() {
    const { dictionary: t } = useLocalization();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>{t.privacyPage.title}</h1>
                <p className={styles.subtitle}>{t.privacyPage.subtitle}</p>
                <div className={styles.lastUpdated}>
                    {t.privacyPage.lastUpdated}: {new Date().toLocaleDateString()}
                </div>
            </div>

            <div className={styles.content}>
                <section className={styles.section}>
                    <h2>{t.privacyPage.introduction.title}</h2>
                    <p>{t.privacyPage.introduction.content}</p>
                </section>

                <section className={styles.section}>
                    <h2>{t.privacyPage.collection.title}</h2>
                    <p>{t.privacyPage.collection.content}</p>
                    <ul className={styles.list}>
                        {t.privacyPage.collection.items.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>{t.privacyPage.usage.title}</h2>
                    <p>{t.privacyPage.usage.content}</p>
                    <ul className={styles.list}>
                        {t.privacyPage.usage.items.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>{t.privacyPage.sharing.title}</h2>
                    <p>{t.privacyPage.sharing.content}</p>
                </section>

                <section className={styles.section}>
                    <h2>{t.privacyPage.security.title}</h2>
                    <p>{t.privacyPage.security.content}</p>
                </section>

                <section className={styles.section}>
                    <h2>{t.privacyPage.rights.title}</h2>
                    <p>{t.privacyPage.rights.content}</p>
                    <ul className={styles.list}>
                        {t.privacyPage.rights.items.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>{t.privacyPage.cookies.title}</h2>
                    <p>{t.privacyPage.cookies.content}</p>
                </section>

                <section className={styles.contactSection}>
                    <h2>{t.privacyPage.contact.title}</h2>
                    <p>{t.privacyPage.contact.content}</p>
                </section>
            </div>
        </div>
    );
}
