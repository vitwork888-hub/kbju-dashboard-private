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

  const targetK = profile?.target_k || 2000
  const targetP = profile?.target_p || 150
  const targetF = profile?.target_f || 70
  const targetC = profile?.target_c || 250

  const remaining = Math.max(0, targetK - totalCalories)
  const caloriePercent = (totalCalories / targetK) * 100

  // Calculate ring progress percentages for SVG animation
  const proteinPercent = (totalProteins / targetP) * 100
  const fatsPercent = (totalFats / targetF) * 100
  const carbsPercent = (totalCarbs / targetC) * 100

  // SVG circle circumferences
  const calorieCircumference = 2 * Math.PI * 90
  const proteinCircumference = 2 * Math.PI * 70
  const fatsCircumference = 2 * Math.PI * 50
  const carbsCircumference = 2 * Math.PI * 30

  const calorieOffset = calorieCircumference - (caloriePercent / 100) * calorieCircumference
  const proteinOffset = proteinCircumference - (proteinPercent / 100) * proteinCircumference
  const fatsOffset = fatsCircumference - (fatsPercent / 100) * fatsCircumference
  const carbsOffset = carbsCircumference - (carbsPercent / 100) * carbsCircumference

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-container-low to-background p-container-padding-mobile md:p-container-padding-desktop">
      {/* Header */}
      <div className="flex items-center gap-3 mb-stack-lg">
        <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant flex-shrink-0">
          <img
            alt="Аватар"
            className="w-full h-full object-cover rounded-full"
            src="https://via.placeholder.com/40"
          />
        </div>
        <h1 className="font-headline-md text-headline-md text-on-surface">Привет, {profile?.first_name || 'Пользователь'}!</h1>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-stack-md">
        {/* Hero Rings Section */}
        <section className="md:col-span-5 flex justify-center items-center py-stack-md">
          <div className="relative w-72 h-72">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
              {/* Calorie Ring Background */}
              <circle className="text-surface-variant opacity-40" cx="100" cy="100" fill="none" r="90" stroke="currentColor" strokeWidth="12" />
              {/* Calorie Progress */}
              <circle
                className="text-primary-container transition-all duration-1000 ease-out"
                cx="100"
                cy="100"
                fill="none"
                r="90"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="12"
                style={{ strokeDasharray: calorieCircumference, strokeDashoffset: calorieOffset }}
              />

              {/* Protein Ring Background */}
              <circle className="text-surface-variant opacity-30" cx="100" cy="100" fill="none" r="70" stroke="currentColor" strokeWidth="10" />
              {/* Protein Progress */}
              <circle
                className="text-primary transition-all duration-1000 ease-out"
                cx="100"
                cy="100"
                fill="none"
                r="70"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="10"
                style={{ strokeDasharray: proteinCircumference, strokeDashoffset: proteinOffset }}
              />

              {/* Fats Ring Background */}
              <circle className="text-surface-variant opacity-30" cx="100" cy="100" fill="none" r="50" stroke="currentColor" strokeWidth="10" />
              {/* Fats Progress */}
              <circle
                className="text-secondary-container transition-all duration-1000 ease-out"
                cx="100"
                cy="100"
                fill="none"
                r="50"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="10"
                style={{ strokeDasharray: fatsCircumference, strokeDashoffset: fatsOffset }}
              />

              {/* Carbs Ring Background */}
              <circle className="text-surface-variant opacity-30" cx="100" cy="100" fill="none" r="30" stroke="currentColor" strokeWidth="10" />
              {/* Carbs Progress */}
              <circle
                className="text-error transition-all duration-1000 ease-out"
                cx="100"
                cy="100"
                fill="none"
                r="30"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="10"
                style={{ strokeDasharray: carbsCircumference, strokeDashoffset: carbsOffset }}
              />
            </svg>

            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="bg-surface-container-high/90 backdrop-blur-sm px-6 py-4 rounded-xl border border-outline-variant/20 flex flex-col items-center">
                <span className="font-display-lg text-display-lg text-on-background leading-none">{remaining}</span>
                <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mt-2">ккал осталось</span>
              </div>
            </div>
          </div>
        </section>

        {/* Macros & Daily Log */}
        <section className="md:col-span-7 space-y-stack-md">
          {/* Macro Stats */}
          <div className="grid grid-cols-3 gap-3">
            {/* Protein */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center border border-surface-variant active:scale-95 transition-transform">
              <div className="w-3 h-3 rounded-full bg-primary mb-2" />
              <span className="font-label-md text-label-md text-on-surface-variant uppercase mb-1">Белки</span>
              <span className="font-stats-number text-stats-number text-on-background">{Math.round(totalProteins)}г</span>
              <span className="text-xs text-on-surface-variant mt-1">из {targetP}г</span>
            </div>

            {/* Fats */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center border border-surface-variant active:scale-95 transition-transform">
              <div className="w-3 h-3 rounded-full bg-secondary-container mb-2" />
              <span className="font-label-md text-label-md text-on-surface-variant uppercase mb-1">Жиры</span>
              <span className="font-stats-number text-stats-number text-on-background">{Math.round(totalFats)}г</span>
              <span className="text-xs text-on-surface-variant mt-1">из {targetF}г</span>
            </div>

            {/* Carbs */}
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center border border-surface-variant active:scale-95 transition-transform">
              <div className="w-3 h-3 rounded-full bg-error mb-2" />
              <span className="font-label-md text-label-md text-on-surface-variant uppercase mb-1">Углеводы</span>
              <span className="font-stats-number text-stats-number text-on-background">{Math.round(totalCarbs)}г</span>
              <span className="text-xs text-on-surface-variant mt-1">из {targetC}г</span>
            </div>
          </div>

          {/* Daily Log */}
          <div>
            <div className="flex justify-between items-end mb-4">
              <h3 className="font-headline-md text-headline-md text-on-background">Дневник за сегодня</h3>
            </div>

            {calories.length === 0 ? (
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-surface-variant text-center">
                <p className="text-on-surface-variant">Пока нет записей</p>
              </div>
            ) : (
              <div className="space-y-3">
                {calories.map((cal) => (
                  <div key={cal.id} className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-surface-variant flex items-center justify-between active:scale-95 transition-transform cursor-pointer">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary text-xl">📍</div>
                      <div className="flex-1">
                        <h4 className="font-body-md text-body-md font-semibold text-on-background">{cal.note}</h4>
                        <p className="text-xs text-on-surface-variant mt-1">Б: {cal.proteins || 0}г | Ж: {cal.fats || 0}г | У: {cal.carbs || 0}г</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-stats-number text-stats-number block text-on-background">{cal.amount}</span>
                      <span className="text-xs text-on-surface-variant">ккал</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
