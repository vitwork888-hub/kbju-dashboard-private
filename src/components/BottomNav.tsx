interface BottomNavProps {
  currentPage: 'dashboard' | 'profile' | 'stats'
  onPageChange: (page: 'dashboard' | 'profile' | 'stats') => void
}

export default function BottomNav({ currentPage, onPageChange }: BottomNavProps) {
  const navItems = [
    { id: 'dashboard', label: 'Дневник', icon: '📊' },
    { id: 'profile', label: 'Профиль', icon: '👤' },
    { id: 'stats', label: 'Статистика', icon: '📈' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-bottom">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id as 'dashboard' | 'profile' | 'stats')}
            className={`flex flex-col items-center justify-center flex-1 h-16 gap-1 transition-colors ${
              currentPage === item.id
                ? 'text-green-600 border-t-2 border-green-600 bg-green-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
