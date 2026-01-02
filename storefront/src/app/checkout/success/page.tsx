"use client";

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLocalization } from '@/context/LocalizationContext';
import { CheckCircle } from 'lucide-react';

const SuccessContent = () => {
    const searchParams = useSearchParams();
    const orderId = searchParams?.get('orderId');
    const { dictionary: t } = useLocalization();

    return (
        <div className="bg-white min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <div className="mb-8 animate-fade-in-up">
                <CheckCircle className="w-20 h-20 text-black mx-auto stroke-1" />
            </div>

            <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6 tracking-tight">
                {t.checkout.success.title}
            </h1>

            <p className="text-gray-500 mb-12 text-lg font-light max-w-md mx-auto leading-relaxed">
                {t.checkout.success.message}
            </p>

            {orderId && (
                <div className="border-y border-gray-100 py-8 w-full max-w-sm mb-12">
                    <span className="text-gray-400 text-xs uppercase tracking-[0.2em] block mb-2">
                        {t.checkout.success.orderId}
                    </span>
                    <span className="text-2xl font-serif text-gray-900">
                        #{orderId}
                    </span>
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
                <Link
                    href="/"
                    className="flex-1 px-8 py-4 bg-black text-white text-sm uppercase tracking-widest hover:bg-gray-900 transition-all duration-300"
                >
                    {t.checkout.success.backToHome}
                </Link>
                <Link
                    href="/collection/all"
                    className="flex-1 px-8 py-4 border border-gray-200 text-gray-900 text-sm uppercase tracking-widest hover:border-black transition-all duration-300"
                >
                    {t.checkout.success.continueShopping}
                </Link>
            </div>
        </div>
    );
};

const SuccessPage = () => {
    return (
        <div className="min-h-screen bg-white pt-20 pb-12">
            <Suspense fallback={<div>Loading...</div>}>
                <SuccessContent />
            </Suspense>
        </div>
    );
};

export default SuccessPage;
