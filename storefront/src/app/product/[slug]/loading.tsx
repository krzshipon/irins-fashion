
import Skeleton from "@/components/common/Skeleton";
import styles from "@/components/product/ProductDetails.module.css";

export default function Loading() {
    return (
        <div className={styles.productContainer}>
            {/* Gallery Skeleton */}
            <div className={styles.galleryContainer}>
                {/* Thumbnails */}
                <div className={styles.thumbnails}>
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={styles.thumbnailButton} style={{ border: 'none' }}>
                            <Skeleton width="100%" height="100%" />
                        </div>
                    ))}
                </div>

                {/* Main Image */}
                <div className={styles.mainImageWrapper}>
                    <Skeleton width="100%" height="100%" />
                </div>
            </div>

            {/* Info Skeleton */}
            <div className={styles.detailsContent}>
                <div className={styles.infoContainer}>
                    <div className={styles.header}>
                        <Skeleton width={100} height={16} />
                        <Skeleton width="80%" height={48} style={{ marginTop: '8px' }} />
                        <Skeleton width={120} height={28} style={{ marginTop: '8px' }} />
                    </div>

                    <div className={styles.divider} />

                    {/* Color Options */}
                    <div className={styles.optionsSection}>
                        <Skeleton width={60} height={20} />
                        <div className={styles.swatchGrid}>
                            <Skeleton width={40} height={40} borderRadius="50%" />
                            <Skeleton width={40} height={40} borderRadius="50%" />
                            <Skeleton width={40} height={40} borderRadius="50%" />
                        </div>
                    </div>

                    {/* Size Options */}
                    <div className={styles.optionsSection}>
                        <Skeleton width={60} height={20} />
                        <div className={styles.swatchGrid}>
                            <Skeleton width={48} height={48} borderRadius="8px" />
                            <Skeleton width={48} height={48} borderRadius="8px" />
                            <Skeleton width={48} height={48} borderRadius="8px" />
                            <Skeleton width={48} height={48} borderRadius="8px" />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className={styles.actions}>
                        <Skeleton width={140} height={56} borderRadius="50px" />
                        <Skeleton width="100%" height={56} borderRadius="50px" />
                    </div>

                    {/* Description */}
                    <div className={styles.description}>
                        <Skeleton width="100%" height={16} style={{ marginBottom: '8px' }} />
                        <Skeleton width="100%" height={16} style={{ marginBottom: '8px' }} />
                        <Skeleton width="80%" height={16} />
                    </div>
                </div>
            </div>
        </div>
    );
}
