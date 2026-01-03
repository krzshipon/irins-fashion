import { CartItem } from '@/context/CartContext';

export type DeliveryZone = 'inside_dhaka' | 'outside_dhaka';

export interface ShippingDetails {
    fullName: string;
    phone: string;
    address: string;
    division: string;
    deliveryZone: DeliveryZone;
    notes: string;
}

export interface ShippingRates {
    insideDhaka: number;
    outsideDhaka: number;
}

export interface Order {
    items: CartItem[];
    subtotal: number;
    shippingCost: number;
    shippingDetails: ShippingDetails;
    paymentMethod: 'cod';
    total: number;
}
