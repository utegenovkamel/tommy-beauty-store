import { useState, useRef, useCallback, useEffect } from 'react';
import { X, Check, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { formatPrice } from '../utils/format';
import { generateWhatsAppLink } from '../utils/whatsapp';
import type { OrderFormData } from '../types';
import toast from 'react-hot-toast';
import styles from './OrderForm.module.css';

// Phone mask helper
function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, '');
  const limited = digits.slice(0, 11);
  
  if (limited.length === 0) return '';
  
  let formatted = '+7';
  if (limited.length > 1) {
    formatted += ' (' + limited.slice(1, 4);
  }
  if (limited.length > 4) {
    formatted += ') ' + limited.slice(4, 7);
  }
  if (limited.length > 7) {
    formatted += '-' + limited.slice(7, 9);
  }
  if (limited.length > 9) {
    formatted += '-' + limited.slice(9, 11);
  }
  
  return formatted;
}

export function OrderForm() {
  const { cart, getCartTotal, isOrderFormOpen, setOrderFormOpen, addOrder, savedCustomer, loadSavedData } = useStore();
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<OrderFormData>({
    name: '',
    phone: '+7',
    comment: '',
  });
  const [errors, setErrors] = useState<Partial<OrderFormData>>({});
  const phoneInputRef = useRef<HTMLInputElement>(null);
  
  // Load saved customer data on mount and when modal opens
  useEffect(() => {
    loadSavedData();
  }, []);
  
  useEffect(() => {
    if (isOrderFormOpen && savedCustomer) {
      setFormData(prev => ({
        ...prev,
        name: savedCustomer.name,
        phone: savedCustomer.phone,
      }));
    }
  }, [isOrderFormOpen, savedCustomer]);

  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));
  }, []);

  const total = getCartTotal();

  const validate = (): boolean => {
    const newErrors: Partial<OrderFormData> = {};
    
    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Введите имя (минимум 2 символа)' as any;
    }
    
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (!phoneDigits || phoneDigits.length < 11) {
      newErrors.phone = 'Введите корректный номер телефона' as any;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const order = await addOrder(formData);
    if (order) {
      console.log('Order submitted:', order);
      toast.success('Заявка успешно отправлена!');
      setIsSuccess(true);
    } else {
      toast.error('Ошибка при отправке заявки');
    }
  };

  const handleClose = () => {
    setOrderFormOpen(false);
    setIsSuccess(false);
    setFormData({ name: '', phone: '+7', comment: '', reserveFor24h: false });
    setErrors({});
  };

  return (
    <AnimatePresence>
      {isOrderFormOpen && (
        <>
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          <div className={styles.modalWrapper} onClick={handleClose}>
            <motion.div
              className={styles.modal}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
            <button className={styles.closeBtn} onClick={handleClose} aria-label="Закрыть">
              <X size={24} />
            </button>

            {isSuccess ? (
              <div className={styles.success}>
                <motion.div
                  className={styles.successIcon}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                >
                  <Check size={48} />
                </motion.div>
                <h2 className={styles.successTitle}>Заявка отправлена!</h2>
                <p className={styles.successText}>
                  Наш менеджер свяжется с вами в ближайшее время для подтверждения заказа.
                </p>
                <div className={styles.successActions}>
                  <a
                    href={generateWhatsAppLink([], 0)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.whatsappBtn}
                  >
                    <MessageCircle size={20} />
                    Написать в WhatsApp
                  </a>
                  <button className={styles.closeSuccessBtn} onClick={handleClose}>
                    Закрыть
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className={styles.title}>Оформление заявки</h2>

                <div className={styles.orderSummary}>
                  <h3 className={styles.summaryTitle}>Ваш заказ:</h3>
                  <ul className={styles.summaryList}>
                    {cart.map((item) => (
                      <li key={item.product.id} className={styles.summaryItem}>
                        <span>{item.product.name}</span>
                        <span>× {item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                  <div className={styles.summaryTotal}>
                    <span>Итого:</span>
                    <span className={styles.totalPrice}>{formatPrice(total)}</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.field}>
                    <label htmlFor="name" className={styles.label}>
                      Ваше имя <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                      placeholder="Введите имя"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    {errors.name && <span className={styles.error}>{errors.name}</span>}
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="phone" className={styles.label}>
                      Телефон <span className={styles.required}>*</span>
                    </label>
                    <input
                      ref={phoneInputRef}
                      type="tel"
                      id="phone"
                      className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                      placeholder="+7 (___) ___-__-__"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                    />
                    {errors.phone && <span className={styles.error}>{errors.phone}</span>}
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="comment" className={styles.label}>
                      Комментарий
                    </label>
                    <textarea
                      id="comment"
                      className={styles.textarea}
                      placeholder="Удобное время для связи, пожелания..."
                      rows={3}
                      value={formData.comment}
                      onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    />
                  </div>

                  <button type="submit" className={styles.submitBtn}>
                    Отправить заявку
                  </button>
                </form>
              </>
            )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

