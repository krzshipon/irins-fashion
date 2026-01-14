import Skeleton from '@/components/common/Skeleton';
import styles from '@/app/page.module.css'; // Reuse basic layout styles

export default function HomeSkeleton() {
    return (
        <div className="container" style={{ paddingBottom: '4rem' }}>
            {/* Hero Skeleton */}
            <Skeleton
                style={{
                    width: '100%',
                    height: '600px',
                    marginBottom: 'var(--spacing-lg)',
                    borderRadius: '0 0 var(--radius-md) var(--radius-md)'
                }}
            />

            {/* Category Section Skeleton */}
            <div style={{ marginBottom: '4rem', padding: 'var(--spacing-lg) 0' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                    <Skeleton width={200} height={32} />
                </div>
                <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <Skeleton width={120} height={120} borderRadius="50%" />
                            <Skeleton width={80} height={20} />
                        </div>
                    ))}
                </div>
            </div>

            {/* New Arrivals Skeleton */}
            <div className={styles.section}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                    <Skeleton width={250} height={40} />
                </div>
                <div className={styles.grid}>
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={styles.card} style={{ height: '450px' }}>
                            <Skeleton width="100%" height={350} />
                            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                <Skeleton width={100} height={14} />
                                <Skeleton width={180} height={20} />
                                <Skeleton width={80} height={20} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
