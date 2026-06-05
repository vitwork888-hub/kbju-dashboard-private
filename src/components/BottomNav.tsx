interface BottomNavProps {
  currentPage: 'dashboard' | 'profile' | 'stats'
  onPageChange: (page: 'dashboard' | 'profile' | 'stats') => void
}

export default function BottomNav({ currentPage, onPageChange }: BottomNavProps) {
  const navItems = [
    { id: 'dashboard', label: 'Дневник', icon: 'home' },
    { id: 'stats', label: 'Прогресс', icon: 'leaderboard' },
    { id: 'profile', label: 'Профиль', icon: 'person' },
  ]

  return (
    <nav className="glass-dock-dark fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center h-20 px-6 rounded-full mx-auto mb-8 w-[90%] md:hidden safe-bottom border border-white/10">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onPageChange(item.id as 'dashboard' | 'stats' | 'profile')}
          className={`flex flex-col items-center justify-center gap-1 p-2 rounded-full transition-all active:scale-95 ${
            currentPage === item.id
              ? 'bg-primary text-white shadow-lg'
              : 'text-gray-400 hover:bg-white/10'
          }`}
          style={{ scale: '1.1' }}
        >
          <span className="material-symbols-outlined text-[20px]" style={{
            fontVariationSettings: currentPage === item.id ? "'FILL' 1" : "'FILL' 0"
          }}>
            {item.icon}
          </span>
        </button>
      ))}
    </nav>
  )
}
