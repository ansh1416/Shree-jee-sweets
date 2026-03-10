'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/app/actions/auth'
import { Store } from 'lucide-react'

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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 via-white to-red-50 relative overflow-hidden">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-[420px] relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-orange-500 to-red-500 shadow-xl shadow-orange-500/30 mb-6 transform hover:scale-105 transition-transform duration-300">
            <Store className="w-10 h-10 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            Shree Jee Dairy
          </h1>
          <p className="text-gray-500 font-medium">
            POS & Management Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-gray-200/50 border border-white p-8 sm:p-10">
          <form action={formAction} className="space-y-6">
            
            {state.error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <span className="flex-1">{state.error}</span>
              </div>
            )}
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    required
                    className="w-full px-5 py-4 bg-gray-50/50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:ring-0 focus:border-orange-500 outline-none transition-all text-gray-900 font-medium placeholder:text-gray-400"
                    placeholder="Enter your username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    required
                    className="w-full px-5 py-4 bg-gray-50/50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:ring-0 focus:border-orange-500 outline-none transition-all text-gray-900 font-medium placeholder:text-gray-400"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 mt-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 active:scale-[0.98] text-white font-bold rounded-2xl shadow-[0_8px_30px_-10px_rgba(249,115,22,0.6)] transition-all disabled:opacity-70 disabled:cursor-not-allowed text-lg tracking-wide"
            >
               {isPending ? 'Authenticating...' : 'Secure Login'}
            </button>
          </form>
        </div>
        
        <p className="text-center text-sm font-semibold text-gray-400 mt-8">
          Authorized personnel only
        </p>
      </div>
    </div>
  )
}
