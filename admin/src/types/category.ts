export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    icon?: string; // Emoji
    image?: string; // URL
    isActive: boolean;
    sortOrder: number;
    productCount?: number; // Backend aggregation
}
