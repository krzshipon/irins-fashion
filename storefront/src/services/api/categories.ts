import { Category } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const getCategories = async (): Promise<Category[]> => {
    try {
        const res = await fetch(`${API_URL}/categories`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch categories');
        const payload = await res.json();
        return payload.data || [];
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};
