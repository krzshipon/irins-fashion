"use client";

import Link from 'next/link';
import styles from './Header.module.css';
import { useLocalization } from '@/context/LocalizationContext';

export default function Header() {
    const { t, locale, setLocale } = useLocalization();

    const toggleLocale = () => {
        setLocale(locale === 'en' ? 'bn' : 'en');
    };

    return (
        <header className={styles.header}>
            <div className={`container ${styles.container}`}>
                <Link href="/" className={styles.logo}>
                    IRIN'S FASHION
                </Link>

                <nav className={styles.nav}>
                    <Link href="/" className={styles.navLink}>{t('nav.home')}</Link>
                    <Link href="/shop" className={styles.navLink}>{t('nav.shop')}</Link>
                    <Link href="/about" className={styles.navLink}>{t('nav.about')}</Link>
                    <Link href="/contact" className={styles.navLink}>{t('nav.contact')}</Link>
                </nav>

                <div className={styles.actions}>
                    <button onClick={toggleLocale} className={styles.langSwitch}>
                        {locale === 'en' ? 'BN' : 'EN'}
                    </button>
                    <Link href="/cart" className={styles.navLink}>
                        {t('nav.cart')} (0)
                    </Link>
                </div>
            </div>
        </header>
    );
}
