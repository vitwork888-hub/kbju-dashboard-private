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
    return <div className="flex items-center justify-center h-screen text-on-surface-variant">Загрузка профиля...</div>
  }

  if (!profile) {
    return <div className="flex items-center justify-center h-screen text-on-surface-variant">Профиль не найден</div>
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
    <div className="min-h-screen bg-gradient-to-b from-surface-container-low to-background p-container-padding-mobile md:p-container-padding-desktop">
      <div className="max-w-2xl mx-auto space-y-stack-md">
        {/* Header */}
        <h1 className="font-headline-lg text-headline-lg text-on-background">Мой профиль</h1>

        {/* Profile Card */}
        <div className="bg-gradient-to-br from-primary to-primary-container rounded-xl p-6 text-on-primary">
          <h2 className="font-headline-md text-headline-md mb-4">{profile.first_name}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm opacity-90 mb-1">Возраст</p>
              <p className="font-headline-md text-headline-md">{profile.age} лет</p>
            </div>
            <div>
              <p className="text-sm opacity-90 mb-1">Пол</p>
              <p className="font-headline-md text-headline-md">{profile.gender === 'male' ? '👨' : '👩'}</p>
            </div>
            <div>
              <p className="text-sm opacity-90 mb-1">Рост</p>
              <p className="font-headline-md text-headline-md">{profile.height} см</p>
            </div>
            <div>
              <p className="text-sm opacity-90 mb-1">Вес</p>
              <p className="font-headline-md text-headline-md">{profile.weight} кг</p>
            </div>
          </div>
        </div>

        {/* Goals Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-surface-variant">
          <h3 className="font-headline-md text-headline-md text-on-background mb-4">Цель и норма</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-on-surface-variant mb-1">Цель</p>
              <p className="font-body-lg text-body-lg text-on-background">{goalLabels[profile.goal] || profile.goal}</p>
            </div>
            <div className="border-t border-surface-variant pt-4">
              <p className="text-sm text-on-surface-variant mb-2">Дневная норма</p>
              <p className="font-display-lg text-display-lg text-primary">{profile.target_k}</p>
              <p className="text-sm text-on-surface-variant">ккал/день</p>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-surface-variant">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-primary mb-2" />
                <p className="text-xs text-on-surface-variant uppercase">Белки</p>
                <p className="font-body-md text-body-md font-semibold text-on-background">{profile.target_p}г</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-secondary-container mb-2" />
                <p className="text-xs text-on-surface-variant uppercase">Жиры</p>
                <p className="font-body-md text-body-md font-semibold text-on-background">{profile.target_f}г</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-error mb-2" />
                <p className="text-xs text-on-surface-variant uppercase">Углеводы</p>
                <p className="font-body-md text-body-md font-semibold text-on-background">{profile.target_c}г</p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-surface-variant">
          <h3 className="font-headline-md text-headline-md text-on-background mb-4">Активность</h3>
          <p className="font-body-lg text-body-lg text-on-background">{activityLabels[profile.activity] || profile.activity}</p>
        </div>
      </div>
    </div>
  )
}
