import { Order } from '@/types/checkout';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const submitOrder = async (_order: Order): Promise<{ success: boolean; orderId: string; message: string }> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const success = true; // In a real app we might validate or have failure modes
    const mockOrderId = `ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

    if (success) {
        return {
            success: true,
            orderId: mockOrderId,
            message: "Order placed successfully"
        };
    } else {
        throw new Error("Failed to process order");
    }
};
