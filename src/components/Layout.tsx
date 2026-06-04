import { useState } from 'react'
import Dashboard from '../pages/Dashboard'
import Profile from '../pages/Profile'
import Statistics from '../pages/Statistics'
import BottomNav from './BottomNav'

type Page = 'dashboard' | 'profile' | 'stats'

export default function Layout() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'profile':
        return <Profile />
      case 'stats':
        return <Statistics />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {renderPage()}
      </main>

      {/* Bottom navigation */}
      <BottomNav currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  )
}
