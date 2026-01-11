export interface ProductBadge {
  id: string;
  productId: string;
  type: string;
  text: string;
  color?: string;
  textColor?: string;
}

export interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
  productId?: string;
  productColorId?: string;
}

export interface ProductVariant {
  id: string;
  productColorId: string;
  size: string;
  sku: string;
  stock: number;
  price?: number; // string in Prisma Decimal, but usually handled as number/string in frontend. Let's stick to number for now or string if needed.
}

export interface ProductColor {
  id: string;
  productId: string;
  name: string;
  code: string;
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  localizedNames?: any;       // Json
  localizedDescriptions?: any; // Json
  isActive: boolean;
  sortOrder: number;
}

export interface ProductDiscount {
  type: 'flat' | 'percentage';
  value: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description?: string;
  localizedNames?: any;
  localizedDescriptions?: any;
  price: number; // Decimal handling
  originalPrice?: number;
  discount?: ProductDiscount; // Json
  currency: string;
  categoryId: string;
  status: string;
  sizeChart?: string;
  isNew?: boolean;
  createdAt: string;
  updatedAt: string;
  category: Category;
  badges: ProductBadge[];
  colors: ProductColor[];
  images: ProductImage[];
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

// User & Identity
export type UserRole = 'CUSTOMER' | 'ADMIN';

export interface User {
  id: string;
  mobile: string;
  email?: string;
  name?: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Address {
  id: string;
  label: string; // "Home", "Work", etc.
  recipientName: string;
  address: string; // Full address string
  division: string;
  phone: string;
  isDefault: boolean;
}

// Orders
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  variant?: {
    size?: string;
    color?: string;
  };
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId?: string | null;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  discount?: number;
  shippingAddress: Address;
  createdAt: string; // ISO Date
}

// Tracking
export interface TrackingEvent {
  id: string;
  status: OrderStatus;
  title: string;
  description: string;
  location?: string;
  timestamp: string; // ISO Date
  isCompleted: boolean;
}
