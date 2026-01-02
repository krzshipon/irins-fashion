import React from 'react';
import { CartItem } from '@/context/CartContext';
import { useLocalization } from '@/context/LocalizationContext';
import Image from 'next/image';

interface OrderSummaryProps {
    items: CartItem[];
    subtotal: number;
    total: number;
    onPlaceOrder: () => void;
    isSubmitting: boolean;
}


export const OrderSummary: React.FC<OrderSummaryProps> = ({ items, subtotal, total, onPlaceOrder, isSubmitting }) => {
    const { dictionary: t } = useLocalization();

    return (
        <div className="bg-gray-50 p-8 rounded-sm"> {/* Cleaner background, no border/shadow */}
            <h2 className="text-2xl font-serif text-gray-900 mb-8">{t.checkout.orderSummary}</h2>

            <div className="space-y-6 mb-8">
                {items.map((item) => (
                    <div key={item.cartItemId} className="flex gap-4">
                        <div className="relative w-20 h-24 flex-shrink-0 bg-gray-100 overflow-hidden rounded-sm">
                            <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute top-0 right-0 bg-black/50 text-white text-[10px] px-1.5 py-0.5 backdrop-blur-sm">
                                x{item.quantity}
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                            <div>
                                <h3 className="font-medium text-gray-900 leading-tight">{item.name}</h3>
                                <div className="text-sm text-gray-500 mt-1 space-x-2">
                                    {item.selectedColor && <span>{item.selectedColor}</span>}
                                    {item.selectedSize && <span>{item.selectedSize}</span>}
                                </div>
                            </div>
                            <p className="text-sm font-medium text-gray-900">৳ {item.price.toLocaleString()}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t border-gray-200 py-6 space-y-3">
                <div className="flex justify-between text-gray-600">
                    <span>{t.checkout.subtotal}</span>
                    <span>৳ {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>{t.checkout.shippingFee}</span>
                    <span className="text-green-700 text-sm font-medium tracking-wide uppercase">{t.checkout.free}</span>
                </div>
            </div>

            <div className="flex justify-between items-baseline border-t border-gray-900 pt-6 mb-8">
                <span className="text-lg font-serif italic text-gray-900">{t.checkout.total}</span>
                <span className="text-3xl font-serif text-gray-900">৳ {total.toLocaleString()}</span>
            </div>

            <button
                onClick={onPlaceOrder}
                disabled={isSubmitting}
                className="w-full bg-black text-white py-4 text-sm uppercase tracking-widest font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
            >
                {isSubmitting ? 'Processing...' : t.checkout.placeOrder}
            </button>
        </div>
    );
};
