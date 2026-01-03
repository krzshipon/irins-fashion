export interface ProductBadge {
  type: 'new' | 'discount' | 'bestseller' | 'custom';
  text: string;
  color?: string;
  textColor?: string;
}

export interface ProductDiscount {
  type: 'flat' | 'percentage';
  value: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  originalPrice?: number; // MSRP or previous price
  discount?: ProductDiscount;
  currency: string;
  category: string;
  image: string;
  images: string[];
  isNew?: boolean; // Kept for backward compatibility/logic
  badges?: ProductBadge[]; // New flexible badge system
  description?: string;
  sizes?: string[];
  colors?: string[];
  colorImages?: Record<string, string>;
}

export interface Banner {
  id: string;
  title: string;
  titleBn?: string;
  subtitle: string;
  subtitleBn?: string;
  image: string;
  link: string;
  category?: string; // For associating with product categories
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
}

export interface AboutPageContent {
  title: string;
  story: string;
  mission: string;
  imageUrl?: string;
}
