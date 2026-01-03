"use client";

import Link from 'next/link';
import styles from './Footer.module.css';
import { useLocalization } from '@/context/LocalizationContext';

export default function Footer() {
    const { dictionary: t } = useLocalization();

    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.grid}`}>
                <div className={styles.column}>
                    <h3>IRIN&apos;S FASHION</h3>
                    <p>{t.footer.brandTagline}</p>
                </div>
                <div className={styles.column}>
                    <h3>{t.footer.shop}</h3>
                    <ul>
                        <li><Link href="/shop">{t.footer.newArrivals}</Link></li>
                        <li><Link href="/collection/abayas">{t.footer.abayas}</Link></li>
                        <li><Link href="/collection/hijabs">{t.footer.hijabs}</Link></li>
                    </ul>
                </div>
                <div className={styles.column}>
                    <h3>{t.footer.company}</h3>
                    <ul>
                        <li><Link href="/about">{t.footer.aboutUs}</Link></li>
                        <li><Link href="/contact">{t.footer.contactUs}</Link></li>
                    </ul>
                </div>
                <div className={styles.column}>
                    <h3>{t.footer.support}</h3>
                    <ul>
                        <li><Link href="/faq">{t.footer.faq}</Link></li>
                        <li><Link href="/shipping">{t.footer.shipping}</Link></li>
                        <li><Link href="/returns">{t.footer.returns}</Link></li>
                        <li><Link href="/policy/privacy">{t.footer.privacy}</Link></li>
                    </ul>
                </div>
            </div>
            <div className={styles.copyright}>
                &copy; {new Date().getFullYear()} Irin&apos;s Fashion. {t.common.allRightsReserved}
            </div>
        </footer>
    );
}
