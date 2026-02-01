import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Package,
  ShoppingCart,
  Eye,
  EyeOff,
  Loader2,
  Tag,
  Phone,
  MessageCircle,
  Award,
  Upload
} from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Product, Category, Brand } from '../types';
import { formatPrice, formatDate } from '../utils/format';
import toast from 'react-hot-toast';
import styles from './Admin.module.css';
import { uploadImage } from '../lib/supabase';

type Tab = 'products' | 'orders' | 'categories' | 'brands';

const emptyCategory: Omit<Category, 'id'> = {
  slug: '',
  name: '',
  sortOrder: 0,
};

const emptyBrand: Omit<Brand, 'id'> = {
  slug: '',
  name: '',
  logo: '',
  sortOrder: 0,
};

const emptyProduct: Omit<Product, 'id'> = {
  name: '',
  category: 'skincare',
  brand: '',
  price: 0,
  image: '',
  images: [],
  inStock: true,
  stockQuantity: undefined,
  description: '',
};

export function Admin() {
  const {
    isAdminAuthenticated,
    adminLogin,
    adminLogout,
    products,
    productsLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    ordersLoading,
    fetchOrders,
    updateOrderStatus,
    categories,
    categoriesLoading,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    brands,
    brandsLoading,
    fetchBrands,
    addBrand,
    updateBrand,
    deleteBrand,
  } = useStore();

  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('products');
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Omit<Product, 'id'>>(emptyProduct);
  const [isSaving, setIsSaving] = useState(false);

  // Category editing state
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [editingCategoryData, setEditingCategoryData] = useState<Category | null>(null);
  const [categoryFormData, setCategoryFormData] = useState<Omit<Category, 'id'>>(emptyCategory);
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  // Brand editing state
  const [isEditingBrand, setIsEditingBrand] = useState(false);
  const [editingBrandData, setEditingBrandData] = useState<Brand | null>(null);
  const [brandFormData, setBrandFormData] = useState<Omit<Brand, 'id'>>(emptyBrand);
  const [isSavingBrand, setIsSavingBrand] = useState(false);

  // Image upload states
  const [isUploadingMainImage, setIsUploadingMainImage] = useState(false);
  const [uploadingImageIndex, setUploadingImageIndex] = useState<number | null>(null);
  const [isUploadingBrandLogo, setIsUploadingBrandLogo] = useState(false);

  // File input refs
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const brandLogoInputRef = useRef<HTMLInputElement>(null);

  // New orders notification state
  const [previousOrdersCount, setPreviousOrdersCount] = useState<number>(0);
  const [newOrdersCount, setNewOrdersCount] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load all data when authenticated (for tab counters)
  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchOrders();
      fetchCategories();
      fetchBrands();
      // Initialize previous orders count
      setPreviousOrdersCount(orders.length);
    }
  }, [isAdminAuthenticated, fetchOrders, fetchCategories, fetchBrands]);

  // Auto-refresh orders and detect new ones
  useEffect(() => {
    if (!isAdminAuthenticated) return;

    const checkForNewOrders = async () => {
      await fetchOrders();
    };

    // Poll for new orders every 15 seconds
    const interval = setInterval(checkForNewOrders, 15000);

    return () => clearInterval(interval);
  }, [isAdminAuthenticated, orders.length, fetchOrders]);

  // Detect new orders and play sound
  useEffect(() => {
    if (!isAdminAuthenticated) return;

    const currentCount = orders.length;

    // Skip initial load
    if (previousOrdersCount === 0) {
      setPreviousOrdersCount(currentCount);
      return;
    }

    // New orders detected
    if (currentCount > previousOrdersCount) {
      const newOrders = currentCount - previousOrdersCount;
      setNewOrdersCount(newOrders);

      // Play notification sound
      playNotificationSound();

      // Show toast notification
      toast.success(`Новая заявка! Всего: ${newOrders}`, {
        duration: 5000,
        icon: '🔔',
      });

      setPreviousOrdersCount(currentCount);
    }
  }, [orders.length, isAdminAuthenticated, previousOrdersCount]);

  // Play notification sound
  const playNotificationSound = () => {
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio();
      // Using a simple notification sound (data URI)
      audioRef.current.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjeL0fLTgjMGHm7A7+OZTR0SU6zn77dfFgs+muDyvHEjCDV7w/HLdjwJG2a36+WXUBwPS6Xj77RhGws6k9X0xHguBSZ1w/HRgDkJF2Kz6+mrWBcLPZnb8r52JQY8iM7w04k5CRZmsOnpsV4dDkqk4O+zYh0LOY/T8sZ8MAUocLzv2I9CDBNZrOXwrF4XCz2Q0/S9cyQIO4LG8NSBOAkTYLLl67RiHAxKo+Htsl0bCjmP0/LGfTAFKG+87tiQQwwTWazl8KtfFws9j9Pzu3UlBjuCxfDTgTcJE12y5eq0Yx0MSqPg7bJdGwo5jtLyxn0wBSdvu+7Yj0MLFV2s5fCsYBcLPZDT87x1JQY7gcTwz4A2CRRasOjrt2MeDEmj4O2yXRsKOY7S8sZ9MAUmb7zv2I9DCxVdrOXwrGAXCz2P0/O8dSUGO4HE8M+ANgkUWrDp67djHgxJo+DtsV4bCjmO0vLGfDAFJm+87tiPQwsVXazl8KxgFws9jtPzv HUlBjuBxPDPgDYJFFqw6eq3Yx4MSaLg7bJeGwo5jdPyxn4wBSduu+/Yj0MLFV2s5fCsYBcLPY7T871zJAY7gcXwz4A2CRRasOnqt2MdDEmj4O2yXRsKOY3S8sZ+MAUnbrvw2I9DCxVdrOXwrGAXCz2P0/O9cyQGO4HF8M+ANgkUWrDp6rZjHQxJo+Dssl0bCjmO0vLGfTAFJ2+77tiPQwsVXa3l8KtgFws9j9PzvXQkBjuBxfDPgDYJFFqw6eq2Yx0MSaPg7bJdGwo5jtLyxn0wBSdvu+7Yj0MLFV2t5fCrYBcLPY7T871zJAY7gcXwz4A2CRRasOnqtmMdDEmj4O2yXRsKOY7S8sZ9MAUnbrvv2I9CCxVdrOXwq2AXCz2O0/O8dCQGO4HF8M+ANgkUWrDp6rZjHQxJo+Dssl0bCjmO0vLGfTAFJ2677tiPQgsVXa3l8KtgFws9jtPzvHQkBjuBxfDPgDYJFFqw6eq2Yx0MSaPg7bJdGwo5jtLyxn0wBSdvu+7Yj0ILFV2t5fCrYBcLPY7T87x0JAY7gcXwz4A2CRRasOnqtmMdDEmj4O2yXRsKOY7S8sZ9MAUnbrvv2I9CCxVdrOXwq2AXCz2O0/O8dCQGO4HF8M+ANgkUWrDp6rZjHQxJo+Dssl0bCjmO0vLGfTAFJ2677tiPQgsVXa3l8KxgFws9jtPzvHQkBjuBxfDPgDYJFFqw6eq2Yx0MSaPg7bJdGwo5jtLyxn0wBSduu+/Yj0ILFV2t5fCrYBcLPY7T87x0JAY7gcXwz4A2CRRasOnqtmMdDEmj4O2yXRsKOY7S8sZ9MAUnbrvv2I9CCxVdrOXwq2AXCz2O0/O8dCQGO4HF8M+ANgkUWrDp6rZjHQxJo+Dssl0bCjmO0vLGfTAFJ2677tiPQgsVXa3l8KtgFws9jtPzvHQkBjuBxfDPgDYJFFqw6eq2Yx0MSaPg7bJdGwo5jtLyxn0wBSduu+/Yj0ILFV2t5fCrYBcLPY7T87x0JAY7gcXwz4A2CRRasOnqtmMdDEmj4O2yXRsKOY7S8sZ9MAUnbrvv2I9CCxVdrOXwq2AXCz2O0/O8dCQGO4HF8M+ANgkUWrDp6rZjHQxJo+Dssl0bCjmO0vLGfTAFJ2677tiPQgsVXa3l8KtgFws9jtPzvHQkBjuBxfDPgDYJFFqw6eq2Yx0MSaPg7bJdGwo5jtLyxn0wBSduu+/Yj0ILFV2t5fCrYBcLPY7T87x0JAY7gcXwz4A2CRRasOnqtmMdDEmj4O2yXRsK';
    }

    audioRef.current.volume = 0.5;
    audioRef.current.play().catch(err => {
      console.log('Could not play notification sound:', err);
    });
  };

  // Reset new orders count when viewing orders tab
  useEffect(() => {
    if (activeTab === 'orders' && newOrdersCount > 0) {
      setNewOrdersCount(0);
    }
  }, [activeTab, newOrdersCount]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin(password)) {
      toast.success('Вход выполнен успешно');
      setPassword('');
    } else {
      toast.error('Неверный пароль');
    }
  };

  const handleLogout = () => {
    adminLogout();
    toast.success('Вы вышли из системы');
  };

  const openProductForm = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      // Find brand name - product.brand might be slug or name
      const brandName = brands.find((b) => b.name === product.brand)?.name 
        || brands.find((b) => b.slug === product.brand)?.name 
        || product.brand;
      setFormData({
        name: product.name,
        category: product.category,
        brand: brandName,
        price: product.price,
        oldPrice: product.oldPrice,
        image: product.image,
        images: product.images || [],
        badge: product.badge,
        inStock: product.inStock,
        stockQuantity: product.stockQuantity,
        description: product.description,
        fullDescription: product.fullDescription,
        ingredients: product.ingredients,
        howToUse: product.howToUse,
        rating: product.rating,
      });
    } else {
      setEditingProduct(null);
      setFormData(emptyProduct);
    }
    setIsEditing(true);
  };

  const closeProductForm = () => {
    setIsEditing(false);
    setEditingProduct(null);
    setFormData(emptyProduct);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.brand || !formData.price) {
      toast.error('Заполните обязательные поля');
      return;
    }

    setIsSaving(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
        toast.success('Товар обновлен');
      } else {
        await addProduct(formData as Product);
        toast.success('Товар добавлен');
      }
      closeProductForm();
    } catch (error) {
      toast.error('Ошибка при сохранении');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      try {
        await deleteProduct(id);
        toast.success('Товар удален');
      } catch (error: any) {
        const errorMessage = error?.message || 'Ошибка при удалении';
        toast.error(errorMessage);
      }
    }
  };

  const toggleProductStock = async (id: number, currentStock: boolean) => {
    try {
      await updateProduct(id, { inStock: !currentStock });
      toast.success(currentStock ? 'Товар скрыт' : 'Товар доступен');
    } catch (error) {
      toast.error('Ошибка при обновлении');
    }
  };

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus(orderId, status as any);
      toast.success('Статус обновлен');
    } catch (error) {
      toast.error('Ошибка при обновлении статуса');
    }
  };

  // Category handlers
  const openCategoryForm = (category?: Category) => {
    if (category) {
      setEditingCategoryData(category);
      setCategoryFormData({
        slug: category.slug,
        name: category.name,
        sortOrder: category.sortOrder,
      });
    } else {
      setEditingCategoryData(null);
      setCategoryFormData(emptyCategory);
    }
    setIsEditingCategory(true);
  };

  const closeCategoryForm = () => {
    setIsEditingCategory(false);
    setEditingCategoryData(null);
    setCategoryFormData(emptyCategory);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryFormData.name || !categoryFormData.slug) {
      toast.error('Заполните название и slug');
      return;
    }

    setIsSavingCategory(true);
    try {
      if (editingCategoryData) {
        await updateCategory(editingCategoryData.id, categoryFormData);
        toast.success('Категория обновлена');
      } else {
        await addCategory(categoryFormData);
        toast.success('Категория добавлена');
      }
      closeCategoryForm();
    } catch (error) {
      toast.error('Ошибка при сохранении');
    } finally {
      setIsSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (window.confirm('Удалить категорию? Товары этой категории останутся без категории.')) {
      try {
        await deleteCategory(id);
        toast.success('Категория удалена');
      } catch (error) {
        toast.error('Ошибка при удалении');
      }
    }
  };

  // Brand handlers
  const openBrandForm = (brand?: Brand) => {
    if (brand) {
      setEditingBrandData(brand);
      setBrandFormData({
        slug: brand.slug,
        name: brand.name,
        logo: brand.logo || '',
        sortOrder: brand.sortOrder,
      });
    } else {
      setEditingBrandData(null);
      setBrandFormData(emptyBrand);
    }
    setIsEditingBrand(true);
  };

  const closeBrandForm = () => {
    setIsEditingBrand(false);
    setEditingBrandData(null);
    setBrandFormData(emptyBrand);
  };

  const handleSaveBrand = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!brandFormData.name || !brandFormData.slug) {
      toast.error('Заполните название и slug');
      return;
    }

    setIsSavingBrand(true);
    try {
      if (editingBrandData) {
        await updateBrand(editingBrandData.id, brandFormData);
        toast.success('Бренд обновлен');
      } else {
        await addBrand(brandFormData);
        toast.success('Бренд добавлен');
      }
      closeBrandForm();
    } catch (error) {
      toast.error('Ошибка при сохранении');
    } finally {
      setIsSavingBrand(false);
    }
  };

  const handleDeleteBrand = async (id: number) => {
    if (window.confirm('Удалить бренд?')) {
      try {
        await deleteBrand(id);
        toast.success('Бренд удален');
      } catch (error) {
        toast.error('Ошибка при удалении');
      }
    }
  };

  // Image upload handlers
  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Выберите изображение');
      return;
    }

    setIsUploadingMainImage(true);
    try {
      const url = await uploadImage(file);
      setFormData({ ...formData, image: url });
      toast.success('Изображение загружено');
    } catch (error: any) {
      toast.error(error.message || 'Ошибка загрузки');
    } finally {
      setIsUploadingMainImage(false);
      if (mainImageInputRef.current) {
        mainImageInputRef.current.value = '';
      }
    }
  };

  const handleAdditionalImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Выберите изображение');
      return;
    }

    setUploadingImageIndex(index);
    try {
      const url = await uploadImage(file);
      const newImages = [...(formData.images || [])];
      newImages[index] = url;
      setFormData({ ...formData, images: newImages });
      toast.success('Изображение загружено');
    } catch (error: any) {
      toast.error(error.message || 'Ошибка загрузки');
    } finally {
      setUploadingImageIndex(null);
    }
  };

  const handleBrandLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Выберите изображение');
      return;
    }

    setIsUploadingBrandLogo(true);
    try {
      const url = await uploadImage(file, 'brand-logos');
      setBrandFormData({ ...brandFormData, logo: url });
      toast.success('Логотип загружен');
    } catch (error: any) {
      toast.error(error.message || 'Ошибка загрузки');
    } finally {
      setIsUploadingBrandLogo(false);
      if (brandLogoInputRef.current) {
        brandLogoInputRef.current.value = '';
      }
    }
  };

  const generateSlug = (name: string) => {
    const translitMap: Record<string, string> = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
      'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
      'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
      'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '',
      'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya', ' ': '-'
    };
    return name.toLowerCase().split('').map(char => translitMap[char] || char).join('').replace(/[^a-z0-9-]/g, '');
  };

  if (!isAdminAuthenticated) {
    return (
      <main className={styles.main}>
        <div className={styles.loginContainer}>
          <motion.div
            className={styles.loginCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={styles.loginIcon}>
              <Lock size={32} />
            </div>
            <h1 className={styles.loginTitle}>Вход в админ-панель</h1>
            <form onSubmit={handleLogin} className={styles.loginForm}>
              <input
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.loginInput}
                autoFocus
              />
              <button type="submit" className={styles.loginBtn}>
                Войти
              </button>
            </form>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.title}>Админ-панель</h1>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={20} />
            Выйти
          </button>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'products' ? styles.active : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={20} />
            Товары ({products.length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'categories' ? styles.active : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <Tag size={20} />
            Категории ({categories.length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'brands' ? styles.active : ''}`}
            onClick={() => setActiveTab('brands')}
          >
            <Award size={20} />
            Бренды ({brands.length})
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'orders' ? styles.active : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingCart size={20} />
            Заявки ({orders.length})
            {newOrdersCount > 0 && (
              <span className={styles.newBadge}>{newOrdersCount}</span>
            )}
          </button>
        </div>

        {activeTab === 'products' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Управление товарами</h2>
              <button className={styles.addBtn} onClick={() => openProductForm()}>
                <Plus size={20} />
                Добавить товар
              </button>
            </div>

            {productsLoading ? (
              <div className={styles.loading}>
                <Loader2 size={32} className={styles.spinner} />
                <p>Загрузка товаров...</p>
              </div>
            ) : (
              <div className={styles.productList}>
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    className={styles.productItem}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <img
                      src={product.image || 'https://via.placeholder.com/60'}
                      alt={product.name}
                      className={styles.productImage}
                    />
                    <div className={styles.productInfo}>
                      <h3 className={styles.productName}>{product.name}</h3>
                      <p className={styles.productMeta}>
                        {product.brand} • {formatPrice(product.price)}
                        {product.stockQuantity !== undefined && ` • Остаток: ${product.stockQuantity} шт.`}
                      </p>
                      <span
                        className={`${styles.stockBadge} ${
                          product.inStock ? styles.inStock : styles.outOfStock
                        }`}
                      >
                        {product.inStock ? 'В наличии' : 'Нет в наличии'}
                      </span>
                    </div>
                    <div className={styles.productActions}>
                      <button
                        className={styles.actionBtn}
                        onClick={() => toggleProductStock(product.id, product.inStock)}
                        title={product.inStock ? 'Скрыть товар' : 'Показать товар'}
                      >
                        {product.inStock ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <button
                        className={styles.actionBtn}
                        onClick={() => openProductForm(product)}
                        title="Редактировать"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        onClick={() => handleDeleteProduct(product.id)}
                        title="Удалить"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'categories' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Управление категориями</h2>
              <button className={styles.addBtn} onClick={() => openCategoryForm()}>
                <Plus size={20} />
                Добавить категорию
              </button>
            </div>

            {categoriesLoading ? (
              <div className={styles.loading}>
                <Loader2 size={32} className={styles.spinner} />
                <p>Загрузка категорий...</p>
              </div>
            ) : categories.length === 0 ? (
              <p className={styles.emptyText}>Категорий пока нет</p>
            ) : (
              <div className={styles.productList}>
                {categories.map((category) => (
                  <motion.div
                    key={category.id}
                    className={styles.productItem}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className={styles.categoryIcon}>
                      <Tag size={24} />
                    </div>
                    <div className={styles.productInfo}>
                      <h3 className={styles.productName}>{category.name}</h3>
                      <p className={styles.productMeta}>
                        slug: {category.slug} • порядок: {category.sortOrder}
                      </p>
                    </div>
                    <div className={styles.productActions}>
                      <button
                        className={styles.actionBtn}
                        onClick={() => openCategoryForm(category)}
                        title="Редактировать"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        onClick={() => handleDeleteCategory(category.id)}
                        title="Удалить"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'brands' && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Управление брендами</h2>
              <button className={styles.addBtn} onClick={() => openBrandForm()}>
                <Plus size={20} />
                Добавить бренд
              </button>
            </div>

            {brandsLoading ? (
              <div className={styles.loading}>
                <Loader2 size={32} className={styles.spinner} />
                <p>Загрузка брендов...</p>
              </div>
            ) : brands.length === 0 ? (
              <p className={styles.emptyText}>Брендов пока нет</p>
            ) : (
              <div className={styles.productList}>
                {brands.map((brand) => (
                  <motion.div
                    key={brand.id}
                    className={styles.productItem}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {brand.logo ? (
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className={styles.brandLogo}
                      />
                    ) : (
                      <div className={styles.categoryIcon}>
                        <Award size={24} />
                      </div>
                    )}
                    <div className={styles.productInfo}>
                      <h3 className={styles.productName}>{brand.name}</h3>
                      <p className={styles.productMeta}>
                        slug: {brand.slug} • порядок: {brand.sortOrder} • товаров: {products.filter(p => p.brand === brand.name).length}
                      </p>
                    </div>
                    <div className={styles.productActions}>
                      <button
                        className={styles.actionBtn}
                        onClick={() => openBrandForm(brand)}
                        title="Редактировать"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        onClick={() => handleDeleteBrand(brand.id)}
                        title="Удалить"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Заявки</h2>
            {ordersLoading ? (
              <div className={styles.loading}>
                <Loader2 size={32} className={styles.spinner} />
                <p>Загрузка заявок...</p>
              </div>
            ) : orders.length === 0 ? (
              <p className={styles.emptyText}>Заявок пока нет</p>
            ) : (
              <div className={styles.orderList}>
                {orders.map((order) => (
                  <motion.div
                    key={order.id}
                    className={styles.orderItem}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className={styles.orderHeader}>
                      <span className={styles.orderId}>{order.id}</span>
                      <span className={styles.orderDate}>
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                    <div className={styles.orderCustomer}>
                      <strong>{order.customer.name}</strong>
                      <div className={styles.phoneDropdown}>
                        <button className={styles.phoneDropdownTrigger}>
                          <Phone size={14} />
                          {order.customer.phone}
                        </button>
                        <div className={styles.phoneDropdownMenu}>
                          <a 
                            href={`tel:${order.customer.phone.replace(/\D/g, '')}`}
                            className={styles.phoneDropdownItem}
                          >
                            <Phone size={16} />
                            Позвонить
                          </a>
                          <a 
                            href={`https://wa.me/${order.customer.phone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.phoneDropdownItem}
                          >
                            <MessageCircle size={16} />
                            Написать в WhatsApp
                          </a>
                        </div>
                      </div>
                      {order.customer.comment && (
                        <p className={styles.orderComment}>{order.customer.comment}</p>
                      )}
                      {order.customer.reserveFor24h && (
                        <span className={styles.reserveBadge}>Бронь на 24ч</span>
                      )}
                    </div>
                    <div className={styles.orderItems}>
                      {order.items.map((item) => (
                        <div key={item.product.id} className={styles.orderProduct}>
                          <img
                            src={item.product.image || 'https://via.placeholder.com/40'}
                            alt={item.product.name}
                            className={styles.orderProductImage}
                          />
                          <span className={styles.orderProductName}>{item.product.name}</span>
                          <span className={styles.orderProductQty}>× {item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className={styles.orderFooter}>
                      <span className={styles.orderTotal}>
                        Итого: {formatPrice(order.total)}
                      </span>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`${styles.statusSelect} ${styles[order.status]}`}
                      >
                        <option value="pending">Ожидает</option>
                        <option value="contacted">Связались</option>
                        <option value="completed">Завершен</option>
                        <option value="cancelled">Отменен</option>
                      </select>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Product Form Modal */}
        <AnimatePresence>
          {isEditing && (
            <>
              <motion.div
                className={styles.overlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeProductForm}
              />
              <div className={styles.modalWrapper} onClick={closeProductForm}>
                <motion.div
                  className={styles.modal}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={(e) => e.stopPropagation()}
                >
                <div className={styles.modalHeader}>
                  <h2 className={styles.modalTitle}>
                    {editingProduct ? 'Редактировать товар' : 'Добавить товар'}
                  </h2>
                  <button className={styles.closeBtn} onClick={closeProductForm}>
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSaveProduct} className={styles.form}>
                  <div className={styles.formGrid}>
                    <div className={styles.field}>
                      <label>Название *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className={styles.field}>
                      <label>Бренд *</label>
                      <select
                        value={formData.brand}
                        onChange={(e) =>
                          setFormData({ ...formData, brand: e.target.value })
                        }
                        required
                      >
                        <option value="">Выберите бренд</option>
                        {brands.map((brand) => (
                          <option key={brand.id} value={brand.name}>
                            {brand.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className={styles.field}>
                      <label>Категория</label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                      >
                        <option value="">Выберите категорию</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.slug}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className={styles.field}>
                      <label>Бейдж</label>
                      <select
                        value={formData.badge || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            badge: e.target.value as any || undefined,
                          })
                        }
                      >
                        <option value="">Нет</option>
                        <option value="hit">ХИТ</option>
                        <option value="new">НОВИНКА</option>
                        <option value="sale">СКИДКА</option>
                      </select>
                    </div>

                    <div className={styles.field}>
                      <label>Цена *</label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: Number(e.target.value) })
                        }
                        required
                        min="0"
                      />
                    </div>

                    <div className={styles.field}>
                      <label>Старая цена</label>
                      <input
                        type="number"
                        value={formData.oldPrice || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            oldPrice: e.target.value ? Number(e.target.value) : undefined,
                          })
                        }
                        min="0"
                      />
                    </div>

                    <div className={styles.field}>
                      <label>Остаток (шт.)</label>
                      <input
                        type="number"
                        value={formData.stockQuantity ?? ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            stockQuantity: e.target.value ? Number(e.target.value) : undefined,
                          })
                        }
                        min="0"
                        placeholder="Не указано"
                      />
                    </div>

                    <div className={styles.field}>
                      <label>Главное изображение</label>
                      <div className={styles.imageUploadRow}>
                        <input
                          type="url"
                          value={formData.image}
                          onChange={(e) =>
                            setFormData({ ...formData, image: e.target.value })
                          }
                          placeholder="URL или загрузите файл"
                          className={styles.imageUrlInput}
                        />
                        <input
                          ref={mainImageInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleMainImageUpload}
                          className={styles.hiddenFileInput}
                        />
                        <button
                          type="button"
                          className={styles.uploadBtn}
                          onClick={() => mainImageInputRef.current?.click()}
                          disabled={isUploadingMainImage}
                          title="Загрузить файл"
                        >
                          {isUploadingMainImage ? (
                            <Loader2 size={18} className={styles.spinner} />
                          ) : (
                            <Upload size={18} />
                          )}
                        </button>
                        {formData.image && (
                          <img
                            src={formData.image}
                            alt="Preview"
                            className={styles.imagePreviewSmall}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                      </div>
                    </div>

                    <div className={styles.field}>
                      <label>Рейтинг (1-5)</label>
                      <input
                        type="number"
                        value={formData.rating || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            rating: e.target.value ? Number(e.target.value) : undefined,
                          })
                        }
                        min="1"
                        max="5"
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label>Краткое описание</label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Полное описание</label>
                    <textarea
                      value={formData.fullDescription || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, fullDescription: e.target.value })
                      }
                      rows={3}
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Состав</label>
                    <textarea
                      value={formData.ingredients || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, ingredients: e.target.value })
                      }
                      rows={2}
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Способ применения</label>
                    <textarea
                      value={formData.howToUse || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, howToUse: e.target.value })
                      }
                      rows={2}
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Дополнительные изображения</label>
                    <div className={styles.imagesContainer}>
                      {(formData.images || []).map((url, index) => (
                        <div key={index} className={styles.imageInputRow}>
                          <input
                            type="url"
                            value={url}
                            onChange={(e) => {
                              const newImages = [...(formData.images || [])];
                              newImages[index] = e.target.value;
                              setFormData({ ...formData, images: newImages });
                            }}
                            placeholder="URL или загрузите файл"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleAdditionalImageUpload(e, index)}
                            className={styles.hiddenFileInput}
                            id={`additional-image-${index}`}
                          />
                          <button
                            type="button"
                            className={styles.uploadBtn}
                            onClick={() => document.getElementById(`additional-image-${index}`)?.click()}
                            disabled={uploadingImageIndex === index}
                            title="Загрузить файл"
                          >
                            {uploadingImageIndex === index ? (
                              <Loader2 size={16} className={styles.spinner} />
                            ) : (
                              <Upload size={16} />
                            )}
                          </button>
                          {url && (
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className={styles.imagePreviewSmall}
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          )}
                          <button
                            type="button"
                            className={styles.removeImageBtn}
                            onClick={() => {
                              const newImages = (formData.images || []).filter((_, i) => i !== index);
                              setFormData({ ...formData, images: newImages });
                            }}
                            title="Удалить"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className={styles.addImageBtn}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            images: [...(formData.images || []), ''],
                          });
                        }}
                      >
                        <Plus size={16} />
                        Добавить изображение
                      </button>
                    </div>
                  </div>

                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={formData.inStock}
                      onChange={(e) =>
                        setFormData({ ...formData, inStock: e.target.checked })
                      }
                    />
                    <span className={styles.checkmark}></span>
                    <span>В наличии</span>
                  </label>

                  <div className={styles.formActions}>
                    <button
                      type="button"
                      className={styles.cancelBtn}
                      onClick={closeProductForm}
                      disabled={isSaving}
                    >
                      Отмена
                    </button>
                    <button type="submit" className={styles.saveBtn} disabled={isSaving}>
                      {isSaving ? (
                        <Loader2 size={20} className={styles.spinner} />
                      ) : (
                        <Check size={20} />
                      )}
                      {editingProduct ? 'Сохранить' : 'Добавить'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
            </>
          )}
        </AnimatePresence>

        {/* Brand Form Modal */}
        <AnimatePresence>
          {isEditingBrand && (
            <>
              <motion.div
                className={styles.overlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeBrandForm}
              />
              <div className={styles.modalWrapper} onClick={closeBrandForm}>
                <motion.div
                  className={styles.modal}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>
                      {editingBrandData ? 'Редактировать бренд' : 'Добавить бренд'}
                    </h2>
                    <button className={styles.closeBtn} onClick={closeBrandForm}>
                      <X size={24} />
                    </button>
                  </div>

                  <form onSubmit={handleSaveBrand} className={styles.form}>
                    <div className={styles.field}>
                      <label>Название *</label>
                      <input
                        type="text"
                        value={brandFormData.name}
                        onChange={(e) => {
                          const name = e.target.value;
                          setBrandFormData({
                            ...brandFormData,
                            name,
                            slug: brandFormData.slug || generateSlug(name),
                          });
                        }}
                        required
                        placeholder="The Ordinary"
                      />
                    </div>

                    <div className={styles.field}>
                      <label>Slug (URL) *</label>
                      <input
                        type="text"
                        value={brandFormData.slug}
                        onChange={(e) =>
                          setBrandFormData({ ...brandFormData, slug: e.target.value })
                        }
                        required
                        placeholder="the-ordinary"
                      />
                    </div>

                    <div className={styles.field}>
                      <label>Логотип</label>
                      <div className={styles.imageUploadRow}>
                        <input
                          type="url"
                          value={brandFormData.logo || ''}
                          onChange={(e) =>
                            setBrandFormData({ ...brandFormData, logo: e.target.value || undefined })
                          }
                          placeholder="URL или загрузите файл"
                          className={styles.imageUrlInput}
                        />
                        <input
                          ref={brandLogoInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleBrandLogoUpload}
                          className={styles.hiddenFileInput}
                        />
                        <button
                          type="button"
                          className={styles.uploadBtn}
                          onClick={() => brandLogoInputRef.current?.click()}
                          disabled={isUploadingBrandLogo}
                          title="Загрузить файл"
                        >
                          {isUploadingBrandLogo ? (
                            <Loader2 size={18} className={styles.spinner} />
                          ) : (
                            <Upload size={18} />
                          )}
                        </button>
                        {brandFormData.logo && (
                          <img
                            src={brandFormData.logo}
                            alt="Logo preview"
                            className={styles.imagePreviewSmall}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                      </div>
                    </div>

                    <div className={styles.field}>
                      <label>Порядок сортировки</label>
                      <input
                        type="number"
                        value={brandFormData.sortOrder}
                        onChange={(e) =>
                          setBrandFormData({
                            ...brandFormData,
                            sortOrder: Number(e.target.value),
                          })
                        }
                        min="0"
                      />
                    </div>

                    <div className={styles.formActions}>
                      <button
                        type="button"
                        className={styles.cancelBtn}
                        onClick={closeBrandForm}
                        disabled={isSavingBrand}
                      >
                        Отмена
                      </button>
                      <button type="submit" className={styles.saveBtn} disabled={isSavingBrand}>
                        {isSavingBrand ? (
                          <Loader2 size={20} className={styles.spinner} />
                        ) : (
                          <Check size={20} />
                        )}
                        {editingBrandData ? 'Сохранить' : 'Добавить'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>

        {/* Category Form Modal */}
        <AnimatePresence>
          {isEditingCategory && (
            <>
              <motion.div
                className={styles.overlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeCategoryForm}
              />
              <div className={styles.modalWrapper} onClick={closeCategoryForm}>
                <motion.div
                  className={styles.modal}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>
                      {editingCategoryData ? 'Редактировать категорию' : 'Добавить категорию'}
                    </h2>
                    <button className={styles.closeBtn} onClick={closeCategoryForm}>
                      <X size={24} />
                    </button>
                  </div>

                  <form onSubmit={handleSaveCategory} className={styles.form}>
                    <div className={styles.field}>
                      <label>Название *</label>
                      <input
                        type="text"
                        value={categoryFormData.name}
                        onChange={(e) => {
                          const name = e.target.value;
                          setCategoryFormData({
                            ...categoryFormData,
                            name,
                            slug: categoryFormData.slug || generateSlug(name),
                          });
                        }}
                        required
                        placeholder="Уход за кожей"
                      />
                    </div>

                    <div className={styles.field}>
                      <label>Slug (URL) *</label>
                      <input
                        type="text"
                        value={categoryFormData.slug}
                        onChange={(e) =>
                          setCategoryFormData({ ...categoryFormData, slug: e.target.value })
                        }
                        required
                        placeholder="skincare"
                      />
                    </div>

                    <div className={styles.field}>
                      <label>Порядок сортировки</label>
                      <input
                        type="number"
                        value={categoryFormData.sortOrder}
                        onChange={(e) =>
                          setCategoryFormData({
                            ...categoryFormData,
                            sortOrder: Number(e.target.value),
                          })
                        }
                        min="0"
                      />
                    </div>

                    <div className={styles.formActions}>
                      <button
                        type="button"
                        className={styles.cancelBtn}
                        onClick={closeCategoryForm}
                        disabled={isSavingCategory}
                      >
                        Отмена
                      </button>
                      <button type="submit" className={styles.saveBtn} disabled={isSavingCategory}>
                        {isSavingCategory ? (
                          <Loader2 size={20} className={styles.spinner} />
                        ) : (
                          <Check size={20} />
                        )}
                        {editingCategoryData ? 'Сохранить' : 'Добавить'}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
