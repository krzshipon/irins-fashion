"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Locale, Dictionary, dictionaries } from '@/constants/locales';

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
