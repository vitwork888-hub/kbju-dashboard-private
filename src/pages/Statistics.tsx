import { useEffect, useState } from 'react'
import { useTelegram } from '../context/TelegramContext'
import { getStatsForPeriod } from '../lib/supabase'

type Period = 7 | 30

export default function Statistics() {
  const { userId } = useTelegram()
  const [period, setPeriod] = useState<Period>(7)
  const [stats, setStats] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      if (!userId) return
      setLoading(true)
      const data = await getStatsForPeriod(userId, period)
      setStats(data)
      setLoading(false)
    }
    loadStats()
  }, [userId, period])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Загрузка статистики...</div>
  }

  // Group by date and calculate totals
  const groupedStats = stats.reduce((acc: Record<string, any>, item: any) => {
    if (!acc[item.date]) {
      acc[item.date] = { k: 0, p: 0, f: 0, c: 0, count: 0 }
    }
    acc[item.date].k += item.amount || 0
    acc[item.date].p += item.proteins || 0
    acc[item.date].f += item.fats || 0
    acc[item.date].c += item.carbs || 0
    acc[item.date].count += 1
    return acc
  }, {})

  const dates = Object.keys(groupedStats).sort().reverse()
  const avgKcal = dates.length > 0
    ? Math.round(dates.reduce((sum, date) => sum + groupedStats[date].k, 0) / dates.length)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-md mx-auto pt-6">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Статистика</h1>

        {/* Period toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setPeriod(7)}
            className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
              period === 7
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-800 border border-gray-200'
            }`}
          >
            7 дней
          </button>
          <button
            onClick={() => setPeriod(30)}
            className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
              period === 30
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-800 border border-gray-200'
            }`}
          >
            30 дней
          </button>
        </div>

        {/* Average stats */}
        {dates.length > 0 && (
          <div className="bg-gradient-primary rounded-lg p-6 text-white mb-6">
            <p className="text-sm opacity-90 mb-2">Среднее в день</p>
            <p className="text-3xl font-bold">{avgKcal}</p>
            <p className="text-xs opacity-80 mt-1">на основе {dates.length} дней</p>
          </div>
        )}

        {/* Timeline */}
        <div className="space-y-3">
          {dates.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Нет данных за этот период</p>
          ) : (
            dates.map((date) => {
              const data = groupedStats[date]
              const percent = Math.round((data.k / 2000) * 100)

              return (
                <div key={date} className="bg-white rounded-lg p-4 shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {new Date(date).toLocaleDateString('ru-RU', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                        })}
                      </p>
                      <p className="text-xs text-gray-500">{data.count} записей</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">{Math.round(data.k)} ккал</p>
                      <p className="text-xs text-gray-500">{percent}%</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-primary h-2 rounded-full"
                      style={{ width: `${Math.min(percent, 100)}%` }}
                    ></div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-200">
                    <div className="text-center">
                      <p className="text-xs text-pink-600 font-semibold">{data.p.toFixed(0)}г</p>
                      <p className="text-xs text-gray-600">Белки</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-amber-600 font-semibold">{data.f.toFixed(0)}г</p>
                      <p className="text-xs text-gray-600">Жиры</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-blue-600 font-semibold">{data.c.toFixed(0)}г</p>
                      <p className="text-xs text-gray-600">Углеводы</p>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}