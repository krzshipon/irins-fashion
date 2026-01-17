
import Skeleton from '@/components/common/Skeleton';
import ProductGridSkeleton from '@/components/common/ProductGridSkeleton';
import styles from './page.module.css';

export default function Loading() {
    return (
        <div className={`container ${styles.page}`}>
            {/* Header Skeleton */}
            <div className={styles.header}>
                <Skeleton width={150} height={20} style={{ marginBottom: '1rem', marginInline: 'auto' }} />
                <Skeleton width={200} height={40} style={{ marginInline: 'auto' }} />
            </div>

            <div className={styles.contentWrapper}>
                {/* Sidebar Skeleton */}
                <aside className={styles.sidebar}>
                    <Skeleton width={80} height={24} style={{ marginBottom: '1.5rem' }} />

                    {/* Price Filter Skeleton */}
                    <div className={styles.section}>
                        <Skeleton width={60} height={16} style={{ marginBottom: '1rem' }} />
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <Skeleton width="45%" height={36} />
                            <Skeleton width="45%" height={36} />
                        </div>
                    </div>

                    {/* Status Filter Skeleton */}
                    <div className={styles.section}>
                        <Skeleton width={60} height={16} style={{ marginBottom: '1rem' }} />
                        <Skeleton width={100} height={20} />
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
