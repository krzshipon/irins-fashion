import { AboutPageContent, ContactInfo } from './types';
import { dictionaries } from '@/constants/locales';

// Use English dictionary as the source of truth for the API simulation
const fallbackData = dictionaries['en'].company;

export const getContactInfo = async (): Promise<ContactInfo> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // In a real scenario, this would try to fetch from API, and catch error to return fallback
    return {
        phone: fallbackData.contact.phone,
        email: fallbackData.contact.email,
        address: fallbackData.contact.address,
    };
};

export const getAboutPageContent = async (): Promise<AboutPageContent> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    return {
        title: fallbackData.about.title,
        story: fallbackData.about.story,
        mission: fallbackData.about.mission,
        imageUrl: '/images/hero-banner.png'
    };
};
