import { Banner } from './types';

export const MOCK_BANNERS: Banner[] = [
    {
        id: 'hero-1',
        title: 'Elegance in Every Details',
        subtitle: 'Discover our new Summer Collection',
        image: '/images/hero-banner.png',
        link: '/collection/summer',
    },
    {
        id: 'hero-2',
        title: 'Urban Modesty',
        subtitle: 'Chic styles for the modern city life',
        image: '/images/hero-banner-urban.png',
        link: '/collection/urban',
    },
    {
        id: 'hero-3',
        title: 'Cozy at Home',
        subtitle: 'Premium lounge wear for your comfort',
        image: '/images/hero-banner-cozy.png',
        link: '/collection/lounge',
    },
];

export const getHeroBanners = async (): Promise<Banner[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_BANNERS;
};

export const getHeroBanner = async (): Promise<Banner> => {
    return (await getHeroBanners())[0];
};
