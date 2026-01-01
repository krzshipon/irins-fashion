import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Silk Hijab - Emerald',
        price: 25.0,
        currency: 'USD',
        category: 'Hijab',
        image: '/images/product-hijab.png',
        isNew: true,
    },
    {
        id: '2',
        name: 'Classic Abaya - Black',
        price: 89.99,
        currency: 'USD',
        category: 'Abaya',
        image: '/images/product-abaya.png',
    },
    {
        id: '3',
        name: 'Floral Maxi Dress',
        price: 120.0,
        currency: 'USD',
        category: 'Dress',
        image: '/images/product-dress.png',
        isNew: true,
    },
    {
        id: '4',
        name: 'Wool Cardigan - Beige',
        price: 65.0,
        currency: 'USD',
        category: 'Outerwear',
        image: '/images/product-cardigan.png',
    },
];

export const getFeaturedProducts = async (): Promise<Product[]> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return MOCK_PRODUCTS.slice(0, 4);
};
