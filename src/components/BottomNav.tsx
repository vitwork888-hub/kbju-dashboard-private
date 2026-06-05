interface BottomNavProps {
  currentPage: 'dashboard' | 'profile' | 'stats'
  onPageChange: (page: 'dashboard' | 'profile' | 'stats') => void
}

export default function BottomNav({ currentPage, onPageChange }: BottomNavProps) {
  const navItems = [
    { id: 'dashboard', label: 'Дневник', icon: 'home' },
    { id: 'profile', label: 'Профиль', icon: 'person' },
    { id: 'stats', label: 'Прогресс', icon: 'leaderboard' },
  ]

  return (
    <nav className="glass-dock fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center h-20 px-6 rounded-full mx-auto mb-8 w-[90%] md:hidden safe-bottom">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onPageChange(item.id as 'dashboard' | 'profile' | 'stats')}
          className={`flex flex-col items-center justify-center gap-1 p-3 rounded-full transition-all active:scale-95 vibrate-on-touch ${
            currentPage === item.id
              ? 'bg-primary text-on-primary shadow-lg'
              : 'text-on-surface-variant hover:bg-primary-container/30'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]" style={{
            fontVariationSettings: currentPage === item.id ? "'FILL' 1" : "'FILL' 0"
          }}>
            {item.icon}
          </span>
        </button>
      ))}
    </nav>
  )
}
