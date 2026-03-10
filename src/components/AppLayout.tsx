import { ReactNode } from 'react'
import { BottomNav } from '@/components/BottomNav'
import { logout } from '@/app/actions/auth'
import { LogOut, Zap } from 'lucide-react'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0f0f13] pb-24 max-w-lg mx-auto relative">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0f0f13]/80 backdrop-blur-xl border-b border-white/5 px-5 py-3.5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-[15px] font-black text-white tracking-tight leading-none">Shree Jee Dairy</h1>
            <p className="text-[10px] font-medium text-white/30 mt-0.5 tracking-widest uppercase">POS System</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Live
          </div>
          <form action={logout}>
            <button
              type="submit"
              title="Logout"
              className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/50 hover:text-white/80 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </header>
      
      <main className="px-4 py-5">
        {children}
      </main>

      <BottomNav />
    </div>
  )
}
