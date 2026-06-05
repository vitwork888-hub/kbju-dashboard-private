# 🥗 KBZU Diary — Telegram Mini App

A sleek web app for tracking calories and macros directly inside Telegram.

## 🚀 Features

- **Dashboard** — Daily calorie & macro totals with circular progress chart (Easy Fit style)
- **Profile** — View your profile, goals, calorie target, and body metrics
- **Statistics** — 7 & 30-day nutrition history with trend charts
- **Telegram Integration** — Seamless integration with Telegram WebApp API for authentication
- **Supabase** — Secure database with row-level security (RLS) per user

## 🛠 Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS with Easy Fit color scheme (green → blue gradient)
- **Backend:** Supabase (PostgreSQL + Row-Level Security)
- **Hosting:** GitHub Pages (static deployment)
- **CI/CD:** GitHub Actions (automated builds)

## 📋 Requirements

- Node.js 20+
- npm or yarn
- Supabase account with `users` and `calories` tables configured

## 🔧 Installation

```bash
# Clone the repository
git clone https://github.com/vitwork888-hub/kbju-dashboard-private.git
cd kbju-dashboard-private

# Install dependencies
npm install

# Create .env.local file (copy from .env.example and fill in values)
cp .env.example .env.local
```

Fill in your `.env.local`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

## 🏃 Development

```bash
# Start dev server at http://localhost:5173
npm run dev

# Build for production
npm run build

# Preview the production build locally
npm run preview
```

## 📁 Project Structure

```
src/
├── components/        # React components (Layout, BottomNav, etc)
├── pages/            # App pages (Dashboard, Profile, Statistics)
├── lib/              # Utilities (Telegram SDK, Supabase client)
├── context/          # React Context (TelegramContext)
├── hooks/            # Custom React hooks
├── styles/           # Tailwind CSS styles
├── App.tsx           # Root component
└── main.tsx          # App entry point

public/
└── index.html        # HTML with Telegram WebApp SDK script
```

## 🚢 Deployment

On every push to main branch:
1. GitHub Actions runs `npm run build`
2. Build output from `dist/` is deployed to GitHub Pages
3. Live at: https://vitwork888-hub.github.io/kbju-dashboard-private/

### GitHub Pages Setup

1. Go to Settings → Pages
2. Select "Deploy from a branch"
3. Choose `gh-pages` branch
4. Save

## 🔐 Environment Variables

Add these secrets to GitHub Actions:
- `VITE_SUPABASE_URL` — Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Public anonymous API key

Go to: Settings → Secrets and variables → Actions → New repository secret

## 📱 Using as Telegram Mini App

Add a button to your Telegram bot:
```javascript
const webAppUrl = 'https://vitwork888-hub.github.io/kbju-dashboard-private/';

// In your bot's keyboard:
{
  text: 'Open Diary',
  web_app: {
    url: webAppUrl
  }
}
```

When opened, the Mini App receives user data via `window.Telegram.WebApp.initDataUnsafe.user`.

## 🎨 Design System

Easy Fit inspired color scheme:
- **Primary Green:** #10b981
- **Secondary Blue:** #3b82f6
- **Accent Pink (Proteins):** #ec4899
- **Accent Amber (Fats):** #f59e0b
- **Accent Blue (Carbs):** #3b82f6

## 📊 Development Waves

- **Wave 0:** Foundational setup (config, lib, pages, components) ✅
- **Wave 1:** Enhanced Dashboard (CalorieCircle, MacroCircles, FoodDiary list)
- **Wave 2:** Profile & Stats improvements (charts, date ranges)
- **Wave 3:** Bot integration, E2E testing, performance optimization

## 🔗 Related Projects

- **[KBZU Bot](https://github.com/vitwork888-hub/kbju-bot)** — Main n8n bot that logs food entries to the database
- **[Supabase](https://supabase.com)** — Shared database for bot & Mini App

## 📝 License

Private repository. 2026 © VIT
