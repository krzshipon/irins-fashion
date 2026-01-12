const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface AdminOrder {
    id: string;
    userId?: string;
    status: string;
    total: number;
    subtotal: number;
    shippingCost: number;
    discount: number;
    paymentMethod: string;
    shippingAddressSnapshot: {
        fullName: string;
        phone: string;
        address: string;
        division: string;
        deliveryZone: string;
        notes?: string;
    };
    createdAt: string;
    updatedAt: string;
    items: {
        id: string;
        productId: string;
        productName: string;
        productImage: string;
        quantity: number;
        price: number;
        variantSnapshot?: { color?: string; size?: string };
    }[];
    user?: {
        id: string;
        name?: string;
        mobile: string;
        email?: string;
    };
}

export interface OrdersResponse {
    orders: AdminOrder[];
    total: number;
    page: number;
    totalPages: number;
}

export interface OrderStats {
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
}

export const ordersService = {
    async getAll(filters?: {
        status?: string;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<OrdersResponse> {
        const params = new URLSearchParams();
        if (filters?.status) params.set('status', filters.status);
        if (filters?.search) params.set('search', filters.search);
        if (filters?.page) params.set('page', filters.page.toString());
        if (filters?.limit) params.set('limit', filters.limit.toString());

        const response = await fetch(`${API_URL}/admin/orders?${params}`, {
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch orders');
        }

        const responseData = await response.json();
        // Backend wraps response in {statusCode, message, data: {...}}
        const result = responseData.data || responseData;

        return {
            orders: (result.orders || []).map((o: any) => ({
                ...o,
                total: Number(o.total),
                subtotal: Number(o.subtotal),
                shippingCost: Number(o.shippingCost),
                discount: Number(o.discount),
                items: (o.items || []).map((i: any) => ({
                    ...i,
                    price: Number(i.price),
                })),
            })),
            total: result.total || 0,
            page: result.page || 1,
            totalPages: result.totalPages || 1,
        };
    },

    async getOne(id: string): Promise<AdminOrder> {
        const response = await fetch(`${API_URL}/admin/orders/${id}`, {
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch order');
        }

        const responseData = await response.json();
        const order = responseData.data || responseData;

        return {
            ...order,
            total: Number(order.total),
            subtotal: Number(order.subtotal),
            shippingCost: Number(order.shippingCost),
            discount: Number(order.discount),
            items: (order.items || []).map((i: any) => ({
                ...i,
                price: Number(i.price),
            })),
        };
    },

    async updateStatus(id: string, status: string): Promise<AdminOrder> {
        const response = await fetch(`${API_URL}/admin/orders/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            throw new Error('Failed to update order status');
        }

        const data = await response.json();
        return data.data || data;
    },

    async getStats(): Promise<OrderStats> {
        const response = await fetch(`${API_URL}/admin/orders/stats`, {
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch order stats');
        }

        const data = await response.json();
        return data.data || data;
    },
};
