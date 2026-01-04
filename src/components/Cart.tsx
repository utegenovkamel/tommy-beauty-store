import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { formatPrice } from '../utils/format';
import { generateWhatsAppLink } from '../utils/whatsapp';
import styles from './Cart.module.css';

export function Cart() {
  const {
    cart,
    isCartOpen,
    setCartOpen,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    setOrderFormOpen,
  } = useStore();

  const total = getCartTotal();

  const handleCheckout = () => {
    setCartOpen(false);
    setOrderFormOpen(true);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
          />
          <motion.aside
            className={styles.cart}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <header className={styles.header}>
              <h2 className={styles.title}>
                <ShoppingBag size={24} />
                Корзина ({cart.length})
              </h2>
              <button
                className={styles.closeBtn}
                onClick={() => setCartOpen(false)}
                aria-label="Закрыть корзину"
              >
                <X size={24} />
              </button>
            </header>

            {cart.length === 0 ? (
              <div className={styles.empty}>
                <div className={styles.emptyIcon}>
                  <ShoppingBag size={48} />
                </div>
                <p className={styles.emptyText}>Корзина пуста</p>
                <Link
                  to="/catalog"
                  className={styles.emptyBtn}
                  onClick={() => setCartOpen(false)}
                >
                  Перейти в каталог
                </Link>
              </div>
            ) : (
              <>
                <div className={styles.items}>
                  <AnimatePresence mode="popLayout">
                    {cart.map((item) => (
                      <motion.div
                        key={item.product.id}
                        className={styles.item}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <Link
                          to={`/product/${item.product.id}`}
                          className={styles.itemImage}
                          onClick={() => setCartOpen(false)}
                        >
                          <img src={item.product.image} alt={item.product.name} />
                        </Link>
                        <div className={styles.itemInfo}>
                          <Link
                            to={`/product/${item.product.id}`}
                            className={styles.itemName}
                            onClick={() => setCartOpen(false)}
                          >
                            {item.product.name}
                          </Link>
                          <span className={styles.itemPrice}>
                            {formatPrice(item.product.price)}
                          </span>
                          <div className={styles.itemActions}>
                            <div className={styles.quantity}>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                aria-label="Уменьшить количество"
                              >
                                <Minus size={16} />
                              </button>
                              <span>{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                aria-label="Увеличить количество"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                            <button
                              className={styles.removeBtn}
                              onClick={() => removeFromCart(item.product.id)}
                              aria-label="Удалить из корзины"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <footer className={styles.footer}>
                  <div className={styles.total}>
                    <span>Итого:</span>
                    <span className={styles.totalPrice}>{formatPrice(total)}</span>
                  </div>
                  <div className={styles.footerActions}>
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
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

