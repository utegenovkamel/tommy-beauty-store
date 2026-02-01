# Tommy Beauty Store

Интернет-магазин косметики и товаров для красоты.

## Технологии

- React 19
- TypeScript
- Vite
- Supabase (база данных и хранилище файлов)
- Zustand (state management)
- Framer Motion (анимации)
- React Router

## Запуск

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build
```

## Переменные окружения

Создайте файл `.env` в корне проекта на основе `.env.example`:

```bash
cp .env.example .env
```

Обязательные переменные:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Опциональные переменные для Telegram уведомлений:
```
VITE_TELEGRAM_BOT_TOKEN=your_bot_token
VITE_TELEGRAM_CHAT_ID=your_chat_id
```

## Telegram уведомления

Для настройки уведомлений о новых заказах в Telegram, следуйте подробной инструкции в файле [TELEGRAM_SETUP.md](TELEGRAM_SETUP.md).

Возможности:
- Мгновенные уведомления о новых заявках
- Детальная информация о заказе (товары, клиент, сумма)
- Поддержка личных и групповых чатов
- Полностью опционально - магазин работает и без Telegram
