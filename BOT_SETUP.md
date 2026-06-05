# 🚀 KBZU Bot — Setup & Deployment Guide

Step-by-step guide to set up and deploy the KBZU Bot.

---

## Quick Start (5 minutes)

### Option A: Use Existing Bot (If Already Deployed)

```
1. Open Telegram
2. Find @zojvkarmane channel or your bot username
3. Send /start
4. Complete profile setup
5. Start logging food!
```

### Option B: Deploy Your Own Instance

Follow the complete setup guide below.

---

## Complete Setup Guide

### Step 1: Create Telegram Bot (5 min)

1. **Open Telegram**
   - Message [@BotFather](https://t.me/botfather)

2. **Create new bot**
   - Send: `/newbot`
   - Choose name: e.g., "My KBZU Tracker"
   - Choose username: e.g., `my_kbju_bot`
   - **Save the token** (will be `BOT_TOKEN`)

3. **Configure bot settings**
   - Send: `/setcommands`
   - Select your bot
   - Add:
     ```
     start - Start using the bot
     profile - View your profile
     today - Show today's totals
     stats - Weekly/monthly stats
     help - Show help
     ```

### Step 2: Create Supabase Database (10 min)

1. **Go to [supabase.com](https://supabase.com)**
   - Sign up / Log in
   - Create new project
   - Choose region closest to you
   - Wait for setup (~2 min)

2. **Create tables**
   
   In SQL Editor, run:
   
   ```sql
   -- Users table
   CREATE TABLE public.users (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     telegram_id BIGINT UNIQUE NOT NULL,
     first_name TEXT,
     username TEXT,
     gender TEXT,
     age INTEGER,
     height INTEGER,
     weight INTEGER,
     activity_level TEXT,
     daily_calorie_goal INTEGER,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
   );

   -- Food entries table
   CREATE TABLE public.food_entries (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
     food_name TEXT NOT NULL,
     calories INTEGER NOT NULL,
     protein DECIMAL(10,2),
     fat DECIMAL(10,2),
     carbs DECIMAL(10,2),
     portion_size TEXT,
     notes TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
   );

   -- Chat history table (for AI context)
   CREATE TABLE public.chat_history (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
     role TEXT,
     message TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
   );

   -- Daily summaries (for performance)
   CREATE TABLE public.daily_summaries (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
     date DATE NOT NULL,
     total_calories INTEGER,
     total_protein DECIMAL(10,2),
     total_fat DECIMAL(10,2),
     total_carbs DECIMAL(10,2),
     entries_count INTEGER,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
     UNIQUE(user_id, date)
   );

   -- Enable RLS (Row-Level Security)
   ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.food_entries ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
   ALTER TABLE public.daily_summaries ENABLE ROW LEVEL SECURITY;

   -- RLS Policies
   CREATE POLICY "Users can view own data" ON public.users
     FOR SELECT USING (auth.uid()::text = id::text);

   CREATE POLICY "Food entries visible to owner" ON public.food_entries
     FOR SELECT USING (user_id = auth.uid());

   CREATE POLICY "Users can insert own entries" ON public.food_entries
     FOR INSERT WITH CHECK (user_id = auth.uid());
   ```

3. **Get Supabase credentials**
   - Go to Settings → API
   - Copy `Project URL` → `SUPABASE_URL`
   - Copy `anon public` key → `SUPABASE_ANON_KEY`

### Step 3: Get API Keys (5 min)

#### DeepSeek API Key
1. Go to [platform.deepseek.com](https://platform.deepseek.com)
2. Sign up
3. Create API key
4. Save as `DEEPSEEK_API_KEY`

#### OpenAI API Key
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up / Log in
3. Create API key
4. Save as `OPENAI_API_KEY`

**Note:** You need credits on both services!

### Step 4: Set Up n8n (15 min)

#### Option A: Use n8n Cloud (Easiest)

1. Go to [n8n.cloud](https://n8n.cloud)
2. Sign up free account
3. Create new workflow
4. Import workflow JSON:
   - Download `kbju-v5.1-nutrition-v1.0.json`
   - Click "Import" in n8n
   - Upload the JSON file

#### Option B: Self-Hosted n8n (Advanced)

```bash
# Install Docker
# Download n8n
docker run -d --name n8n \
  -p 5678:5678 \
  n8n

# Access at http://localhost:5678
```

### Step 5: Configure n8n Credentials

1. **In n8n UI:**
   - Go to Credentials
   - Add new credential for each:

2. **Telegram Bot API**
   - Type: HTTP Header Auth
   - Header: `Authorization`
   - Value: `Bearer <BOT_TOKEN>`

3. **Supabase**
   - Type: Supabase
   - URL: `SUPABASE_URL`
   - API Key: `SUPABASE_ANON_KEY`

4. **DeepSeek**
   - Type: HTTP Header Auth
   - Header: `Authorization`
   - Value: `Bearer <DEEPSEEK_API_KEY>`

5. **OpenAI**
   - Type: HTTP Header Auth
   - Header: `Authorization`
   - Value: `Bearer <OPENAI_API_KEY>`

### Step 6: Set Telegram Webhook

1. **In n8n workflow:**
   - Get webhook URL: `https://[n8n-domain]/webhook/kbju-bot`

2. **Run this command:**
   ```bash
   curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook" \
     -d "url=https://[n8n-domain]/webhook/kbju-bot" \
     -d "max_connections=10" \
     -d "allowed_updates=[\"message\",\"callback_query\"]"
   ```

3. **Verify webhook:**
   ```bash
   curl "https://api.telegram.org/bot<BOT_TOKEN>/getWebhookInfo"
   ```
   
   Should return `"ok": true`

### Step 7: Test the Bot

1. **Open Telegram**
2. **Find your bot** by username
3. **Send** `/start`
4. **Complete profile:**
   - Gender → Age → Height → Weight → Activity
5. **Send** `Chicken 300g`
6. **Bot should respond** with calories & macros

---

## Troubleshooting Setup

### Problem: "Webhook request failed"

**Solution:**
```bash
# Check webhook is set
curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"

# If set to wrong URL, delete and reset
curl -X POST "https://api.telegram.org/bot<TOKEN>/deleteWebhook"

# Re-add webhook
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -d "url=https://correct-url/webhook/kbju-bot"
```

### Problem: "Credentials not found"

**Solution:**
- In n8n, go to Credentials
- Verify all credentials are saved
- Check names match in workflow nodes
- Re-create if needed

### Problem: "Supabase connection error"

**Solution:**
- Verify URL is correct (ends with `.supabase.co`)
- Check API key is not expired
- Make sure RLS policies allow public access
- Test with curl:
  ```bash
  curl -H "Authorization: Bearer <ANON_KEY>" \
    https://<PROJECT>.supabase.co/rest/v1/users?select=*
  ```

### Problem: Bot doesn't respond to messages

**Solution:**
1. Check n8n workflow is "Active" (toggle in UI)
2. Check webhook is set (see Step 6)
3. Check n8n logs for errors
4. Test manually: send test event in n8n

---

## Environment Variables

If self-hosting, use `.env` file:

```bash
# Telegram
BOT_TOKEN=your_token_here
WEBHOOK_URL=https://your-domain.com/webhook/kbju-bot

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key

# DeepSeek
DEEPSEEK_API_KEY=your_key

# OpenAI
OPENAI_API_KEY=your_key
```

---

## Production Checklist

- [ ] Bot token secured (not in version control)
- [ ] API keys stored securely
- [ ] Supabase backups enabled
- [ ] Webhook URL verified
- [ ] RLS policies configured
- [ ] Daily report scheduler set up
- [ ] Monitoring/logging enabled
- [ ] Error handling configured
- [ ] Rate limiting added (v5.2)
- [ ] HTTPS enforced everywhere

---

## Next Steps

1. **Monitor bot usage:**
   - Check Supabase for user growth
   - Review API costs (DeepSeek, OpenAI)

2. **Customize for your needs:**
   - Add more food brands
   - Adjust AI prompts
   - Change calorie targets

3. **Scale up:**
   - Upgrade n8n plan if hitting limits
   - Implement caching for food database
   - Add user analytics

---

## Support

**Issues?**
- Check BOT_SETUP.md troubleshooting section
- Review BOT_OVERVIEW.md for architecture
- Check n8n logs for errors
- Message creator for help

---

**Last Updated:** 2026-06-06  
**Version:** 5.1
