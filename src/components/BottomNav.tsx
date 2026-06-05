interface BottomNavProps {
  currentPage: 'dashboard' | 'profile' | 'stats'
  onPageChange: (page: 'dashboard' | 'profile' | 'stats') => void
}

export default function BottomNav({ currentPage, onPageChange }: BottomNavProps) {
  const navItems = [
    { id: 'dashboard', label: 'Дневник', icon: 'dashboard' },
    { id: 'profile', label: 'Профиль', icon: 'person' },
    { id: 'stats', label: 'Статистика', icon: 'leaderboard' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-xl border-t border-outline-variant/20 md:hidden z-50 safe-bottom">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id as 'dashboard' | 'profile' | 'stats')}
            className={`flex flex-col items-center justify-center flex-1 h-16 gap-1 transition-all active:scale-95 ${
              currentPage === item.id
                ? 'text-primary border-t-2 border-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: currentPage === item.id ? "'FILL' 1" : "'FILL' 0" }}>
              {item.icon}
            </span>
            <span className="text-xs font-label-md">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
