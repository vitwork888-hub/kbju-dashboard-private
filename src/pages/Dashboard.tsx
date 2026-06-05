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
        <p className="text-gray-400">Загрузка дневника...</p>
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

  const caloriePercent = Math.min((totalCalories / targetK) * 100, 100)
  const proteinPercent = Math.min((totalProteins / targetP) * 100, 100)
  const carbsPercent = Math.min((totalCarbs / targetC) * 100, 100)
  const fatsPercent = Math.min((totalFats / targetF) * 100, 100)

  // Color logic for calories
  let calorieColor = '#4ae176' // green (normal)
  let calorieTextColor = 'text-white'
  if (totalCalories > targetK + 50) {
    calorieColor = '#ba1a1a' // red (over)
    calorieTextColor = 'text-error'
  } else if (totalCalories > targetK - 50 && totalCalories <= targetK) {
    calorieColor = '#ffc400' // yellow (close)
    calorieTextColor = 'text-yellow-400'
  } else if (totalCalories > targetK) {
    calorieColor = '#ffc400' // yellow (slightly over)
    calorieTextColor = 'text-yellow-400'
  }

  // Color logic for macros
  const getMacroColor = (eaten: number, target: number) => {
    if (eaten > target + 50) return { color: '#ba1a1a', textColor: 'text-error' }
    if (eaten > target - 50 && eaten <= target) return { color: '#ffc400', textColor: 'text-yellow-400' }
    if (eaten > target) return { color: '#ffc400', textColor: 'text-yellow-400' }
    return { color: '#4ae176', textColor: 'text-white' }
  }

  const proteinColor = getMacroColor(totalProteins, targetP)
  const carbsColor = getMacroColor(totalCarbs, targetC)
  const fatsColor = getMacroColor(totalFats, targetF)

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
    <div className="pt-5 px-container-padding pb-32 bg-[#0b1326] min-h-screen">
      <div className="max-w-4xl mx-auto space-y-5">
        {/* Bot Name Header */}
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-primary-fixed-dim text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            eco
          </span>
          <h1 className="font-headline-sm text-white font-bold">КБЖУ</h1>
        </div>

        {/* Calendar Strip */}
        <section className="glass-card-dark rounded-2xl p-4 flex justify-between items-center">
          {calendarDays.map((day, i) => (
            <div
              key={i}
              className={`flex flex-col items-center gap-1 ${day.isToday ? '' : 'opacity-50'}`}
            >
              <span className="font-label-caps text-label-caps text-gray-400 text-xs">{day.day}</span>
              {day.isToday ? (
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-fixed-dim/20 border-2 border-primary-fixed-dim text-primary-fixed-dim font-bold text-sm">
                  {day.date}
                </div>
              ) : (
                <span className="font-body-sm text-body-sm w-10 h-10 flex items-center justify-center text-white">{day.date}</span>
              )}
            </div>
          ))}
        </section>

        {/* Combined Dashboard */}
        <section className="glass-card-dark rounded-2xl p-5 flex flex-col gap-6 relative overflow-hidden">
          {/* Decorative blur */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-fixed-dim/20 rounded-full blur-3xl z-0" />

          {/* Top Overview with mini ring */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 flex-shrink-0">
                <svg className="w-full h-full circle-progress" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" fill="none" r="42" stroke="rgba(255,255,255,0.1)" strokeWidth="10" strokeLinecap="round" />
                  <circle
                    cx="50"
                    cy="50"
                    fill="none"
                    r="42"
                    stroke={calorieColor}
                    strokeWidth="10"
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                    style={{
                      strokeDasharray: `${2 * Math.PI * 42}`,
                      strokeDashoffset: `${2 * Math.PI * 42 - (caloriePercent / 100) * 2 * Math.PI * 42}`,
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1", color: calorieColor }}>
                    local_fire_department
                  </span>
                </div>
              </div>
              <div>
                <h1 className="font-display-lg-mobile text-white leading-none mb-1">
                  {targetK} <span className={`text-headline-sm font-normal ${calorieTextColor}`}>/ {Math.round(totalCalories)}</span>
                </h1>
                <p className="font-body-sm text-gray-400">ккал</p>
              </div>
            </div>
          </div>

          {/* Macro Cards Grid */}
          <div className="grid grid-cols-3 gap-3 z-10">
            {/* Proteins */}
            <div className="bg-white/5 rounded-3xl p-3 flex flex-col items-center justify-center text-center border border-white/10">
              <div className="font-label-caps text-gray-400 mb-1 text-xs uppercase">Белки</div>
              <div className="relative w-12 h-12 mb-2">
                <svg className="w-full h-full circle-progress" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" fill="none" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                  <circle
                    cx="50"
                    cy="50"
                    fill="none"
                    r="40"
                    stroke={proteinColor.color}
                    strokeWidth="10"
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                    style={{
                      strokeDasharray: `${2 * Math.PI * 40}`,
                      strokeDashoffset: `${2 * Math.PI * 40 - (proteinPercent / 100) * 2 * Math.PI * 40}`,
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-tertiary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    egg_alt
                  </span>
                </div>
              </div>
              <div className={`font-body-sm text-sm font-semibold leading-none text-white`}>
                <span className="text-xs text-gray-400">{targetP}г</span><span className="mx-0.5 text-gray-400">/</span><span className={proteinColor.textColor}>{Math.round(totalProteins)}г</span>
              </div>
            </div>

            {/* Fats */}
            <div className="bg-white/5 rounded-3xl p-3 flex flex-col items-center justify-center text-center border border-white/10">
              <div className="font-label-caps text-gray-400 mb-1 text-xs uppercase">Жиры</div>
              <div className="relative w-12 h-12 mb-2">
                <svg className="w-full h-full circle-progress" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" fill="none" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                  <circle
                    cx="50"
                    cy="50"
                    fill="none"
                    r="40"
                    stroke={fatsColor.color}
                    strokeWidth="10"
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                    style={{
                      strokeDasharray: `${2 * Math.PI * 40}`,
                      strokeDashoffset: `${2 * Math.PI * 40 - (fatsPercent / 100) * 2 * Math.PI * 40}`,
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-surface-variant text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    water_drop
                  </span>
                </div>
              </div>
              <div className={`font-body-sm text-sm font-semibold leading-none text-white`}>
                <span className="text-xs text-gray-400">{targetF}г</span><span className="mx-0.5 text-gray-400">/</span><span className={fatsColor.textColor}>{Math.round(totalFats)}г</span>
              </div>
            </div>

            {/* Carbs */}
            <div className="bg-white/5 rounded-3xl p-3 flex flex-col items-center justify-center text-center border border-white/10">
              <div className="font-label-caps text-gray-400 mb-1 text-xs uppercase">Углеводы</div>
              <div className="relative w-12 h-12 mb-2">
                <svg className="w-full h-full circle-progress" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" fill="none" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                  <circle
                    cx="50"
                    cy="50"
                    fill="none"
                    r="40"
                    stroke={carbsColor.color}
                    strokeWidth="10"
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                    style={{
                      strokeDasharray: `${2 * Math.PI * 40}`,
                      strokeDashoffset: `${2 * Math.PI * 40 - (carbsPercent / 100) * 2 * Math.PI * 40}`,
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    bakery_dining
                  </span>
                </div>
              </div>
              <div className={`font-body-sm text-sm font-semibold leading-none text-white`}>
                <span className="text-xs text-gray-400">{targetC}г</span><span className="mx-0.5 text-gray-400">/</span><span className={carbsColor.textColor}>{Math.round(totalCarbs)}г</span>
              </div>
            </div>
          </div>
        </section>

        {/* Food Log */}
        <section className="flex flex-col gap-4 pb-24">
          <h2 className="font-headline-sm text-headline-sm text-white">Дневник за сегодня</h2>

          {calories.length === 0 ? (
            <div className="glass-card-dark rounded-2xl p-6 text-center">
              <p className="text-gray-400">Пока нет записей</p>
            </div>
          ) : (
            <div className="space-y-3">
              {calories.map((cal) => (
                <div key={cal.id} className="glass-card-dark rounded-2xl p-3 flex gap-4 items-center card-press border border-white/10">
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      restaurant
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-body-lg text-body-lg font-semibold text-white">{cal.note}</h3>
                      <span className="font-label-caps text-label-caps text-gray-400 opacity-70 text-xs">
                        {cal.created_at
                          ? new Date(cal.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', hour12: false })
                          : 'сейчас'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-white mb-1">
                      <span className="material-symbols-outlined text-sm text-primary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>
                        local_fire_department
                      </span>
                      <span className="font-body-sm text-body-sm font-semibold">{cal.amount} калорий</span>
                    </div>
                    <div className="flex gap-3 font-label-caps text-label-caps text-gray-400 text-xs">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container" />
                        <span>Б: {cal.proteins || 0}г</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-surface-variant" />
                        <span>Ж: {cal.fats || 0}г</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary-container" />
                        <span>У: {cal.carbs || 0}г</span>
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
