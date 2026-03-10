'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ShoppingCart, FileText, History, Settings } from 'lucide-react'

const navItems = [
  { name: 'Home', href: '/', icon: LayoutDashboard },
  { name: 'POS', href: '/pos', icon: ShoppingCart },
  { name: 'History', href: '/history', icon: History },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Admin', href: '/admin', icon: Settings },
]

export function BottomNav() {
  const pathname = usePathname()

  if (pathname === '/login') return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 max-w-lg mx-auto">
      <div className="bg-[#13131c]/95 backdrop-blur-2xl border-t border-white/5 px-2 pb-safe">
        <nav className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-200 relative ${
                  isActive ? 'text-orange-400' : 'text-white/25 hover:text-white/50'
                }`}
              >
                {isActive && (
                  <span className="absolute top-2 w-6 h-0.5 bg-orange-500 rounded-full opacity-80 animate-in fade-in duration-300" />
                )}
                <item.icon className={`w-5 h-5 mt-2 ${isActive ? 'stroke-[2.5px]' : ''}`} />
                <span className={`text-[9px] font-bold tracking-wider uppercase ${isActive ? 'text-orange-400' : ''}`}>
                  {item.name}
                </span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
