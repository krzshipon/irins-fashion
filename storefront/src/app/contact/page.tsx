"use client";

import { useEffect, useState } from 'react';
import { getContactInfo } from '@/services/api/company';
import { ContactInfo } from '@/services/api/types';
import { useLocalization } from '@/context/LocalizationContext';
import styles from './contact.module.css';

export default function ContactPage() {
    const { locale, dictionary: t } = useLocalization();
    const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getContactInfo(locale);
                setContactInfo(data);
            } catch (error) {
                console.error("Failed to fetch contact info", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [locale]);

    if (loading || !contactInfo) {
        return <div className={styles.container} style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{t.common.loading}</div>;
    }

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

                {/* Mock Contact Form */}
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
