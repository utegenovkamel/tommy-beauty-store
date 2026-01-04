import { motion } from 'framer-motion';
import { Award, Heart, Users, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './About.module.css';

const values = [
  {
    icon: Award,
    title: 'Оригинальность',
    description: 'Мы работаем только с официальными поставщиками и гарантируем подлинность каждого продукта.',
  },
  {
    icon: Heart,
    title: 'Забота о клиентах',
    description: 'Индивидуальный подход к каждому покупателю. Поможем подобрать уход именно для вашей кожи.',
  },
  {
    icon: Users,
    title: 'Экспертность',
    description: 'Наши консультанты проходят обучение по корейской косметике и всегда готовы помочь.',
  },
  {
    icon: Sparkles,
    title: 'Качество',
    description: 'Тщательно отбираем бренды и продукты, представляя только лучшее из мира K-beauty.',
  },
];

export function About() {
  return (
    <main className={styles.main}>
      <div className="container">
        <motion.div
          className={styles.hero}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className={styles.title}>О нас</h1>
          <p className={styles.subtitle}>
            TOMMY BEAUTY STORE — ваш проводник в мир корейской косметики в Астане
          </p>
        </motion.div>

        <div className={styles.content}>
          <motion.div
            className={styles.story}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className={styles.storyImage}>
              <img
                src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop"
                alt="Korean cosmetics"
              />
            </div>
            <div className={styles.storyText}>
              <h2>Наша история</h2>
              <p>
                TOMMY BEAUTY STORE был основан из любви к корейской косметике и желания 
                поделиться лучшими продуктами K-beauty с жителями Астаны.
              </p>
              <p>
                Мы лично отбираем каждый бренд и продукт в нашем магазине, тестируем 
                новинки и следим за трендами корейской индустрии красоты, чтобы предложить 
                вам только самое лучшее.
              </p>
              <p>
                Наш офлайн-магазин — это уютное пространство, где вы можете не только 
                приобрести косметику, но и получить профессиональную консультацию, 
                протестировать продукты и узнать больше о корейских ритуалах ухода за кожей.
              </p>
            </div>
          </motion.div>

          <section className={styles.values}>
            <motion.h2
              className={styles.sectionTitle}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Наши ценности
            </motion.h2>
            <div className={styles.valuesGrid}>
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  className={styles.valueCard}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className={styles.valueIcon}>
                    <value.icon size={28} />
                  </div>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          <motion.section
            className={styles.cta}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Приходите к нам!</h2>
            <p>
              Мы всегда рады видеть вас в нашем магазине. Приходите за покупками, 
              консультацией или просто познакомиться с миром корейской косметики.
            </p>
            <div className={styles.ctaActions}>
              <Link to="/catalog" className={styles.primaryBtn}>
                Смотреть каталог
              </Link>
              <Link to="/contacts" className={styles.secondaryBtn}>
                Как нас найти
              </Link>
            </div>
          </motion.section>
        </div>
      </div>
    </main>
  );
}

