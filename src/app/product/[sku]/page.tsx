import { getProductBySku } from '@/services/api/products';
import ProductDetailsContainer from '@/components/product/ProductDetailsContainer';
import RelatedProducts from '@/components/product/RelatedProducts';
import styles from '@/components/product/ProductDetails.module.css';
import { notFound } from 'next/navigation';

interface ProductPageProps {
    params: Promise<{
        sku: string;
    }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { sku } = await params;
    const product = await getProductBySku(sku);

    if (!product) {
        notFound();
    }

    // Fallback images if not provided in data
    const galleryImages = product.images && product.images.length > 0
        ? product.images
        : [product.image];

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.image,
        description: product.description,
        brand: {
            '@type': 'Brand',
            name: 'IF' // Replace with actual brand name if available
        },
        offers: {
            '@type': 'Offer',
            priceCurrency: 'USD', // Assuming USD, adjust as needed
            price: product.price,
            availability: 'https://schema.org/InStock'
        }
    };

    return (
        <div>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
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

export async function generateMetadata({ params }: ProductPageProps) {
    const { sku } = await params;
    const product = await getProductBySku(sku);

    if (!product) {
        return {
            title: 'Product Not Found',
        };
    }

    return {
        title: `${product.name} | IF Shop`,
        description: product.description,
        openGraph: {
            images: [product.image],
        },
    };
}
