import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../store/useStore';
import type { SortOption } from '../types';
import styles from './Catalog.module.css';

const sortOptions: { id: SortOption; name: string }[] = [
  { id: 'popular', name: 'По популярности' },
  { id: 'price-asc', name: 'По цене ↑' },
  { id: 'price-desc', name: 'По цене ↓' },
  { id: 'new', name: 'Новинки' },
];

export function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, categories, fetchCategories, brands, fetchBrands } = useStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [showFilters, setShowFilters] = useState(false);
  
  const categoryParam = searchParams.get('category') || 'all';
  const brandParam = searchParams.get('brand') || 'all';
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [selectedBrand, setSelectedBrand] = useState<string>(brandParam);

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, [fetchCategories, fetchBrands]);

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'all');
    setSelectedBrand(searchParams.get('brand') || 'all');
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by inStock (only show available products)
    result = result.filter((p) => p.inStock);

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by brand (check both slug and name for compatibility)
    if (selectedBrand !== 'all') {
      const brand = brands.find((b) => b.slug === selectedBrand);
      result = result.filter((p) => 
        p.brand === selectedBrand || 
        (brand && p.brand === brand.name)
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'new':
        result.sort((a, b) => (a.badge === 'new' ? -1 : b.badge === 'new' ? 1 : 0));
        break;
      case 'popular':
      default:
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [products, selectedCategory, selectedBrand, searchQuery, sortBy]);

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    if (categorySlug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', categorySlug);
    }
    setSearchParams(searchParams);
  };

  const handleBrandChange = (brandSlug: string) => {
    setSelectedBrand(brandSlug);
    if (brandSlug === 'all') {
      searchParams.delete('brand');
    } else {
      searchParams.set('brand', brandSlug);
    }
    setSearchParams(searchParams);
  };

  return (
    <main className={styles.main}>
      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={styles.headerTop}>
            <div>
              <h1 className={styles.title}>Каталог</h1>
              <p className={styles.count}>Товаров: {filteredProducts.length}</p>
            </div>
            <button
              className={styles.filterToggle}
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={20} />
              Фильтры
            </button>
          </div>

          <div className={styles.searchBar}>
            <Search size={20} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Поиск товара..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button
                className={styles.clearSearch}
                onClick={() => setSearchQuery('')}
                aria-label="Очистить поиск"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </motion.div>

        <div className={styles.content}>
          <aside className={`${styles.sidebar} ${showFilters ? styles.sidebarOpen : ''}`}>
            <div className={styles.sidebarHeader}>
              <h2 className={styles.sidebarTitle}>Категории</h2>
              <button
                className={styles.closeSidebar}
                onClick={() => setShowFilters(false)}
              >
                <X size={24} />
              </button>
            </div>
            <ul className={styles.categoryList}>
              <li>
                <button
                  className={`${styles.categoryBtn} ${
                    selectedCategory === 'all' ? styles.active : ''
                  }`}
                  onClick={() => handleCategoryChange('all')}
                >
                  Все товары
                  <span className={styles.categoryCount}>{products.filter((p) => p.inStock).length}</span>
                </button>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <button
                    className={`${styles.categoryBtn} ${
                      selectedCategory === category.slug ? styles.active : ''
                    }`}
                    onClick={() => handleCategoryChange(category.slug)}
                  >
                    {category.name}
                    <span className={styles.categoryCount}>
                      {products.filter((p) => p.category === category.slug && p.inStock).length}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <div className={styles.brandSection}>
              <h2 className={styles.sidebarTitle}>Бренды</h2>
              <ul className={styles.categoryList}>
                <li>
                  <button
                    className={`${styles.categoryBtn} ${
                      selectedBrand === 'all' ? styles.active : ''
                    }`}
                    onClick={() => handleBrandChange('all')}
                  >
                    Все бренды
                    <span className={styles.categoryCount}>{products.filter((p) => p.inStock).length}</span>
                  </button>
                </li>
                {brands.map((brand) => (
                  <li key={brand.id}>
                    <button
                      className={`${styles.categoryBtn} ${
                        selectedBrand === brand.slug ? styles.active : ''
                      }`}
                      onClick={() => handleBrandChange(brand.slug)}
                    >
                      {brand.name}
                      <span className={styles.categoryCount}>
                        {products.filter((p) => p.inStock && (p.brand === brand.slug || p.brand === brand.name)).length}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.sortSection}>
              <h2 className={styles.sidebarTitle}>Сортировка</h2>
              <ul className={styles.sortList}>
                {sortOptions.map((option) => (
                  <li key={option.id}>
                    <button
                      className={`${styles.sortBtn} ${
                        sortBy === option.id ? styles.active : ''
                      }`}
                      onClick={() => setSortBy(option.id)}
                    >
                      {option.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {showFilters && (
            <div
              className={styles.sidebarOverlay}
              onClick={() => setShowFilters(false)}
            />
          )}

          <div className={styles.products}>
            {filteredProducts.length === 0 ? (
              <div className={styles.empty}>
                <p className={styles.emptyText}>Товары не найдены</p>
                <button
                  className={styles.resetBtn}
                  onClick={() => {
                    setSearchQuery('');
                    handleCategoryChange('all');
                    handleBrandChange('all');
                  }}
                >
                  Сбросить фильтры
                </button>
              </div>
            ) : (
              <div className={styles.grid}>
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

