import type { CartItem } from '../types';
import { formatPrice } from './format';

const WHATSAPP_NUMBER = '77004170411';

export function generateWhatsAppLink(cart: CartItem[], total: number): string {
  let message: string;

  if (cart.length === 0) {
    message = 'Здравствуйте! Интересует корейская косметика.';
  } else {
    const items = cart
      .map((item) => `${item.product.name} - ${item.quantity} шт.`)
      .join('\n');
    
    message = `Здравствуйте! Меня интересуют:

${items}

Итого: ${formatPrice(total)}

Когда можно приехать посмотреть?`;
  }

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppLink(): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Здравствуйте! Интересует корейская косметика.')}`;
}

