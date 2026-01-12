const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Banner {
    id: string;
    title: string;
    titleBn?: string;
    subtitle?: string;
    subtitleBn?: string;
    description?: string;
    buttonText?: string;
    buttonTextBn?: string;
    imageUrl: string;
    linkType?: 'EXTERNAL' | 'PRODUCT' | 'CATEGORY';
    linkId?: string;
    link?: string;
    isActive: boolean;
    sortOrder: number;
    startDate?: string;
    endDate?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateBannerDto {
    title: string;
    titleBn?: string;
    subtitle?: string;
    subtitleBn?: string;
    description?: string;
    buttonText?: string;
    buttonTextBn?: string;
    imageUrl: string;
    linkType?: 'EXTERNAL' | 'PRODUCT' | 'CATEGORY';
    linkId?: string;
    link?: string;
    isActive?: boolean;
    sortOrder?: number;
    startDate?: string;
    endDate?: string;
}

export interface UpdateBannerDto extends Partial<CreateBannerDto> { }

export const bannersService = {
    async getAll(): Promise<Banner[]> {
        const response = await fetch(`${API_URL}/banners/admin`, { // Updated to match BannersController
            credentials: 'include',
        });

        if (!response.ok) throw new Error('Failed to fetch banners');
        const data = await response.json();
        return data.data || data;
    },

    async create(data: CreateBannerDto): Promise<Banner> {
        const response = await fetch(`${API_URL}/banners/admin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create banner');
        }
        const resData = await response.json();
        return resData.data || resData;
    },

    async update(id: string, data: UpdateBannerDto): Promise<Banner> {
        const response = await fetch(`${API_URL}/banners/admin/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update banner');
        }
        const resData = await response.json();
        return resData.data || resData;
    },

    async delete(id: string): Promise<void> {
        const response = await fetch(`${API_URL}/banners/admin/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete banner');
        }
    }
};
