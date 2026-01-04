import { Order } from './types';

const MOCK_ORDERS: Order[] = [
    {
        id: 'ORD-7829-XJ',
        userId: 'usr_123456',
        status: 'DELIVERED',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
        subtotal: 12500,
        shippingCost: 100,
        total: 12600,
        shippingAddress: {
            id: 'addr_1',
            label: 'Home',
            recipientName: 'Irina Shayk',
            street: 'House 12, Road 5',
            city: 'Dhaka',
            division: 'Dhaka',
            postalCode: '1209',
            phone: '01700000000',
            isDefault: true
        },
        items: [
            {
                id: 'item_1',
                productId: 'prod_1',
                productName: 'Premium Silk Abaya',
                productImage: 'https://images.unsplash.com/photo-1594576722512-582bcd46fba3?q=80&w=800&auto=format&fit=crop', // Temporary placeholder
                variant: { color: 'Emerald', size: 'M' },
                quantity: 1,
                price: 8500,
            },
            {
                id: 'item_2',
                productId: 'prod_2',
                productName: 'Chiffon Hijab',
                productImage: 'https://images.unsplash.com/photo-1585670210693-e7fdd16b142e?q=80&w=800&auto=format&fit=crop',
                variant: { color: 'Beige' },
                quantity: 2,
                price: 2000,
            },
        ],
    },
    {
        id: 'ORD-9921-MC',
        userId: 'usr_123456',
        status: 'PROCESSING',
        createdAt: new Date().toISOString(), // Today
        subtotal: 4500,
        shippingCost: 60,
        total: 4560,
        shippingAddress: {
            id: 'addr_1',
            label: 'Home',
            recipientName: 'Irina Shayk',
            street: 'House 12, Road 5',
            city: 'Dhaka',
            division: 'Dhaka',
            postalCode: '1209',
            phone: '01700000000',
            isDefault: true
        },
        items: [
            {
                id: 'item_3',
                productId: 'prod_3',
                productName: 'Everyday Cotton Tunic',
                productImage: 'https://images.unsplash.com/photo-1564415319596-8cc0f3c5aa84?q=80&w=800&auto=format&fit=crop',
                variant: { size: 'L' },
                quantity: 1,
                price: 4500,
            },
        ],
    },
];

export const orderService = {
    async getOrders(): Promise<Order[]> {
        await new Promise((resolve) => setTimeout(resolve, 800));
        return MOCK_ORDERS;
    },

    async getOrderById(id: string): Promise<Order | undefined> {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return MOCK_ORDERS.find((o) => o.id === id);
    },
};
