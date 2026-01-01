export interface Product {
  id: string;
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
