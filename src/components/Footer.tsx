import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, Instagram, Send } from 'lucide-react';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link to="/" className={styles.logo}>
              <span className={styles.logoText}>TOMMY</span>
              <span className={styles.logoSubtext}>BEAUTY STORE</span>
            </Link>
            <p className={styles.description}>
              Оригинальная корейская косметика в Астане. Профессиональный уход для вашей кожи.
            </p>
            <div className={styles.social}>
              <a href="https://www.instagram.com/tommybeauty.store" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <Instagram size={20} />
              </a>
              <a href="https://t.me/tommybeautystore" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <Send size={20} />
              </a>
            </div>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Контакты</h3>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <MapPin size={18} />
                <span>ЖК Buqar Jyrau 2, Проспект Туран, 50/5, Астана</span>
              </li>
              <li className={styles.listItem}>
                <Phone size={18} />
                <a href="tel:+77004170411">+7 700 417 04 11</a>
              </li>
              <li className={styles.listItem}>
                <Clock size={18} />
                <div>
                  <span>Пн — Пт: 09:30 — 23:30</span>
                  <br />
                  <span>Сб — Вс: 10:00 — 23:30</span>
                </div>
              </li>
            </ul>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Информация</h3>
            <ul className={styles.list}>
              <li><Link to="/catalog" className={styles.link}>Каталог</Link></li>
              <li><Link to="/about" className={styles.link}>О нас</Link></li>
              <li><Link to="/contacts" className={styles.link}>Контакты</Link></li>
              <li><Link to="/delivery" className={styles.link}>Доставка и оплата</Link></li>
            </ul>
          </div>

          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Категории</h3>
            <ul className={styles.list}>
              <li><Link to="/catalog?category=skincare" className={styles.link}>Уход за кожей</Link></li>
              <li><Link to="/catalog?category=makeup" className={styles.link}>Декоративная косметика</Link></li>
              <li><Link to="/catalog?category=masks" className={styles.link}>Маски и патчи</Link></li>
              <li><Link to="/catalog?category=haircare" className={styles.link}>Уход за волосами</Link></li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>© 2025 TOMMY BEAUTY STORE. Все права защищены.</p>
          <div className={styles.badges}>
            <span className={styles.badge}>✓ Оригинальная продукция</span>
            <span className={styles.badge}>✓ Офлайн-магазин</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

