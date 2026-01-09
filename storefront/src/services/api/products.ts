import { Product, Category } from './types';

const API_URL = 'http://localhost:3001'; // FIXME: Revert to process.env.NEXT_PUBLIC_API_URL after server restart
// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// --- API Calls ---



export const getAllProducts = async (
    categories?: string[],
    filters?: FilterOptions,
    sort?: SortOption
): Promise<{ products: Product[] }> => {
    try {
        let url = `${API_URL}/products`;

        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) {
            console.error('Failed to fetch all products');
            return { products: [] };
        }

        const response = await res.json();

        // Handle nested response structure: { data: { products: [] } } or { products: [] } or []
        let products: Product[] = [];
        if (Array.isArray(response)) {
            products = response;
        } else if (response.data && Array.isArray(response.data.products)) {
            products = response.data.products;
        } else if (Array.isArray(response.products)) {
            products = response.products;
        }

        // Client-side filtering
        if (categories && categories.length > 0) {
            products = products.filter((p: Product) => p.category && categories.includes(p.category.name));
        }

        if (filters) {
            if (filters.minPrice !== undefined) {
                products = products.filter((p: Product) => p.price >= filters.minPrice!);
            }
            if (filters.maxPrice !== undefined) {
                products = products.filter((p: Product) => p.price <= filters.maxPrice!);
            }
            if (filters.isNew) {
                products = products.filter((p: Product) => p.badges?.some(b => b.type === 'new'));
            }
        }

        if (sort) {
            products.sort((a: Product, b: Product) => {
                switch (sort) {
                    case 'price_asc':
                        return a.price - b.price;
                    case 'price_desc':
                        return b.price - a.price;
                    case 'newest':
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    default:
                        return 0;
                }
            });
        }

        return { products };
    } catch (error) {
        console.error('Error fetching all products:', error);
        return { products: [] };
    }
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
    try {
        const res = await fetch(`${API_URL}/products?take=8`, { cache: 'no-store' });
        if (!res.ok) {
            console.error('Failed to fetch featured products');
            return [];
        }
        const response = await res.json();

        // Handle nested response structure
        if (Array.isArray(response)) return response;
        if (response.data && Array.isArray(response.data.products)) return response.data.products;
        if (Array.isArray(response.products)) return response.products;

        return [];
    } catch (error) {
        console.error('Error fetching featured products:', error);
        return [];
    }
};

export type FilterOptions = {
    minPrice?: number;
    maxPrice?: number;
    isNew?: boolean;
};

export type SortOption = 'price_asc' | 'price_desc' | 'newest';

export const getProductsBySlug = async (
    slug: string,
    filters?: FilterOptions,
    sort?: SortOption
): Promise<{ categoryName: string; products: Product[]; category?: Category }> => {
    try {
        const res = await fetch(`${API_URL}/products?category=${slug}`, { cache: 'no-store' });

        if (!res.ok) {
            return { categoryName: '', products: [] };
        }

        const response = await res.json();

        // Handle nested response structure
        let products: Product[] = [];
        let categoryData: Category | undefined = undefined;

        if (response.data) {
            products = response.data.products || [];
            categoryData = response.data.category;
        } else {
            products = response.products || [];
            categoryData = response.category;
        }

        if (!categoryData) {
            // Fallback strategy if category not strictly returned
            // return { categoryName: '', products: [] };
        }

        // Client-side filtering/sorting
        if (filters) {
            if (filters.minPrice !== undefined) {
                products = products.filter(p => p.price >= filters.minPrice!);
            }
            if (filters.maxPrice !== undefined) {
                products = products.filter(p => p.price <= filters.maxPrice!);
            }
            if (filters.isNew) {
                products = products.filter(p => p.badges?.some(b => b.type === 'new'));
            }
        }

        if (sort) {
            products.sort((a, b) => {
                switch (sort) {
                    case 'price_asc':
                        return a.price - b.price;
                    case 'price_desc':
                        return b.price - a.price;
                    case 'newest':
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    default:
                        return 0;
                }
            });
        }

        return {
            categoryName: categoryData?.name || '',
            products,
            category: categoryData
        };
    } catch (error) {
        console.error("Error in getProductsBySlug", error);
        return { categoryName: '', products: [] };
    }
};

export const getProductBySlug = async (slug: string): Promise<Product | undefined> => {
    try {
        const res = await fetch(`${API_URL}/products/slug/${slug}`, { cache: 'no-store' });
        if (!res.ok) {
            return undefined;
        }
        const response = await res.json();
        // Handle wrapped response
        return response.data || response;
    } catch (error) {
        console.error(`Error fetching product by slug ${slug}:`, error);
        return undefined;
    }
};

// Kept for legacy support if needed, but updated to use API
export const getProductBySku = async (sku: string): Promise<Product | undefined> => {
    try {
        const res = await fetch(`${API_URL}/products/sku/${sku}`, { cache: 'no-store' });
        if (!res.ok) return undefined;
        const response = await res.json();
        // Handle wrapped response
        return response.data || response;
    } catch (error) {
        console.error(`Error fetching product by SKU ${sku}:`, error);
        return undefined;
    }
};
