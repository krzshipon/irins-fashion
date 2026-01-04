import { apiClient } from '@/lib/api-client';
import { Category } from '../types/category';

export const categoriesService = {
    getAll: () => apiClient.get<Category[]>('/categories/admin'),
    create: (data: Partial<Category>) => apiClient.post<Category>('/categories', data),
    update: (id: string, data: Partial<Category>) => apiClient.put<Category>(`/categories/${id}`, data),
    toggleStatus: (id: string) => apiClient.patch<Category>(`/categories/${id}/status`, {}), // PATCH request doesn't need body for status toggle if handled by URL
    delete: (id: string) => apiClient.delete<void>(`/categories/${id}`),
};
