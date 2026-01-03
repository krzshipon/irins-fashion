// Mock Coupon API Service

export interface Coupon {
    code: string;
    type: 'percentage' | 'fixed';
    value: number; // percentage (0-100) or fixed amount in BDT
    maxDiscount?: number; // optional max discount for percentage coupons
    minOrderAmount?: number; // minimum order amount to apply coupon
    description: {
        en: string;
        bn: string;
    };
}

export interface CouponValidationResult {
    valid: boolean;
    coupon?: Coupon;
    error?: string;
}

// Mock coupon database
const MOCK_COUPONS: Coupon[] = [
    {
        code: 'WELCOME10',
        type: 'percentage',
        value: 10,
        minOrderAmount: 500,
        description: {
            en: '10% off on your order',
            bn: 'আপনার অর্ডারে ১০% ছাড়'
        }
    },
    {
        code: 'FLAT200',
        type: 'fixed',
        value: 200,
        minOrderAmount: 1000,
        description: {
            en: '৳200 off on your order',
            bn: 'আপনার অর্ডারে ২০০ টাকা ছাড়'
        }
    },
    {
        code: 'NEWYEAR25',
        type: 'percentage',
        value: 25,
        maxDiscount: 1000,
        minOrderAmount: 2000,
        description: {
            en: '25% off (max ৳1000)',
            bn: '২৫% ছাড় (সর্বোচ্চ ১০০০ টাকা)'
        }
    },
    {
        code: 'FREESHIP',
        type: 'fixed',
        value: 120,
        minOrderAmount: 0,
        description: {
            en: 'Free shipping discount',
            bn: 'ফ্রি শিপিং ছাড়'
        }
    }
];

/**
 * Validate a coupon code
 * @param code - The coupon code to validate
 * @param orderAmount - The current order subtotal
 * @returns Promise with validation result
 */
export async function validateCoupon(code: string, orderAmount: number): Promise<CouponValidationResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const normalizedCode = code.toUpperCase().trim();
    const coupon = MOCK_COUPONS.find(c => c.code === normalizedCode);

    if (!coupon) {
        return {
            valid: false,
            error: 'Invalid coupon code'
        };
    }

    if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
        return {
            valid: false,
            error: `Minimum order amount is ৳${coupon.minOrderAmount}`
        };
    }

    return {
        valid: true,
        coupon
    };
}

/**
 * Calculate discount amount based on coupon and order amount
 * @param coupon - The applied coupon
 * @param orderAmount - The order subtotal
 * @returns The discount amount in BDT
 */
export function calculateDiscount(coupon: Coupon, orderAmount: number): number {
    if (coupon.type === 'fixed') {
        return Math.min(coupon.value, orderAmount);
    }

    // Percentage discount
    let discount = (orderAmount * coupon.value) / 100;

    // Apply max discount cap if exists
    if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
    }

    return Math.round(discount);
}
