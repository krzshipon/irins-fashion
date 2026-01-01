import { getProductById } from '@/services/api/products';
import ProductDetailsContainer from '@/components/product/ProductDetailsContainer';
import RelatedProducts from '@/components/product/RelatedProducts';
import styles from '@/components/product/ProductDetails.module.css';
import { notFound } from 'next/navigation';

interface ProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
        notFound();
    }

    // Fallback images if not provided in data
    const galleryImages = product.images && product.images.length > 0
        ? product.images
        : [product.image];

    return (
        <div>
            <ProductDetailsContainer
                product={product}
                initialGalleryImages={galleryImages}
            />

            <div style={{ padding: '2rem 4%' }}>
                <RelatedProducts
                    category={product.category}
                    currentProductId={product.id}
                />
            </div>
        </div>
    );
}
