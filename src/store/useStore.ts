import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, CartItem, Order, OrderFormData, Category, Brand, SavedOrder, SavedCustomer } from '../types';
import { supabase, dbToProduct, productToDb, dbToCategory, categoryToDb, dbToBrand, brandToDb } from '../lib/supabase';
import { sendTelegramNotification } from '../utils/telegram';

// LocalStorage keys
const SAVED_ORDERS_KEY = 'tommy-saved-orders';
const SAVED_CUSTOMER_KEY = 'tommy-saved-customer';

// Helper functions for localStorage
function getSavedOrders(): SavedOrder[] {
  try {
    const data = localStorage.getItem(SAVED_ORDERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveSavedOrders(orders: SavedOrder[]): void {
  localStorage.setItem(SAVED_ORDERS_KEY, JSON.stringify(orders));
}

function getSavedCustomer(): SavedCustomer | null {
  try {
    const data = localStorage.getItem(SAVED_CUSTOMER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function saveSavedCustomer(customer: SavedCustomer): void {
  localStorage.setItem(SAVED_CUSTOMER_KEY, JSON.stringify(customer));
}

interface StoreState {
  // Categories
  categories: Category[];
  categoriesLoading: boolean;
  fetchCategories: () => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: number, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;

  // Brands
  brands: Brand[];
  brandsLoading: boolean;
  fetchBrands: () => Promise<void>;
  addBrand: (brand: Omit<Brand, 'id'>) => Promise<void>;
  updateBrand: (id: number, brand: Partial<Brand>) => Promise<void>;
  deleteBrand: (id: number) => Promise<void>;

  // Products
  products: Product[];
  productsLoading: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: number, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  
  // Favorites
  favorites: number[];
  toggleFavorite: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
  getFavoritesCount: () => number;
  getFavoriteProducts: () => Product[];
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  
  // Orders
  orders: Order[];
  ordersLoading: boolean;
  fetchOrders: () => Promise<void>;
  addOrder: (formData: OrderFormData) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  
  // Saved orders (localStorage)
  savedOrders: SavedOrder[];
  savedCustomer: SavedCustomer | null;
  loadSavedData: () => void;
  restoreCartFromSavedOrder: (orderId: string) => void;
  deleteSavedOrder: (orderId: string) => void;
  
  // UI State
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  isOrderFormOpen: boolean;
  setOrderFormOpen: (open: boolean) => void;
  
  // Admin
  isAdminAuthenticated: boolean;
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;
}

const ADMIN_PASSWORD = 'tommy2025';

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Categories
      categories: [],
      categoriesLoading: false,

      fetchCategories: async () => {
        set({ categoriesLoading: true });
        try {
          const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('sort_order', { ascending: true });

          if (error) throw error;

          const categories = (data || []).map(dbToCategory);
          set({ categories, categoriesLoading: false });
        } catch (error) {
          console.error('Error fetching categories:', error);
          set({ categoriesLoading: false });
        }
      },

      addCategory: async (category) => {
        try {
          const dbCategory = categoryToDb(category);
          const { data, error } = await supabase
            .from('categories')
            .insert(dbCategory)
            .select()
            .single();

          if (error) throw error;

          const newCategory = dbToCategory(data);
          set((state) => ({ categories: [...state.categories, newCategory] }));
        } catch (error) {
          console.error('Error adding category:', error);
          throw error;
        }
      },

      updateCategory: async (id, updatedCategory) => {
        try {
          const dbCategory = categoryToDb(updatedCategory);
          const cleanDbCategory = Object.fromEntries(
            Object.entries(dbCategory).filter(([_, v]) => v !== undefined)
          );

          const { error } = await supabase
            .from('categories')
            .update(cleanDbCategory)
            .eq('id', id);

          if (error) throw error;

          set((state) => ({
            categories: state.categories.map((c) =>
              c.id === id ? { ...c, ...updatedCategory } : c
            ),
          }));
        } catch (error) {
          console.error('Error updating category:', error);
          throw error;
        }
      },

      deleteCategory: async (id) => {
        try {
          const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

          if (error) throw error;

          set((state) => ({
            categories: state.categories.filter((c) => c.id !== id),
          }));
        } catch (error) {
          console.error('Error deleting category:', error);
          throw error;
        }
      },

      // Brands
      brands: [],
      brandsLoading: false,

      fetchBrands: async () => {
        set({ brandsLoading: true });
        try {
          const { data, error } = await supabase
            .from('brands')
            .select('*')
            .order('sort_order', { ascending: true });

          if (error) throw error;

          const brands = (data || []).map(dbToBrand);
          set({ brands, brandsLoading: false });
        } catch (error) {
          console.error('Error fetching brands:', error);
          set({ brandsLoading: false });
        }
      },

      addBrand: async (brand) => {
        try {
          const dbBrand = brandToDb(brand);
          const { data, error } = await supabase
            .from('brands')
            .insert(dbBrand)
            .select()
            .single();

          if (error) throw error;

          const newBrand = dbToBrand(data);
          set((state) => ({ brands: [...state.brands, newBrand] }));
        } catch (error) {
          console.error('Error adding brand:', error);
          throw error;
        }
      },

      updateBrand: async (id, updatedBrand) => {
        try {
          const dbBrand = brandToDb(updatedBrand);
          const cleanDbBrand = Object.fromEntries(
            Object.entries(dbBrand).filter(([_, v]) => v !== undefined)
          );

          const { error } = await supabase
            .from('brands')
            .update(cleanDbBrand)
            .eq('id', id);

          if (error) throw error;

          set((state) => ({
            brands: state.brands.map((b) =>
              b.id === id ? { ...b, ...updatedBrand } : b
            ),
          }));
        } catch (error) {
          console.error('Error updating brand:', error);
          throw error;
        }
      },

      deleteBrand: async (id) => {
        try {
          const { error } = await supabase
            .from('brands')
            .delete()
            .eq('id', id);

          if (error) throw error;

          set((state) => ({
            brands: state.brands.filter((b) => b.id !== id),
          }));
        } catch (error) {
          console.error('Error deleting brand:', error);
          throw error;
        }
      },

      // Products
      products: [],
      productsLoading: false,
      
      fetchProducts: async () => {
        set({ productsLoading: true });
        try {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          
          const products = (data || []).map(dbToProduct);
          set({ products, productsLoading: false });
        } catch (error) {
          console.error('Error fetching products:', error);
          set({ productsLoading: false });
        }
      },
      
      addProduct: async (product) => {
        try {
          const dbProduct = productToDb(product);
          const { data, error } = await supabase
            .from('products')
            .insert(dbProduct)
            .select()
            .single();
          
          if (error) throw error;
          
          const newProduct = dbToProduct(data);
          set((state) => ({ products: [newProduct, ...state.products] }));
        } catch (error) {
          console.error('Error adding product:', error);
          throw error;
        }
      },
      
      updateProduct: async (id, updatedProduct) => {
        try {
          const dbProduct = productToDb(updatedProduct);
          // Remove undefined values
          const cleanDbProduct = Object.fromEntries(
            Object.entries(dbProduct).filter(([_, v]) => v !== undefined)
          );
          
          const { error } = await supabase
            .from('products')
            .update(cleanDbProduct)
            .eq('id', id);
          
          if (error) throw error;
          
          set((state) => ({
            products: state.products.map((p) =>
              p.id === id ? { ...p, ...updatedProduct } : p
            ),
          }));
        } catch (error) {
          console.error('Error updating product:', error);
          throw error;
        }
      },
      
      deleteProduct: async (id) => {
        try {
          // Delete the product
          // If CASCADE is configured in DB, order_items will be deleted automatically
          const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);
          
          if (error) {
            // If FK constraint error, provide helpful message
            if (error.code === '23503') {
              throw new Error('Не удалось удалить товар: он используется в заказах. Выполните SQL миграцию supabase_cascade_delete_migration.sql в Supabase SQL Editor для настройки каскадного удаления.');
            }
            throw error;
          }
          
          set((state) => ({
            products: state.products.filter((p) => p.id !== id),
          }));
        } catch (error) {
          console.error('Error deleting product:', error);
          throw error;
        }
      },
      
      // Favorites
      favorites: [],
      toggleFavorite: (productId) => set((state) => ({
        favorites: state.favorites.includes(productId)
          ? state.favorites.filter((id) => id !== productId)
          : [...state.favorites, productId]
      })),
      isFavorite: (productId) => {
        const { favorites } = get();
        return favorites.includes(productId);
      },
      getFavoritesCount: () => {
        const { favorites } = get();
        return favorites.length;
      },
      getFavoriteProducts: () => {
        const { favorites, products } = get();
        return products.filter((p) => favorites.includes(p.id));
      },
      
      // Cart
      cart: [],
      addToCart: (product, quantity = 1) => set((state) => {
        const existingItem = state.cart.find((item) => item.product.id === product.id);
        if (existingItem) {
          return {
            cart: state.cart.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          };
        }
        return { cart: [...state.cart, { product, quantity }] };
      }),
      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter((item) => item.product.id !== productId)
      })),
      updateQuantity: (productId, quantity) => set((state) => ({
        cart: quantity <= 0
          ? state.cart.filter((item) => item.product.id !== productId)
          : state.cart.map((item) =>
              item.product.id === productId ? { ...item, quantity } : item
            )
      })),
      clearCart: () => set({ cart: [] }),
      getCartTotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
      },
      getCartCount: () => {
        const { cart } = get();
        return cart.reduce((count, item) => count + item.quantity, 0);
      },
      
      // Orders
      orders: [],
      ordersLoading: false,
      
      fetchOrders: async () => {
        set({ ordersLoading: true });
        try {
          const { data: ordersData, error: ordersError } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (ordersError) throw ordersError;
          
          const { data: itemsData, error: itemsError } = await supabase
            .from('order_items')
            .select('*');
          
          if (itemsError) throw itemsError;

          // Fetch products to get images
          const { data: productsData } = await supabase
            .from('products')
            .select('id, image, brand, category');
          
          const productsMap = new Map(
            (productsData || []).map((p) => [p.id, p])
          );
          
          const orders: Order[] = (ordersData || []).map((order) => ({
            id: order.id,
            items: (itemsData || [])
              .filter((item) => item.order_id === order.id)
              .map((item) => {
                const productData = productsMap.get(item.product_id);
                return {
                  product: {
                    id: item.product_id,
                    name: item.product_name,
                    price: item.product_price,
                    category: productData?.category || '',
                    brand: productData?.brand || '',
                    image: productData?.image || '',
                    inStock: true,
                    description: '',
                  },
                  quantity: item.quantity,
                };
              }),
            total: order.total,
            customer: {
              name: order.customer_name,
              phone: order.customer_phone,
              comment: order.customer_comment || '',
              reserveFor24h: order.reserve_for_24h,
            },
            createdAt: order.created_at,
            status: order.status,
          }));
          
          set({ orders, ordersLoading: false });
        } catch (error) {
          console.error('Error fetching orders:', error);
          set({ ordersLoading: false });
        }
      },
      
      addOrder: async (formData) => {
        const { cart, getCartTotal } = get();
        const orderId = `ORD-${Date.now()}`;
        const total = getCartTotal();
        
        try {
          // Insert order
          const { error: orderError } = await supabase
            .from('orders')
            .insert({
              id: orderId,
              customer_name: formData.name,
              customer_phone: formData.phone,
              customer_comment: formData.comment || null,
              reserve_for_24h: formData.reserveFor24h,
              total,
              status: 'pending',
            });
          
          if (orderError) throw orderError;
          
          // Insert order items
          const orderItems = cart.map((item) => ({
            order_id: orderId,
            product_id: item.product.id,
            product_name: item.product.name,
            product_price: item.product.price,
            quantity: item.quantity,
          }));
          
          const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);
          
          if (itemsError) throw itemsError;
          
          const order: Order = {
            id: orderId,
            items: [...cart],
            total,
            customer: formData,
            createdAt: new Date().toISOString(),
            status: 'pending',
          };
          
          set((state) => ({ orders: [order, ...state.orders] }));
          
          // Save to localStorage
          const savedOrder: SavedOrder = {
            id: orderId,
            items: [...cart],
            total,
            customer: { name: formData.name, phone: formData.phone },
            createdAt: new Date().toISOString(),
          };
          const existingOrders = getSavedOrders();
          saveSavedOrders([savedOrder, ...existingOrders]);
          
          // Save customer data
          saveSavedCustomer({ name: formData.name, phone: formData.phone });
          
          // Update state and clear cart
          set((state) => ({
            savedOrders: [savedOrder, ...state.savedOrders],
            savedCustomer: { name: formData.name, phone: formData.phone },
            cart: [],
          }));

          console.log('New order created:', order);

          // Send Telegram notification (non-blocking)
          sendTelegramNotification(order).catch((error) => {
            console.error('Failed to send Telegram notification:', error);
          });

          return order;
        } catch (error) {
          console.error('Error creating order:', error);
          return null;
        }
      },
      
      updateOrderStatus: async (orderId, status) => {
        try {
          const { error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', orderId);
          
          if (error) throw error;
          
          set((state) => ({
            orders: state.orders.map((order) =>
              order.id === orderId ? { ...order, status } : order
            ),
          }));
        } catch (error) {
          console.error('Error updating order status:', error);
          throw error;
        }
      },
      
      // Saved orders (localStorage)
      savedOrders: [],
      savedCustomer: null,
      
      loadSavedData: () => {
        const savedOrders = getSavedOrders();
        const savedCustomer = getSavedCustomer();
        set({ savedOrders, savedCustomer });
      },
      
      restoreCartFromSavedOrder: (orderId) => {
        const { savedOrders } = get();
        const order = savedOrders.find((o) => o.id === orderId);
        if (order) {
          set({ cart: [...order.items] });
        }
      },
      
      deleteSavedOrder: (orderId) => {
        const existingOrders = getSavedOrders();
        const filtered = existingOrders.filter((o) => o.id !== orderId);
        saveSavedOrders(filtered);
        set({ savedOrders: filtered });
      },
      
      // UI State
      isCartOpen: false,
      setCartOpen: (open) => set({ isCartOpen: open }),
      isOrderFormOpen: false,
      setOrderFormOpen: (open) => set({ isOrderFormOpen: open }),
      
      // Admin
      isAdminAuthenticated: false,
      adminLogin: (password) => {
        if (password === ADMIN_PASSWORD) {
          set({ isAdminAuthenticated: true });
          return true;
        }
        return false;
      },
      adminLogout: () => set({ isAdminAuthenticated: false }),
    }),
    {
      name: 'tommy-beauty-store',
      partialize: (state) => ({
        cart: state.cart,
        favorites: state.favorites,
        isAdminAuthenticated: state.isAdminAuthenticated,
      }),
    }
  )
);
