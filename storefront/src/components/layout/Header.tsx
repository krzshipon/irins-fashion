"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Header.module.css';
import { useLocalization } from '@/context/LocalizationContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ShoppingBag, User, LogOut, Package, MapPin, LayoutDashboard, ChevronDown } from 'lucide-react';

export default function Header() {
    const { t, locale, setLocale } = useLocalization();
    const { cartCount } = useCart();
    const { user, logout } = useAuth();
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleLocale = () => {
        setLocale(locale === 'en' ? 'bn' : 'en');
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logout();
        setIsDropdownOpen(false);
        router.push("/");
    };

    // Helper to get initials
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <header className={styles.header}>
            <div className={`container ${styles.container}`}>
                <Link href="/" className={styles.logo}>
                    IRIN&apos;S FASHION
                </Link>

                <nav className={styles.nav}>
                    <Link href="/" className={styles.navLink}>{t('nav.home')}</Link>
                    <Link href="/shop" className={styles.navLink}>{t('nav.shop')}</Link>
                    <Link href="/shop?collection=new" className={styles.navLink}>{t('nav.newCollection')}</Link>
                    <Link href="/about" className={styles.navLink}>{t('nav.about')}</Link>
                </nav>

                <div className={styles.actions}>
                    {/* Language Switch */}
                    <button onClick={toggleLocale} className={styles.langSwitch}>
                        {locale === 'en' ? 'BN' : 'EN'}
                    </button>

                    {/* Cart */}
                    <Link href="/cart" className={styles.cartLink} aria-label={t('nav.cart')}>
                        <ShoppingBag size={22} className={styles.cartIcon} />
                        {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
                    </Link>

                    {/* Auth / Identity */}
                    <div className={styles.userSection} ref={dropdownRef}>
                        {user ? (
                            <>
                                <button
                                    className={styles.avatarBtn}
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    aria-label="User menu"
                                >
                                    {user.avatarUrl ? (
                                        <img src={user.avatarUrl} alt={user.name} className={styles.avatarImg} />
                                    ) : (
                                        getInitials(user.name || 'User')
                                    )}
                                </button>

                                {isDropdownOpen && (
                                    <div className={styles.dropdown}>
                                        <div className="px-4 py-3 border-b border-border mb-1">
                                            <p className="text-sm font-semibold truncate">{user.name}</p>
                                            <p className="text-xs text-text-muted truncate">{user.mobile}</p>
                                        </div>

                                        <Link href="/account/overview" className={styles.dropdownItem} onClick={() => setIsDropdownOpen(false)}>
                                            <LayoutDashboard size={16} />
                                            Overview
                                        </Link>
                                        <Link href="/account/orders" className={styles.dropdownItem} onClick={() => setIsDropdownOpen(false)}>
                                            <Package size={16} />
                                            My Orders
                                        </Link>
                                        <Link href="/account/addresses" className={styles.dropdownItem} onClick={() => setIsDropdownOpen(false)}>
                                            <MapPin size={16} />
                                            Addresses
                                        </Link>

                                        <div className={styles.dropdownDivider} />

                                        <button onClick={handleLogout} className={`${styles.dropdownItem} ${styles.logoutBtn}`}>
                                            <LogOut size={16} />
                                            Log Out
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <Link href="/login" className={styles.authBtn} aria-label="Login">
                                <User size={22} />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
