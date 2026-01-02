import { AboutPageContent, ContactInfo } from './types';
import { dictionaries, Locale } from '@/constants/locales';

export const getContactInfo = async (locale: Locale = 'en'): Promise<ContactInfo> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Get data based on locale, fallback to English if somehow invalid
    const data = dictionaries[locale]?.company || dictionaries['en'].company;

    return {
        phone: data.contact.phone,
        email: data.contact.email,
        address: data.contact.address,
    };
};

export const getAboutPageContent = async (locale: Locale = 'en'): Promise<AboutPageContent> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const data = dictionaries[locale]?.company || dictionaries['en'].company;

    return {
        title: data.about.title,
        story: data.about.story,
        mission: data.about.mission,
        imageUrl: '/images/hero-banner.png'
    };
};
