import { getProductBySlug } from '@/services/api/products';
import ProductDetailsContainer from '@/components/product/ProductDetailsContainer';
import RelatedProducts from '@/components/product/RelatedProducts';
import { notFound } from 'next/navigation';

interface ProductPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;

    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    // Fallback images if not provided in data
    // New structure: product.images is array of ProductImage objects { url, isPrimary }
    const galleryImages = product.images && product.images.length > 0
        ? product.images.map(img => img.url)
        : ['/images/placeholder-product.png'];

    const primaryImage = product.images.find(img => img.isPrimary)?.url || galleryImages[0];

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: primaryImage,
        description: product.description,
        brand: {
            '@type': 'Brand',
            name: 'IF' // Replace with actual brand name if available
        },
        offers: {
            '@type': 'Offer',
            priceCurrency: 'BDT',
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
                    category={product.category?.slug || 'all'}
                    currentProductId={product.id}
                />
            </div>
        </div>
    );
}

export async function generateMetadata({ params }: ProductPageProps) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        return {
            title: 'Product Not Found',
        };
    }

    const primaryImage = product.images?.find(img => img.isPrimary)?.url || product.images?.[0]?.url;

    return {
        title: `${product.name} | IF Shop`,
        description: product.description,
        openGraph: {
            images: primaryImage ? [primaryImage] : [],
        },
    };
}
