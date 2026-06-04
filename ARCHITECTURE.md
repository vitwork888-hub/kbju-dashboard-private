# КБЖУ Дневник - Архитектура

## Обзор системы

```
┌─────────────────────────────────────────┐
│      Telegram Mini App (этот проект)    │
│  ┌─────────────────────────────────────┐│
│  │   React 18 SPA (Vite + TypeScript)  ││
│  │   ┌──────────────────────────────┐  ││
│  │   │  Pages: Dashboard / Profile  │  ││
│  │   │  / Statistics                │  ││
│  │   └──────────────────────────────┘  ││
│  │   ┌──────────────────────────────┐  ││
│  │   │  Context: TelegramContext    │  ││
│  │   │  (userId, WebApp API)        │  ││
│  │   └──────────────────────────────┘  ││
│  └─────────────────────────────────────┘│
│         ▼                       ▼        │
│   Telegram WebApp SDK    GitHub Pages   │
└─────────────────────────────────────────┘
         │                       │
         ▼                       ▼
    ┌──────────────────────────────────────┐
    │    Supabase PostgreSQL Database      │
    │  ┌────────────────────────────────┐  │
    │  │ Public Schema (read-only)      │  │
    │  │  - users (RLS: SELECT own)     │  │
    │  │  - calories (RLS: SELECT own)  │  │
    │  └────────────────────────────────┘  │
    └──────────────────────────────────────┘
         ▲
         │
    ┌──────────────────────────────────────┐
    │   n8n Calorie Tracking Bot (n8n)    │
    │  ┌────────────────────────────────┐  │
    │  │ Telegram → Log Entry → Insert  │  │
    │  │ calories (with auth & AI)      │  │
    │  └────────────────────────────────┘  │
    └──────────────────────────────────────┘
```

## Слои приложения

### 1. **Presentation Layer** (src/components, src/pages)

#### Components:
- `Layout.tsx` — основной контейнер с маршрутизацией
- `BottomNav.tsx` — навигация между 3 экранами

#### Pages:
- `Dashboard.tsx` — суточная статистика с большой диаграммой калорий + КБЖУ
- `Profile.tsx` — параметры пользователя, цель, норма
- `Statistics.tsx` — история за период (7/30 дней) с графиками

### 2. **State Management** (src/context, src/hooks)

#### TelegramContext:
- Инициализирует Telegram WebApp SDK
- Извлекает `userId` из `initDataUnsafe.user`
- Предоставляет контекст всему приложению

```typescript
// Использование:
const { userId, tg, isReady } = useTelegram()
```

### 3. **Integration Layer** (src/lib)

#### telegram.ts:
```typescript
// Инициализация WebApp SDK
initTelegramWebApp()      // ready() + expand()
getTelegramWebApp()       // Доступ к window.Telegram.WebApp
getUserIdFromTelegram()   // Извлечение userId для аутентификации
```

#### supabase.ts:
```typescript
// Supabase клиент с публичными функциями
getUserProfile(userId)    // SELECT * FROM users WHERE user_id = $1
getTodayCalories(userId)  // SELECT * FROM calories WHERE date = today
getStatsForPeriod(userId, days) // История за N дней
```

### 4. **Data Layer** (Supabase)

#### Таблица `users`:
```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE,  -- Telegram ID
  first_name TEXT,
  age INT,
  gender TEXT,  -- 'male' | 'female'
  height INT,   -- см
  weight INT,   -- кг
  goal TEXT,    -- 'cut' | 'bulk' | 'maintain' | 'custom'
  activity TEXT, -- 'act_sedentary' | 'act_light' | ...
  target_k INT, -- суточная норма ккал
  target_p INT, -- норма белков в граммах
  target_f INT, -- норма жиров в граммах
  target_c INT, -- норма углеводов в граммах
  created_at TIMESTAMP
);

-- RLS: Пользователь видит только свои данные
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "select_own_user" ON users
  FOR SELECT USING (user_id = auth.uid());
```

#### Таблица `calories`:
```sql
CREATE TABLE calories (
  id BIGINT PRIMARY KEY,
  user_id BIGINT NOT NULL,  -- Telegram ID
  date DATE,
  note TEXT,  -- Описание блюда/продукта
  amount INT, -- Калории в ккал
  proteins FLOAT,  -- Граммы
  fats FLOAT,      -- Граммы
  carbs FLOAT,     -- Граммы
  created_at TIMESTAMP
);

-- RLS: Пользователь видит только свои записи
ALTER TABLE calories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "select_own_calories" ON calories
  FOR SELECT USING (user_id = auth.uid());
```

