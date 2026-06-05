# 📁 KBZU Project — Complete Structure

Full overview of the KBZU project structure, both bot and mini-app.

---

## Project Overview

**KBZU** is a complete calorie tracking system with:
- **Bot:** n8n-powered Telegram bot for food logging & AI coaching
- **Mini App:** React web app showing dashboard & stats
- **Database:** Shared Supabase instance
- **Design:** Stitch design system (Google)

---

## Directory Structure

```
project/
│
├── 📚 DOCUMENTATION (You are here)
│   ├── BOT_DOCS_INDEX.md          ← Start here for bot docs
│   ├── BOT_OVERVIEW.md            ← Bot features & architecture
│   ├── BOT_SETUP.md               ← How to deploy bot
│   ├── BOT_API_REFERENCE.md       ← Bot API details
│   ├── PROJECT_STRUCTURE.md       ← This file
│   └── README.md                  ← Mini App overview
│
├── 🤖 BOT (n8n Workflow)
│   └── workflows/
│       └── kbju-v5.1-nutrition-v1.0.json
│           ├── Food logging nodes
│           ├── Photo recognition nodes
│           ├── AI nutritionist nodes
│           ├── Database integration
│           └── User management
│
├── 🎨 MINI APP (React)
│   ├── src/
│   │   ├── components/            # React components
│   │   │   ├── Layout.tsx
│   │   │   ├── BottomNav.tsx
│   │   │   └── ...
│   │   ├── pages/                # App pages
│   │   │   ├── Dashboard.tsx      # Main page (calories, macros)
│   │   │   ├── Profile.tsx        # User profile
│   │   │   ├── Statistics.tsx     # Trends & history
│   │   │   └── ...
│   │   ├── lib/                  # Utilities
│   │   │   ├── supabase.ts       # DB client
│   │   │   ├── telegram.ts       # Telegram SDK
│   │   │   └── ...
│   │   ├── context/              # React Context
│   │   │   └── TelegramContext.tsx
│   │   ├── hooks/                # Custom hooks
│   │   ├── styles/               # Tailwind CSS
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── public/
│   │   ├── index.html            # Telegram SDK script tag
│   │   └── ...
│   │
│   ├── package.json              # Dependencies
│   ├── vite.config.ts            # Vite config
│   ├── tailwind.config.js        # Tailwind config
│   ├── tsconfig.json             # TypeScript config
│   └── .env.example              # Environment template
│
├── 🗄️ DATABASE (Supabase)
│   ├── users                     # User profiles
│   ├── food_entries              # Food logs
│   ├── chat_history              # AI chat logs
│   └── daily_summaries           # Performance cache
│
├── 🎨 DESIGN (Stitch)
│   ├── Colors & Palette          # Easy Fit theme
│   ├── Typography                # Fonts & sizes
│   ├── Components                # UI kit
│   └── Effects                   # Shadows, gradients
│
└── ⚙️ DEPLOYMENT
    ├── GitHub Pages (Mini App)
    ├── n8n Cloud (Bot)
    ├── Supabase (Database)
    └── Telegram (Messaging)
```

---

## Component Breakdown

### 🤖 Bot (n8n Workflow)

**Location:** `/workflows/kbju-v5.1-nutrition-v1.0.json`

**Main Components:**
- **Entry Point:** Telegram webhook receiver
- **Food Logging:** Text parsing → DeepSeek → DB store
- **Photo Recognition:** Image download → GPT-4o-mini → DB store
- **Calculation:** TDEE, macro splits, totals
- **AI Nutritionist:** Context gathering → DeepSeek → Response
- **Daily Reports:** Scheduled → Calculate → Send to users
- **User Management:** Onboarding, profile updates

**Technologies:**
- n8n (workflow orchestration)
- Telegram Bot API
- DeepSeek API (text)
- OpenAI API (vision)
- Supabase (database)

---

### 🎨 Mini App (React)

**Location:** `/src/`

**Main Pages:**

#### Dashboard (`pages/Dashboard.tsx`)
- Shows daily calorie progress (circular chart)
- Macro breakdown (P/F/C)
- Today's food entries
- Quick add button

#### Profile (`pages/Profile.tsx`)
- User metrics (gender, age, height, weight, activity)
- Daily calorie goal
- Target macros
- Edit button

#### Statistics (`pages/Statistics.tsx`)
- 7/30-day trend graphs
- Daily averages
- Weekly progress
- Calorie history

#### Components (`components/`)
- **Layout:** Main layout wrapper
- **BottomNav:** Navigation tabs
- **CalorieCircle:** Circular progress chart
- **MacroCircles:** Individual macro meters
- **FoodDiary:** List of today's entries
- **Charts:** Trend visualization

**Technologies:**
- React 18 + TypeScript
- Vite (bundler)
- Tailwind CSS (styling)
- Supabase (database client)
- Telegram WebApp API (auth)

