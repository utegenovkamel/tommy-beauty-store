import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ArrowRight, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { formatPrice } from '../utils/format';
import { generateWhatsAppLink } from '../utils/whatsapp';
import { ProductCard } from '../components/ProductCard';
import { SavedOrdersModal } from '../components/SavedOrdersModal';
import styles from './CartPage.module.css';

export function CartPage() {
  const {
    cart,
    products,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    setOrderFormOpen,
    savedOrders,
    loadSavedData,
  } = useStore();
  
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  useEffect(() => {
    loadSavedData();
  }, [loadSavedData]);

  const total = getCartTotal();
  const cartProductIds = cart.map(item => item.product.id);

  // Popular products (hits, new, sale)
  const popularProducts = products
    .filter(p => !cartProductIds.includes(p.id) && p.inStock)
    .filter(p => p.badge === 'hit' || p.badge === 'new' || p.badge === 'sale')
    .slice(0, 8);

  // Fill remaining with random products if needed
  const fillerProducts = products
    .filter(p => 
      !cartProductIds.includes(p.id) && 
      p.inStock && 
      !popularProducts.includes(p)
    )
    .slice(0, Math.max(0, 8 - popularProducts.length));

  const handleCheckout = () => {
    setOrderFormOpen(true);
  };

  return (
    <main className={styles.page}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/catalog" className={styles.backLink}>
            <ArrowLeft size={20} />
            Продолжить покупки
          </Link>

          <header className={styles.header}>
            <div className={styles.headerLeft}>
              <h1 className={styles.title}>
                <ShoppingBag size={32} />
                Корзина
              </h1>
              {cart.length > 0 && (
                <span className={styles.count}>{cart.length} товаров</span>
              )}
            </div>
            {savedOrders.length > 0 && (
              <button
                className={styles.historyBtn}
                onClick={() => setIsHistoryOpen(true)}
              >
                <History size={20} />
                История заказов
              </button>
            )}
          </header>

          {cart.length === 0 ? (
            <motion.div
              className={styles.empty}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className={styles.emptyIcon}>
                <ShoppingBag size={80} strokeWidth={1} />
              </div>
              <h2 className={styles.emptyTitle}>Корзина пуста</h2>
              <p className={styles.emptyText}>
                Добавьте товары из каталога, чтобы оформить заказ
              </p>
              <Link to="/catalog" className={styles.emptyBtn}>
                Перейти в каталог
              </Link>
            </motion.div>
          ) : (
            <div className={styles.content}>
              <div className={styles.cartSection}>
                <div className={styles.items}>
                  <AnimatePresence mode="popLayout">
                    {cart.map((item, index) => (
                      <motion.div
                        key={item.product.id}
                        className={styles.item}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Link
                          to={`/product/${item.product.id}`}
                          className={styles.itemImage}
                        >
                          <img src={item.product.image} alt={item.product.name} />
                        </Link>
                        <div className={styles.itemInfo}>
                          <Link
                            to={`/product/${item.product.id}`}
                            className={styles.itemName}
                          >
                            {item.product.name}
                          </Link>
                          <span className={styles.itemBrand}>{item.product.brand}</span>
                          <div className={styles.itemPriceRow}>
                            <span className={styles.itemPrice}>
                              {formatPrice(item.product.price)}
                            </span>
                            {item.product.oldPrice && (
                              <span className={styles.itemOldPrice}>
                                {formatPrice(item.product.oldPrice)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className={styles.itemActions}>
                          <div className={styles.quantity}>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              aria-label="Уменьшить количество"
                            >
                              <Minus size={18} />
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              aria-label="Увеличить количество"
                            >
                              <Plus size={18} />
                            </button>
                          </div>
                          <span className={styles.itemTotal}>
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                          <button
                            className={styles.removeBtn}
                            onClick={() => removeFromCart(item.product.id)}
                            aria-label="Удалить из корзины"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <motion.div
                  className={styles.summary}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <div className={styles.summaryRow}>
                    <span>Товары ({cart.reduce((acc, item) => acc + item.quantity, 0)} шт.)</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Доставка</span>
                    <span className={styles.freeDelivery}>Бесплатно</span>
                  </div>
                  <div className={styles.summaryTotal}>
                    <span>Итого</span>
                    <span className={styles.totalPrice}>{formatPrice(total)}</span>
                  </div>
                  <div className={styles.summaryActions}>
                    <button className={styles.checkoutBtn} onClick={handleCheckout}>
                      Оформить заявку
                    </button>
                    <a
                      href={generateWhatsAppLink(cart, total)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.whatsappBtn}
                    >
                      Отправить в WhatsApp
                    </a>
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {/* Popular Products Section */}
          {(popularProducts.length > 0 || fillerProducts.length > 0) && (
            <section className={styles.recommended}>
              <motion.div
                className={styles.recommendedHeader}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h2 className={styles.recommendedTitle}>
                  {cart.length > 0 ? 'Может пригодиться' : 'Популярные товары'}
                </h2>
                <p className={styles.recommendedSubtitle}>
                  {cart.length > 0
                    ? 'Хиты продаж и новинки'
                    : 'Самые популярные товары нашего магазина'}
                </p>
              </motion.div>
              <div className={styles.recommendedGrid}>
                {[...popularProducts, ...fillerProducts].map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
              
              {/* View Catalog Button */}
              <motion.div
                className={styles.viewCatalogWrapper}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link to="/catalog" className={styles.viewCatalogBtn}>
                  Смотреть весь каталог
                  <ArrowRight size={20} />
                </Link>
              </motion.div>
            </section>
          )}
        </motion.div>
      </div>
      
      <SavedOrdersModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </main>
  );
}

