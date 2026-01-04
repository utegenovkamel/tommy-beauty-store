import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Minus, 
  Plus, 
  ChevronDown, 
  ChevronUp,
  ArrowLeft,
  MessageCircle,
  Check
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatPrice } from '../utils/format';
import { generateWhatsAppLink } from '../utils/whatsapp';
import { ProductCard } from '../components/ProductCard';
import styles from './ProductDetail.module.css';

type AccordionSection = 'description' | 'ingredients' | 'howToUse' | 'delivery';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart, cart, setCartOpen, setOrderFormOpen, brands, fetchBrands } = useStore();
  
  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);
  
  const product = products.find((p) => p.id === Number(id));
  const [quantity, setQuantity] = useState(1);
  const [openSection, setOpenSection] = useState<AccordionSection | null>('description');
  
  const isInCart = cart.some((item) => item.product.id === product?.id);
  
  // Find brand by name or slug
  const productBrand = product?.brand || '';
  const brand = brands.find((b) => b.slug === productBrand || b.name === productBrand);
  const brandSlug = brand?.slug || productBrand;
  const brandName = brand?.name || productBrand;
  
  const relatedProducts = products
    .filter((p) => p.category === product?.category && p.id !== product?.id)
    .slice(0, 6);

  if (!product) {
    return (
      <main className={styles.main}>
        <div className="container">
          <div className={styles.notFound}>
            <h1>Товар не найден</h1>
            <Link to="/catalog" className={styles.backLink}>
              <ArrowLeft size={20} />
              Вернуться в каталог
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setCartOpen(true);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setOrderFormOpen(true);
  };

  const toggleSection = (section: AccordionSection) => {
    setOpenSection(openSection === section ? null : section);
  };

  const accordionSections: { id: AccordionSection; title: string; content: string }[] = [
    {
      id: 'description',
      title: 'Описание',
      content: product.fullDescription || product.description,
    },
    {
      id: 'ingredients',
      title: 'Состав',
      content: product.ingredients || 'Информация о составе уточняется у продавца.',
    },
    {
      id: 'howToUse',
      title: 'Применение',
      content: product.howToUse || 'Способ применения уточняйте у консультанта.',
    },
    {
      id: 'delivery',
      title: 'Доставка',
      content: 'Самовывоз из магазина по адресу: Проспект Туран, 50/5, Астана. Бронирование товара на 24 часа. Для уточнения деталей свяжитесь с нами в WhatsApp.',
    },
  ];

  return (
    <main className={styles.main}>
      <div className="container">
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          <ArrowLeft size={20} />
          Назад
        </button>

        <div className={styles.product}>
          <motion.div
            className={styles.gallery}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className={styles.mainImage}>
              <img src={product.image} alt={product.name} />
              {product.badge && (
                <span className={`${styles.badge} ${styles[product.badge]}`}>
                  {product.badge === 'hit' && 'ХИТ'}
                  {product.badge === 'new' && 'НОВИНКА'}
                  {product.badge === 'sale' && `СКИДКА -${Math.round((1 - product.price / (product.oldPrice || product.price)) * 100)}%`}
                </span>
              )}
            </div>
          </motion.div>

          <motion.div
            className={styles.info}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link 
              to={`/catalog?brand=${brandSlug}`} 
              className={styles.brand}
            >
              {brandName}
            </Link>
            <h1 className={styles.name}>{product.name}</h1>

            <div className={styles.priceBlock}>
              <span className={styles.price}>{formatPrice(product.price)}</span>
              {product.oldPrice && (
                <span className={styles.oldPrice}>{formatPrice(product.oldPrice)}</span>
              )}
            </div>

            <span className={`${styles.availability} ${product.inStock ? styles.inStock : styles.outOfStock}`}>
              {product.inStock 
                ? (product.stockQuantity !== undefined && product.stockQuantity <= 10 
                    ? `✓ Осталось ${product.stockQuantity} шт.` 
                    : '✓ Есть в наличии')
                : 'Под заказ'}
            </span>

            <p className={styles.description}>{product.description}</p>

            <div className={styles.actions}>
              <div className={styles.quantity}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Уменьшить количество"
                >
                  <Minus size={18} />
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Увеличить количество"
                >
                  <Plus size={18} />
                </button>
              </div>

              <button
                className={`${styles.addToCartBtn} ${isInCart ? styles.inCart : ''}`}
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                {isInCart ? (
                  <>
                    <Check size={20} />
                    В корзине
                  </>
                ) : (
                  <>
                    <ShoppingBag size={20} />
                    Добавить в корзину
                  </>
                )}
              </button>
            </div>

            <button
              className={styles.buyNowBtn}
              onClick={handleBuyNow}
              disabled={!product.inStock}
            >
              Купить в 1 клик
            </button>

            <a
              href={generateWhatsAppLink([{ product, quantity }], product.price * quantity)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappBtn}
            >
              <MessageCircle size={20} />
              Спросить в WhatsApp
            </a>

            <div className={styles.accordion}>
              {accordionSections.map((section) => (
                <div key={section.id} className={styles.accordionItem}>
                  <button
                    className={`${styles.accordionHeader} ${openSection === section.id ? styles.open : ''}`}
                    onClick={() => toggleSection(section.id)}
                  >
                    {section.title}
                    {openSection === section.id ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </button>
                  {openSection === section.id && (
                    <motion.div
                      className={styles.accordionContent}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <p>{section.content}</p>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {relatedProducts.length > 0 && (
          <section className={styles.related}>
            <h2 className={styles.relatedTitle}>Похожие товары</h2>
            <div className={styles.relatedGrid}>
              {relatedProducts.map((p, index) => (
                <ProductCard key={p.id} product={p} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

