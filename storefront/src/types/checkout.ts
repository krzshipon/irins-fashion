import { CartItem } from '@/context/CartContext';

export interface ShippingDetails {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
}

export interface Order {
    items: CartItem[];
    subtotal: number;
    shippingDetails: ShippingDetails;
    paymentMethod: 'cod'; // Only Cash on Delivery for now
    total: number;
}