## Поток данных

### 1. Инициализация
```
App.tsx
  ↓
TelegramProvider
  ├─ initTelegramWebApp()
  ├─ Извлекает userId из initDataUnsafe
  └─ Предоставляет контекст (TelegramContext)
```

### 2. Загрузка данных Dashboard
```
Dashboard.tsx
  ├─ useTelegram() → userId
  ├─ getUserProfile(userId)  → Supabase
  ├─ getTodayCalories(userId) → Supabase
  └─ Рендерит:
     ├─ Большой круг калорий
     ├─ 3 мини-круга КБЖУ
     └─ Список записей дня
```

### 3. Загрузка данных Profile
```
Profile.tsx
  ├─ useTelegram() → userId
  ├─ getUserProfile(userId)  → Supabase
  └─ Рендерит карточку с профилем
```

### 4. Загрузка данных Statistics
```
Statistics.tsx
  ├─ useTelegram() → userId
  ├─ getStatsForPeriod(userId, days) → Supabase
  ├─ Группирует по датам
  └─ Рендерит временную шкалу с прогрессбарами
```

## Аутентификация

### Механизм:
1. Пользователь открывает Mini App из Telegram бота
2. Telegram передаёт `initData` (подписанный JWT-like пакет с user info)
3. Наш код извлекает `userId` через `window.Telegram.WebApp.initDataUnsafe.user.id`
4. Передаёт `userId` в Supabase запросы
5. Supabase RLS политики проверяют, что `user_id` в таблице = текущему пользователю

### Безопасность:
- **RLS (Row Level Security)** в Supabase гарантирует, что каждый пользователь видит только свои данные
- **Public (anon) ключ** используется, Telegram WebApp SDK передаёт данные внутри `initData`
- **Нет бэкенда** — мини-приложение полностью read-only (данные добавляет только n8n бот)

## Интеграция с n8n ботом

n8n бот (отдельный проект) отвечает за:
- Прослушивание сообщений Telegram
- Добавление записей в таблицу `calories`
- Обновление профиля в таблице `users`
- AI Nutritionist анализ

Наш Mini App просто **читает** данные, которые добавил бот.

## Деплой

### Local Development:
```bash
npm run dev  # Запуск на localhost:5173
```

### Production (GitHub Pages):
1. Push в main → GitHub Actions запускается
2. `npm run build` → Создаёт `dist/` папку
3. `gh-pages` action деплоит `dist/` → GitHub Pages
4. Доступен по URL: `https://vitwork888.github.io/kbju-dashboard-private/`

### GitHub Actions Workflow:
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    - Install dependencies
    - Build (с Supabase env vars)
    - Deploy to gh-pages branch
```

## Future Improvements (Wave 1+)

### Wave 1:
- [ ] Улучшенный Dashboard с красивыми диаграммами (recharts/chart.js)
- [ ] Расширенный список записей с фильтром по типу (завтрак, обед, ужин)
- [ ] Кэширование на клиенте (localStorage)

### Wave 2:
- [ ] Интерактивные графики на Statistics странице
- [ ] Экспорт данных (CSV)
- [ ] Светлая/тёмная тема

### Wave 3:
- [ ] Редактирование/удаление записей (если разрешит n8n)
- [ ] Push уведомления о достижении целей
- [ ] Интеграция с AI Nutritionist (кнопка в Mini App, но логика в боте)
- [ ] E2E тесты

## Зависимости

### Core:
- **react** — UI framework
- **react-dom** — React DOM rendering
- **@supabase/supabase-js** — Supabase client

### Build:
- **vite** — Build tool
- **typescript** — Type safety
- **tailwindcss** — Styling

### Utilities:
- **date-fns** — Date formatting
- **autoprefixer** — CSS prefixes
- **postcss** — CSS processing

## Тестирование

На данный момент нет unit/integration тестов (Wave 3). Тестирование проводится вручную в браузере.

### Как тестировать Mini App локально:
1. Запустить `npm run dev`
2. Открыть http://localhost:5173
3. Проверить что все 3 страницы загружаются (даже без Telegram контекста)
4. В продакшене Mini App откроется из Telegram бота и будет иметь доступ к userId

## Знакомство с кодом

Новичкам рекомендуется начать с:
1. `README.md` (этот файл) — обзор архитектуры
2. `src/App.tsx` — корневой компонент
3. `src/context/TelegramContext.tsx` — управление состоянием
4. `src/lib/supabase.ts` — работа с БД
5. `src/pages/Dashboard.tsx` — главная страница
