import { Banner } from './types';

// These banners can be managed via admin API in the future
// Current structure supports: id, title, subtitle, image, link, category
// Supports localization with titleBn and subtitleBn for Bengali
export const MOCK_BANNERS: Banner[] = [
    {
        id: 'hero-hijab',
        title: 'Premium Hijab Collection',
        titleBn: 'প্রিমিয়াম হিজাব কালেকশন',
        subtitle: 'Elegant styles for every occasion - silk, chiffon & jersey',
        subtitleBn: 'প্রতিটি উপলক্ষের জন্য মার্জিত স্টাইল - সিল্ক, শিফন ও জার্সি',
        image: '/images/hero-banner.png',
        link: '/collection/hijabs',
        category: 'Hijab',
    },
    {
        id: 'hero-abaya',
        title: 'Timeless Abaya Designs',
        titleBn: 'কালজয়ী আবায়া ডিজাইন',
        subtitle: 'From classic black to contemporary embroidered pieces',
        subtitleBn: 'ক্লাসিক কালো থেকে আধুনিক এমব্রয়ডারি পিস',
        image: '/images/hero-banner-urban.png',
        link: '/collection/abayas',
        category: 'Abaya',
    },
    {
        id: 'hero-accessories',
        title: 'Complete Your Look',
        titleBn: 'আপনার লুক সম্পূর্ণ করুন',
        subtitle: 'Handbags, jewelry & accessories to match your style',
        subtitleBn: 'হ্যান্ডব্যাগ, জুয়েলারি ও এক্সেসরিজ আপনার স্টাইলের সাথে',
        image: '/images/hero-banner-cozy.png',
        link: '/collection/accessories',
        category: 'Accessories',
    },
];

// API endpoint to fetch hero banners
// In production, this would call the backend API
// Admin app can manage these through: POST/PUT/DELETE /api/banners
export const getHeroBanners = async (): Promise<Banner[]> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));

    // TODO: Replace with actual API call
    // const response = await fetch('/api/banners');
    // return response.json();

    return MOCK_BANNERS;
};

export const getHeroBanner = async (): Promise<Banner> => {
    return (await getHeroBanners())[0];
};
