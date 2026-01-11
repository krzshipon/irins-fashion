import { Order, ShippingRates } from '@/types/checkout';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Fallback shipping rates
const FALLBACK_RATES: ShippingRates = {
    insideDhaka: 80,
    outsideDhaka: 120,
};

/**
 * Fetch shipping rates from API with fallback
 */
export const getShippingRates = async (): Promise<ShippingRates> => {
    try {
        // TODO: Replace with actual API call when endpoint is ready
        // const response = await fetch(`${API_URL}/shipping-rates`);
        // if (!response.ok) throw new Error('Failed to fetch rates');
        // return await response.json();

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Return mock data (simulating API response)
        return {
            insideDhaka: 80,
            outsideDhaka: 120,
        };
    } catch (error) {
        console.warn('Failed to fetch shipping rates, using fallback:', error);
        return FALLBACK_RATES;
    }
};

/**
 * Submit order to the backend
 */
export const submitOrder = async (order: Order): Promise<{ success: boolean; orderId: string; message: string }> => {
    try {
        // Transform cart items to API format
        const orderPayload = {
            items: order.items.map(item => ({
                productId: item.id,
                productName: item.name,
                productImage: item.images?.find(img => img.isPrimary)?.url || item.images?.[0]?.url || '',
                quantity: item.quantity,
                price: (item as any).effectivePrice ?? item.price,
                variantSnapshot: {
                    color: item.selectedColor,
                    size: item.selectedSize,
                },
            })),
            subtotal: order.subtotal,
            shippingCost: order.shippingCost,
            total: order.total,
            couponDiscount: order.couponDiscount,
            shippingDetails: order.shippingDetails,
            paymentMethod: order.paymentMethod,
            appliedCoupon: order.appliedCoupon,
        };

        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(orderPayload),
        });

        const responseData = await response.json();

        if (!response.ok) {
            return {
                success: false,
                orderId: '',
                message: responseData.message || 'Failed to submit order',
            };
        }

        // Backend wraps response in {statusCode, message, data: {...}}
        const data = responseData.data || responseData;
        return {
            success: data.success ?? true,
            orderId: data.orderId || '',
            message: data.message || 'Order placed successfully',
        };
    } catch (error) {
        console.error('Order submission failed:', error);
        return {
            success: false,
            orderId: '',
            message: error instanceof Error ? error.message : 'An error occurred',
        };
    }
};

