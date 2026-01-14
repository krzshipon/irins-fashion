import Skeleton from '@/components/common/Skeleton';
import ProductGridSkeleton from './ProductGridSkeleton';
import styles from '@/app/shop/shop.module.css';

export default function ShopSkeleton() {
    return (
        <div className={`container ${styles.page}`}>
            {/* Header Skeleton */}
            <div className={styles.header}>
                <Skeleton width={150} height={20} style={{ marginBottom: '1rem' }} />
                <Skeleton width={200} height={40} />
            </div>

            <div className={styles.contentWrapper}>
                {/* Sidebar Skeleton */}
                <aside className={styles.sidebar}>
                    <Skeleton width={100} height={24} style={{ marginBottom: '1.5rem' }} />

                    {/* Category Filter Skeleton */}
                    <div style={{ marginBottom: '2rem' }}>
                        <Skeleton width={80} height={16} style={{ marginBottom: '1rem' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {[1, 2, 3, 4, 5].map(i => (
                                <Skeleton key={i} width="100%" height={24} />
                            ))}
                        </div>
                    </div>

                    {/* Price Filter Skeleton */}
                    <div style={{ marginBottom: '2rem' }}>
                        <Skeleton width={60} height={16} style={{ marginBottom: '1rem' }} />
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Skeleton width="45%" height={36} />
                            <Skeleton width="45%" height={36} />
                        </div>
                    </div>
                </aside>

                {/* Main Content Skeleton */}
                <div className={styles.main}>
                    <div className={styles.toolbar}>
                        <Skeleton width={120} height={20} />
                        <Skeleton width={150} height={36} />
                    </div>
                    <ProductGridSkeleton />
                </div>
            </div>
        </div>
    );
}
