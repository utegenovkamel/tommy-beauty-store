import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { generateWhatsAppLink } from '../utils/whatsapp';
import styles from './WhatsAppButton.module.css';

export function WhatsAppButton() {
  const { cart, getCartTotal } = useStore();
  const total = getCartTotal();

  return (
    <motion.a
      href={generateWhatsAppLink(cart, total)}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.button}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Написать в WhatsApp"
    >
      <MessageCircle size={28} />
      <span className={styles.tooltip}>Напишите нам</span>
    </motion.a>
  );
}

