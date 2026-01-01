import { Banner } from './types';

export const MOCK_BANNERS: Banner[] = [
    {
        id: 'hero-1',
        title: 'Elegance in Every Details',
        subtitle: 'Discover our new Summer Collection',
        image: '/images/hero-banner.png',
        link: '/collection/summer',
    },
];

export const getHeroBanner = async (): Promise<Banner> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_BANNERS[0];
};
