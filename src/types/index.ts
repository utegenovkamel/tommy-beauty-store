export interface Product {
  id: number;
  name: string;
  category: string;
  brand: string;
  price: number;
  oldPrice?: number;
  image: string;
  images?: string[];
  badge?: 'hit' | 'new' | 'sale';
  inStock: boolean;
  stockQuantity?: number;
  description: string;
  fullDescription?: string;
  ingredients?: string;
  howToUse?: string;
  rating?: number;
  reviewCount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderFormData {
  name: string;
  phone: string;
  comment: string;
  reserveFor24h?: boolean;
}

export interface SavedOrder {
  id: string;
  items: CartItem[];
  total: number;
  customer: { name: string; phone: string };
  createdAt: string;
}

export interface SavedCustomer {
  name: string;
  phone: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  customer: OrderFormData;
  createdAt: string;
  status: 'pending' | 'contacted' | 'completed' | 'cancelled';
}

export type SortOption = 'popular' | 'price-asc' | 'price-desc' | 'new';

export interface Category {
  id: number;
  slug: string;
  name: string;
  sortOrder: number;
}

export interface Brand {
  id: number;
  slug: string;
  name: string;
  logo?: string;
  sortOrder: number;
}

