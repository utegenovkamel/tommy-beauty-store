import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface DbProduct {
  id: number;
  name: string;
  category: string;
  brand: string;
  price: number;
  old_price: number | null;
  image: string | null;
  images: string[] | null;
  badge: 'hit' | 'new' | 'sale' | null;
  in_stock: boolean;
  stock_quantity: number | null;
  description: string | null;
  full_description: string | null;
  ingredients: string | null;
  how_to_use: string | null;
  rating: number | null;
  review_count: number | null;
  created_at: string;
}

export interface DbOrder {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_comment: string | null;
  reserve_for_24h: boolean;
  total: number;
  status: 'pending' | 'contacted' | 'completed' | 'cancelled';
  created_at: string;
}

export interface DbOrderItem {
  id: number;
  order_id: string;
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
}

export interface DbCategory {
  id: number;
  slug: string;
  name: string;
  sort_order: number;
  created_at: string;
}

export interface DbBrand {
  id: number;
  slug: string;
  name: string;
  logo: string | null;
  sort_order: number;
  created_at: string;
}

// Convert DB category to app Category
export function dbToCategory(db: DbCategory) {
  return {
    id: db.id,
    slug: db.slug,
    name: db.name,
    sortOrder: db.sort_order,
  };
}

// Convert app Category to DB format
export function categoryToDb(category: Partial<{
  slug: string;
  name: string;
  sortOrder: number;
}>) {
  return {
    slug: category.slug,
    name: category.name,
    sort_order: category.sortOrder,
  };
}

// Convert DB brand to app Brand
export function dbToBrand(db: DbBrand) {
  return {
    id: db.id,
    slug: db.slug,
    name: db.name,
    logo: db.logo ?? undefined,
    sortOrder: db.sort_order,
  };
}

// Convert app Brand to DB format
export function brandToDb(brand: Partial<{
  slug: string;
  name: string;
  logo?: string;
  sortOrder: number;
}>) {
  return {
    slug: brand.slug,
    name: brand.name,
    logo: brand.logo ?? null,
    sort_order: brand.sortOrder,
  };
}

// Convert DB product to app Product
export function dbToProduct(db: DbProduct) {
  return {
    id: db.id,
    name: db.name,
    category: db.category,
    brand: db.brand,
    price: db.price,
    oldPrice: db.old_price ?? undefined,
    image: db.image ?? '',
    images: db.images ?? [],
    badge: db.badge ?? undefined,
    inStock: db.in_stock,
    stockQuantity: db.stock_quantity ?? undefined,
    description: db.description ?? '',
    fullDescription: db.full_description ?? undefined,
    ingredients: db.ingredients ?? undefined,
    howToUse: db.how_to_use ?? undefined,
    rating: db.rating ?? undefined,
    reviewCount: db.review_count ?? undefined,
  };
}

// Convert app Product to DB format
export function productToDb(product: Partial<{
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
}>) {
  return {
    name: product.name,
    category: product.category,
    brand: product.brand,
    price: product.price,
    old_price: product.oldPrice ?? null,
    image: product.image,
    images: product.images ?? [],
    badge: product.badge ?? null,
    in_stock: product.inStock,
    stock_quantity: product.stockQuantity ?? null,
    description: product.description,
    full_description: product.fullDescription ?? null,
    ingredients: product.ingredients ?? null,
    how_to_use: product.howToUse ?? null,
    rating: product.rating ?? null,
    review_count: product.reviewCount ?? null,
  };
}

