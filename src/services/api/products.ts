import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
    // Hijabs
    {
        id: 'h1',
        name: 'Premium Silk Hijab - Emerald',
        price: 1250.0,
        currency: 'BDT',
        category: 'Hijab',
        image: '/images/products/hijab-emerald.png', // Using placeholder for now, ideally unique
        isNew: true,
        description: 'Experience the luxury of our Premium Silk Hijab in Emerald. Crafted from the finest silk, this hijab offers a smooth, lustrous finish that drapes beautifully. Perfect for special occasions or adding a touch of elegance to your everyday look. The rich emerald color is vibrant and long-lasting.',
        images: [
            '/images/products/hijab-emerald.png',
            '/images/products/hijab-rose.png', // Placeholder additional images
            '/images/products/hijab-black.png'
        ],
        sizes: ['One Size'],
        colors: ['Emerald', 'Dusty Rose', 'Black', 'Navy'],
        colorImages: {
            'Emerald': '/images/products/hijab-emerald.png',
            'Dusty Rose': '/images/products/hijab-rose.png',
            'Black': '/images/products/hijab-black.png',
            'Navy': '/images/products/hijab-navy.png'
        }
    },
    {
        id: 'h2',
        name: 'Chiffon Hijab - Dusty Rose',
        price: 850.0,
        currency: 'BDT',
        category: 'Hijab',
        image: '/images/products/hijab-rose.png',
        isNew: true,
    },
    {
        id: 'h3',
        name: 'Jersey Hijab - Black',
        price: 650.0,
        currency: 'BDT',
        category: 'Hijab',
        image: '/images/products/hijab-black.png',
    },
    {
        id: 'h4',
        name: 'Georgette Hijab - Navy',
        price: 750.0,
        currency: 'BDT',
        category: 'Hijab',
        image: '/images/products/hijab-navy.png',
    },
    {
        id: 'h5',
        name: 'Satin Hijab - Gold',
        price: 1450.0,
        currency: 'BDT',
        category: 'Hijab',
        image: '/images/products/hijab-emerald.png', // Reuse for now
    },

    // Abayas
    {
        id: 'a1',
        name: 'Classic Black Abaya',
        price: 4500.0,
        currency: 'BDT',
        category: 'Abaya',
        image: '/images/product-abaya.png',
    },
    {
        id: 'a2',
        name: 'Embroidered Open Abaya',
        price: 6500.0,
        currency: 'BDT',
        category: 'Abaya',
        image: '/images/product-abaya.png',
        isNew: true,
    },
    {
        id: 'a3',
        name: 'Kimono Style Abaya',
        price: 5200.0,
        currency: 'BDT',
        category: 'Abaya',
        image: '/images/product-abaya.png',
    },
    {
        id: 'a4',
        name: 'Butterfly Abaya - Beige',
        price: 4800.0,
        currency: 'BDT',
        category: 'Abaya',
        image: '/images/product-abaya.png',
        isNew: true,
    },

    // Dresses
    {
        id: 'd1',
        name: 'Floral Maxi Dress',
        price: 3500.0,
        currency: 'BDT',
        category: 'Dress',
        image: '/images/product-dress.png',
        isNew: true,
    },
    {
        id: 'd2',
        name: 'Elegant Evening Gown',
        price: 8500.0,
        currency: 'BDT',
        category: 'Dress',
        image: '/images/product-dress.png',
    },
    {
        id: 'd3',
        name: 'Summer Cotton Dress',
        price: 2200.0,
        currency: 'BDT',
        category: 'Dress',
        image: '/images/product-dress.png',
    },
    {
        id: 'd4',
        name: 'Pleated Midi Dress',
        price: 2800.0,
        currency: 'BDT',
        category: 'Dress',
        image: '/images/product-dress.png',
    },

    // Accessories
    {
        id: 'ac1',
        name: 'Leather Handbag',
        price: 3200.0,
        currency: 'BDT',
        category: 'Accessories',
        image: '/images/product-cardigan.png', // Reusing placeholder
    },
    {
        id: 'ac2',
        name: 'Statement Necklace',
        price: 1200.0,
        currency: 'BDT',
        category: 'Accessories',
        image: '/images/product-cardigan.png',
    },
];

export const getFeaturedProducts = async (): Promise<Product[]> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return MOCK_PRODUCTS.filter(p => p.isNew).slice(0, 4);
};

// Helper to map URL slugs to Category names
const slugToCategoryMap: Record<string, string> = {
    'hijabs': 'Hijab',
    'abayas': 'Abaya',
    'dresses': 'Dress',
    'accessories': 'Accessories',
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
): Promise<{ categoryName: string, products: Product[] }> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const categoryName = slugToCategoryMap[slug.toLowerCase()];

    if (!categoryName) {
        return { categoryName: '', products: [] };
    }

    let products = MOCK_PRODUCTS.filter(p => p.category.toLowerCase() === categoryName.toLowerCase());

    // Filtering
    if (filters) {
        if (filters.minPrice !== undefined) {
            products = products.filter(p => p.price >= filters.minPrice!);
        }
        if (filters.maxPrice !== undefined) {
            products = products.filter(p => p.price <= filters.maxPrice!);
        }
        if (filters.isNew) {
            products = products.filter(p => p.isNew);
        }
    }

    // Sorting
    if (sort) {
        products.sort((a, b) => {
            switch (sort) {
                case 'price_asc':
                    return a.price - b.price;
                case 'price_desc':
                    return b.price - a.price;
                case 'newest':
                    return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0); // Put New items first
                default:
                    return 0;
            }
        });
    }

    return { categoryName, products };
};

export const getProductsByCategory = async (category: string, limit: number = 4): Promise<Product[]> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    // Case insensitive match
    return MOCK_PRODUCTS.filter(p => p.category.toLowerCase() === category.toLowerCase()).slice(0, limit);
}

export const getProductById = async (id: string): Promise<Product | undefined> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_PRODUCTS.find(p => p.id === id);
};
