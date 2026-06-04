import { useEffect, useState } from 'react'
import { useTelegram } from '../context/TelegramContext'
import { getUserProfile } from '../lib/supabase'

export default function Profile() {
  const { userId } = useTelegram()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) return
      const prof = await getUserProfile(userId)
      setProfile(prof)
      setLoading(false)
    }
    loadProfile()
  }, [userId])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Загрузка профиля...</div>
  }

  if (!profile) {
    return <div className="flex items-center justify-center h-screen">Профиль не найден</div>
  }

  const goalLabels: Record<string, string> = {
    cut: '📉 Похудение',
    bulk: '📈 Набор массы',
    maintain: '⚖️ Поддержание',
    custom: '🎯 Свой план',
  }

  const activityLabels: Record<string, string> = {
    act_sedentary: '🪑 Сидячий образ жизни',
    act_light: '🚶 Легкая активность',
    act_moderate: '🏃 Умеренная активность',
    act_heavy: '🏋️ Интенсивные тренировки',
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-md mx-auto pt-6">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Мой профиль</h1>

        {/* Profile card */}
        <div className="bg-gradient-primary rounded-lg p-6 text-white mb-6">
          <h2 className="text-xl font-semibold mb-4">{profile.first_name}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm opacity-90">Возраст</p>
              <p className="text-lg font-semibold">{profile.age} лет</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Пол</p>
              <p className="text-lg font-semibold">{profile.gender === 'male' ? '👨' : '👩'}</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Рост</p>
              <p className="text-lg font-semibold">{profile.height} см</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Вес</p>
              <p className="text-lg font-semibold">{profile.weight} кг</p>
            </div>
          </div>
        </div>

        {/* Goals card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Цель и норма</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Цель</p>
              <p className="text-lg font-semibold text-gray-800">{goalLabels[profile.goal] || profile.goal}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Дневная норма</p>
              <p className="text-2xl font-bold text-green-600">{profile.target_k} ккал</p>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-xs text-gray-600">Белки</p>
                <p className="font-semibold text-gray-800">{profile.target_p}г</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Жиры</p>
                <p className="font-semibold text-gray-800">{profile.target_f}г</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Углеводы</p>
                <p className="font-semibold text-gray-800">{profile.target_c}г</p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Активность</h3>
          <p className="text-lg text-gray-800">{activityLabels[profile.activity] || profile.activity}</p>
        </div>
      </div>
    </div>
  )
}
