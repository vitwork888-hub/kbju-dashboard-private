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
  const proteinPercent = Math.min((totalProteins / targetP) * 100, 100)
  const carbsPercent = Math.min((totalCarbs / targetC) * 100, 100)
  const fatsPercent = Math.min((totalFats / targetF) * 100, 100)

  // Calendar setup
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
    <div className="pt-20 px-container-padding pb-32">
      <div className="max-w-4xl mx-auto space-y-5">
        {/* Calendar Strip */}
        <section className="glass-card rounded-2xl p-4 flex justify-between items-center">
          {calendarDays.map((day, i) => (
            <div
              key={i}
              className={`flex flex-col items-center gap-1 ${day.isToday ? '' : 'opacity-50'}`}
            >
              <span className="font-label-caps text-label-caps text-on-surface-variant">{day.day}</span>
              {day.isToday ? (
                <div className="flex flex-col items-center gap-1 bg-white rounded-full p-1 pb-2 shadow-sm border border-primary/20 relative">
                  <span className="font-label-caps text-label-caps text-on-surface mt-1 px-2 text-xs">{day.day}</span>
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 border-2 border-primary text-primary font-bold text-sm">
                    {day.date}
                  </div>
                  <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full" />
                </div>
              ) : (
                <span className="font-body-sm text-body-sm w-10 h-10 flex items-center justify-center">{day.date}</span>
              )}
            </div>
          ))}
        </section>

        {/* Combined Dashboard */}
        <section className="glass-card rounded-2xl p-5 flex flex-col gap-6 relative overflow-hidden">
          {/* Decorative blur */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl z-0" />

          {/* Top Overview with mini ring */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 flex-shrink-0">
                <svg className="w-full h-full circle-progress" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" fill="none" r="42" stroke="currentColor" strokeWidth="10" strokeLinecap="round" className="text-surface-variant opacity-30" />
                  <circle
                    cx="50"
                    cy="50"
                    fill="none"
                    r="42"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                    className="text-primary transition-all duration-1000"
                    style={{
                      strokeDasharray: `${2 * Math.PI * 42}`,
                      strokeDashoffset: `${2 * Math.PI * 42 - (caloriePercent / 100) * 2 * Math.PI * 42}`,
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    local_fire_department
                  </span>
                </div>
              </div>
              <div>
                <h1 className="font-display-lg-mobile text-on-surface leading-none mb-1">
                  {remaining} <span className="text-headline-sm text-on-surface-variant font-normal">/ {targetK}</span>
                </h1>
                <p className="font-body-sm text-on-surface-variant">ккал осталось</p>
              </div>
            </div>
          </div>

          {/* Macro Cards Grid */}
          <div className="grid grid-cols-3 gap-3 z-10">
            {/* Proteins */}
            <div className="bg-white/50 rounded-3xl p-3 flex flex-col items-center justify-center text-center shadow-sm border border-white/60">
              <div className="font-label-caps text-on-surface-variant mb-1 text-xs uppercase">Белки</div>
              <div className="relative w-12 h-12 mb-2">
                <svg className="w-full h-full circle-progress" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" fill="none" r="40" stroke="currentColor" strokeWidth="10" className="text-error-container opacity-50" />
                  <circle
                    cx="50"
                    cy="50"
                    fill="none"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                    className="text-tertiary transition-all duration-1000"
                    style={{
                      strokeDasharray: `${2 * Math.PI * 40}`,
                      strokeDashoffset: `${2 * Math.PI * 40 - (proteinPercent / 100) * 2 * Math.PI * 40}`,
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-tertiary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    egg_alt
                  </span>
                </div>
              </div>
              <div className="font-body-sm text-sm font-semibold text-on-surface leading-none">
                {Math.round(totalProteins)}<span className="text-xs text-on-surface-variant font-normal ml-0.5">/{targetP}г</span>
              </div>
            </div>

            {/* Carbs */}
            <div className="bg-white/50 rounded-3xl p-3 flex flex-col items-center justify-center text-center shadow-sm border border-white/60">
              <div className="font-label-caps text-on-surface-variant mb-1 text-xs uppercase">Углеводы</div>
              <div className="relative w-12 h-12 mb-2">
                <svg className="w-full h-full circle-progress" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" fill="none" r="40" stroke="currentColor" strokeWidth="10" className="text-secondary-fixed opacity-50" />
                  <circle
                    cx="50"
                    cy="50"
                    fill="none"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                    className="text-secondary transition-all duration-1000"
                    style={{
                      strokeDasharray: `${2 * Math.PI * 40}`,
                      strokeDashoffset: `${2 * Math.PI * 40 - (carbsPercent / 100) * 2 * Math.PI * 40}`,
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    bakery_dining
                  </span>
                </div>
              </div>
              <div className="font-body-sm text-sm font-semibold text-on-surface leading-none">
                {Math.round(totalCarbs)}<span className="text-xs text-on-surface-variant font-normal ml-0.5">/{targetC}г</span>
              </div>
            </div>

            {/* Fats */}
            <div className="bg-white/50 rounded-3xl p-3 flex flex-col items-center justify-center text-center shadow-sm border border-white/60">
              <div className="font-label-caps text-on-surface-variant mb-1 text-xs uppercase">Жиры</div>
              <div className="relative w-12 h-12 mb-2">
                <svg className="w-full h-full circle-progress" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" fill="none" r="40" stroke="currentColor" strokeWidth="10" className="text-surface-variant opacity-50" />
                  <circle
                    cx="50"
                    cy="50"
                    fill="none"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                    className="text-inverse-surface transition-all duration-1000"
                    style={{
                      strokeDasharray: `${2 * Math.PI * 40}`,
                      strokeDashoffset: `${2 * Math.PI * 40 - (fatsPercent / 100) * 2 * Math.PI * 40}`,
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-inverse-surface text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    water_drop
                  </span>
                </div>
              </div>
              <div className="font-body-sm text-sm font-semibold text-on-surface leading-none">
                {Math.round(totalFats)}<span className="text-xs text-on-surface-variant font-normal ml-0.5">/{targetF}г</span>
              </div>
            </div>
          </div>
        </section>

        {/* Food Log */}
        <section className="flex flex-col gap-4 pb-8">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Дневник за сегодня</h2>

          {calories.length === 0 ? (
            <div className="glass-card rounded-2xl p-6 text-center">
              <p className="text-on-surface-variant">Пока нет записей</p>
            </div>
          ) : (
            <div className="space-y-3">
              {calories.map((cal) => (
                <div key={cal.id} className="glass-card rounded-2xl p-3 flex gap-4 items-center card-press">
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container-highest flex items-center justify-center text-3xl">
                    📍
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-body-lg text-body-lg font-semibold text-on-surface">{cal.note}</h3>
                      <span className="font-label-caps text-label-caps text-on-surface-variant opacity-70 text-xs">сейчас</span>
                    </div>
                    <div className="flex items-center gap-1 text-on-surface mb-1">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                        local_fire_department
                      </span>
                      <span className="font-body-sm text-body-sm font-semibold">{cal.amount} калорий</span>
                    </div>
                    <div className="flex gap-3 font-label-caps text-label-caps text-on-surface-variant text-xs">
                      <span className="flex items-center gap-0.5">
                        <span className="w-2 h-2 rounded-full bg-tertiary" />
                        {cal.proteins || 0}г
                      </span>
                      <span className="flex items-center gap-0.5">
                        <span className="w-2 h-2 rounded-full bg-secondary" />
                        {cal.carbs || 0}г
                      </span>
                      <span className="flex items-center gap-0.5">
                        <span className="w-2 h-2 rounded-full bg-inverse-surface" />
                        {cal.fats || 0}г
                      </span>
                    </div>
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
