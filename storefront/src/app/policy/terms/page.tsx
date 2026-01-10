"use client";

import { useLocalization } from '@/context/LocalizationContext';
import styles from './page.module.css';

export default function TermsOfServicePage() {
    const { dictionary: t } = useLocalization();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>{t.termsPage.title}</h1>
                <p className={styles.subtitle}>{t.termsPage.subtitle}</p>
                <div className={styles.lastUpdated}>
                    {t.termsPage.lastUpdated}: {new Date().toLocaleDateString()}
                </div>
            </div>

            <div className={styles.content}>
                <section className={styles.section}>
                    <h2>{t.termsPage.introduction.title}</h2>
                    <p>{t.termsPage.introduction.content}</p>
                </section>

                <section className={styles.section}>
                    <h2>{t.termsPage.acceptance.title}</h2>
                    <p>{t.termsPage.acceptance.content}</p>
                </section>

                <section className={styles.section}>
                    <h2>{t.termsPage.products.title}</h2>
                    <p>{t.termsPage.products.content}</p>
                    <ul className={styles.list}>
                        {t.termsPage.products.items.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>{t.termsPage.orders.title}</h2>
                    <p>{t.termsPage.orders.content}</p>
                    <ul className={styles.list}>
                        {t.termsPage.orders.items.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>{t.termsPage.pricing.title}</h2>
                    <p>{t.termsPage.pricing.content}</p>
                </section>

                <section className={styles.section}>
                    <h2>{t.termsPage.shipping.title}</h2>
                    <p>{t.termsPage.shipping.content}</p>
                    <ul className={styles.list}>
                        {t.termsPage.shipping.items.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>{t.termsPage.returns.title}</h2>
                    <p>{t.termsPage.returns.content}</p>
                    <ul className={styles.list}>
                        {t.termsPage.returns.items.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>{t.termsPage.customOrders.title}</h2>
                    <p>{t.termsPage.customOrders.content}</p>
                    <ul className={styles.list}>
                        {t.termsPage.customOrders.items.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>{t.termsPage.intellectual.title}</h2>
                    <p>{t.termsPage.intellectual.content}</p>
                </section>

                <section className={styles.section}>
                    <h2>{t.termsPage.limitation.title}</h2>
                    <p>{t.termsPage.limitation.content}</p>
                </section>

                <section className={styles.section}>
                    <h2>{t.termsPage.governing.title}</h2>
                    <p>{t.termsPage.governing.content}</p>
                </section>

                <section className={styles.section}>
                    <h2>{t.termsPage.changes.title}</h2>
                    <p>{t.termsPage.changes.content}</p>
                </section>

                <section className={styles.contactSection}>
                    <h2>{t.termsPage.contact.title}</h2>
                    <p>{t.termsPage.contact.content}</p>
                </section>
            </div>
        </div>
    );
}
