import { AboutPageContent, ContactInfo } from './types';

export const MOCK_CONTACT_INFO: ContactInfo = {
    phone: '+8801648593538',
    email: 'info@irinsfashion.com',
    address: 'Dahaka, Bangladesh',
};

export const MOCK_ABOUT_CONTENT: AboutPageContent = {
    title: "About Irin's Fashion",
    story: "Founded with a passion for blending tradition with contemporary style, Irin's Fashion has grown from a small boutique to a beloved brand. We believe that modesty and elegance are not mutually exclusive but go hand-in-hand to create truly timeless looks.",
    mission: "Our mission is to empower women to feel confident and beautiful in attire that respects their values. We are committed to high-quality fabrics, intricate craftsmanship, and designs that celebrate the modern woman.",
    imageUrl: '/images/hero-banner.png' // Utilizing existing asset for now
};

export const getContactInfo = async (): Promise<ContactInfo> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_CONTACT_INFO;
};

export const getAboutPageContent = async (): Promise<AboutPageContent> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_ABOUT_CONTENT;
};
