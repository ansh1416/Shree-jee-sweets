import { ReactNode } from 'react'
import { BottomNav } from '@/components/BottomNav'
import { logout } from '@/app/actions/auth'
import { LogOut } from 'lucide-react'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-24 max-w-lg mx-auto shadow-2xl relative bg-white">
      <header className="sticky top-0 z-40 bg-orange-500 text-white p-4 shadow-md rounded-b-xl flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight leading-none">Shree Jee Dairy</h1>
          <p className="text-orange-200 text-[10px] font-medium mt-0.5">POS & Management</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-medium opacity-90">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Live
          </div>
          <form action={logout}>
            <button
              type="submit"
              title="Logout"
              className="p-2 rounded-xl bg-orange-600 hover:bg-orange-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </header>
      
      <main className="p-4 pt-6">
        {children}
      </main>

      <BottomNav />
    </div>
  )
}
