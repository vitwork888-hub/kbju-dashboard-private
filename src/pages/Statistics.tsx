import { useEffect, useState } from 'react'
import { useTelegram } from '../context/TelegramContext'
import { getStatsForPeriod, getUserProfile } from '../lib/supabase'

type Period = 7 | 30

export default function Statistics() {
  const { userId } = useTelegram()
  const [period, setPeriod] = useState<Period>(7)
  const [stats, setStats] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      if (!userId) return
      setLoading(true)
      const [data, prof] = await Promise.all([
        getStatsForPeriod(userId, period),
        getUserProfile(userId),
      ])
      setStats(data)
      setProfile(prof)
      setLoading(false)
    }
    loadData()
  }, [userId, period])

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-on-surface-variant">Загрузка статистики...</div>
  }

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
  const targetK = profile?.target_k || 2000
  const avgKcal = dates.length > 0
    ? Math.round(dates.reduce((sum, date) => sum + groupedStats[date].k, 0) / dates.length)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-container-low to-background p-container-padding-mobile md:p-container-padding-desktop">
      <div className="max-w-2xl mx-auto space-y-stack-md">
        {/* Header */}
        <h1 className="font-headline-lg text-headline-lg text-on-background">Статистика</h1>

        {/* Period Toggle */}
        <div className="flex gap-3">
          <button
            onClick={() => setPeriod(7)}
            className={`flex-1 py-3 rounded-lg font-label-md text-label-md transition-all active:scale-95 ${
              period === 7
                ? 'bg-primary text-on-primary'
                : 'bg-white/70 text-on-background border border-surface-variant backdrop-blur-sm'
            }`}
          >
            7 дней
          </button>
          <button
            onClick={() => setPeriod(30)}
            className={`flex-1 py-3 rounded-lg font-label-md text-label-md transition-all active:scale-95 ${
              period === 30
                ? 'bg-primary text-on-primary'
                : 'bg-white/70 text-on-background border border-surface-variant backdrop-blur-sm'
            }`}
          >
            30 дней
          </button>
        </div>

        {/* Average Stats */}
        {dates.length > 0 && (
          <div className="bg-gradient-to-br from-primary to-primary-container rounded-xl p-6 text-on-primary">
            <p className="text-sm opacity-90 mb-2">Среднее в день</p>
            <p className="font-display-lg text-display-lg">{avgKcal}</p>
            <p className="text-xs opacity-80 mt-2">на основе {dates.length} дней</p>
          </div>
        )}

        {/* Timeline */}
        <div className="space-y-3">
          {dates.length === 0 ? (
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-surface-variant text-center">
              <p className="text-on-surface-variant">Нет данных за этот период</p>
            </div>
          ) : (
            dates.map((date) => {
              const data = groupedStats[date]
              const percent = Math.round((data.k / targetK) * 100)

              return (
                <div key={date} className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-surface-variant active:scale-95 transition-transform cursor-pointer">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-body-md text-body-md font-semibold text-on-background">
                        {new Date(date).toLocaleDateString('ru-RU', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                        })}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-1">{data.count} записей</p>
                    </div>
                    <div className="text-right">
                      <p className="font-stats-number text-stats-number text-on-background">{Math.round(data.k)}</p>
                      <p className="text-xs text-on-surface-variant">ккал</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-surface-variant rounded-full h-2 mb-4 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary to-primary-container h-full transition-all duration-500"
                      style={{ width: `${Math.min(percent, 100)}%` }}
                    />
                  </div>

                  {/* Macro Breakdown */}
                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-surface-variant">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-primary mb-1" />
                      <p className="text-xs text-on-surface-variant uppercase">Б</p>
                      <p className="font-label-md text-label-md text-on-background">{data.p.toFixed(0)}г</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-secondary-container mb-1" />
                      <p className="text-xs text-on-surface-variant uppercase">Ж</p>
                      <p className="font-label-md text-label-md text-on-background">{data.f.toFixed(0)}г</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-error mb-1" />
                      <p className="text-xs text-on-surface-variant uppercase">У</p>
                      <p className="font-label-md text-label-md text-on-background">{data.c.toFixed(0)}г</p>
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