import { useEffect, useState } from 'react'
import { useTelegram } from '../context/TelegramContext'
import { getUserProfile, getTodayCalories } from '../lib/supabase'

export default function Dashboard() {
  const { userId } = useTelegram()
  const [profile, setProfile] = useState<any>(null)
  const [calories, setCalories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      if (!userId) return
      try {
        const [prof, cals] = await Promise.all([
          getUserProfile(userId),
          getTodayCalories(userId),
        ])
        setProfile(prof)
        setCalories(cals)
      } catch (err) {
        console.error('Error loading data:', err)
      }
      setLoading(false)
    }

    loadData()
  }, [userId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-on-surface-variant">Загрузка дневника...</p>
      </div>
    )
  }

  const totalCalories = calories.reduce((sum, cal) => sum + (cal.amount || 0), 0)
  const totalProteins = calories.reduce((sum, cal) => sum + (cal.proteins || 0), 0)
  const totalFats = calories.reduce((sum, cal) => sum + (cal.fats || 0), 0)
  const totalCarbs = calories.reduce((sum, cal) => sum + (cal.carbs || 0), 0)

  const targetK = profile?.target_k || 2500
  const targetP = profile?.target_p || 150
  const targetF = profile?.target_f || 70
  const targetC = profile?.target_c || 275

  const remaining = Math.max(0, targetK - totalCalories)
  const caloriePercent = Math.min((totalCalories / targetK) * 100, 100)

  // Calendar setup - get current week
  const today = new Date()
  const currentDayOfWeek = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - (currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1))

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
  const calendarDays = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    return {
      day: weekDays[i],
      date: date.getDate(),
      isToday: date.toDateString() === today.toDateString(),
    }
  })

  return (
    <div className="pt-16 px-container-padding pb-20">
      <div className="max-w-4xl mx-auto space-y-section-margin">
        {/* Calendar Strip */}
        <section className="glass-card rounded-2xl p-4 flex justify-between items-center">
          {calendarDays.map((day, i) => (
            <div
              key={i}
              className={`flex flex-col items-center gap-1 ${day.isToday ? '' : 'opacity-50'}`}
            >
              <span className="font-label-caps text-label-caps text-on-surface-variant">{day.day}</span>
              {day.isToday ? (
                <div className="glass-panel rounded-full px-3 py-1 border-2 border-primary">
                  <span className="font-body-sm text-body-sm text-primary font-bold">{day.date}</span>
                </div>
              ) : (
                <span className="font-body-sm text-body-sm w-10 h-10 flex items-center justify-center">{day.date}</span>
              )}
            </div>
          ))}
        </section>

        {/* Main Calories Dashboard */}
        <section className="glass-card rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col z-10 w-full md:w-auto">
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">
              {remaining} <span className="text-headline-md text-on-surface-variant font-normal">/ {targetK}</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">ккал осталось</p>
          </div>

          {/* Progress Ring */}
          <div className="relative w-40 h-40 flex-shrink-0 z-10">
            <svg className="w-full h-full circle-progress" viewBox="0 0 100 100">
              <circle cx="50" cy="50" fill="none" r="42" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="text-surface-variant opacity-30" />
              <circle
                cx="50"
                cy="50"
                fill="none"
                r="42"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                className="text-primary transition-all duration-1000"
                style={{
                  strokeDasharray: `${2 * Math.PI * 42}`,
                  strokeDashoffset: `${2 * Math.PI * 42 - (caloriePercent / 100) * 2 * Math.PI * 42}`,
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_fire_department
              </span>
            </div>
          </div>
        </section>

        {/* Macro Cards Grid */}
        <section className="grid grid-cols-3 gap-3">
          {/* Proteins */}
          <div className="glass-card rounded-3xl p-4 flex flex-col items-center justify-center text-center">
            <div className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">Белки</div>
            <div className="font-body-sm text-body-sm font-semibold text-on-surface mb-3">
              {Math.round(totalProteins)}<span className="text-xs text-on-surface-variant font-normal">/{targetP}g</span>
            </div>
            <div className="relative w-16 h-16">
              <svg className="w-full h-full circle-progress" viewBox="0 0 100 100">
                <circle cx="50" cy="50" fill="none" r="40" stroke="currentColor" strokeWidth="8" className="text-error-container opacity-50" />
                <circle
                  cx="50"
                  cy="50"
                  fill="none"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className="text-tertiary transition-all duration-1000"
                  style={{
                    strokeDasharray: `${2 * Math.PI * 40}`,
                    strokeDashoffset: `${2 * Math.PI * 40 - ((totalProteins / targetP) / 100) * 2 * Math.PI * 40}`,
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-tertiary text-xl">egg_alt</span>
              </div>
            </div>
          </div>

          {/* Carbs */}
          <div className="glass-card rounded-3xl p-4 flex flex-col items-center justify-center text-center">
            <div className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">Углеводы</div>
            <div className="font-body-sm text-body-sm font-semibold text-on-surface mb-3">
              {Math.round(totalCarbs)}<span className="text-xs text-on-surface-variant font-normal">/{targetC}g</span>
            </div>
            <div className="relative w-16 h-16">
              <svg className="w-full h-full circle-progress" viewBox="0 0 100 100">
                <circle cx="50" cy="50" fill="none" r="40" stroke="currentColor" strokeWidth="8" className="text-secondary-fixed opacity-50" />
                <circle
                  cx="50"
                  cy="50"
                  fill="none"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className="text-secondary transition-all duration-1000"
                  style={{
                    strokeDasharray: `${2 * Math.PI * 40}`,
                    strokeDashoffset: `${2 * Math.PI * 40 - ((totalCarbs / targetC) / 100) * 2 * Math.PI * 40}`,
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary text-xl">bakery_dining</span>
              </div>
            </div>
          </div>

          {/* Fats */}
          <div className="glass-card rounded-3xl p-4 flex flex-col items-center justify-center text-center">
            <div className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">Жиры</div>
            <div className="font-body-sm text-body-sm font-semibold text-on-surface mb-3">
              {Math.round(totalFats)}<span className="text-xs text-on-surface-variant font-normal">/{targetF}g</span>
            </div>
            <div className="relative w-16 h-16">
              <svg className="w-full h-full circle-progress" viewBox="0 0 100 100">
                <circle cx="50" cy="50" fill="none" r="40" stroke="currentColor" strokeWidth="8" className="text-surface-variant opacity-50" />
                <circle
                  cx="50"
                  cy="50"
                  fill="none"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className="text-inverse-surface transition-all duration-1000"
                  style={{
                    strokeDasharray: `${2 * Math.PI * 40}`,
                    strokeDashoffset: `${2 * Math.PI * 40 - ((totalFats / targetF) / 100) * 2 * Math.PI * 40}`,
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-inverse-surface text-xl">water_drop</span>
              </div>
            </div>
          </div>
        </section>

        {/* Food Log */}
        <section>
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-card-gap">Дневник за сегодня</h2>
          {calories.length === 0 ? (
            <div className="glass-card rounded-2xl p-6 text-center">
              <p className="text-on-surface-variant">Пока нет записей</p>
            </div>
          ) : (
            <div className="space-y-3">
              {calories.map((cal) => (
                <div key={cal.id} className="glass-card rounded-2xl p-3 flex gap-4 items-center card-press">
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container-highest flex items-center justify-center text-2xl">
                    📍
                  </div>
                  <div className="flex-1">
                    <h4 className="font-body-lg text-body-lg font-semibold text-on-surface">{cal.note}</h4>
                    <p className="text-xs text-on-surface-variant mt-1">
                      Б: {cal.proteins || 0}г | Ж: {cal.fats || 0}г | У: {cal.carbs || 0}г
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-headline-sm text-headline-sm block text-on-background">{cal.amount}</span>
                    <span className="text-xs text-on-surface-variant">ккал</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
