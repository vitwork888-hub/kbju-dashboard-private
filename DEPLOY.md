# Инструкция по развёртыванию

## Шаг 1: Создать репозиторий на GitHub

1. Перейти на https://github.com/new
2. Repository name: `kbju-dashboard-private`
3. Description: `Telegram Mini App for calorie tracking`
4. **Выбрать: Private** (если это приватный проект)
5. **НЕ выбирать** "Initialize with README" (у нас уже есть)
6. Нажать **Create repository**

## Шаг 2: Пушить код (если не получилось через CLI)

Выполнить команды в проекте (папка `/Users/vit888/Desktop/WORK/kbju-dashboard-private`):

```bash
# Если remote не добавлен:
git remote add origin https://github.com/vitwork888/kbju-dashboard-private.git

# Пушить (замени ghp_... на свой актуальный PAT):
git push -u https://<PAT>@github.com/vitwork888/kbju-dashboard-private.git main

# Или через SSH (если настроен):
git push -u origin main
```

## Шаг 3: Настроить GitHub Pages

1. Перейти в репозитории в **Settings** → **Pages**
2. **Source:** Выбрать "Deploy from a branch"
3. **Branch:** Выбрать `gh-pages`
4. Нажать **Save**
5. Ждать ~5 минут, пока GitHub Actions закончит первый деплой

## Шаг 4: Добавить Supabase secrets

1. Перейти в **Settings** → **Secrets and variables** → **Actions**
2. Нажать **New repository secret**
3. Добавить два секрета:

```
Name: VITE_SUPABASE_URL
Value: https://your-project.supabase.co
```

```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

(Получить значения из Supabase Project Settings → API)

## Шаг 5: Проверить деплой

1. Перейти в репозиторие в **Actions**
2. Должна быть зелёная галочка у последнего коммита
3. Если есть красный крест — кликнуть на него и посмотреть ошибку в логах
4. После успешного деплоя, сайт будет доступен по:

```
https://vitwork888.github.io/kbju-dashboard-private/
```

(или на пользовательском домене, если настроил в deploy.yml)

## Шаг 6: Добавить кнопку в Telegram бот

В n8n боте, в запросе на отправку клавиатуры, добавить:

```javascript
{
  "inline_keyboard": [[
    {
      "text": "📊 Открыть дневник",
      "web_app": {
        "url": "https://vitwork888.github.io/kbju-dashboard-private/"
      }
    }
  ]]
}
```

Или в кастомном домене (если настроил):

```javascript
{
  "text": "📊 Открыть дневник",
  "web_app": {
    "url": "https://kbju-dashboard.vitwork.dev/"
  }
}
```

## Troubleshooting

### GitHub Actions не запускается
- Проверить, что файл `.github/workflows/deploy.yml` существует
- Проверить, что коммит на main ветке (не на develop или другой)

### "Repository not found" при пуше
- Проверить, что репозиторий создан на GitHub
- Проверить, что PAT актуален и имеет права на repo
- Попробовать через Web UI загрузить файлы

### Supabase ошибки на мини-приложении
- Проверить, что секреты добавлены в GitHub Actions
- Проверить, что RLS политики правильно настроены в Supabase
- Проверить консоль браузера (F12) на ошибки

### Мини-приложение открывается пусто
- Проверить интернет соединение
- Проверить, что Supabase credentials верные
- Открыть в Telegram Web App (F12 → console) и посмотреть ошибки
- Проверить, что пользователь авторизован в Telegram

## После успешного деплоя

1. Отправить боту команду, чтобы открилось мини-приложение
2. Убедиться, что загружаются данные (Dashboard показывает калории)
3. Проверить все три вкладки (Dashboard, Profile, Statistics)
4. Попробовать в мобильном Telegram (iOS/Android)

## Ссылки

- [GitHub Pages Setup](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [Telegram Mini Apps](https://core.telegram.org/bots/webapps)
- [Supabase Environment Variables](https://supabase.com/docs/guides/auth/server-side-auth)

---

**Если что-то не работает — напиши ошибку в issue на GitHub! 🚀**
