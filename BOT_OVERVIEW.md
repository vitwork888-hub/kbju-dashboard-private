# 🤖 KBZU Bot — Complete Documentation

**Production-ready Telegram bot for calorie tracking with AI nutritionist**

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Architecture](#architecture)
5. [Setup & Deployment](#setup--deployment)
6. [API Reference](#api-reference)
7. [Workflow Guide](#workflow-guide)
8. [Troubleshooting](#troubleshooting)
9. [Known Issues](#known-issues)

---

## Overview

KBZU Bot is an intelligent Telegram chatbot that helps users track their daily calorie intake and macronutrients with personalized AI nutritionist advice.

**Key Capabilities:**
- Text-based food logging ("Chicken 300g")
- Photo-based food recognition (computer vision)
- Automatic calorie & macro calculations
- TDEE (Total Daily Energy Expenditure) calculation
- AI-powered nutrition coaching
- Daily reports & trend analysis

**Current Status:** ✅ Production (v5.1)  
**Platform:** n8n (no-code automation)  
**Users:** Active user base  
**Hosting:** n8n Cloud

---

## Features

### 1. Food Logging

#### Text Input
- User sends: `"Chicken 300g"`
- Bot recognizes food from 50+ brands database
- Supports: NL International, Milty, Grow Food, fast food chains
- Fallback: standard portions if no exact match

#### Photo Input
- User sends food photo
- GPT-4o-mini analyzes the image
- Extracts: food type, portion estimate, dish composition
- Returns: calories, protein, fat, carbs

#### Auto-Calculation
- Portion size → API lookup → nutrition facts
- JSON parsing from DeepSeek
- Real-time total calculation
- Error handling for failed requests

### 2. Profile & Goals

**Onboarding Flow:**
1. Gender (Male/Female)
2. Age
3. Height (cm)
4. Weight (kg)
5. Activity Level (Sedentary, Light, Moderate, Active, Very Active)

**TDEE Calculation:**
- Uses Mifflin-St Jeor formula
- Adjusts based on activity multiplier
- Options: Cut (-15%), Maintain, Bulk (+15%)
- Users can set custom targets

### 3. Daily Tracking

**Real-Time Dashboard:**
- Total calories eaten vs. goal
- Macro breakdown (P/F/C)
- Progress percentage with emoji indicators
- Remaining calories for the day

**History Management:**
- View all entries from today
- Delete incorrect entries
- No permanent deletion (can be recovered)

### 4. Reports & Analytics

**Daily Reports:**
- Sent automatically (configurable time)
- Shows: total kcal, macro split, goal progress

**Trend Analysis:**
- 7-day average
- 14-day average
- 30-day average
- Visual progress indicators

### 5. AI Nutritionist (Pak)

**Context-Aware Advice:**
- Sees user's goals
- Analyzes today's food intake
- Provides personalized recommendations

**Example Interactions:**
```
User: "Should I eat more?"
Bot: "You've eaten 1600 kcal. Your goal is 2000.
     You have room for 400 kcal. Try a protein-heavy snack 
     (cottage cheese, nuts) to hit your 80g protein target. 
     Currently at 72g."
```

**Features:**
- Contextual recommendations
- Brand awareness
- 5-minute session memory
- Multiple conversation turns

---

## Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Messaging** | Telegram Bot API | Receive messages, send responses |
| **Automation** | n8n | Workflow orchestration |
| **Database** | Supabase (PostgreSQL) | Store users, entries, chat history |
| **Food Recognition** | DeepSeek v4-pro | Food classification & JSON parsing |
| **Photo Analysis** | OpenAI GPT-4o-mini | Image-to-text food recognition |
| **Hosting** | n8n Cloud | Managed webhooks & execution |
| **Language** | Node.js (in n8n nodes) | Custom logic & calculations |

### API Keys & Services

| Service | Key Name | Used For | Provider |
|---------|----------|----------|----------|
| Telegram | BOT_TOKEN | Bot authentication | Telegram |
| DeepSeek | DEEPSEEK_API_KEY | Food text parsing | DeepSeek |
| OpenAI | OPENAI_API_KEY | Photo recognition | OpenAI |
| Supabase | SUPABASE_URL | Database host | Supabase |
| Supabase | SUPABASE_ANON_KEY | DB public access | Supabase |

---

## Architecture

### System Flow

```
User (Telegram) 
    ↓
Telegram Bot API 
    ↓
n8n Webhook (Main Entry)
    ↓
Request Router (detect message type)
    ├─→ /start command → Onboarding flow
    ├─→ Text message → Food logging flow
    ├─→ Photo + caption → Photo recognition flow
    ├─→ Button click → Context handling
    └─→ Chat message → AI nutritionist flow
    ↓
Processing Node (specific handler)
    ├─→ DeepSeek (text → JSON)
    ├─→ GPT-4o-mini (image → description)
    ├─→ Calculation (macro computation)
    └─→ Database operations (Supabase)
    ↓
Response Builder (format message)
    ↓
Telegram API (send response)
```

### Workflow Nodes (Main Components)

**Entry Point:** `webhook_receive`
- Receives all Telegram events
- Routes to appropriate handler

**Profile Management:** `user_onboarding`
- Creates user record
- Stores metrics
- Sets up TDEE goal

**Food Logging:** `food_entry_text`
- Parse user input
- Query food database
- Send to DeepSeek if needed
- Store entry in Supabase

**Photo Recognition:** `food_entry_photo`
- Download photo from Telegram
- Send to GPT-4o-mini
- Extract portion estimate
- Calculate nutrition facts

**AI Nutritionist:** `ai_chat_handler`
- Fetch user context (goals, today's intake)
- Send to DeepSeek prompt
- Format response
- Send to user

**Daily Reports:** `scheduled_daily_report`
- Triggered by n8n scheduler
- Calculate daily totals
- Send to all active users

### Database Schema

**Tables:**
- `users` — user profiles (gender, age, height, weight, activity, goals)
- `food_entries` — daily food logs (user_id, food, calories, macros, timestamp)
- `chat_history` — conversation logs (for session context)
- `daily_totals` — pre-calculated daily summaries (performance optimization)

**Row-Level Security (RLS):**
- Users can only see their own data
- Enforced at Supabase level

---

## Setup & Deployment

### Prerequisites

- n8n account (cloud or self-hosted)
- Telegram Bot token (from BotFather)
- Supabase account with tables created
- DeepSeek API key
- OpenAI API key

### Step 1: Create Telegram Bot

```bash
1. Message @BotFather on Telegram
2. /newbot
3. Choose name and username
4. Save the BOT_TOKEN
```

### Step 2: Set Up Supabase

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id INTEGER UNIQUE,
  name TEXT,
  gender TEXT,
  age INTEGER,
  height INTEGER,
  weight INTEGER,
  activity_level TEXT,
  daily_goal INTEGER,
  created_at TIMESTAMP DEFAULT now()
);

-- Create food_entries table
CREATE TABLE food_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  food_name TEXT,
  calories INTEGER,
  protein DECIMAL,
  fat DECIMAL,
  carbs DECIMAL,
  portion_size TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Create chat_history table
CREATE TABLE chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  role TEXT,
  message TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_entries ENABLE ROW LEVEL SECURITY;
```

### Step 3: Export & Import n8n Workflow

1. Download `kbju-v5.1-nutrition-v1.0.json` from workflows folder
2. In n8n: Workflows → Import → Upload JSON file
3. Update credential references (API keys)

### Step 4: Configure API Keys in n8n

Go to n8n Settings → Credentials:
- Add Telegram credentials (BOT_TOKEN)
- Add DeepSeek API key
- Add OpenAI API key
- Add Supabase connection (URL + anon key)

### Step 5: Set Telegram Webhook

```bash
curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook" \
  -d "url=https://n8n-instance.com/webhook/kbju-bot" \
  -d "max_connections=10"
```

### Step 6: Test the Bot

```
1. Open Telegram
2. Find bot by username
3. Send /start
4. Complete profile
5. Send: "Chicken 300g"
6. Verify response
```

---

## API Reference

### Telegram Events Received

#### /start Command
```json
{
  "update_id": 123456,
  "message": {
    "from": {"id": 987654, "first_name": "John"},
    "text": "/start"
  }
}
```
**Response:** Profile setup questions (gender, age, etc)

#### Text Message (Food Entry)
```json
{
  "message": {
    "from": {"id": 987654},
    "text": "Chicken 300g"
  }
}
```
**Response:** `✅ Added: Chicken 300g → 330 kcal (35g P, 12g F, 0g C)`

#### Photo Message
```json
{
  "message": {
    "from": {"id": 987654},
    "photo": [...],
    "caption": "dinner"
  }
}
```
**Response:** Recognized food with calories and macros

#### Regular Message (AI Chat)
```json
{
  "message": {
    "from": {"id": 987654},
    "text": "Should I eat more?"
  }
}
```
**Response:** AI nutritionist advice based on user context

---

## Workflow Guide

### Adding a New Food Brand

1. Open n8n workflow
2. Find `food_database` node
3. Add entry: `{brand: "...", food: "...", calories: X, protein: X, ...}`
4. Deploy

### Customizing AI Prompts

1. Find `ai_nutritionist` node
2. Edit system prompt in DeepSeek call
3. Adjust context window (currently 5 messages)
4. Deploy

### Changing TDEE Formula

1. Find `calculate_tdee` node
2. Current: Mifflin-St Jeor
3. Edit formula in JavaScript code node
4. Deploy

### Adjusting Photo Recognition

1. Find `analyze_photo` node
2. Uses GPT-4o-mini (vision model)
3. Edit prompt for better results
4. Deploy

---

## Troubleshooting

### Issue: Bot doesn't respond

**Causes:**
1. Webhook not set in Telegram
2. n8n workflow paused
3. API credentials expired

**Solution:**
```bash
# Check webhook status
curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"

# Verify n8n workflow is active (check UI)
# Refresh API credentials
```

### Issue: Photo recognition fails

**Causes:**
1. GPT-4o-mini API limit reached
2. Image format not supported
3. OpenAI key invalid

**Solution:**
- Check OpenAI billing
- Use JPEG/PNG (not WebP)
- Regenerate API key

### Issue: TDEE calculation wrong

**Causes:**
1. User entered incorrect metrics
2. Activity multiplier miscalibrated
3. Formula changed

**Solution:**
- Ask user to verify input: `/profile`
- Reset and re-enter onboarding

### Issue: Database connection lost

**Causes:**
1. Supabase down
2. RLS policies blocking access
3. API key revoked

**Solution:**
- Check Supabase status page
- Review RLS policies
- Regenerate API key in Supabase

---

## Known Issues

### 🔴 Critical

**Hardcoded Credentials**
- API keys stored in n8n workflow (should use env vars)
- **Fix planned:** v5.2
- **Workaround:** Keep n8n instance secure, limit access

**No Rate Limiting**
- DeepSeek/OpenAI calls unmetered
- **Cost risk:** High usage = high bills
- **Fix planned:** v5.2 with usage caps

**Single Point of Failure**
- All data in one Supabase instance
- **Risk:** Data loss if instance compromised
- **Mitigation:** Regular backups (manual)

### 🟡 Major

**Monolithic Workflow**
- 50+ nodes in single workflow (hard to debug)
- **Fix planned:** v6.0 (split into microworkflows)

**No Data Recovery**
- Deleted entries cannot be restored
- **Workaround:** Delete entries rarely, use soft-delete

**Fragile Onboarding**
- State machine can get stuck mid-profile
- **Workaround:** /start command resets state

### 🟢 Minor

**Stateless Chat**
- AI has no long-term memory (resets per session)
- **Expected behavior** for security

**No Dietary Preferences**
- Cannot exclude allergies/dietary restrictions
- **Planned:** v6.0

**Russian Only**
- Bot responses in Russian
- **Planned:** v7.0 (multi-language)

---

## Performance Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Response Time (p99) | <5 sec | ~3 sec |
| Photo Recognition | <10 sec | ~7 sec |
| Webhook Timeout | 30 sec | - |
| Daily Active Users | 50+ | TBD |
| 30-Day Retention | 60%+ | TBD |

---

## Security Considerations

### ✅ Implemented

- HTTPS for all API calls
- Telegram API authentication
- Supabase Row-Level Security
- No PII in logs

### ⚠️ To Implement (v5.2)

- Move credentials to environment variables
- Add request signing
- Rate limiting per user
- Audit logging

---

## Support & Maintenance

**Creator:** VIT (@vitwork888)  
**Status:** Active maintenance  
**Update Frequency:** Monthly patches, quarterly features  

**To Report Issues:**
- Telegram DM: @vitwork888
- Include: error message, user ID, timestamp

---

**Last Updated:** 2026-06-06  
**Version:** 5.1 (Production)
