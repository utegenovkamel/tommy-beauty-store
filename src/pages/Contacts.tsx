import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, MessageCircle, Navigation, Instagram, Send } from 'lucide-react';
import { getWhatsAppLink } from '../utils/whatsapp';
import styles from './Contacts.module.css';

export function Contacts() {
  return (
    <main className={styles.main}>
      <div className="container">
        <motion.div
          className={styles.hero}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className={styles.title}>Контакты</h1>
          <p className={styles.subtitle}>
            Приходите в наш магазин или свяжитесь с нами любым удобным способом
          </p>
        </motion.div>

        <div className={styles.content}>
          <motion.div
            className={styles.info}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className={styles.infoCard}>
              <h2 className={styles.cardTitle}>TOMMY BEAUTY STORE</h2>
              
              <ul className={styles.contactList}>
                <li>
                  <MapPin size={22} />
                  <div>
                    <strong>Адрес</strong>
                    <span>ЖК Buqar Jyrau 2, Проспект Туран, 50/5, Астана</span>
                  </div>
                </li>
                <li>
                  <Phone size={22} />
                  <div>
                    <strong>Телефон / WhatsApp</strong>
                    <a href="tel:+77004170411">+7 700 417 04 11</a>
                  </div>
                </li>
                <li>
                  <Clock size={22} />
                  <div>
                    <strong>Часы работы</strong>
                    <span>Пн — Пт: 09:30 — 23:30</span>
                    <span>Сб — Вс: 10:00 — 23:30</span>
                  </div>
                </li>
              </ul>

              <div className={styles.actions}>
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.whatsappBtn}
                >
                  <MessageCircle size={20} />
                  Написать в WhatsApp
                </a>
                <a
                  href="https://go.2gis.com/4yrKQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.directionsBtn}
                >
                  <Navigation size={20} />
                  Открыть в 2GIS
                </a>
              </div>

              <div className={styles.social}>
                <span>Мы в соцсетях:</span>
                <div className={styles.socialLinks}>
                  <a href="https://www.instagram.com/tommybeauty.store" target="_blank" rel="noopener noreferrer">
                    <Instagram size={22} />
                  </a>
                  <a href="https://t.me/tommybeautystore" target="_blank" rel="noopener noreferrer">
                    <Send size={22} />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className={styles.map}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d1000!2d71.401818!3d51.105393!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNTHCsDA2JzE5LjQiTiA3McKwMjQnMDYuNSJF!5e0!3m2!1sru!2skz!4v1704369600000"
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: '16px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="TOMMY BEAUTY STORE location"
            />
          </motion.div>
        </div>

        <motion.section
          className={styles.faq}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className={styles.faqTitle}>Часто задаваемые вопросы</h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <h3>Как забронировать товар?</h3>
              <p>
                Напишите нам в WhatsApp или оформите заявку на сайте. Мы забронируем 
                товар на 24 часа, чтобы вы могли приехать и забрать его.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3>Есть ли доставка?</h3>
              <p>
                Мы работаем как офлайн-магазин с самовывозом. Это позволяет вам 
                увидеть товар вживую и получить консультацию специалиста.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3>Как убедиться в оригинальности?</h3>
              <p>
                Вся наша продукция поставляется от официальных дистрибьюторов. 
                Мы предоставляем гарантию подлинности на каждый товар.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3>Можно ли вернуть товар?</h3>
              <p>
                Да, вы можете вернуть неиспользованный товар в течение 14 дней 
                при сохранении упаковки и товарного вида.
              </p>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}

