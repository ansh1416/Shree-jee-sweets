'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/app/actions/auth'
import { Utensils } from 'lucide-react'

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
    <div className="min-h-screen flex items-center justify-center bg-orange-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100">
        <div className="bg-orange-500 p-6 text-center">
          <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
            <Utensils className="w-8 h-8 text-orange-500" />
          </div>
          <h1 className="text-2xl font-bold text-white">Shree Jee Dairy</h1>
          <p className="text-orange-100 mt-1">Management Staff Portal</p>
        </div>
        
        <div className="p-8">
          <form action={formAction} className="space-y-6">
            {state.error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
                {state.error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                required
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-lg"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all text-lg"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 px-4 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold rounded-xl shadow-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed text-lg"
            >
              {isPending ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
