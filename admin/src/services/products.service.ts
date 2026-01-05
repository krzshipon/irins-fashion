import { apiClient } from '@/lib/api-client';

// We can define strict types or use 'any' for now since the form is complex
// Ideally we should import shared DTOs or define interfaces
export interface ProductPayload {
    name: string;
    slug: string;
    description: string;
    localizedNames?: Record<string, string>;
    localizedDescriptions?: Record<string, string>;
    price: number;
    originalPrice?: number;
    sku: string;
    status: string;
    images?: { url: string; isPrimary: boolean }[];
    variants?: any[]; // Full structure
    discount?: { type: string; value: number };
    badges?: string[];
    sizeChart?: string;
    categoryName: string; // ID of the category
}

export const productsService = {
    getAll: (params?: any) => apiClient.get<any>('/products', { params }),
    getOne: (id: string) => apiClient.get<any>(`/products/${id}`),
    create: (data: ProductPayload) => apiClient.post<any>('/products', data),
    update: (id: string, data: Partial<ProductPayload>) => apiClient.patch<any>(`/products/${id}`, data),
    delete: (id: string) => apiClient.delete<void>(`/products/${id}`),
};
