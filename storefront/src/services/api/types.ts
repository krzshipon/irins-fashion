export interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  currency: string;
  category: string;
  image: string;
  isNew?: boolean;
  description?: string;
  images?: string[];
  sizes?: string[];
  colors?: string[];
  colorImages?: Record<string, string>;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
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
