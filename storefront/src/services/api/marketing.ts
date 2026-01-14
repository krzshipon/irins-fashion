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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// API endpoint to fetch hero banners
// In production, this would call the backend API
// Admin app can manage these through: POST/PUT/DELETE /api/banners
export const getHeroBanners = async (): Promise<Banner[]> => {
    try {
        const res = await fetch(`${API_URL}/banners`, { next: { revalidate: 3600, tags: ['banners'] } });
        if (!res.ok) {
            console.warn('Failed to fetch banners from API, using fallback');
            return MOCK_BANNERS;
        }

        const response = await res.json();
        // Handle wrapped response { data: [...] } or direct array
        const bannersData = Array.isArray(response) ? response : (response.data || []);

        if (Array.isArray(bannersData) && bannersData.length > 0) {
            return bannersData.map((b: any) => ({
                id: b.id,
                title: b.title,
                titleBn: b.titleBn,
                subtitle: b.subtitle || "",
                subtitleBn: b.subtitleBn,
                image: b.imageUrl, // Map imageUrl -> image
                link: b.link || "/",
                buttonText: b.buttonText,
                buttonTextBn: b.buttonTextBn,
                description: b.description,
            }));
        }

        // If API returns empty array, use fallback
        return MOCK_BANNERS;

    } catch (error) {
        console.error('Error fetching banners:', error);
        return MOCK_BANNERS;
    }
};

export const getHeroBanner = async (): Promise<Banner> => {
    return (await getHeroBanners())[0];
};