---

### 🗄️ Database (Supabase)

**Tables:**

#### `users`
```sql
id                   UUID (primary key)
telegram_id          INTEGER (unique)
first_name           TEXT
username             TEXT
gender               TEXT
age                  INTEGER
height               INTEGER (cm)
weight               INTEGER (kg)
activity_level       TEXT
daily_calorie_goal   INTEGER
created_at           TIMESTAMP
```

#### `food_entries`
```sql
id                   UUID (primary key)
user_id              UUID (foreign key → users)
food_name            TEXT
calories             INTEGER
protein              DECIMAL
fat                  DECIMAL
carbs                DECIMAL
portion_size         TEXT
notes                TEXT
created_at           TIMESTAMP
```

#### `chat_history`
```sql
id                   UUID (primary key)
user_id              UUID (foreign key → users)
role                 TEXT (user/assistant)
message              TEXT
created_at           TIMESTAMP
```

#### `daily_summaries`
```sql
id                   UUID (primary key)
user_id              UUID (foreign key → users)
date                 DATE
total_calories       INTEGER
total_protein        DECIMAL
total_fat            DECIMAL
total_carbs          DECIMAL
entries_count        INTEGER
created_at           TIMESTAMP
```

**Security:** Row-Level Security (RLS) enabled on all tables

---

### 🎨 Design System (Stitch)

**Colors:**
- Primary Green: #10b981 (success, progress)
- Secondary Blue: #3b82f6 (accents, secondary)
- Pink: #ec4899 (proteins)
- Amber: #f59e0b (fats)
- Blue: #3b82f6 (carbs)

**Typography:**
- Headings: Inter, Bold, 24px
- Body: Inter, Regular, 14-16px
- Captions: Inter, Light, 12px

**Components:**
- Buttons (primary, secondary, danger)
- Cards (entry cards, summary cards)
- Charts (pie, line, bar)
- Modals (confirmations, forms)
- Input fields (text, number, select)

---

## Data Flow

### User Adds Food Entry

```
1. User in Telegram → Types "Chicken 300g"
   ↓
2. Telegram API → Sends to n8n webhook
   ↓
3. n8n Food Logging Node
   - Parse input
   - Query food database
   - Call DeepSeek if needed
   - Extract: calories, protein, fat, carbs
   ↓
4. n8n Database Node
   - Insert into food_entries table
   - Update daily_summaries cache
   ↓
5. n8n Response Node
   - Format response with totals
   - Calculate remaining calories
   - Send to Telegram
   ↓
6. Telegram sends message to user
   ↓
7. User opens Mini App
   - Supabase fetches latest entries
   - Dashboard updates in real-time
   - Shows new totals
```

### User Views Dashboard

```
1. User opens bot → Clicks "Open Diary"
   ↓
2. Telegram WebApp opens Mini App
   - Passes Telegram auth data
   ↓
3. React App initializes
   - Verifies user with Telegram SDK
   - Gets user_id from Telegram
   ↓
4. Supabase Query
   - SELECT * FROM food_entries WHERE user_id = ? AND date = today()
   - SELECT * FROM users WHERE telegram_id = ?
   ↓
5. React Components
   - Fetch today's entries
   - Calculate totals
   - Render Dashboard
   - Show circular charts
   ↓
6. Mini App displays
   - Total calories (with goal)
   - Macro breakdown
   - Today's entries list
   - Progress indicators
```

### User Gets AI Advice

```
1. User in Telegram → Asks "Should I eat more?"
   ↓
2. n8n AI Nutritionist Node
   - Fetch user profile
   - Fetch today's food entries
   - Fetch chat history (last 5 messages)
   ↓
3. Build Context Prompt
   - User goal: 2000 kcal
   - Today's intake: 1600 kcal
   - Protein: 72g/80g
   - Recent conversation
   ↓
4. Call DeepSeek API
   - System prompt: "You are a nutrition coach"
   - User context: goal, intake, macros
   - User message: "Should I eat more?"
   ↓
5. DeepSeek responds
   - Analyzes situation
   - Makes recommendations
   - Suggests protein-rich foods
   ↓
6. n8n Response Node
   - Format response
   - Add emojis
   - Add recommendations
   ↓
7. Send to Telegram
   → User sees AI advice
```

---

## API & Integration Points

### Telegram Bot API
- **Incoming:** webhooks (messages, photos, callbacks)
- **Outgoing:** sendMessage, sendPhoto, editMessage

### Supabase REST API
- **Reads:** food_entries, users, daily_summaries
- **Writes:** food_entries (insert, update, delete)
- **Auth:** JWT (telegram_id verified)

### DeepSeek API
- **Input:** food description or conversation
- **Output:** JSON with nutrition facts or text response

