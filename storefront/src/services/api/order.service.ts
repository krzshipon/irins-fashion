import { Order, TrackingEvent, OrderStatus } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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
            location: order.shippingAddress?.division || 'Customer Address',
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

// Transform API response to frontend Order type
function transformOrder(apiOrder: any): Order {
    return {
        id: apiOrder.id,
        userId: apiOrder.userId,
        status: apiOrder.status,
        createdAt: apiOrder.createdAt,
        subtotal: Number(apiOrder.subtotal),
        shippingCost: Number(apiOrder.shippingCost),
        total: Number(apiOrder.total),
        discount: Number(apiOrder.discount) || 0,
        shippingAddress: apiOrder.shippingAddressSnapshot ? {
            id: 'snapshot',
            label: 'Shipping',
            recipientName: apiOrder.shippingAddressSnapshot.fullName,
            address: apiOrder.shippingAddressSnapshot.address,
            division: apiOrder.shippingAddressSnapshot.division,
            phone: apiOrder.shippingAddressSnapshot.phone,
            isDefault: false,
        } : {
            id: 'unknown',
            label: 'Unknown',
            recipientName: 'Unknown',
            address: 'Unknown',
            division: 'Unknown',
            phone: 'Unknown',
            isDefault: false,
        },
        items: (apiOrder.items || []).map((item: any) => {
            // Fallback to product.images if productImage is empty
            let imageUrl = item.productImage;
            if (!imageUrl && item.product?.images?.length > 0) {
                const primaryImage = item.product.images.find((img: any) => img.isPrimary);
                imageUrl = primaryImage?.url || item.product.images[0]?.url || '';
            }
            return {
                id: item.id,
                productId: item.productId,
                productName: item.productName,
                productImage: imageUrl || '',
                variant: item.variantSnapshot || {},
                quantity: item.quantity,
                price: Number(item.price),
            };
        }),
    };
}

export const orderService = {
    async getOrders(): Promise<Order[]> {
        try {
            const response = await fetch(`${API_URL}/orders/my/all`, {
                credentials: 'include',
            });

            if (!response.ok) {
                // For unauthenticated users, return empty array
                if (response.status === 401) {
                    return [];
                }
                throw new Error('Failed to fetch orders');
            }

            const responseData = await response.json();
            // Backend wraps response in {statusCode, message, data: [...]}
            const orders = responseData.data || responseData;
            return (Array.isArray(orders) ? orders : []).map(transformOrder);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            return [];
        }
    },

    async getOrderById(id: string): Promise<Order | undefined> {
        try {
            const response = await fetch(`${API_URL}/orders/${id}`, {
                credentials: 'include',
            });

            if (!response.ok) {
                return undefined;
            }

            const responseData = await response.json();
            // Backend wraps response in {statusCode, message, data: {...}}
            const order = responseData.data || responseData;
            return transformOrder(order);
        } catch (error) {
            console.error('Failed to fetch order:', error);
            return undefined;
        }
    },

    async getOrderTracking(orderId: string): Promise<{ order: Order; tracking: TrackingEvent[] } | null> {
        try {
            const order = await this.getOrderById(orderId);
            if (!order) return null;

            return {
                order,
                tracking: generateTrackingEvents(order),
            };
        } catch (error) {
            console.error('Failed to fetch order tracking:', error);
            return null;
        }
    },
};
