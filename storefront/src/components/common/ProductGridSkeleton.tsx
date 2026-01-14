import Skeleton from '@/components/common/Skeleton';
import styles from '@/app/shop/shop.module.css'; // Reusing shop grid styles

export default function ProductGridSkeleton() {
    return (
        <div className={styles.grid}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className={styles.card} style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
                    <Skeleton width="100%" height={300} style={{ marginBottom: '1rem' }} />
                    <div style={{ padding: '0 1rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                        <Skeleton width="40%" height={12} />
                        <Skeleton width="80%" height={16} />
                        <Skeleton width="30%" height={16} style={{ marginTop: 'auto' }} />
                    </div>
                </div>
            ))}
        </div>
    );
}
