"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Locale = 'en' | 'bn';

interface Dictionary {
    nav: {
        home: string;
        shop: string;
        about: string;
        contact: string;
        cart: string;
    };
    hero: {
        cta: string;
    };
    section: {
        categories: string;
    };
    categories: {
        hijab: string;
        abaya: string;
        dress: string;
        accessories: string;
    };
    products: {
        newArrival: string;
        addToCart: string;
    };
    common: {
        seeMore: string;
    };
}

const dictionaries: Record<Locale, Dictionary> = {
    en: {
        nav: {
            home: 'Home',
            shop: 'Shop',
            about: 'About',
            contact: 'Contact',
            cart: 'Cart',
        },
        hero: {
            cta: 'Shop Now',
        },
        section: {
            categories: 'Shop by Category',
        },
        categories: {
            hijab: 'Hijabs',
            abaya: 'Abayas',
            dress: 'Dresses',
            accessories: 'Accessories',
        },
        products: {
            newArrival: 'New Arrival',
            addToCart: 'Add to Cart',
        },
        common: {
            seeMore: 'See More',
        },
    },
    bn: {
        nav: {
            home: 'হোম',
            shop: 'দোকান',
            about: 'আমাদের সম্পর্কে',
            contact: 'যোগাযোগ',
            cart: 'কার্ট',
        },
        hero: {
            cta: 'এখন কিনুন',
        },
        section: {
            categories: 'বিভাগ অনুযায়ী কেনাকাটা',
        },
        categories: {
            hijab: 'হিজাব',
            abaya: 'আবায়া',
            dress: 'জুব্বা',
            accessories: 'অন্যান্য',
        },
        products: {
            newArrival: 'নতুন আগমন',
            addToCart: 'কার্টে যোগ করুন',
        },
        common: {
            seeMore: 'আরও দেখুন',
        },
    },
};

interface LocalizationContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (key: string) => string;
    dictionary: Dictionary;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider = ({ children }: { children: ReactNode }) => {
    const [locale, setLocale] = useState<Locale>('en');

    const dictionary = dictionaries[locale];

    // Helper to access nested keys like "nav.home"
    const t = (path: string): string => {
        const keys = path.split('.');
        let current: any = dictionary;
        for (const key of keys) {
            if (current[key] === undefined) return path;
            current = current[key];
        }
        return current as string;
    };

    return (
        <LocalizationContext.Provider value={{ locale, setLocale, t, dictionary }}>
            {children}
        </LocalizationContext.Provider>
    );
};

export const useLocalization = () => {
    const context = useContext(LocalizationContext);
    if (context === undefined) {
        throw new Error('useLocalization must be used within a LocalizationProvider');
    }
    return context;
};
