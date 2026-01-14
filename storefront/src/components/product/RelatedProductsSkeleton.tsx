import Skeleton from '@/components/common/Skeleton';
import ProductGridSkeleton from '@/components/common/ProductGridSkeleton';

export default function RelatedProductsSkeleton() {
    return (
        <section style={{ marginTop: '5rem', marginBottom: '3rem' }}>
            <Skeleton width={300} height={40} style={{ marginBottom: '2rem' }} />
            <ProductGridSkeleton />
        </section>
    );
}
