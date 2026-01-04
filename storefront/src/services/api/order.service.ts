import { Order, TrackingEvent, OrderStatus } from './types';

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
                productImage: 'https://images.unsplash.com/photo-1594576722512-582bcd46fba3?q=80&w=800&auto=format&fit=crop',
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

// Helper to generate tracking timeline based on order status
function generateTrackingEvents(order: Order): TrackingEvent[] {
    const statusOrder: OrderStatus[] = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
    const currentIndex = statusOrder.indexOf(order.status);
    const orderDate = new Date(order.createdAt);

    const events: TrackingEvent[] = [
        {
            id: 'track_1',
            status: 'PENDING',
            title: 'Order Placed',
            description: 'Your order has been placed successfully',
            location: 'Online',
            timestamp: orderDate.toISOString(),
            isCompleted: currentIndex >= 0,
        },
        {
            id: 'track_2',
            status: 'PROCESSING',
            title: 'Order Confirmed',
            description: 'Your order is being prepared for shipment',
            location: 'Dhaka Warehouse',
            timestamp: new Date(orderDate.getTime() + 3600000 * 2).toISOString(), // +2 hours
            isCompleted: currentIndex >= 1,
        },
        {
            id: 'track_3',
            status: 'SHIPPED',
            title: 'Shipped',
            description: 'Your order has been handed to the courier',
            location: 'Dhaka Sorting Center',
            timestamp: new Date(orderDate.getTime() + 86400000).toISOString(), // +1 day
            isCompleted: currentIndex >= 2,
        },
        {
            id: 'track_4',
            status: 'DELIVERED',
            title: 'Delivered',
            description: 'Your order has been delivered successfully',
            location: order.shippingAddress.city,
            timestamp: new Date(orderDate.getTime() + 86400000 * 3).toISOString(), // +3 days
            isCompleted: currentIndex >= 3,
        },
    ];

    // If cancelled, add a cancelled event
    if (order.status === 'CANCELLED') {
        return [
            events[0],
            {
                id: 'track_cancelled',
                status: 'CANCELLED',
                title: 'Order Cancelled',
                description: 'Your order has been cancelled',
                location: 'N/A',
                timestamp: new Date(orderDate.getTime() + 3600000).toISOString(),
                isCompleted: true,
            },
        ];
    }

    return events;
}

export const orderService = {
    async getOrders(): Promise<Order[]> {
        await new Promise((resolve) => setTimeout(resolve, 800));
        return MOCK_ORDERS;
    },

    async getOrderById(id: string): Promise<Order | undefined> {
        await new Promise((resolve) => setTimeout(resolve, 500));
        return MOCK_ORDERS.find((o) => o.id === id);
    },

    async getOrderTracking(orderId: string): Promise<{ order: Order; tracking: TrackingEvent[] } | null> {
        await new Promise((resolve) => setTimeout(resolve, 600));
        const order = MOCK_ORDERS.find((o) => o.id === orderId);
        if (!order) return null;

        return {
            order,
            tracking: generateTrackingEvents(order),
        };
    },
};
