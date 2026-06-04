interface TelegramUser {
  id: number
  is_bot: boolean
  first_name: string
  username?: string
  language_code?: string
  is_premium?: boolean
}

export interface TelegramWebApp {
  ready: () => void
  expand: () => void
  close: () => void
  sendData: (data: string) => void
  initData: string
  initDataUnsafe: {
    query_id?: string
    user?: TelegramUser
    auth_date?: number
    hash?: string
    start_param?: string
  }
  colorScheme: 'light' | 'dark'
  themeParams: {
    bg_color?: string
    text_color?: string
    hint_color?: string
    link_color?: string
    button_color?: string
    button_text_color?: string
  }
  viewportHeight: number
  viewportStableHeight: number
  isExpanded: boolean
  isClosingConfirmationEnabled: boolean
  BackButton: {
    isVisible: boolean
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
    show: () => void
    hide: () => void
  }
  MainButton: {
    text: string
    color: string
    textColor: string
    isVisible: boolean
    isActive: boolean
    isProgressVisible: boolean
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
    show: () => void
    hide: () => void
    enable: () => void
    disable: () => void
    showProgress: () => void
    hideProgress: () => void
    setText: (text: string) => void
    setParams: (params: Partial<TelegramWebApp['MainButton']>) => void
  }
}

export function getTelegramWebApp(): TelegramWebApp | null {
  return (window as any).Telegram?.WebApp || null
}

export function initTelegramWebApp() {
  const tg = getTelegramWebApp()
  if (!tg) {
    console.warn('Telegram WebApp SDK not available')
    return null
  }

  tg.ready()
  tg.expand()

  return {
    tg,
    user: tg.initDataUnsafe.user || null,
    userId: tg.initDataUnsafe.user?.id || null,
  }
}

export function getUserIdFromTelegram(): number | null {
  const tg = getTelegramWebApp()
  return tg?.initDataUnsafe.user?.id || null
}
