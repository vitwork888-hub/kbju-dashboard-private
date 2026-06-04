# Quick Start

## 🚀 Это всё готово!

Wave 0 проекта **полностью завершён**. Все файлы созданы, скомпилированы и готовы к использованию.

## 📦 Что было создано

- 24 файла конфигурации и исходного кода
- 3 React страницы (Dashboard, Profile, Statistics)
- Интеграция с Telegram WebApp SDK
- Интеграция с Supabase
- GitHub Pages CI/CD workflow
- Полная документация (README, ARCHITECTURE, SPECIFICATION, DEPLOY)

## ⚡ Быстрый старт (5 минут)

### 1. Установить зависимости
```bash
cd /Users/vit888/Desktop/WORK/kbju-dashboard-private
npm install
```

### 2. Запустить локально
```bash
npm run dev
# Откроется http://localhost:5173
```

### 3. Сделать push на GitHub
```bash
# Сначала создать репозиторий на https://github.com/new
# Имя: kbju-dashboard-private
# Затем:
git push -u origin main
```

### 4. Включить GitHub Pages
- Settings → Pages → Deploy from branch → gh-pages

## 📚 Документация

Читайте в этом порядке:

1. **[WAVE0.md](./WAVE0.md)** ← Начни отсюда! Сводка по волне 0
2. **[README.md](./README.md)** ← Как установить и запустить
3. **[ARCHITECTURE.md](./ARCHITECTURE.md)** ← Как это работает
4. **[SPECIFICATION.md](./SPECIFICATION.md)** ← Требования и фичи
5. **[DEPLOY.md](./DEPLOY.md)** ← Как залить на GitHub Pages

## 🎯 Основные компоненты

### Pages
- **Dashboard** (`src/pages/Dashboard.tsx`) — калории за день
- **Profile** (`src/pages/Profile.tsx`) — профиль пользователя
- **Statistics** (`src/pages/Statistics.tsx`) — история питания

### Интеграция
- **Telegram** (`src/lib/telegram.ts`) — WebApp SDK
- **Supabase** (`src/lib/supabase.ts`) — база данных

### UI
- **Layout** (`src/components/Layout.tsx`) — контейнер + маршрутизация
- **BottomNav** (`src/components/BottomNav.tsx`) — навигация

## 🔧 Команды

```bash
# Разработка
npm run dev          # Dev сервер на :5173

# Сборка
npm run build        # Продакшен сборка в dist/
npm run preview      # Preview продакшена

# Другое
npm run type-check   # TypeScript проверка
npm install          # Установка зависимостей
```

## 🎨 Design System

- **Primary:** #10b981 (Emerald Green) ← Основной цвет
- **Secondary:** #3b82f6 (Blue) ← Вторичный
- **Proteins:** #ec4899 (Pink) ← Белки
- **Fats:** #f59e0b (Amber) ← Жиры
- **Carbs:** #3b82f6 (Blue) ← Углеводы

Все цвета настроены в `tailwind.config.js`

## 📊 Data Model

Две таблицы Supabase:

### Users
```
user_id (Telegram ID)
first_name, age, gender, height, weight
goal (cut/bulk/maintain)
activity (sedentary/light/moderate/heavy)
target_k, target_p, target_f, target_c
```

### Calories
```
user_id (Telegram ID)
date, note, amount
proteins, fats, carbs
```

## 🔐 Secrets (для GitHub Actions)

Нужно добавить в Settings → Secrets:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

## ✅ Следующие шаги

### Для локального тестирования:
1. `npm install`
2. `npm run dev`
3. Открыть http://localhost:5173

### Для GitHub:
1. Создать репозиторий на GitHub
2. `git push -u origin main`
3. Включить GitHub Pages

### Для использования в Telegram:
1. Добавить web_app кнопку в n8n бот
2. Ссылка на мини-приложение:
   ```
   https://vitwork888.github.io/kbju-dashboard-private/
   ```

## 🎓 Где найти код

```
src/
├── pages/        ← Три главные страницы (Dashboard, Profile, Stats)
├── lib/          ← Интеграция с Telegram + Supabase
├── components/   ← Переиспользуемые UI компоненты
├── context/      ← React Context для состояния
└── styles/       ← CSS (Tailwind)
```

Пример: как загрузить данные:
```typescript
import { useTelegram } from '../context/TelegramContext'
import { getUserProfile } from '../lib/supabase'

export default function MyComponent() {
  const { userId } = useTelegram()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (!userId) return
    getUserProfile(userId).then(setProfile)
  }, [userId])

  return <div>{profile?.first_name}</div>
}
```

## 🔗 Важные ссылки

- [Telegram Mini Apps API](https://core.telegram.org/bots/webapps)
- [Supabase RLS Docs](https://supabase.com/docs/guides/auth/row-level-security)
- [React 18 Docs](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite Docs](https://vitejs.dev/)

## 💬 Контакт

Email: vitwork888@gmail.com

---

**Готово к разработке! Удачи! 🚀**

Начни с `npm install && npm run dev` 👉
