import { useEffect, useState } from 'react'
import { TelegramProvider } from './context/TelegramContext'
import Layout from './components/Layout'

export default function App() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Wait for Telegram WebApp to be ready
    const timer = setTimeout(() => setIsReady(true), 100)
    return () => clearTimeout(timer)
  }, [])

  if (!isReady) {
    return <div className="flex items-center justify-center h-screen">Загрузка...</div>
  }

  return (
    <TelegramProvider>
      <Layout />
    </TelegramProvider>
  )
}
