import { ProductDiscount, Product, ProductVariant } from '@/services/api/types';

/**
 * Apply discount to a price
 * @param price - The original price
 * @param discount - The discount object (percentage or flat)
 * @returns The discounted price
 */
export function applyDiscount(price: number, discount?: ProductDiscount): number {
    if (!discount) return price;

    if (discount.type === 'percentage') {
        return Math.round(price * (1 - discount.value / 100));
    } else {
        // Flat discount
        return Math.max(0, price - discount.value);
    }
}

/**
 * Get the effective price for a product/variant combination
 * Takes into account variant-specific pricing and applies product discount
 * 
 * @param product - The product
 * @param selectedColor - The selected color name
 * @param selectedSize - The selected size name
 * @returns Object with effectivePrice (discounted) and originalPrice (before discount)
 */
export function getEffectivePrice(
    product: Product,
    selectedColor?: string,
    selectedSize?: string
): { effectivePrice: number; originalPrice: number } {
    // Find the variant if color and size are selected
    let basePrice = product.price;

    if (selectedColor && selectedSize && product.colors) {
        const colorData = product.colors.find(c => c.name === selectedColor);
        if (colorData) {
            const variant = colorData.variants.find(v => v.size === selectedSize);
            if (variant && variant.price) {
                basePrice = Number(variant.price);
            }
        }
    }

    // Apply discount to get effective price
    const effectivePrice = applyDiscount(basePrice, product.discount);

    return {
        effectivePrice,
        originalPrice: basePrice
    };
}

/**
 * Format price with currency
 */
export function formatPrice(price: number, currency: string = 'BDT'): string {
    return `${currency} ${price.toLocaleString()}`;
}
