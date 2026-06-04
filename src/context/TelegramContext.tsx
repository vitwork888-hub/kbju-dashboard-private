import { createContext, useContext, ReactNode, useEffect, useState } from 'react'
import { initTelegramWebApp, TelegramWebApp } from '../lib/telegram'

interface TelegramContextType {
  tg: TelegramWebApp | null
  userId: number | null
  isReady: boolean
}

const TelegramContext = createContext<TelegramContextType | undefined>(undefined)

export function TelegramProvider({ children }: { children: ReactNode }) {
  const [context, setContext] = useState<TelegramContextType>({
    tg: null,
    userId: null,
    isReady: false,
  })

  useEffect(() => {
    const init = initTelegramWebApp()
    if (init) {
      setContext({
        tg: init.tg,
        userId: init.userId,
        isReady: true,
      })
    } else {
      setContext(prev => ({ ...prev, isReady: true }))
    }
  }, [])

  return (
    <TelegramContext.Provider value={context}>
      {children}
    </TelegramContext.Provider>
  )
}

export function useTelegram() {
  const context = useContext(TelegramContext)
  if (!context) {
    throw new Error('useTelegram must be used within TelegramProvider')
  }
  return context
}
