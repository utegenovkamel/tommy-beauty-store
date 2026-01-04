import { X, ShoppingBag, Trash2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { formatPrice } from '../utils/format';
import styles from './SavedOrdersModal.module.css';
import toast from 'react-hot-toast';

interface SavedOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SavedOrdersModal({ isOpen, onClose }: SavedOrdersModalProps) {
  const { savedOrders, restoreCartFromSavedOrder, deleteSavedOrder, setOrderFormOpen } = useStore();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleRestore = (orderId: string) => {
    restoreCartFromSavedOrder(orderId);
    toast.success('Корзина восстановлена из заказа');
    onClose();
  };

  const handleRestoreAndOrder = (orderId: string) => {
    restoreCartFromSavedOrder(orderId);
    onClose();
    setTimeout(() => {
      setOrderFormOpen(true);
    }, 100);
  };

  const handleDelete = (orderId: string) => {
    deleteSavedOrder(orderId);
    toast.success('Заказ удален из истории');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <div className={styles.modalWrapper} onClick={onClose}>
            <motion.div
              className={styles.modal}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className={styles.closeBtn} onClick={onClose} aria-label="Закрыть">
                <X size={24} />
              </button>

              <h2 className={styles.title}>
                <ShoppingBag size={24} />
                История заказов
              </h2>

              {savedOrders.length === 0 ? (
                <div className={styles.empty}>
                  <p>У вас пока нет сохраненных заказов</p>
                </div>
              ) : (
                <div className={styles.ordersList}>
                  {savedOrders.map((order) => (
                    <motion.div
                      key={order.id}
                      className={styles.orderCard}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className={styles.orderHeader}>
                        <span className={styles.orderDate}>{formatDate(order.createdAt)}</span>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(order.id)}
                          aria-label="Удалить"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <div className={styles.orderItems}>
                        {order.items.slice(0, 3).map((item) => (
                          <div key={item.product.id} className={styles.orderItem}>
                            <span className={styles.itemName}>{item.product.name}</span>
                            <span className={styles.itemQty}>× {item.quantity}</span>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className={styles.moreItems}>
                            +{order.items.length - 3} товаров
                          </div>
                        )}
                      </div>
                      
                      <div className={styles.orderFooter}>
                        <span className={styles.orderTotal}>{formatPrice(order.total)}</span>
                        <div className={styles.orderActions}>
                          <button
                            className={styles.restoreBtn}
                            onClick={() => handleRestore(order.id)}
                            title="Восстановить в корзину"
                          >
                            <RefreshCw size={16} />
                            В корзину
                          </button>
                          <button
                            className={styles.reorderBtn}
                            onClick={() => handleRestoreAndOrder(order.id)}
                          >
                            Повторить заказ
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

