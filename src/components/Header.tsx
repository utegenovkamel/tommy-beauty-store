import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, Phone, Heart, Instagram, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import styles from './Header.module.css';

const WHATSAPP_NUMBER = '77004170411';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { getCartCount, getFavoritesCount } = useStore();
  const cartCount = getCartCount();
  const favoritesCount = getFavoritesCount();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { to: '/', label: 'Главная' },
    { to: '/catalog', label: 'Каталог' },
    { to: '/about', label: 'О нас' },
    { to: '/contacts', label: 'Контакты' },
  ];

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.container}`}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoText}>TOMMY</span>
          <span className={styles.logoSubtext}>BEAUTY STORE</span>
        </Link>

        <nav className={styles.nav}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`${styles.navLink} ${location.pathname === link.to ? styles.active : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <div className={styles.socialLinks}>
            <a
              href="https://www.instagram.com/tommybeauty.store"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://t.me/tommybeautystore"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Telegram"
            >
              <Send size={20} />
            </a>
          </div>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappBtn}
          >
            <Phone size={18} />
            <span className={styles.whatsappText}>+7 700 417 04 11</span>
          </a>

          <Link
            to="/favorites"
            className={styles.favoritesBtn}
            aria-label={`Избранное: ${favoritesCount} товаров`}
          >
            <Heart size={22} />
            {favoritesCount > 0 && (
              <motion.span
                className={styles.favoritesBadge}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                key={favoritesCount}
              >
                {favoritesCount}
              </motion.span>
            )}
          </Link>

          <Link
            to="/cart"
            className={styles.cartBtn}
            aria-label={`Корзина: ${cartCount} товаров`}
          >
            <ShoppingBag size={22} />
            {cartCount > 0 && (
              <motion.span
                className={styles.cartBadge}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                key={cartCount}
              >
                {cartCount}
              </motion.span>
            )}
          </Link>

          <button
            className={styles.menuBtn}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Меню"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className={styles.mobileNav}>
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.to}
                    className={`${styles.mobileNavLink} ${location.pathname === link.to ? styles.active : ''}`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mobileWhatsapp}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Phone size={20} />
                +7 700 417 04 11
              </motion.a>
              <motion.div
                className={styles.mobileSocialLinks}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <a
                  href="https://www.instagram.com/tommybeauty.store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mobileSocialLink}
                >
                  <Instagram size={22} />
                  Instagram
                </a>
                <a
                  href="https://t.me/tommybeautystore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mobileSocialLink}
                >
                  <Send size={22} />
                  Telegram
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

