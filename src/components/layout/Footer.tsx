"use client";

import Link from 'next/link';
import styles from './Footer.module.css';
import { useLocalization } from '@/context/LocalizationContext';

export default function Footer() {
    const { t } = useLocalization();

    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.grid}`}>
                <div className={styles.column}>
                    <h3>IRIN'S FASHION</h3>
                    <p>Modest fashion for the modern woman.</p>
                </div>
                <div className={styles.column}>
                    <h3>Shop</h3>
                    <ul>
                        <li><Link href="/new">New Arrivals</Link></li>
                        <li><Link href="/abayas">Abayas</Link></li>
                        <li><Link href="/hijabs">Hijabs</Link></li>
                    </ul>
                </div>
                <div className={styles.column}>
                    <h3>Support</h3>
                    <ul>
                        <li><Link href="/faq">FAQ</Link></li>
                        <li><Link href="/shipping">Shipping</Link></li>
                        <li><Link href="/returns">Returns</Link></li>
                    </ul>
                </div>
            </div>
            <div className={styles.copyright}>
                &copy; {new Date().getFullYear()} Irin's Fashion. All rights reserved.
            </div>
        </footer>
    );
}
