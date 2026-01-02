"use client";

import { useEffect, useState } from 'react';
import { getContactInfo } from '@/services/api/company';
import { ContactInfo } from '@/services/api/types';
import { useLocalization } from '@/context/LocalizationContext';
import styles from './contact.module.css';

export default function ContactPage() {
    const { locale } = useLocalization();
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
        return <div className={styles.container} style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Contact Us</h1>
                <p className={styles.intro}>We&apos;d love to hear from you. Here&apos;s how you can reach us.</p>
            </div>

            <div className={styles.grid}>
                {/* Contact Information Card */}
                <div className={styles.infoCard}>
                    <h2 className={styles.cardTitle}>Get in Touch</h2>

                    <div className={styles.infoItem}>
                        <span className={styles.icon}>📍</span>
                        <div className={styles.details}>
                            <h3>Address</h3>
                            <p>{contactInfo.address}</p>
                        </div>
                    </div>

                    <div className={styles.infoItem}>
                        <span className={styles.icon}>📞</span>
                        <div className={styles.details}>
                            <h3>Phone</h3>
                            <p><a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a></p>
                        </div>
                    </div>

                    <div className={styles.infoItem}>
                        <span className={styles.icon}>✉️</span>
                        <div className={styles.details}>
                            <h3>Email</h3>
                            <p><a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a></p>
                        </div>
                    </div>
                </div>

                {/* Mock Contact Form */}
                <div className={styles.formCard}>
                    <h2 className={styles.cardTitle}>Send us a Message</h2>
                    <form className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name">Name</label>
                            <input type="text" id="name" name="name" placeholder="Your Name" required />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" name="email" placeholder="Your Email" required />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="message">Message</label>
                            <textarea id="message" name="message" rows={5} placeholder="How can we help?" required></textarea>
                        </div>

                        <button type="submit" className={styles.submitBtn}>Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
