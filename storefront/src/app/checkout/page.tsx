import { Suspense } from 'react';
import { getShippingRates } from '@/services/api/checkout';
import { getDivisions } from '@/services/api/divisions';
import CheckoutClient from '@/components/checkout/CheckoutClient';

export default async function CheckoutPage() {
    // Fetch configuration data on server
    const [shippingRates, divisions] = await Promise.all([
        getShippingRates(),
        getDivisions()
    ]);

    return (
        <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Loading Checkout...</div>}>
            <CheckoutClient
                initialShippingRates={shippingRates}
                initialDivisions={divisions}
            />
        </Suspense>
    );
}
