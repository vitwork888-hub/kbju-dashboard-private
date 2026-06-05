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
    return <div className="flex items-center justify-center h-screen text-gray-400 bg-[#0b1326]">Загрузка профиля...</div>
  }

  if (!profile) {
    return <div className="flex items-center justify-center h-screen text-gray-400 bg-[#0b1326]">Профиль не найден</div>
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
    <div className="pt-16 px-container-padding pb-20 bg-[#0b1326] min-h-screen">
      <div className="max-w-lg mx-auto space-y-section-margin">
        {/* Profile Hero */}
        <section className="flex flex-col items-center justify-center py-6">
          <div className="relative mb-4">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-primary-fixed-dim/20 shadow-lg bg-primary-fixed-dim/20 flex items-center justify-center text-4xl">
              👤
            </div>
          </div>
          <h2 className="font-headline-md text-headline-md text-white">{profile.first_name}</h2>
          <p className="font-body-sm text-body-sm text-gray-400 mt-1">{profile.email || 'user@example.com'}</p>
        </section>

        {/* Physical Data */}
        <section>
          <h3 className="font-headline-sm text-headline-sm text-white mb-card-gap">Физические данные</h3>
          <div className="grid grid-cols-3 gap-card-gap">
            <div className="glass-panel-dark rounded-xl p-4 flex flex-col items-center justify-center text-center border border-white/10">
              <span className="font-label-caps text-label-caps text-gray-400 uppercase tracking-wider mb-2">Возраст</span>
              <span className="font-headline-sm text-headline-sm text-primary-fixed-dim">{profile.age}</span>
              <span className="font-body-sm text-body-sm text-gray-400 mt-0.5">лет</span>
            </div>
            <div className="glass-panel-dark rounded-xl p-4 flex flex-col items-center justify-center text-center border border-white/10">
              <span className="font-label-caps text-label-caps text-gray-400 uppercase tracking-wider mb-2">Рост</span>
              <span className="font-headline-sm text-headline-sm text-primary-fixed-dim">{profile.height}</span>
              <span className="font-body-sm text-body-sm text-gray-400 mt-0.5">см</span>
            </div>
            <div className="glass-panel-dark rounded-xl p-4 flex flex-col items-center justify-center text-center border border-white/10">
              <span className="font-label-caps text-label-caps text-gray-400 uppercase tracking-wider mb-2">Вес</span>
              <span className="font-headline-sm text-headline-sm text-primary-fixed-dim">{profile.weight}</span>
              <span className="font-body-sm text-body-sm text-gray-400 mt-0.5">кг</span>
            </div>
          </div>
        </section>

        {/* Goal */}
        <section>
          <h3 className="font-headline-sm text-headline-sm text-white mb-card-gap">Моя цель</h3>
          <div className="glass-panel-dark rounded-xl p-5 flex items-center justify-between border border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-fixed-dim/20 flex items-center justify-center text-primary-fixed-dim">
                <span className="material-symbols-outlined">fitness_center</span>
              </div>
              <div>
                <p className="font-headline-sm text-headline-sm text-white">{goalLabels[profile.goal] || profile.goal}</p>
                <p className="font-body-sm text-body-sm text-gray-400">{profile.target_k} ккал / день</p>
              </div>
            </div>
            <button className="text-primary-fixed-dim hover:bg-white/10 p-2 rounded-full transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </section>

        {/* KBJU */}
        <section>
          <h3 className="font-headline-sm text-headline-sm text-white mb-card-gap">Макронутриенты</h3>
          <div className="glass-panel-dark rounded-xl p-6 border border-white/10">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-tertiary-container mb-2" />
                <p className="text-xs text-gray-400 uppercase">Белки</p>
                <p className="font-body-md text-body-lg font-semibold text-white mt-1">{profile.target_p}г</p>
              </div>
              <div className="flex flex-col items-center border-l border-r border-white/10">
                <div className="w-3 h-3 rounded-full bg-secondary-container mb-2" />
                <p className="text-xs text-gray-400 uppercase">Углеводы</p>
                <p className="font-body-md text-body-lg font-semibold text-white mt-1">{profile.target_c}г</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-surface-variant mb-2" />
                <p className="text-xs text-gray-400 uppercase">Жиры</p>
                <p className="font-body-md text-body-lg font-semibold text-white mt-1">{profile.target_f}г</p>
              </div>
            </div>
          </div>
        </section>

        {/* Activity */}
        <section>
          <h3 className="font-headline-sm text-headline-sm text-white mb-card-gap">Активность</h3>
          <div className="glass-panel-dark rounded-xl p-5 border border-white/10">
            <p className="font-body-lg text-body-lg text-white">{activityLabels[profile.activity] || profile.activity}</p>
          </div>
        </section>
      </div>
    </div>
  )
}
