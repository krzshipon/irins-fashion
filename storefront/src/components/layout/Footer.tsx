"use client";

import Link from 'next/link';
import styles from './Footer.module.css';
import { useLocalization } from '@/context/LocalizationContext';
import { Category } from '@/services/api/types';

interface FooterProps {
    categories?: Category[];
}

export default function Footer({ categories = [] }: FooterProps) {
    const { dictionary: t, lang } = useLocalization();

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
                        {categories.slice(0, 5).map(category => (
                            <li key={category.id}>
                                <Link href={`/collection/${category.slug}`}>
                                    {lang === 'bn' ? category.localizedNames?.bn || category.name : category.name}
                                </Link>
                            </li>
                        ))}
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
