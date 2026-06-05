# 📡 KBZU Bot — API Reference

Complete reference for all bot API endpoints, events, and responses.

---

## Table of Contents

- [Telegram Events](#telegram-events)
- [Bot Commands](#bot-commands)
- [Response Formats](#response-formats)
- [Webhook Payloads](#webhook-payloads)
- [Error Codes](#error-codes)
- [Rate Limits](#rate-limits)

---

## Telegram Events

All events are sent to your webhook via POST requests.

### 1. Message Event

**When:** User sends a text message

```json
{
  "update_id": 123456789,
  "message": {
    "message_id": 42,
    "from": {
      "id": 987654321,
      "is_bot": false,
      "first_name": "John",
      "username": "johndoe",
      "language_code": "en"
    },
    "chat": {
      "id": 987654321,
      "first_name": "John",
      "username": "johndoe",
      "type": "private"
    },
    "date": 1717675200,
    "text": "Chicken 300g"
  }
}
```

### 2. Photo Message

**When:** User sends a photo (with optional caption)

```json
{
  "update_id": 123456789,
  "message": {
    "message_id": 43,
    "from": {"id": 987654321, "first_name": "John"},
    "chat": {"id": 987654321, "type": "private"},
    "date": 1717675200,
    "photo": [
      {
        "file_id": "AgADBQADl6...",
        "file_unique_id": "AQADl6...",
        "width": 320,
        "height": 240,
        "file_size": 12345
      }
    ],
    "caption": "Breakfast"
  }
}
```

### 3. Callback Query (Button Click)

**When:** User clicks an inline button

```json
{
  "update_id": 123456789,
  "callback_query": {
    "id": "callback_query_id_123",
    "from": {"id": 987654321, "first_name": "John"},
    "chat_instance": "12345",
    "data": "action_delete_entry_42",
    "message": {
      "message_id": 44,
      "chat": {"id": 987654321},
      "date": 1717675200,
      "text": "Entry added: Chicken 300g"
    }
  }
}
```

---

## Bot Commands

### /start

Initiates user onboarding.

**Trigger:** User sends `/start` or opens bot for first time

**Flow:**
1. Check if user exists in DB
2. If new: Show profile setup questions
3. If existing: Show main menu

**Response:**
```
Welcome to KBZU Bot! 🥗

Let's set up your profile.
What's your gender?
[Male] [Female] [Other]
```

### /profile

Show user's current profile

**Response:**
```
📋 Your Profile

Gender: Male
Age: 28 years
Height: 180 cm
Weight: 75 kg
Activity: Moderate

Daily Goal: 2200 kcal
Protein: 165g | Fat: 73g | Carbs: 275g

[Edit Profile]
```

### /today

Show today's totals

**Response:**
```
📊 Today's Progress

Eaten: 1650 / 2200 kcal (75%)

🔴 Protein: 120g / 165g (73%)
🟠 Fat: 55g / 73g (75%)
🟡 Carbs: 210g / 275g (76%)

Remaining: 550 kcal

[View Entries] [Add Food]
```

### /stats

Show weekly/monthly trends

**Parameters:**
- `7` — last 7 days
- `30` — last 30 days

**Response:**
```
📈 7-Day Average

Calories: 2150 kcal/day
Protein: 162g/day
Fat: 71g/day
Carbs: 272g/day

Status: 🟢 On track

[30-day stats] [Back]
```

### /help

Show help information

**Response:**
```
🆘 Need Help?

I can help you track food and get nutrition advice!

📝 How to use:
• Send food name: "Chicken 300g"
• Send photo: 📸 [photo of meal]
• Ask questions: "Should I eat more?"

🤖 Commands:
/start - Set up profile
/profile - View your profile
/today - Show today's totals
/stats - View trends
/help - Show this message

Questions? Message @vitwork888
```

---

## Response Formats

### Text Food Entry Response

**Scenario:** User sends `"Chicken 300g"`

```
✅ Added: Chicken 300g

Calories: 330 kcal
Protein: 35g | Fat: 12g | Carbs: 0g

Total today: 1650 / 2200 kcal (🟢 on track)
Protein: 120g / 165g
Fat: 55g / 73g
Carbs: 210g / 275g

[Delete entry] [Edit] [Add another]
```

### Photo Recognition Response

**Scenario:** User sends food photo

```
📸 Analyzing your meal...

🍗 Chicken & Rice Bowl

Estimated portion: 300g
Calories: 420 kcal
Protein: 28g | Fat: 15g | Carbs: 45g

Is this correct?
[Yes, save] [Wrong, re-estimate] [Skip]
```

### AI Nutritionist Response

**Scenario:** User asks "Should I eat more?"

```
🥗 Nutrition Tip

You've eaten 1600 kcal so far. Your goal is 2000 kcal.

✅ You have 400 kcal left for the day!

💪 Tip: Your protein is at 72g/80g. 
Try a protein-rich snack:
• Greek yogurt (100g) - 20g protein
• Almonds (30g) - 6g protein
• Cottage cheese (100g) - 28g protein

Would you like recommendations?
[Breakfast] [Lunch] [Dinner] [Snacks]
```

### Error Response

**Scenario:** Something went wrong

```
⚠️ Oops!

Sorry, I couldn't recognize that food.
Try: "Chicken 300g" or send a photo.

Common formats:
• Food name + portion: "Rice 200g"
• Brand + product: "NL International Isolate 30g"
• Photo of meal: 📸

Need help? /help
```

---

## Webhook Payloads

### Webhook URL Structure

```
POST https://[n8n-instance]/webhook/kbju-bot

Headers:
Content-Type: application/json

Body: Telegram event (JSON)
```

### Webhook Signature Verification

Telegram sends all events with standard HTTPS.

```bash
# Verify webhook is set correctly
curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"

Response:
{
  "ok": true,
  "result": {
    "url": "https://n8n.example.com/webhook/kbju-bot",
    "has_custom_certificate": false,
    "pending_update_count": 0,
    "max_connections": 10,
    "allowed_updates": ["message", "callback_query"]
  }
}
```

### Request Format

All Telegram events follow this structure:

```json
{
  "update_id": 123456789,
  "[event_type]": {
    // Event-specific data
  }
}
```

**Possible event types:**
- `message` — text or photo
- `callback_query` — button click
- `edited_message` — edited message
- `channel_post` — channel message

---

## Error Codes

### Telegram API Errors

| Error | Meaning | Solution |
|-------|---------|----------|
| 400 | Bad request | Check payload format |
| 401 | Unauthorized | Verify BOT_TOKEN |
| 403 | Forbidden | Bot was blocked by user |
| 404 | Not found | Webhook URL incorrect |
| 429 | Too many requests | Rate limited, wait and retry |

### DeepSeek API Errors

| Error | Meaning | Solution |
|-------|---------|----------|
| 401 | Invalid API key | Check DEEPSEEK_API_KEY |
| 402 | Insufficient credit | Add credits to account |
| 429 | Rate limited | Implement backoff |
| 500 | Server error | Retry with backoff |

### OpenAI API Errors

| Error | Meaning | Solution |
|-------|---------|----------|
| 401 | Invalid API key | Check OPENAI_API_KEY |
| 402 | Insufficient credits | Add credits to account |
| 429 | Rate limited | Implement backoff |
| 500 | Server error | Retry with backoff |

### Supabase Errors

| Error | Meaning | Solution |
|-------|---------|----------|
| PGRST001 | JWT invalid | Check API key |
| PGRST002 | Row not found | Check user_id exists |
| PGRST003 | Relation not found | Check table names |
| PGRST004 | RLS policy blocked | Check RLS policies |

---

## Rate Limits

### Telegram API

- **Messages:** 30 messages per second (per bot)
- **Updates:** 30 updates per second
- **Webhook:** Max 1 connection, configurable

### DeepSeek API

- **Free tier:** 10 requests/minute
- **Paid tier:** Based on plan
- **Implementation:** Implement queue system

### OpenAI API

- **Text (GPT-4):** 10,000 requests/minute
- **Vision (GPT-4o-mini):** 500 requests/minute
- **Implementation:** Add request queuing

### Supabase

- **Reads:** 100,000/second (free tier)
- **Writes:** 10,000/second (free tier)
- **File storage:** 10GB (free tier)

---

## Implementation Examples

### Send Message via n8n

```javascript
// In HTTP Request node

POST https://api.telegram.org/bot<BOT_TOKEN>/sendMessage

{
  "chat_id": 987654321,
  "text": "✅ Added: Chicken 300g",
  "reply_markup": {
    "inline_keyboard": [[
      {"text": "Delete", "callback_data": "delete_42"}
    ]]
  }
}
```

### Send Photo via n8n

```javascript
POST https://api.telegram.org/bot<BOT_TOKEN>/sendPhoto

{
  "chat_id": 987654321,
  "photo": "https://example.com/chart.png",
  "caption": "Your 7-day trend"
}
```

### Query Supabase via n8n

```javascript
GET https://your-project.supabase.co/rest/v1/food_entries?user_id=eq.{user_id}&order=created_at.desc&limit=10

Headers:
Authorization: Bearer <ANON_KEY>
```

---

## Best Practices

### 1. Error Handling

Always provide fallback messages:
```
If DeepSeek fails:
"Sorry, I couldn't analyze that. Try: 'Chicken 300g'"

If Supabase fails:
"Database unavailable. Please try again in a moment."
```

### 2. User Feedback

Confirm all actions:
```
✅ Added: [food]
⏳ Calculating macros...
📊 Updating totals...
```

### 3. Message Formatting

Use emoji for quick scanning:
```
✅ Success
⚠️ Warning
❌ Error
📊 Stats
🤖 AI tip
```

### 4. Rate Limiting

Implement queuing for API calls:
```
User sends 5 photos → Queue requests → Process one per second
```

---

## Testing API

### Manual Webhook Test

```bash
curl -X POST https://n8n.example.com/webhook/kbju-bot \
  -H "Content-Type: application/json" \
  -d '{
    "update_id": 1,
    "message": {
      "message_id": 1,
      "from": {"id": 123, "first_name": "Test"},
      "chat": {"id": 123, "type": "private"},
      "date": 1717675200,
      "text": "Chicken 300g"
    }
  }'
```

### Test DeepSeek API

```bash
curl -X POST https://api.deepseek.com/v1/chat/completions \
  -H "Authorization: Bearer $DEEPSEEK_API_KEY" \
  -d '{
    "model": "deepseek-chat",
    "messages": [{"role": "user", "content": "Parse: Chicken 300g"}]
  }'
```

---

**Last Updated:** 2026-06-06  
**Version:** 5.1
