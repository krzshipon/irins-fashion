import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getProductsBySlug } from '@/services/api/products';

// Type for the page props
type Props = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

// Generate SEO Metadata dynamically
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
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

import CategoryClientPage from '@/components/category/CategoryClientPage';

export default async function CategoryPage({ params }: Props) {
    const { slug } = await params;
    return <CategoryClientPage slug={slug} />;
}
