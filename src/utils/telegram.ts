import type { Order } from '../types';
import { formatPrice } from './format';

interface TelegramConfig {
  botToken: string;
  chatId: string;
}

/**
 * Get Telegram configuration from environment variables
 */
function getTelegramConfig(): TelegramConfig | null {
  const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn('Telegram bot token or chat ID not configured');
    return null;
  }

  return { botToken, chatId };
}

/**
 * Format order details for Telegram message
 */
function formatOrderMessage(order: Order): string {
  const items = order.items
    .map((item) => `  • ${item.product.name} × ${item.quantity} = ${formatPrice(item.product.price * item.quantity)}`)
    .join('\n');

  const message = `
🛍️ <b>Новая заявка в магазине!</b>

📋 <b>Номер заказа:</b> ${order.id}

👤 <b>Клиент:</b> ${order.customer.name}
📱 <b>Телефон:</b> ${order.customer.phone}
${order.customer.comment ? `💬 <b>Комментарий:</b> ${order.customer.comment}\n` : ''}
<b>Товары:</b>
${items}

💰 <b>ИТОГО:</b> ${formatPrice(order.total)}

⏰ Дата: ${new Date(order.createdAt).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })}
`.trim();

  return message;
}

/**
 * Send notification to Telegram
 */
export async function sendTelegramNotification(order: Order): Promise<boolean> {
  const config = getTelegramConfig();

  if (!config) {
    console.log('Telegram notifications disabled - missing configuration');
    return false;
  }

  try {
    const message = formatOrderMessage(order);
    const url = `https://api.telegram.org/bot${config.botToken}/sendMessage`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: config.chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Failed to send Telegram notification:', error);
      return false;
    }

    console.log('Telegram notification sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    return false;
  }
}
