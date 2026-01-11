import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Award, 
  ArrowRight,
  MessageCircle,
  Clock,
  Phone,
  Navigation
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useStore } from '../store/useStore';
import { getWhatsAppLink } from '../utils/whatsapp';
import styles from './Home.module.css';

const categories = [
  { id: 'skincare', name: 'Уход за кожей', icon: '✨', description: 'Сыворотки, тонеры, кремы' },
  { id: 'makeup', name: 'Декоративная косметика', icon: '💄', description: 'Помады, тинты, тушь' },
  { id: 'masks', name: 'Маски и патчи', icon: '🎭', description: 'Тканевые маски, патчи' },
  { id: 'haircare', name: 'Уход за волосами', icon: '💇', description: 'Шампуни, маски, сыворотки' },
];

const features = [
  {
    icon: Award,
    title: 'Оригинальная продукция',
    description: 'Только сертифицированная косметика от официальных поставщиков',
  },
  {
    icon: MapPin,
    title: 'Офлайн-магазин в центре Астаны',
    description: 'Приходите посмотреть и протестировать товары вживую',
  },
  {
    icon: Calendar,
    title: 'Бронирование на 24 часа',
    description: 'Зарезервируйте товар и заберите в удобное время',
  },
];

export function Home() {
  const { products } = useStore();
  const hotProducts = products
    .filter((p) => p.inStock && (p.badge === 'hit' || p.rating && p.rating >= 4.7))
    .slice(0, 8);

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.heroGradient} />
          <div className={styles.heroPattern} />
        </div>
        <div className={`container ${styles.heroContent}`}>
          <motion.div
            className={styles.heroText}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className={styles.heroTag}>
              <Sparkles size={16} />
              Korean Beauty
            </span>
            <h1 className={styles.heroTitle}>
              Оригинальная корейская косметика в Астане
            </h1>
            <p className={styles.heroSubtitle}>
              Профессиональный уход для вашей кожи. Лучшие бренды Кореи в одном месте.
            </p>
            <div className={styles.heroActions}>
              <Link to="/catalog" className={styles.primaryBtn}>
                Смотреть каталог
                <ArrowRight size={18} />
              </Link>
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsappBtn}
              >
                <MessageCircle size={18} />
                Связаться в WhatsApp
              </a>
            </div>
            <div className={styles.trustBadges}>
              <span>✓ Оригинальная продукция</span>
              <span>✓ Офлайн-магазин</span>
              <span>✓ Консультация специалиста</span>
            </div>
          </motion.div>
          <motion.div
            className={styles.heroImage}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img
              src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=700&fit=crop"
              alt="Korean cosmetics"
            />
            <div className={styles.heroImageDecor} />
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className={styles.categories}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={styles.sectionTitle}>Категории</h2>
            <p className={styles.sectionSubtitle}>Найдите идеальный уход для себя</p>
          </motion.div>
          <div className={styles.categoryGrid}>
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={`/catalog?category=${category.id}`}
                  className={styles.categoryCard}
                >
                  <span className={styles.categoryIcon}>{category.icon}</span>
                  <h3 className={styles.categoryName}>{category.name}</h3>
                  <p className={styles.categoryDesc}>{category.description}</p>
                  <span className={styles.categoryLink}>
                    Смотреть <ArrowRight size={16} />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hot Products Section */}
      <section className={styles.hotProducts}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={styles.sectionTitle}>
              <span className={styles.fireEmoji}>🔥</span> Хиты продаж
            </h2>
            <Link to="/catalog" className={styles.viewAllLink}>
              Смотреть все <ArrowRight size={16} />
            </Link>
          </motion.div>
          <div className={styles.productsScroll}>
            {hotProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={styles.sectionTitle}>Почему выбирают нас</h2>
          </motion.div>
          <div className={styles.featureGrid}>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className={styles.featureCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={styles.featureIcon}>
                  <feature.icon size={28} />
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDesc}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className={styles.mapSection}>
        <div className="container">
          <motion.div
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={styles.sectionTitle}>Наш магазин</h2>
            <p className={styles.sectionSubtitle}>Приходите за покупками!</p>
          </motion.div>
          <div className={styles.mapContainer}>
            <div className={styles.mapWrapper}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d1000!2d71.401818!3d51.105393!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNTHCsDA2JzE5LjQiTiA3McKwMjQnMDYuNSJF!5e0!3m2!1sru!2skz!4v1704369600000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="TOMMY BEAUTY STORE location"
              />
            </div>
            <motion.div
              className={styles.mapInfo}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className={styles.mapInfoTitle}>TOMMY BEAUTY STORE</h3>
              <ul className={styles.mapInfoList}>
                <li>
                  <MapPin size={20} />
                  <span>ЖК Buqar Jyrau 2, Проспект Туран, 50/5, Астана</span>
                </li>
                <li>
                  <Clock size={20} />
                  <div>
                    <span>Пн — Пт: 09:30 — 23:30</span>
                    <span style={{ display: 'block' }}>Сб — Вс: 10:00 — 23:30</span>
                  </div>
                </li>
                <li>
                  <Phone size={20} />
                  <a href="tel:+77004170411">+7 700 417 04 11</a>
                </li>
              </ul>
              <a
                href="https://go.2gis.com/4yrKQ"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.directionsBtn}
              >
                <Navigation size={18} />
                Построить маршрут
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}

