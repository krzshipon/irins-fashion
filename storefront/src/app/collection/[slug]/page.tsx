import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getProductsBySlug, SortOption } from '@/services/api/products';
import CategoryClient from '@/components/category/CategoryClient';
import { Suspense } from 'react';

// Type for the page props
type Props = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Generate SEO Metadata dynamically
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const { categoryName } = await getProductsBySlug(slug);

    if (!categoryName) {
        return {
            title: 'Category Not Found | Irin\'s Fashion',
        };
    }

    return {
        title: `Shop ${categoryName}s - Premium Collection | Irin's Fashion`,
        description: `Explore our exclusive collection of ${categoryName}s. curated for style and modesty.`,
    };
}

export default async function CategoryPage({ params, searchParams }: Props) {
    const { slug } = await params;
    const resolvedSearchParams = await searchParams;

    // Parse filters
    const minPrice = resolvedSearchParams.minPrice ? Number(resolvedSearchParams.minPrice) : undefined;
    const maxPrice = resolvedSearchParams.maxPrice ? Number(resolvedSearchParams.maxPrice) : undefined;
    const isNew = resolvedSearchParams.isNew === 'true';
    const sort = resolvedSearchParams.sort as SortOption | undefined;

    // Fetch filtered data on server
    const { products, category } = await getProductsBySlug(slug, { minPrice, maxPrice, isNew }, sort);

    return (
        <Suspense>
            <CategoryClient
                slug={slug}
                initialProducts={products}
                category={category || null}
            />
        </Suspense>
    );
}
