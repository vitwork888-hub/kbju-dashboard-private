# КБЖУ Дневник - Спецификация

## Обзор проекта

**Название:** КБЖУ Дневник  
**Тип:** Telegram Mini App (Web App встроенное в Telegram)  
**Версия:** 1.0.0  
**Статус:** Wave 0 (Foundational)

## Цель проекта

Создать веб-интерфейс для отслеживания питания пользователей прямо в Telegram. Mini App служит **read-only дашбордом** для данных, собираемых n8n ботом. Позволяет пользователям в один клик увидеть:
- Суточные калории и макронутриенты
- Профиль с целями и нормами
- Историю питания за период

## Требования

### Функциональные требования

#### FR1: Аутентификация через Telegram
- [ ] Mini App получает `userId` из `window.Telegram.WebApp.initDataUnsafe`
- [ ] Пользователь автоматически аутентифицируется без логина/пароля
- [ ] Данные изолированы по user_id благодаря RLS в Supabase

#### FR2: Dashboard (главный экран)
- [ ] Показывает калории за текущий день (большой круг)
- [ ] Отображает прогресс к суточной норме (процент)
- [ ] Показывает 3 мини-круга КБЖУ (белки, жиры, углеводы)
- [ ] Показывает список записей за день с деталями
- [ ] Автоматически загружает данные при открытии

#### FR3: Profile (профиль пользователя)
- [ ] Отображает основные параметры (возраст, пол, рост, вес)
- [ ] Показывает цель питания (похудение, набор массы, поддержание)
- [ ] Показывает уровень активности
- [ ] Показывает дневную норму калорий и КБЖУ
- [ ] Read-only (редактирование только в боте)

#### FR4: Statistics (статистика)
- [ ] Переключение между 7 и 30 днями
- [ ] Показывает среднее ккал в день
- [ ] Временная шкала с прогрессбарами по датам
- [ ] Показывает КБЖУ для каждого дня

#### FR5: Navigation (навигация)
- [ ] Нижняя навигационная панель с 3 кнопками
- [ ] Переключение между Dashboard / Profile / Statistics
- [ ] Визуальное выделение активной страницы
- [ ] Иконки для быстрого распознавания

#### FR6: Интеграция с n8n ботом
- [ ] Получение данных из Supabase (общей БД с ботом)
- [ ] Синхронизация в реальном времени (обновления при перезагрузке)
- [ ] Кнопка "AI Nutritionist" редиректит в бот (обратно в Telegram)

### Нефункциональные требования

#### NFR1: Производительность
- [ ] Загрузка страницы < 2 секунд на 3G
- [ ] Плавные переходы между страницами
- [ ] Кэширование данных на клиенте (в Wave 2)

#### NFR2: Безопасность
- [ ] HTTPS (GitHub Pages автоматически)
- [ ] RLS политики в Supabase (каждый видит свои данные)
- [ ] Нет хранения сенсетивных данных на клиенте
- [ ] Aнон ключ Supabase безопасен (RLS защита)

#### NFR3: Совместимость
- [ ] Работает в Telegram Web App (iOS, Android, Web)
- [ ] Responsive дизайн (мобильные устройства)
- [ ] Поддержка темы Telegram (светлая/тёмная)

#### NFR4: Масштабируемость
- [ ] Используется Supabase (автоматическое масштабирование)
- [ ] GitHub Pages (бесплатное, неограниченный трафик)
- [ ] Нет бэкенда (всё работает на фронте)

## Дизайн

### Color Palette (Easy Fit inspired)
```
Primary:    #10b981 (Emerald Green)
Secondary:  #3b82f6 (Blue)
Accent P:   #ec4899 (Pink) - Proteins
Accent F:   #f59e0b (Amber) - Fats
Accent C:   #3b82f6 (Blue)  - Carbs
Background: #f8fafc (Slate)
Text:       #1e293b (Dark slate)
```

### Макеты

#### Dashboard
```
┌─────────────────────────┐
│   КБЖУ Дневник          │  ← Header
│   Среда, 4 июня         │
├─────────────────────────┤
│                         │
│        ╭─────╮          │  ← Large calorie circle
│        │ 1850│          │    (gradient green→blue)
│        │/2000│          │
│        ╰─────╯          │
│                         │
├─────────────────────────┤
│  P 45г   F 65g  C 230g  │  ← 3 small macro circles
├─────────────────────────┤
│ Сегодняшние записи      │  ← Entries list
│ ┌─────────────────────┐ │
│ │ Яйца 2шт  150 ккал │ │
│ │ П:12г Ж:10г У:2г   │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ Рис 150g  450 ккал │ │
│ │ П:8g Ж:2g У:95g   │ │
│ └─────────────────────┘ │
├─────────────────────────┤
│ [📊 Дневник] [👤 Проф] [📈 Статистика] │  ← Bottom nav
└─────────────────────────┘
```

#### Profile
```
┌─────────────────────────┐
│ Мой профиль             │
├─────────────────────────┤
│ ┌─────────────────────┐ │
│ │ Иван                │ │  ← Profile card (green gradient)
│ │ Возраст: 28 лет    │ │
│ │ Пол: М              │ │
│ │ Рост: 180см Вес: 85kg│ │
│ └─────────────────────┘ │
├─────────────────────────┤
│ Цель и норма            │
│ Цель: 📉 Похудение     │
│ Норма: 2000 ккал/день  │
│ Б: 150г  Ж: 70g  У: 250g│
├─────────────────────────┤
│ Активность              │
│ 🏃 Умеренная активность│
└─────────────────────────┘
```