### OpenAI API (GPT-4o-mini)
- **Input:** Photo of food
- **Output:** Text description (food type, portion estimate)

### Telegram WebApp SDK
- **Input:** Telegram user data (on Mini App open)
- **Output:** Auth token to verify user identity

---

## Deployment & Hosting

### Mini App (React)
- **Build:** `npm run build`
- **Output:** `dist/` folder
- **Hosting:** GitHub Pages
- **URL:** https://vitwork888-hub.github.io/kbju-dashboard-private/
- **CI/CD:** GitHub Actions (auto-deploy on push)

### Bot (n8n)
- **Hosting:** n8n Cloud
- **URL:** n8n-instance.com
- **Webhook:** n8n-instance.com/webhook/kbju-bot
- **Auto-scaling:** Yes
- **Execution:** Serverless

### Database (Supabase)
- **Region:** EU (or your choice)
- **Backups:** Daily automatic
- **Uptime SLA:** 99.9%
- **Scaling:** Automatic

### Design (Stitch)
- **Hosted:** Google's Stitch platform
- **Sync:** Manual exports to projects
- **Version control:** Version history in Stitch

---

## Development Workflow

### Make a Change to Bot

```
1. n8n UI → Edit workflow
2. Test in n8n sandbox
3. Export workflow JSON
4. Commit to git
5. Deploy (auto on main)
6. Test in Telegram
```

### Make a Change to Mini App

```
1. Edit React code (src/)
2. Run `npm run dev` for local testing
3. Verify in browser
4. Commit changes
5. Push to main branch
6. GitHub Actions auto-builds
7. GitHub Pages auto-deploys
```

### Make a Design Change

```
1. Edit in Stitch design system
2. Export components / guidelines
3. Update Mini App CSS / components
4. Test visually
5. Commit and deploy
```

---

## CI/CD Pipeline

### Mini App CI/CD

```
Push to main
   ↓
GitHub Actions triggers
   ↓
npm install
   ↓
npm run build
   ↓
dist/ folder generated
   ↓
GitHub Pages deploy
   ↓
https://...github.io/kbju-dashboard-private/ updated
```

### Bot CI/CD

```
Export from n8n
   ↓
Commit to /workflows/
   ↓
n8n auto-syncs (if connected)
   ↓
n8n webhook receives updates
   ↓
No downtime deployment
```

---

## File Naming Convention

### Documentation Files
- `BOT_*.md` — Bot-specific docs
- `PROJECT_*.md` — Project-wide docs
- `README.md` — Mini App overview

### Code Files
- React: `PascalCase` (Dashboard.tsx)
- Functions: `camelCase` (fetchUserProfile)
- Constants: `UPPER_CASE` (API_KEY)
- CSS: `kebab-case` (primary-color)

### Configuration Files
- `.env.example` — Environment template
- `package.json` — Dependencies
- `tsconfig.json` — TypeScript config
- `vite.config.ts` — Vite config

---

## Version Control

### Branches
- `main` — Production (always deployable)
- Feature branches — For new features
- Hotfix branches — For urgent fixes

### Commits
- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation update
- `style:` — Code style (no logic change)
- `refactor:` — Code reorganization

### Releases
- Semantic versioning: `v5.1.0`
- Tag on main branch
- Release notes in GitHub

---

## Monitoring & Observability

### Bot Monitoring
- n8n execution logs
- Error rate tracking
- API usage (DeepSeek, OpenAI)
- Daily active users
- Response time metrics

### Mini App Monitoring
- GitHub Pages uptime
- Build success rate
- Page load time
- Supabase response time

### Database Monitoring
- Supabase admin dashboard
- Query performance
- Storage usage
- Connection count

---

## Useful Links

| Component | URL |
|-----------|-----|
| **Mini App** | https://vitwork888-hub.github.io/kbju-dashboard-private/ |
| **n8n Bot** | https://n8n-instance.com |
| **Supabase** | https://supabase.com/dashboard |
| **GitHub Bot Repo** | (Private) |
| **GitHub Mini App Repo** | https://github.com/vitwork888-hub/kbju-dashboard-private |
| **Telegram Bot** | @zojvkarmane (channel) or @your_bot (bot) |
| **Creator** | @vitwork888 (Telegram) |

---

## Key Takeaways

✅ **Fully Integrated System**
- Bot logs food → Database stores → Mini App displays
- Single user database
- Real-time sync

✅ **Production Ready**
- Deployed & active
- Auto CI/CD pipeline
- 99.9% uptime infrastructure

✅ **Well Documented**
- Overview, setup, API reference
- Code is self-explanatory
- Multiple entry points for different users

✅ **Scalable Architecture**
- Stateless bot (n8n)
- Serverless mini app (GitHub Pages)
- Managed database (Supabase)

---

**Last Updated:** 2026-06-06  
**Project Version:** 5.1  
**Status:** Production (Active)
