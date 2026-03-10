'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/app/actions/auth'
import { Zap } from 'lucide-react'

const initialState: { error?: string; success?: boolean } = {}

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, initialState)
  const router = useRouter()

  useEffect(() => {
    if (state.success) {
      router.push('/')
    }
  }, [state.success, router])

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0a0a0f] relative overflow-hidden">
      
      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-orange-600 rounded-full mix-blend-screen filter blur-[120px] opacity-[0.07]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-red-600 rounded-full mix-blend-screen filter blur-[120px] opacity-[0.07]"></div>

      <div className="w-full max-w-[400px] relative z-10">
        
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 shadow-[0_0_40px_rgba(249,115,22,0.4)] mb-6 animate-float">
            <Zap className="w-8 h-8 text-white fill-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-1">Shree Jee Dairy</h1>
          <p className="text-sm text-white/30 font-medium tracking-widest uppercase">Management Portal</p>
        </div>

        {/* Card */}
        <div className="bg-[#13131e] rounded-3xl border border-white/[0.07] shadow-[0_32px_64px_rgba(0,0,0,0.6)] p-8">
          <form action={formAction} className="space-y-5">
            
            {state.error && (
              <div className="bg-red-500/10 text-red-400 p-4 rounded-2xl text-sm font-semibold border border-red-500/20 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0"></span>
                {state.error}
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold text-white/40 mb-2 ml-1 uppercase tracking-widest">
                Username
              </label>
              <input
                type="text"
                name="username"
                required
                className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-semibold placeholder:text-white/20 focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.07] focus:ring-4 focus:ring-orange-500/10 transition-all"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-white/40 mb-2 ml-1 uppercase tracking-widest">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-semibold placeholder:text-white/20 focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.07] focus:ring-4 focus:ring-orange-500/10 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 mt-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 active:scale-[0.98] text-white font-black rounded-2xl shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:shadow-[0_0_40px_rgba(249,115,22,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base tracking-wide"
            >
              {isPending ? 'Authenticating...' : 'Secure Login →'}
            </button>
          </form>
        </div>
        
        <p className="text-center text-xs font-medium text-white/15 mt-6 tracking-widest uppercase">
          Authorized Personnel Only
        </p>
      </div>
    </div>
  )
}