#### Statistics
```
┌─────────────────────────┐
│ Статистика              │
│ [7 дней] [30 дней]      │  ← Toggle buttons
├─────────────────────────┤
│ Среднее в день: 1850    │  ← Summary card
│ на основе 7 дней        │
├─────────────────────────┤
│ Ср, 4 июня              │  ← Timeline
│ 1850 ккал 92%           │
│ ████████░ prog bar      │
│ Б: 45г  Ж: 65g  У: 230g│
│                         │
│ Вт, 3 июня              │
│ 1920 ккал 96%           │
│ ████████░ prog bar      │
│ Б: 48g  Ж: 68g  У: 240g│
└─────────────────────────┘
```

## Технологическая архитектура

### Frontend Stack
- **Framework:** React 18 (TypeScript)
- **Build:** Vite
- **Styling:** Tailwind CSS
- **State:** React Context
- **DB Client:** @supabase/supabase-js

### Backend/Data
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Telegram WebApp + RLS
- **Hosting:** GitHub Pages (static)

### CI/CD
- **VCS:** GitHub
- **Actions:** Automated build & deploy on push

## Data Model

### Users Table
```typescript
interface User {
  id: bigint
  user_id: bigint              // Telegram ID (unique)
  first_name: string
  age: int
  gender: 'male' | 'female'
  height: int                  // cm
  weight: int                  // kg
  goal: 'cut' | 'bulk' | 'maintain' | 'custom'
  activity: 'act_sedentary' | 'act_light' | 'act_moderate' | 'act_heavy'
  target_k: int               // Daily kcal target
  target_p: int               // Protein grams
  target_f: int               // Fat grams
  target_c: int               // Carbs grams
  created_at: timestamp
}
```

### Calories Table
```typescript
interface CalorieEntry {
  id: bigint
  user_id: bigint              // FK to users.user_id
  date: date
  note: string                 // Food description
  amount: int                  // Kilocalories
  proteins: float              // Grams
  fats: float                  // Grams
  carbs: float                 // Grams
  created_at: timestamp
}
```

## Development Roadmap

### Wave 0 (Foundational) ✅ DONE
- [x] Project setup (Vite, TypeScript, Tailwind)
- [x] Telegram WebApp integration
- [x] Supabase client setup
- [x] Context provider (TelegramContext)
- [x] Three pages: Dashboard, Profile, Statistics
- [x] Bottom navigation
- [x] GitHub Actions workflow

### Wave 1 (Enhanced UI)
- [ ] Beautiful calorie & macro circles with animations
- [ ] Advanced food diary list (meal categories, search)
- [ ] Improved styling with shadows, gradients, spacing
- [ ] Skeleton loading states
- [ ] Error boundaries

### Wave 2 (Data & Analytics)
- [ ] Charts on Statistics page (recharts library)
- [ ] Date range picker
- [ ] Export to CSV
- [ ] Data trends analysis
- [ ] Light/dark theme toggle

### Wave 3 (Polish & Integration)
- [ ] Bot integration (AI Nutritionist button)
- [ ] Push notifications
- [ ] Offline mode (localStorage cache)
- [ ] Unit & E2E tests
- [ ] Performance optimization
- [ ] Accessibility improvements

## Success Criteria

### For Wave 0:
- [x] Project compiles without errors
- [x] All three pages render correctly
- [x] Navigation between pages works
- [x] Supabase connection is configured
- [x] Telegram WebApp SDK is integrated
- [x] GitHub Actions workflow is set up
- [x] README & documentation are complete
- [x] Code is committed to GitHub

### For Wave 1:
- [ ] Dashboard shows real data with nice circles
- [ ] Profile loads user data correctly
- [ ] Statistics shows data timeline
- [ ] Loading states are visually clear
- [ ] No console errors in dev tools

### For Wave 2:
- [ ] Charts display correctly
- [ ] Data export works
- [ ] Theme toggle works
- [ ] Mobile responsive on all screen sizes

### For Wave 3:
- [ ] Unit test coverage > 70%
- [ ] E2E tests pass
- [ ] Lighthouse score > 80
- [ ] Zero accessibility violations

## Known Limitations

1. **Read-only app** — No food entry in Mini App (only in bot)
2. **No offline support** — Requires internet to fetch data (Wave 3)
3. **No caching yet** — Data refetches on every page load (Wave 2)
4. **No export** — Can't export data yet (Wave 2)
5. **No push notifications** — Planned for Wave 3

## Testing Strategy

### Manual Testing (Wave 0):
- [ ] Test in Telegram Web
- [ ] Test in Telegram Mobile (iOS/Android via deeplink)
- [ ] Test responsive on different screen sizes
- [ ] Test with real Supabase data

### Automated Testing (Wave 2+):
- [ ] Unit tests (Jest)
- [ ] E2E tests (Playwright)
- [ ] Visual regression tests
- [ ] Performance tests (Lighthouse)

## Deployment

### Development:
```bash
npm run dev  # http://localhost:5173
```

### Staging (GitHub Pages branch):
```bash
git push origin main  # Triggers GitHub Actions
```

### Production:
- Same as staging (GitHub Pages is production)
- URL: https://vitwork888.github.io/kbju-dashboard-private/

## Support & Maintenance

### Reporting Issues:
- Create GitHub issue with:
  - Device & browser info
  - Steps to reproduce
  - Screenshot/video
  - Console errors

### Security Updates:
- Supabase security patches (auto)
- Dependencies: `npm audit`

### Documentation:
- Keep README.md updated
- Keep ARCHITECTURE.md updated
- Add CHANGELOG.md after Wave 1

## References

- [Telegram Mini Apps Guide](https://core.telegram.org/bots/webapps)
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React 18 Docs](https://react.dev/)
