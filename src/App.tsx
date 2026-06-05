import { useEffect, useState } from 'react'
import { TelegramProvider } from './context/TelegramContext'
import Layout from './components/Layout'

function AppContent() {
  return <Layout />
}

export default function App() {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100)
    return () => clearTimeout(timer)
  }, [])

  if (!isReady) {
    return <div className="flex items-center justify-center h-screen">Загрузка...</div>
  }

  return (
    <TelegramProvider>
      <AppContent />
    </TelegramProvider>
  )
}
