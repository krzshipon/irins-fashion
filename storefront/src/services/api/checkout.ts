import { Order, ShippingRates } from '@/types/checkout';

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
        // TODO: Replace with actual API call
        // const response = await fetch('/api/shipping-rates');
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
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // TODO: Replace with actual API call
    // const response = await fetch('/api/orders', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(order),
    // });

    console.log('Order submitted:', order);

    const mockOrderId = `ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

    return {
        success: true,
        orderId: mockOrderId,
        message: "Order placed successfully"
    };
};
