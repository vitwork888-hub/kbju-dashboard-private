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
      console.log('📊 Dashboard loading with userId:', userId)
      if (!userId) {
        console.error('❌ No userId available')
        return
      }

      try {
        const [prof, cals] = await Promise.all([
          getUserProfile(userId),
          getTodayCalories(userId),
        ])

        console.log('✅ Data loaded:', { prof, cals })
        setProfile(prof)
        setCalories(cals)
      } catch (err) {
        console.error('❌ Error loading data:', err)
      }
      setLoading(false)
    }

    loadData()
  }, [userId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Загрузка дневника...</p>
      </div>
    )
  }

  const totalCalories = calories.reduce((sum, cal) => sum + (cal.amount || 0), 0)
  const target = profile?.target_k || 2000

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      {/* Header */}
      <div className="text-center mt-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-800">КБЖУ Дневник</h1>
        <p className="text-sm text-gray-500 mt-1">
          {new Date().toLocaleDateString('ru-RU', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </p>
      </div>

      {/* Main calorie circle (placeholder) */}
      <div className="flex justify-center mb-8">
        <div className="relative w-48 h-48 rounded-full bg-gradient-primary shadow-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-white text-5xl font-bold">{Math.round(totalCalories)}</div>
            <div className="text-white text-sm mt-2">/ {target} ккал</div>
          </div>
        </div>
      </div>

      {/* Macro circles placeholder */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center">
            <div className="text-center">
              <div className="text-pink-600 font-bold">P</div>
              <div className="text-xs text-pink-600">{calories.reduce((sum, cal) => sum + (cal.proteins || 0), 0).toFixed(0)}г</div>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">Белки</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center">
            <div className="text-center">
              <div className="text-amber-600 font-bold">F</div>
              <div className="text-xs text-amber-600">{calories.reduce((sum, cal) => sum + (cal.fats || 0), 0).toFixed(0)}г</div>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">Жиры</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
            <div className="text-center">
              <div className="text-blue-600 font-bold">C</div>
              <div className="text-xs text-blue-600">{calories.reduce((sum, cal) => sum + (cal.carbs || 0), 0).toFixed(0)}г</div>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">Углеводы</p>
        </div>
      </div>

      {/* Today's entries */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="font-semibold text-gray-800 mb-4">Сегодняшние записи</h2>
        {calories.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Пока нет записей</p>
        ) : (
          <div className="space-y-2">
            {calories.map((cal) => (
              <div key={cal.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-800">{cal.note}</p>
                  <p className="text-xs text-gray-500">{cal.amount} ккал</p>
                </div>
                <div className="text-right text-xs text-gray-600">
                  <div>Б:{cal.proteins || 0}г</div>
                  <div>Ж:{cal.fats || 0}г</div>
                  <div>У:{cal.carbs || 0}г</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
