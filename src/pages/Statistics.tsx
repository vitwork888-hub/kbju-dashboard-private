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
    return (
      <div className="flex items-center justify-center h-screen text-on-surface-variant">
        Загрузка статистики...
      </div>
    )
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
  const avgKcal = dates.length > 0 ? Math.round(dates.reduce((sum, date) => sum + groupedStats[date].k, 0) / dates.length) : 0
  const streak = dates.filter((date, i) => {
    if (i === 0) return true
    const prevDate = new Date(dates[i - 1])
    const currentDate = new Date(date)
    return (prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24) <= 1
  }).length

  return (
    <div className="pt-16 px-container-padding pb-20">
      <div className="max-w-lg mx-auto space-y-section-margin">
        {/* Header */}
        <div>
          <h2 className="font-display-lg-mobile text-display-lg-mobile text-on-surface mb-2">Статистика</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Твой прогресс за период</p>
        </div>

        {/* Period Toggle */}
        <div className="flex gap-3">
          <button
            onClick={() => setPeriod(7)}
            className={`flex-1 py-3 rounded-lg font-label-caps text-label-caps transition-all active:scale-95 ${
              period === 7
                ? 'bg-primary text-on-primary'
                : 'glass-card text-on-background'
            }`}
          >
            7 дней
          </button>
          <button
            onClick={() => setPeriod(30)}
            className={`flex-1 py-3 rounded-lg font-label-caps text-label-caps transition-all active:scale-95 ${
              period === 30
                ? 'bg-primary text-on-primary'
                : 'glass-card text-on-background'
            }`}
          >
            30 дней
          </button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 gap-card-gap">
          {/* Average Kcal */}
          <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-4 text-primary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_fire_department
              </span>
              <span className="font-label-caps text-label-caps">СРЕДНЕЕ</span>
            </div>
            <div>
              <div className="font-display-lg-mobile text-display-lg-mobile text-on-surface">{avgKcal}</div>
              <div className="font-body-sm text-body-sm text-on-surface-variant">ккал/день</div>
            </div>
          </div>

          {/* Streak */}
          <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-4 text-secondary-container">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
              <span className="font-label-caps text-label-caps">СЕРИЯ</span>
            </div>
            <div>
              <div className="font-display-lg-mobile text-display-lg-mobile text-on-surface">
                {streak} <span className="font-headline-sm text-headline-sm text-on-surface-variant">дн</span>
              </div>
              <div className="font-body-sm text-body-sm text-on-surface-variant">активности</div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <section>
          <h3 className="font-headline-md text-headline-md text-on-surface mb-card-gap">
            {dates.length > 0 ? 'История' : 'Нет данных'}
          </h3>

          {dates.length === 0 ? (
            <div className="glass-card rounded-xl p-6 text-center">
              <p className="text-on-surface-variant">Нет данных за этот период</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dates.map((date) => {
                const data = groupedStats[date]
                const percent = Math.round((data.k / targetK) * 100)
                const dateObj = new Date(date)

                return (
                  <div key={date} className="glass-card rounded-2xl p-4 card-press">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-body-lg text-body-lg font-semibold text-on-background">
                          {dateObj.toLocaleDateString('ru-RU', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                          })}
                        </p>
                        <p className="text-xs text-on-surface-variant mt-1">{data.count} записей</p>
                      </div>
                      <div className="text-right">
                        <p className="font-display-lg-mobile text-display-lg-mobile text-on-background">{Math.round(data.k)}</p>
                        <p className="text-xs text-on-surface-variant">ккал</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-surface-variant rounded-full h-2 mb-4 overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all duration-500"
                        style={{ width: `${Math.min(percent, 100)}%` }}
                      />
                    </div>

                    {/* Macro Breakdown */}
                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-surface-variant">
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-tertiary mb-1" />
                        <p className="text-xs text-on-surface-variant uppercase">Б</p>
                        <p className="font-label-caps text-label-caps text-on-background">{data.p.toFixed(0)}г</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-secondary mb-1" />
                        <p className="text-xs text-on-surface-variant uppercase">У</p>
                        <p className="font-label-caps text-label-caps text-on-background">{data.c.toFixed(0)}г</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-inverse-surface mb-1" />
                        <p className="text-xs text-on-surface-variant uppercase">Ж</p>
                        <p className="font-label-caps text-label-caps text-on-background">{data.f.toFixed(0)}г</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
