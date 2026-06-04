# КБЖУ Дневник - Telegram Mini App

Веб-приложение для отслеживания питания прямо в Telegram.

## 🚀 Основные возможности

- **Dashboard** — суточный калории и КБЖУ на большой круговой диаграмме (Easy Fit стиль)
- **Profile** — просмотр профиля с целью, нормой калорий и параметрами
- **Statistics** — история питания за 7/30 дней с графиками
- **Telegram Integration** — полная интеграция с Telegram WebApp API для аутентификации
- **Supabase** — чтение данных из БД с RLS политиками по user_id

## 🛠 Технологический стек

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS с Easy Fit color scheme (green→blue gradient)
- **Backend:** Supabase (PostgreSQL + RLS)
- **Hosting:** GitHub Pages (static)
- **CI/CD:** GitHub Actions

## 📋 Требования

- Node.js 20+
- npm или yarn
- Аккаунт Supabase с таблицами `users`, `calories`

## 🔧 Установка

```bash
# Клонируем репозиторий
git clone https://github.com/vitwork888/kbju-dashboard-private.git
cd kbju-dashboard-private

# Установим зависимости
npm install

# Создаём .env.local (скопируем .env.example и заполним)
cp .env.example .env.local
```

Заполните `.env.local`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 🏃 Разработка

```bash
# Запуск dev сервера на http://localhost:5173
npm run dev

# Build для продакшена
npm run build

# Preview production build
npm run preview
```

## 📁 Структура проекта

```
src/
├── components/        # React компоненты (Layout, BottomNav)
├── pages/            # Страницы приложения (Dashboard, Profile, Statistics)
├── lib/              # Утилиты (Telegram SDK, Supabase клиент)
├── context/          # React Context (TelegramContext)
├── hooks/            # Custom React hooks
├── styles/           # CSS (Tailwind)
├── App.tsx           # Root компонент
└── main.tsx          # Entry point

public/
└── index.html        # HTML с Telegram WebApp SDK script tag
```

## 🚢 Деплой

На каждый push в main ветку:
1. GitHub Actions запускает `npm run build`
2. Результат из `dist/` деплоится на GitHub Pages
3. Доступен по адресу: https://vitwork888.github.io/kbju-dashboard-private/

### Настройка GitHub Pages

1. Перейти в Settings → Pages
2. Выбрать `Deploy from a branch`
3. Выбрать ветку `gh-pages`
4. Сохранить

## 🔐 Переменные окружения

В GitHub Actions нужно добавить secrets:
- `VITE_SUPABASE_URL` — URL вашего Supabase проекта
- `VITE_SUPABASE_ANON_KEY` — анон ключ для публичного доступа

Settings → Secrets and variables → Actions → New repository secret

## 📱 Использование как Telegram Mini App

Добавьте кнопку в Telegram бота:
```javascript
const webAppUrl = 'https://vitwork888.github.io/kbju-dashboard-private/';

// В клавиатуре бота:
{
  text: 'Открыть дневник',
  web_app: {
    url: webAppUrl
  }
}
```

При открытии Mini App получит данные текущего пользователя через `window.Telegram.WebApp.initDataUnsafe.user`.

## 🎨 Design System

Используется Easy Fit inspired цветовая схема:
- **Primary Green:** #10b981
- **Secondary Blue:** #3b82f6
- **Accent Pink (Proteins):** #ec4899
- **Accent Amber (Fats):** #f59e0b
- **Accent Blue (Carbs):** #3b82f6

## 📊 Wave структура разработки

- **Wave 0:** Foundational setup (config, lib, pages, components) ✅
- **Wave 1:** Enhanced Dashboard (CalorieCircle, MacroCircles, FoodDiary list)
- **Wave 2:** Profile & Stats improvements (charts, date ranges)
- **Wave 3:** Bot integration, E2E testing, performance optimization

## 🔗 Связанные проекты

- **n8n Bot:** https://github.com/vitwork888/kbju-bot — основной бот на n8n, добавляет записи в БД
- **Supabase:** Общая БД для бота и Mini App

## 📝 Лицензия

Private repository. 2026 VIT.
