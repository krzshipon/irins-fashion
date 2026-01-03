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
        badges: [{ type: 'new', text: 'New Arrival' }]
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
        badges: [{ type: 'discount', text: '10% OFF' }]
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
        badges: [{ type: 'custom', text: 'Exquisite', color: '#7e22ce', textColor: '#ffffff' }]
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

export const getFeaturedProducts = async (): Promise<Product[]> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return MOCK_PRODUCTS.filter(p => p.isNew).slice(0, 4);
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
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Get unique categories
    const allCategories = [...new Set(MOCK_PRODUCTS.map(p => p.category))];

    let products = [...MOCK_PRODUCTS];

    // Filter by categories
    if (categories && categories.length > 0) {
        products = products.filter(p =>
            categories.some(cat => cat.toLowerCase() === p.category.toLowerCase())
        );
    }

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
                    return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
                default:
                    return 0;
            }
        });
    }

    return { products, categories: allCategories };
};
