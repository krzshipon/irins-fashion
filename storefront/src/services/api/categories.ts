import { Category } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const getCategories = async (): Promise<Category[]> => {
    try {
        const res = await fetch(`${API_URL}/categories`, { next: { revalidate: 86400, tags: ['categories'] } });
        if (!res.ok) throw new Error('Failed to fetch categories');
        const payload = await res.json();
        // Robust check for data: payload.data (standard) or payload (direct array)
        if (Array.isArray(payload)) return payload;
        return payload.data || [];
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};
