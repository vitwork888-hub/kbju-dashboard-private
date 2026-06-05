import { useTelegram } from '../context/TelegramContext'

export default function DebugInfo() {
  const { userId, isReady } = useTelegram()

  if (!userId) {
    return (
      <div className="fixed bottom-20 left-0 right-0 bg-red-100 border-t border-red-400 p-3 text-center text-sm">
        <p className="text-red-800 font-semibold">⚠️ Ошибка: userId не найден</p>
        <p className="text-red-700">Используется Telegram Mini App?</p>
      </div>
    )
  }

  return (
    <div className="fixed bottom-20 left-0 right-0 bg-green-100 border-t border-green-400 p-2 text-center text-xs">
      <p className="text-green-800">✅ userId: {userId}</p>
    </div>
  )
}
