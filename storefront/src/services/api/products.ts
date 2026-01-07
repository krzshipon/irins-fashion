import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
    // Hijabs
    {
        id: 'h1',
        sku: 'IF-HJB-EM-001',
        name: 'Premium Silk Hijab - Emerald',
        price: 1250.0,
        currency: 'BDT',
        category: 'Hijab',
        image: '/images/products/hijab-emerald.png',
        isNew: true,
        description: 'Experience the luxury of our Premium Silk Hijab in Emerald. Crafted from the finest silk, this hijab offers a smooth, lustrous finish that drapes beautifully. Perfect for special occasions or adding a touch of elegance to your everyday look. The rich emerald color is vibrant and long-lasting.',
        images: [
            '/images/products/hijab-emerald.png',
            '/images/products/hijab-rose.png',
            '/images/products/hijab-black.png'
        ],
        sizes: ['One Size'],
        colors: ['Emerald', 'Dusty Rose', 'Black'],
        colorImages: {
            'Emerald': '/images/products/hijab-emerald.png',
            'Dusty Rose': '/images/products/hijab-rose.png',
            'Black': '/images/products/hijab-black.png'
        },
        badges: [{ type: 'new', text: 'New Arrival' }],
        originalPrice: 1500,
        discount: { type: 'flat', value: 250 }
    },
    {
        id: 'h2',
        sku: 'IF-HJB-DR-002',
        name: 'Chiffon Hijab - Dusty Rose',
        price: 850.0,
        currency: 'BDT',
        category: 'Hijab',
        image: '/images/products/hijab-rose.png',
        isNew: true,
        description: 'Our Chiffon Hijab in Dusty Rose is perfect for everyday wear. Lightweight, breathable, and easy to style, it adds a soft, feminine touch to any outfit. The slightly textured fabric ensures it stays in place all day.',
        images: [
            '/images/products/hijab-rose.png',
            '/images/products/hijab-emerald.png',
            '/images/products/hijab-navy.png'
        ],
        sizes: ['One Size'],
        colors: ['Dusty Rose', 'Emerald', 'Navy'],
        colorImages: {
            'Dusty Rose': '/images/products/hijab-rose.png',
            'Emerald': '/images/products/hijab-emerald.png',
            'Navy': '/images/products/hijab-navy.png'
        }
    },
    {
        id: 'h3',
        sku: 'IF-HJB-BK-003',
        name: 'Jersey Hijab - Black',
        price: 650.0,
        currency: 'BDT',
        category: 'Hijab',
        image: '/images/products/hijab-black.png',
        description: 'The essential Jersey Hijab in Black. Made from high-quality stretch cotton jersey, this hijab provides ultimate comfort and versatility. No pins needed – just wrap and go. A must-have staple for every wardrobe.',
        images: [
            '/images/products/hijab-black.png',
            '/images/products/hijab-navy.png'
        ],
        sizes: ['One Size'],
        colors: ['Black', 'Navy'],
        colorImages: {
            'Black': '/images/products/hijab-black.png',
            'Navy': '/images/products/hijab-navy.png'
        }
    },
    {
        id: 'h4',
        sku: 'IF-HJB-NV-004',
        name: 'Georgette Hijab - Navy',
        price: 750.0,
        currency: 'BDT',
        category: 'Hijab',
        image: '/images/products/hijab-navy.png',
        description: 'Elegant Georgette Hijab in deep Navy. The semi-sheer, matte fabric drapes effortlessly, making it ideal for both casual and formal looks. Pair it with an abaya or a contemporary outfit for a polished finish.',
        images: [
            '/images/products/hijab-navy.png',
            '/images/products/hijab-rose.png'
        ],
        sizes: ['One Size'],
        colors: ['Navy', 'Dusty Rose'],
        colorImages: {
            'Navy': '/images/products/hijab-navy.png',
            'Dusty Rose': '/images/products/hijab-rose.png'
        }
    },
    {
        id: 'h5',
        sku: 'IF-HJB-GD-005',
        name: 'Satin Hijab - Gold',
        price: 1450.0,
        currency: 'BDT',
        category: 'Hijab',
        image: '/images/products/hijab-emerald.png', // Fallback
        description: 'Radiate elegance with our Satin Hijab in Gold. The high-shine finish and silky feel make this hijab a showstopper. Perfect for weddings, parties, or whenever you want to feel like royalty.',
        images: [
            '/images/products/hijab-emerald.png' // Fallback
        ],
        sizes: ['One Size'],
        colors: ['Gold'],
        colorImages: {
            'Gold': '/images/products/hijab-emerald.png'
        }
    },

    // Abayas
    {
        id: 'a1',
        sku: 'IF-ABY-BK-001',
        name: 'Classic Black Abaya',
        price: 4500.0,
        currency: 'BDT',
        category: 'Abaya',
        image: '/images/product-abaya.png',
        description: 'A timeless Classic Black Abaya that embodies simplicity and grace. Designed with a flowing silhouette and comfortable fabric, this abaya is reliable for daily wear or religious gatherings. Includes a matching shayla.',
        images: ['/images/product-abaya.png'],
        sizes: ['52', '54', '56', '58', '60'],
        colors: ['Black'],
        colorImages: { 'Black': '/images/product-abaya.png' }

    },
    {
        id: 'a2',
        sku: 'IF-ABY-EM-002',
        name: 'Embroidered Open Abaya',
        price: 6500.0,
        currency: 'BDT',
        category: 'Abaya',
        image: '/images/product-abaya.png',
        isNew: true,
        description: 'Elevate your style with this Embroidered Open Abaya. Featuring intricate floral embroidery along the sleeves and hem, this piece can be worn open over a dress or closed. Perfect for Eid and special events.',
        images: ['/images/product-abaya.png'],
        sizes: ['52', '54', '56', '58'],
        colors: ['Black/Gold', 'Black/Silver'],
        colorImages: {
            'Black/Silver': '/images/product-abaya.png'
        },
        badges: [
            { type: 'new', text: 'New' },
            { type: 'bestseller', text: 'Best Seller', color: '#f59e0b', textColor: '#ffffff' }
        ]
    },
    {
        id: 'a3',
        sku: 'IF-ABY-KM-003',
        name: 'Kimono Style Abaya',
        price: 5200.0,
        currency: 'BDT',
        category: 'Abaya',
        image: '/images/product-abaya.png',
        description: 'Modern Kimono Style Abaya with wide sleeves and a relaxed fit. Made from premium crepe fabric, it offers a contemporary twist on traditional modest wear. Available in versatile shades.',
        images: ['/images/product-abaya.png'],
        sizes: ['Free Size'],
        colors: ['Grey', 'Beige', 'Black'],
        colorImages: {
            'Grey': '/images/product-abaya.png',
            'Beige': '/images/product-abaya.png',
            'Black': '/images/product-abaya.png'
        }
    },
    {
        id: 'a4',
        sku: 'IF-ABY-BF-004',
        name: 'Butterfly Abaya - Beige',
        price: 4800.0,
        currency: 'BDT',
        category: 'Abaya',
        image: '/images/product-abaya.png', // Fallback
        isNew: true,
        description: 'Float through your day in this ethereal Butterfly Abaya in Beige. The ultra-wide cut provides maximum coverage and freedom of movement, while the cinchable inner belt allows for a custom fit.',
        images: ['/images/product-abaya.png'],
        sizes: ['One Size'],
        colors: ['Beige'],
        colorImages: { 'Beige': '/images/product-abaya.png' }
    },

    // Borkhas (formerly Dresses)
    {
        id: 'd1',
        sku: 'IF-DRS-FL-001',
        name: 'Floral Maxi Dress',
        price: 3500.0,
        currency: 'BDT',
        category: 'Borkha',
        image: '/images/product-dress.png',
        isNew: true,
        description: 'Embrace the season with our Floral Maxi Dress. Featuring a vibrant botanical print and a flattering A-line cut, this dress is perfect for brunch or a day out. Long sleeves and a high neckline ensure modest coverage.',
        images: ['/images/product-dress.png'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Floral Pink', 'Floral Blue'],
        colorImages: {
            'Floral Blue': '/images/product-dress.png'
        },
        badges: [{ type: 'discount', text: '10% OFF' }],
        originalPrice: 3900,
        discount: { type: 'percentage', value: 10 }
    },
    {
        id: 'd2',
        sku: 'IF-DRS-EV-002',
        name: 'Elegant Evening Gown',
        price: 8500.0,
        currency: 'BDT',
        category: 'Borkha',
        image: '/images/product-dress.png',
        description: 'Make an entrance in this Elegant Evening Gown. With detailed beading on the bodice and a sweeping skirt, this gown radiates sophistication. Fully lined for comfort and modesty.',
        images: ['/images/product-dress.png'],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Midnight Blue', 'Burgundy'],
        colorImages: {
            'Midnight Blue': '/images/product-dress.png',
            'Burgundy': '/images/product-dress.png'
        }
    },
    {
        id: 'd3',
        sku: 'IF-DRS-CT-003',
        name: 'Summer Cotton Dress',
        price: 2200.0,
        currency: 'BDT',
        category: 'Borkha',
        image: '/images/product-dress.png',
        description: 'Stay cool and chic in our Summer Cotton Dress. Made from 100% organic cotton, this breathable dress features functional pockets and a relaxed fit. Your go-to choice for hot days.',
        images: ['/images/product-dress.png'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['White', 'Sage Green'],
        colorImages: {
            'White': '/images/product-dress.png',
            'Sage Green': '/images/product-dress.png'
        }
    },
    {
        id: 'd4',
        sku: 'IF-DRS-PL-004',
        name: 'Pleated Midi Dress',
        price: 2800.0,
        currency: 'BDT',
        category: 'Borkha',
        image: '/images/product-dress.png',
        description: 'Style meets texture in this Pleated Midi Dress. The accordion pleats add movement and depth, while the belted waist defines your silhouette. Pairs perfectly with boots or heels.',
        images: ['/images/product-dress.png'],
        sizes: ['M', 'L', 'XL'],
        colors: ['Rust', 'Black'],
        colorImages: {
            'Rust': '/images/product-dress.png',
            'Black': '/images/product-dress.png'
        }
    },

    // Gowns
    {
        id: 'g1',
        sku: 'IF-GWN-RB-001',
        name: 'Royal Blue Velvet Gown',
        price: 9500.0,
        currency: 'BDT',
        category: 'Gown',
        image: '/images/product-dress.png',
        isNew: true,
        description: 'Stunning Royal Blue Velvet Gown perfect for special occasions. Features luxurious velvet fabric with intricate detailing.',
        images: ['/images/product-dress.png'],
        sizes: ['S', 'M', 'L'],
        colors: ['Royal Blue'],
        colorImages: { 'Royal Blue': '/images/product-dress.png' },
        badges: [{ type: 'custom', text: 'Exquisite', color: '#7e22ce', textColor: '#ffffff' }],
        originalPrice: 12000,
        discount: { type: 'flat', value: 2500 }
    },

    // Accessories
    {
        id: 'ac1',
        sku: 'IF-ACC-HB-001',
        name: 'Leather Handbag',
        price: 3200.0,
        currency: 'BDT',
        category: 'Accessories',
        image: '/images/product-cardigan.png', // Reusing placeholder as per plan
        description: 'Complete your look with this premium Leather Handbag. Spacious enough for all your essentials yet compact enough for daily carry. Features gold-tone hardware and a detachable shoulder strap.',
        images: ['/images/product-cardigan.png'],
        sizes: ['One Size'],
        colors: ['Tan', 'Black'],
        colorImages: {
            'Tan': '/images/product-cardigan.png',
            'Black': '/images/product-cardigan.png'
        }
    },
    {
        id: 'ac2',
        sku: 'IF-ACC-NK-002',
        name: 'Statement Necklace',
        price: 1200.0,
        currency: 'BDT',
        category: 'Accessories',
        image: '/images/product-cardigan.png', // Reusing placeholder
        description: 'Add a touch of sparkle with our Statement Necklace. This bold piece features layered chains and crystal accents. The perfect accessory to dress up a simple abaya or dress.',
        images: ['/images/product-cardigan.png'],
        sizes: ['Adjustable'],
        colors: ['Gold', 'Silver'],
        colorImages: {
            'Gold': '/images/product-cardigan.png',
            'Silver': '/images/product-cardigan.png'
        }
    },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Helper function to transform backend product data to frontend Product interface
const transformProduct = (backendProduct: any): Product => {
    // Get primary image: first from images array, or from first color's images, or fallback
    let primaryImage = '/images/placeholder-product.png';
    if (backendProduct.images && backendProduct.images.length > 0) {
        primaryImage = backendProduct.images[0].url || backendProduct.images[0];
    } else if (backendProduct.colors && backendProduct.colors.length > 0) {
        const firstColor = backendProduct.colors[0];
        if (firstColor.images && firstColor.images.length > 0) {
            primaryImage = firstColor.images[0].url || firstColor.images[0];
        }
    }

    // Build images array
    const images: string[] = [];
    if (backendProduct.images) {
        images.push(...backendProduct.images.map((img: any) => img.url || img));
    }

    // Get category name
    const categoryName = backendProduct.category?.name || '';

    return {
        id: backendProduct.id,
        sku: backendProduct.sku,
        name: backendProduct.name,
        price: backendProduct.price,
        originalPrice: backendProduct.originalPrice,
        discount: backendProduct.discount,
        currency: 'BDT',
        category: categoryName,
        image: primaryImage,
        images: images,
        description: backendProduct.description,
        isNew: backendProduct.isNew || backendProduct.badges?.some((b: any) => b.type === 'new'),
        badges: backendProduct.badges?.map((b: any) => ({
            type: b.type,
            text: b.text,
            color: b.color,
            textColor: b.textColor
        })) || [],
        variants: backendProduct.colors?.map((color: any) => ({
            id: color.id,
            colorName: color.name,
            colorCode: color.hexCode,
            images: color.images?.map((img: any) => img.url || img) || [],
            sizes: color.variants?.map((v: any) => ({
                id: v.id,
                size: v.size,
                price: String(v.price || backendProduct.price),
                stock: String(v.stock || 0),
                sku: v.sku || backendProduct.sku
            })) || []
        })) || []
    };
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
    try {
        // Fetch from API - get newest products
        const res = await fetch(`${API_URL}/products?take=8`, { cache: 'no-store' });
        if (!res.ok) {
            console.error('Failed to fetch featured products');
            return MOCK_PRODUCTS.filter(p => p.isNew).slice(0, 4); // Fallback to mock
        }
        const response = await res.json();
        // API wraps response in { statusCode, message, data: { products } }
        const rawProducts = response.data?.products || response.products || [];
        return rawProducts.map(transformProduct).slice(0, 4);
    } catch (error) {
        console.error('Error fetching featured products:', error);
        return MOCK_PRODUCTS.filter(p => p.isNew).slice(0, 4); // Fallback to mock
    }
};

// Helper to map URL slugs to Category names
const slugToCategoryMap: Record<string, string> = {
    'hijabs': 'Hijab',
    'abayas': 'Abaya',
    'borkhas': 'Borkha',
    'gowns': 'Gown',
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
): Promise<{ categoryName: string; products: Product[]; category?: any }> => {
    try {
        const res = await fetch(`${API_URL}/products?category=${slug}`, { cache: 'no-store' });

        if (!res.ok) {
            // Fallback to mock if API fails during transition? No, fail loud or return empty.
            // If 404/invalid, return empty.
            return { categoryName: '', products: [] };
        }

        const response = await res.json();
        // API wraps response in { statusCode, message, data: { products, category } }
        const responseData = response.data || response;
        const categoryData = responseData.category;

        if (!categoryData) {
            return { categoryName: '', products: [] };
        }

        let products = (responseData.products as any[] || []).map(transformProduct);

        // Filtering (Client-side for now to match interface)
        if (filters) {
            if (filters.minPrice !== undefined) {
                products = products.filter(p => p.price >= filters.minPrice!);
            }
            if (filters.maxPrice !== undefined) {
                products = products.filter(p => p.price <= filters.maxPrice!);
            }
            if (filters.isNew) {
                products = products.filter(p => (p as any).isNew); // isNew might need casting if not in backend types yet
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
                        // @ts-ignore
                        return ((b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
                    default:
                        return 0;
                }
            });
        }

        return {
            categoryName: categoryData.name,
            products,
            category: categoryData
        };
    } catch (error) {
        console.error("Error in getProductsBySlug", error);
        return { categoryName: '', products: [] };
    }
};


export const getProductsByCategory = async (categorySlug: string, limit: number = 4): Promise<Product[]> => {
    try {
        const res = await fetch(`${API_URL}/products?category=${categorySlug}&take=${limit}`, { cache: 'no-store' });
        if (!res.ok) {
            console.error(`Failed to fetch products for category ${categorySlug}`);
            return [];
        }
        const response = await res.json();
        // API wraps response in { statusCode, message, data: { products } }
        const rawProducts = response.data?.products || response.products || [];
        return rawProducts.map(transformProduct);
    } catch (error) {
        console.error("Error fetching products by category:", error);
        return [];
    }
}

export const getProductById = async (id: string): Promise<Product | undefined> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_PRODUCTS.find(p => p.id === id);
};

export const getProductBySku = async (sku: string): Promise<Product | undefined> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_PRODUCTS.find(p => p.sku === sku);
};

