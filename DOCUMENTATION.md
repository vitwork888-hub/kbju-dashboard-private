# 📖 KBZU Project — Complete Documentation

Welcome! This is the main documentation hub for the KBZU bot & mini-app project.

---

## 🎯 Start Here

**First time here?** Choose your path:

### 👤 I'm a User
- Want to use the bot? → Find [@zojvkarmane](https://t.me/zojvkarmane) on Telegram
- Ask questions? → Message [@vitwork888](https://t.me/vitwork888)

### 👨‍💻 I'm a Developer

**New to the project?**
1. Read [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) (10 min) — Understand what exists
2. Read [BOT_OVERVIEW.md](BOT_OVERVIEW.md) (20 min) — Understand how bot works
3. Choose your next step below

**Want to deploy bot?**
- Follow [BOT_SETUP.md](BOT_SETUP.md) (60 min)

**Want to understand API?**
- Read [BOT_API_REFERENCE.md](BOT_API_REFERENCE.md) (15 min)

**Want to modify mini-app?**
- Read [README.md](README.md) (10 min)
- Look at `/src/` folder structure

---

## 📚 Documentation Files

### Project-Level
| File | Purpose | Time |
|------|---------|------|
| **[DOCUMENTATION.md](DOCUMENTATION.md)** | This file — main hub | 5 min |
| **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** | Complete project structure | 10 min |

### Bot Documentation
| File | Purpose | Time |
|------|---------|------|
| **[BOT_DOCS_INDEX.md](BOT_DOCS_INDEX.md)** | Bot docs hub | 5 min |
| **[BOT_OVERVIEW.md](BOT_OVERVIEW.md)** | Features, architecture, tech stack | 20 min |
| **[BOT_SETUP.md](BOT_SETUP.md)** | How to deploy bot | 60 min |
| **[BOT_API_REFERENCE.md](BOT_API_REFERENCE.md)** | API events, commands, responses | 15 min |

### Mini App Documentation
| File | Purpose | Time |
|------|---------|------|
| **[README.md](README.md)** | Mini app overview & setup | 10 min |

---

## 🗺️ Navigation Guide

### I want to...

**...understand the entire project**
1. Read [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) (overview)
2. Read [BOT_OVERVIEW.md](BOT_OVERVIEW.md) (bot details)
3. Read [README.md](README.md) (mini app details)

**...deploy my own bot**
→ Follow [BOT_SETUP.md](BOT_SETUP.md) step by step

**...understand bot architecture**
→ [BOT_OVERVIEW.md#architecture](BOT_OVERVIEW.md#architecture)

**...see API examples**
→ [BOT_API_REFERENCE.md#implementation-examples](BOT_API_REFERENCE.md#implementation-examples)

**...modify the bot**
1. Understand [BOT_OVERVIEW.md#architecture](BOT_OVERVIEW.md#architecture)
2. Check [BOT_OVERVIEW.md#workflow-guide](BOT_OVERVIEW.md#workflow-guide)
3. Edit n8n workflow
4. Test using [BOT_API_REFERENCE.md#testing-api](BOT_API_REFERENCE.md#testing-api)

**...modify the mini app**
1. Read [README.md](README.md)
2. Check project structure in `/src/`
3. Run `npm run dev`
4. Make changes
5. Commit & push

**...find something specific**
→ Use Ctrl+F to search in the docs

**...troubleshoot a problem**
1. Check [BOT_SETUP.md#troubleshooting-setup](BOT_SETUP.md#troubleshooting-setup)
2. Check [BOT_OVERVIEW.md#troubleshooting](BOT_OVERVIEW.md#troubleshooting)
3. Check [BOT_API_REFERENCE.md#error-codes](BOT_API_REFERENCE.md#error-codes)

---

## 📊 Quick Reference

### What is KBZU?
- **Bot:** Telegram chatbot for tracking food & calories
- **Mini App:** React web app showing dashboard & stats
- **Database:** Shared Supabase PostgreSQL instance
- **Status:** Production (v5.1, active)

### Tech Stack
- **Bot:** n8n (no-code automation)
- **Mini App:** React 18 + TypeScript + Vite
- **Database:** Supabase (PostgreSQL)
- **AI:** DeepSeek + OpenAI GPT-4o-mini
- **Messaging:** Telegram Bot API

### Key Features
- ✅ Text food logging ("Chicken 300g")
- ✅ Photo food recognition (computer vision)
- ✅ Auto calorie & macro calculation
- ✅ AI nutritionist advice
- ✅ Daily reports & trend analysis
- ✅ Web dashboard with charts

### Deployment
- **Mini App:** GitHub Pages (auto-deploy on push)
- **Bot:** n8n Cloud (serverless)
- **Database:** Supabase (managed)

---

## 🎓 Learning Paths

### Path 1: Understand the Project (30 min)
1. [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) — What exists
2. [BOT_OVERVIEW.md](BOT_OVERVIEW.md) — How bot works
3. [README.md](README.md) — How mini app works

### Path 2: Deploy Your Own Bot (90 min)
1. [BOT_SETUP.md](BOT_SETUP.md) — Follow all steps
2. [BOT_SETUP.md#production-checklist](BOT_SETUP.md#production-checklist) — Verify setup

### Path 3: Develop/Modify Bot (120+ min)
1. [BOT_OVERVIEW.md](BOT_OVERVIEW.md) — Understand architecture
2. [BOT_API_REFERENCE.md](BOT_API_REFERENCE.md) — Understand API
3. [BOT_OVERVIEW.md#workflow-guide](BOT_OVERVIEW.md#workflow-guide) — Learn how to modify
4. Modify n8n workflow
5. [BOT_API_REFERENCE.md#testing-api](BOT_API_REFERENCE.md#testing-api) — Test changes

### Path 4: Develop/Modify Mini App (60+ min)
1. [README.md](README.md) — Understand project
2. Read `/src/` code
3. Run `npm run dev`
4. Make changes
5. Test in browser

---

## 🔧 Common Tasks Checklists

### Task: Deploy New Bot Instance

- [ ] Read [BOT_SETUP.md](BOT_SETUP.md)
- [ ] Create Telegram bot (Step 1)
- [ ] Set up Supabase (Step 2)
- [ ] Get API keys (Step 3)
- [ ] Set up n8n (Step 4)
- [ ] Configure credentials (Step 5)
- [ ] Set webhook (Step 6)
- [ ] Test bot (Step 7)
- [ ] Review [BOT_SETUP.md#production-checklist](BOT_SETUP.md#production-checklist)

### Task: Add New Food Brand

- [ ] Understand workflow structure ([BOT_OVERVIEW.md#architecture](BOT_OVERVIEW.md#architecture))
- [ ] Find food database node in n8n
- [ ] Add new entry: `{brand, food, calories, protein, fat, carbs}`
- [ ] Test with sample input
- [ ] Deploy

### Task: Customize AI Prompts

- [ ] Read [BOT_OVERVIEW.md#5-ai-nutritionist-pak](BOT_OVERVIEW.md#5-ai-nutritionist-pak)
- [ ] Find AI nutritionist node in n8n
- [ ] Edit DeepSeek system prompt
- [ ] Test in n8n sandbox
- [ ] Verify response quality
- [ ] Deploy

### Task: Debug a Problem

- [ ] Check [BOT_SETUP.md#troubleshooting-setup](BOT_SETUP.md#troubleshooting-setup)
- [ ] Check [BOT_OVERVIEW.md#troubleshooting](BOT_OVERVIEW.md#troubleshooting)
- [ ] Check [BOT_API_REFERENCE.md#error-codes](BOT_API_REFERENCE.md#error-codes)
- [ ] Check n8n execution logs
- [ ] Message creator if needed

---

## 📞 Support

### I have a question about...

**...how the bot works?**
- Read [BOT_OVERVIEW.md](BOT_OVERVIEW.md)

**...how to deploy?**
- Follow [BOT_SETUP.md](BOT_SETUP.md)

**...the API?**
- Check [BOT_API_REFERENCE.md](BOT_API_REFERENCE.md)

**...the mini app?**
- Read [README.md](README.md)

**...the project structure?**
- Check [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)

**...something else?**
- Message [@vitwork888](https://t.me/vitwork888) on Telegram

---

## 🔗 Key Links

| Resource | Link |
|----------|------|
| **Telegram Bot** | @zojvkarmane (channel) |
| **Bot Creator** | [@vitwork888](https://t.me/vitwork888) |
| **Mini App (Live)** | https://vitwork888-hub.github.io/kbju-dashboard-private/ |
| **Mini App Repo** | https://github.com/vitwork888-hub/kbju-dashboard-private |
| **Design System** | Stitch (Google) |
| **Database** | Supabase |
| **Automation Platform** | n8n Cloud |

---

## 📋 Documentation Checklist

- [x] Project overview ([PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md))
- [x] Bot overview ([BOT_OVERVIEW.md](BOT_OVERVIEW.md))
- [x] Bot setup guide ([BOT_SETUP.md](BOT_SETUP.md))
- [x] Bot API reference ([BOT_API_REFERENCE.md](BOT_API_REFERENCE.md))
- [x] Bot docs index ([BOT_DOCS_INDEX.md](BOT_DOCS_INDEX.md))
- [x] Mini app docs ([README.md](README.md))
- [x] Main documentation hub (this file)

---

## 📈 Documentation Stats

- **Total files:** 7 documentation files
- **Total words:** ~15,000
- **Estimated reading time:** 3-4 hours (complete)
- **Estimated implementation time (from scratch):** 60 hours

---

## 🎯 Project Goals

### Current (v5.1) ✅
- Food logging (text & photo)
- AI nutritionist
- Daily tracking & reports
- Web dashboard (Mini App)

### Planned (v6.0)
- Web dashboard improvements
- Better workflow organization
- Extended AI memory

### Planned (v7.0)
- Health app integrations
- Multi-language support
- Gamification features

---

## 📅 Last Updated

- **Documentation:** 2026-06-06
- **Bot Version:** 5.1 (Production)
- **Mini App Version:** Latest
- **Status:** Active & Maintained

---

## ✨ Quick Stats

| Metric | Value |
|--------|-------|
| **Files in project** | 100+ (mostly node_modules) |
| **Documentation files** | 7 |
| **Bot workflows** | 1 (main) |
| **Database tables** | 4 |
| **Pages in Mini App** | 3 (Dashboard, Profile, Stats) |
| **API integrations** | 4 (Telegram, DeepSeek, OpenAI, Supabase) |

---

## 🚀 Ready to Get Started?

### For Users
1. Find [@zojvkarmane](https://t.me/zojvkarmane) on Telegram
2. Send `/start`
3. Complete your profile
4. Start logging food!

### For Developers
1. Read [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) (10 min)
2. Read [BOT_OVERVIEW.md](BOT_OVERVIEW.md) (20 min)
3. Choose your next step:
   - Want to deploy? → [BOT_SETUP.md](BOT_SETUP.md)
   - Want to understand API? → [BOT_API_REFERENCE.md](BOT_API_REFERENCE.md)
   - Want to modify mini app? → [README.md](README.md)

---

**Welcome to KBZU! 🥗**

Last Updated: 2026-06-06  
Status: Production Ready ✅
