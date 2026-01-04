import { Link } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { ProductCard } from '../components/ProductCard';
import styles from './Favorites.module.css';

export function Favorites() {
  const { getFavoriteProducts } = useStore();
  const favoriteProducts = getFavoriteProducts();

  return (
    <main className={styles.main}>
      <div className="container">
        <div className={styles.header}>
          <Link to="/catalog" className={styles.backLink}>
            <ArrowLeft size={20} />
            <span>Каталог</span>
          </Link>
          <h1 className={styles.title}>
            <Heart size={32} className={styles.titleIcon} />
            Избранное
          </h1>
          <p className={styles.count}>
            {favoriteProducts.length}{' '}
            {favoriteProducts.length === 1
              ? 'товар'
              : favoriteProducts.length >= 2 && favoriteProducts.length <= 4
              ? 'товара'
              : 'товаров'}
          </p>
        </div>

        {favoriteProducts.length > 0 ? (
          <motion.div
            className={styles.grid}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {favoriteProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            className={styles.empty}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className={styles.emptyIcon}>
              <Heart size={64} />
            </div>
            <h2 className={styles.emptyTitle}>В избранном пока пусто</h2>
            <p className={styles.emptyText}>
              Добавляйте понравившиеся товары, нажимая на сердечко
            </p>
            <Link to="/catalog" className={styles.catalogBtn}>
              Перейти в каталог
            </Link>
          </motion.div>
        )}
      </div>
    </main>
  );
}