export const getAllProducts = async (
    categories?: string[],
    filters?: FilterOptions,
    sort?: SortOption
): Promise<{ products: Product[], categories: string[] }> => {
    try {
        const res = await fetch(`${API_URL}/products`, { cache: 'no-store' });
        if (!res.ok) {
            console.error('Failed to fetch all products');
            // Fallback to mock
            return { products: MOCK_PRODUCTS, categories: [...new Set(MOCK_PRODUCTS.map(p => p.category))] };
        }

        const response = await res.json();
        // API wraps response in { statusCode, message, data: { products } }
        const rawProducts = response.data?.products || response.products || [];
        let products = rawProducts.map(transformProduct);

        // Get unique categories from fetched products
        const allCategories = [...new Set(products.map((p: Product) => p.category))];

        // Filter by categories
        if (categories && categories.length > 0) {
            products = products.filter((p: Product) =>
                categories.some(cat => cat.toLowerCase() === p.category.toLowerCase())
            );
        }

        // Filtering
        if (filters) {
            if (filters.minPrice !== undefined) {
                products = products.filter((p: Product) => p.price >= filters.minPrice!);
            }
            if (filters.maxPrice !== undefined) {
                products = products.filter((p: Product) => p.price <= filters.maxPrice!);
            }
            if (filters.isNew) {
                products = products.filter((p: Product) => (p as any).isNew);
            }
        }

        // Sorting
        if (sort) {
            products.sort((a: Product, b: Product) => {
                switch (sort) {
                    case 'price_asc':
                        return a.price - b.price;
                    case 'price_desc':
                        return b.price - a.price;
                    case 'newest':
                        return ((b as any).isNew ? 1 : 0) - ((a as any).isNew ? 1 : 0);
                    default:
                        return 0;
                }
            });
        }

        return { products, categories: allCategories as string[] };
    } catch (error) {
        console.error('Error fetching all products:', error);
        // Fallback to mock
        return { products: MOCK_PRODUCTS, categories: [...new Set(MOCK_PRODUCTS.map(p => p.category))] };
    }
};
