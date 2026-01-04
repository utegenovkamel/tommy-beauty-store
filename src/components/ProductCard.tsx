import { Link } from 'react-router-dom';
import { ShoppingBag, Check, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Product } from '../types';
import { useStore } from '../store/useStore';
import { formatPrice } from '../utils/format';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart, removeFromCart, cart, toggleFavorite, isFavorite } = useStore();
  const isInCart = cart.some((item) => item.product.id === product.id);
  const isProductFavorite = isFavorite(product.id);

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCart) {
      removeFromCart(product.id);
    } else if (product.inStock) {
      addToCart(product);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  const getBadgeLabel = (badge: Product['badge']) => {
    switch (badge) {
      case 'hit': return 'ХИТ';
      case 'new': return 'НОВИНКА';
      case 'sale': return 'СКИДКА';
      default: return '';
    }
  };

  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/product/${product.id}`} className={styles.link}>
        <div className={styles.imageWrapper}>
          <img
            src={product.image}
            alt={product.name}
            className={styles.image}
            loading="lazy"
          />
          {product.badge && (
            <span className={`${styles.badge} ${styles[product.badge]}`}>
              {getBadgeLabel(product.badge)}
              {product.badge === 'sale' && product.oldPrice && (
                <> -{Math.round((1 - product.price / product.oldPrice) * 100)}%</>
              )}
            </span>
          )}
          <button
            className={`${styles.favoriteBtn} ${isProductFavorite ? styles.favorited : ''}`}
            onClick={handleToggleFavorite}
            aria-label={isProductFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
          >
            <Heart size={20} fill={isProductFavorite ? 'currentColor' : 'none'} />
          </button>
          <button
            className={`${styles.cartBtn} ${isInCart ? styles.inCart : ''}`}
            onClick={handleCartClick}
            disabled={!product.inStock && !isInCart}
            aria-label={isInCart ? 'Убрать из корзины' : 'Добавить в корзину'}
          >
            {isInCart ? <Check size={20} /> : <ShoppingBag size={20} />}
          </button>
        </div>

        <div className={styles.content}>
          <span className={`${styles.availability} ${product.inStock ? styles.inStock : styles.outOfStock}`}>
            {product.inStock 
              ? (product.stockQuantity !== undefined && product.stockQuantity <= 10 
                  ? `✓ Осталось ${product.stockQuantity} шт.` 
                  : '✓ Есть в наличии')
              : 'Под заказ'}
          </span>
          
          {product.brand && (
            <span className={styles.brand}>{product.brand}</span>
          )}
          <h3 className={styles.name}>{product.name}</h3>
          <p className={styles.description}>{product.description}</p>
          
          <div className={styles.priceRow}>
            <span className={styles.price}>{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className={styles.oldPrice}>{formatPrice(product.oldPrice)}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

