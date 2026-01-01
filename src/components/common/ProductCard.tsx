import Link from 'next/link';
import Image from 'next/image';
import styles from '@/app/page.module.css'; // Reusing styles for now to ensure consistency
import { Product } from '@/services/api/types';
import { useLocalization } from '@/context/LocalizationContext';

import { ShoppingBag } from 'lucide-react';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { t } = useLocalization();

    return (
        <div className={styles.card}>
            <div style={{ position: 'relative', height: '350px' }}>
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    style={{ objectFit: 'cover' }}
                />
                <button
                    className={styles.addToCartBtn}
                    title={t('products.addToCart')}
                    aria-label={t('products.addToCart')}
                >
                    <ShoppingBag size={20} />
                </button>
            </div>
            <div className={styles.cardContent}>
                <div className={styles.cardCategory}>{product.category}</div>
                <h3 className={styles.cardTitle}>{product.name}</h3>
                <div className={styles.cardPrice}>
                    {product.currency} {product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
            </div>
        </div>
    );
}
