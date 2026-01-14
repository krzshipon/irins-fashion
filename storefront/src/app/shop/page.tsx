import { Suspense } from 'react';
import { getAllProducts, SortOption } from '@/services/api/products';
import { getCategories } from '@/services/api/categories';
import ShopClient from '@/components/shop/ShopClient';
import ShopSkeleton from '@/components/shop/ShopSkeleton';

export const dynamic = 'force-dynamic'; // Since we use searchParams, we want dynamic rendering or properly cached ISR with params

interface ShopPageProps {
    searchParams: Promise<{
        categories?: string;
        minPrice?: string;
        maxPrice?: string;
        collection?: string;
        sort?: string;
    }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
    const params = await searchParams;

    // Parse params
    const selectedCategories = params.categories ? params.categories.split(',') : undefined;
    const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
    const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
    const isNew = params.collection === 'new';
    const sortOption = params.sort as SortOption | undefined;

    // Fetch Data in Parallel
    const [productsData, categories] = await Promise.all([
        getAllProducts(
            selectedCategories,
            { minPrice, maxPrice, isNew },
            sortOption
        ),
        getCategories()
    ]);

    // Sort categories (preserved from original logic)
    const sortedCategories = categories.sort((a, b) => a.sortOrder - b.sortOrder);

    return (
        <Suspense fallback={<ShopSkeleton />}>
            <ShopClient
                initialProducts={productsData.products}
                categories={sortedCategories}
            />
        </Suspense>
    );
}
