'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { addProduct } from '@/app/actions/product'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const initialState: { error?: string; success?: boolean } = {}

export default function AddProductPage() {
  const [state, formAction, isPending] = useActionState(addProduct, initialState)
  const router = useRouter()

  useEffect(() => {
    if (state.success) {
      router.push('/admin')
    }
  }, [state.success, router])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin" className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 border border-gray-100 transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </Link>
        <h2 className="text-2xl font-bold text-gray-800">New Product</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6">
        <form action={formAction} className="space-y-6">
          {state.error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
              {state.error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                placeholder="e.g. Kaju Katli"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  name="category"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                >
                  <option value="sweet">Sweet</option>
                  <option value="snack">Snack</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price (₹)</label>
                <input
                  type="number"
                  name="costPrice"
                  step="0.01"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  placeholder="e.g. 500"
                />
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mt-4">
              <h3 className="text-sm font-bold text-gray-800 mb-3">Selling Prices (Fill at least one)</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Price per KG (₹)</label>
                  <input
                    type="number"
                    name="pricePerKg"
                    step="0.01"
                    className="w-full px-4 py-3 bg-orange-50/50 border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    placeholder="e.g. 900"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Price per Piece (₹)</label>
                    <input
                      type="number"
                      name="pricePerPiece"
                      step="0.01"
                      className="w-full px-4 py-3 bg-orange-50/50 border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                      placeholder="e.g. 20"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Price per Bowl (₹)</label>
                    <input
                      type="number"
                      name="pricePerBowl"
                      step="0.01"
                      className="w-full px-4 py-3 bg-orange-50/50 border border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                      placeholder="e.g. 40"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-4 mt-8 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold rounded-xl shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] transition-all disabled:opacity-70 disabled:cursor-not-allowed text-lg"
          >
            {isPending ? 'Saving...' : 'Save Product'}
          </button>
        </form>
      </div>
    </div>
  )
}
