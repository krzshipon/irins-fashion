"use client";

import Link from 'next/link';
import styles from './Header.module.css';
import { useLocalization } from '@/context/LocalizationContext';
import { useCart } from '@/context/CartContext';
import { ShoppingBag } from 'lucide-react';

export default function Header() {
    const { t, locale, setLocale } = useLocalization();
    const { cartCount } = useCart();

    const toggleLocale = () => {
        setLocale(locale === 'en' ? 'bn' : 'en');
    };

    return (
        <header className={styles.header}>
            <div className={`container ${styles.container}`}>
                <Link href="/" className={styles.logo}>
                    IRIN&apos;S FASHION
                </Link>

                <nav className={styles.nav}>
                    <Link href="/" className={styles.navLink}>{t('nav.home')}</Link>
                    <Link href="/collection/all" className={styles.navLink}>{t('nav.shop')}</Link>
                    <Link href="/about" className={styles.navLink}>{t('nav.about')}</Link>
                    <Link href="/contact" className={styles.navLink}>{t('nav.contact')}</Link>
                </nav>

                <div className={styles.actions}>
                    <button onClick={toggleLocale} className={styles.langSwitch}>
                        {locale === 'en' ? 'BN' : 'EN'}
                    </button>
                    <Link href="/cart" className={styles.cartLink} aria-label={t('nav.cart')}>
                        <ShoppingBag size={22} className={styles.cartIcon} />
                        {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
                    </Link>
                </div>
            </div>
        </header>
    );
}
