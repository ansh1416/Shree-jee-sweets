'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ShoppingCart, Package, FileText, History, Settings } from 'lucide-react'
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'POS', href: '/pos', icon: ShoppingCart },
  { name: 'History', href: '/history', icon: History },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Admin', href: '/admin', icon: Settings },
]

export function BottomNav() {
  const pathname = usePathname()

  if (pathname === '/login') return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-orange-100 pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
      <nav className="flex items-center justify-around h-16 md:h-20 max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-all",
                isActive ? "text-orange-600 scale-105" : "text-gray-400 hover:text-orange-400"
              )}
            >
              <item.icon className={cn("w-6 h-6", isActive && "stroke-[2.5px]")} />
              <span className={cn("text-[10px] font-medium", isActive && "font-bold")}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
