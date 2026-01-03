export interface Category {
    id: string;
    nameIdentifier: string; // Key for localization
    image: string;
    link: string;
}

export const MOCK_CATEGORIES: Category[] = [
    {
        id: 'cat-1',
        nameIdentifier: 'categories.hijab', // Need to add to en.json/bn.json
        image: '/images/cat-hijab.png',
        link: '/collection/hijabs',
    },
    {
        id: 'cat-2',
        nameIdentifier: 'categories.abaya',
        image: '/images/cat-abaya.png',
        link: '/collection/abayas',
    },
    {
        id: 'cat-3',
        nameIdentifier: 'categories.borkha',
        image: '/images/cat-borkha-v3.png',
        link: '/collection/borkhas',
    },
    {
        id: 'cat-gown',
        nameIdentifier: 'categories.gown',
        image: '/images/cat-gown-v3.png',
        link: '/collection/gowns',
    },
    {
        id: 'cat-4',
        nameIdentifier: 'categories.accessories',
        image: '/images/cat-accessories.png', // Will generate soon
        link: '/collection/accessories',
    },
];

export const getCategories = async (): Promise<Category[]> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_CATEGORIES;
};
