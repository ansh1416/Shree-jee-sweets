'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { updateProduct } from '@/app/actions/product'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const initialState: { error?: string; success?: boolean } = {}

interface Product {
  id: string
  name: string
  category: string
  costPrice: number
  pricePerKg: number | null
  pricePerPiece: number | null
  pricePerBowl: number | null
}

export default function EditProductForm({ product }: { product: Product }) {
  const [state, formAction, isPending] = useActionState(updateProduct, initialState)
  const router = useRouter()

  useEffect(() => {
    if (state.success) {
      router.push('/admin')
    }
  }, [state.success, router])

  return (
    <div className="space-y-5 pb-4">
      <div className="flex items-center gap-3">
        <Link
          href="/admin"
          className="w-9 h-9 bg-white/[0.06] rounded-xl border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white/80 hover:bg-white/10 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h2 className="text-xl font-black text-white tracking-tight">Edit Product</h2>
      </div>

      <div className="bg-[#13131e] rounded-3xl border border-white/[0.06] p-5">
        <form action={formAction} className="space-y-5">
          {/* Hidden product ID */}
          <input type="hidden" name="id" value={product.id} />

          {state.error && (
            <div className="bg-red-500/10 text-red-400 p-3 rounded-2xl text-sm font-semibold border border-red-500/20 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0"></span>
              {state.error}
            </div>
          )}

          {/* Product Name */}
          <div>
            <label className="block text-xs font-bold text-white/30 mb-2 uppercase tracking-widest">Product Name</label>
            <input
              type="text"
              name="name"
              required
              defaultValue={product.name}
              className="w-full px-4 py-3.5 bg-white/[0.05] border border-white/[0.08] rounded-2xl text-white font-semibold placeholder:text-white/15 focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.07] focus:ring-4 focus:ring-orange-500/10 transition-all"
              placeholder="e.g. Kaju Katli"
            />
          </div>

          {/* Category + Cost Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-white/30 mb-2 uppercase tracking-widest">Category</label>
              <select
                name="category"
                defaultValue={product.category}
                className="w-full px-4 py-3.5 bg-white/[0.05] border border-white/[0.08] rounded-2xl text-white/70 font-semibold focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.07] transition-all appearance-none"
              >
                <option value="sweet" className="bg-[#1a1a26] text-white">Sweet</option>
                <option value="snack" className="bg-[#1a1a26] text-white">Snack</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-white/30 mb-2 uppercase tracking-widest">Cost Price (₹)</label>
              <input
                type="number"
                name="costPrice"
                step="0.01"
                required
                defaultValue={product.costPrice}
                className="w-full px-4 py-3.5 bg-white/[0.05] border border-white/[0.08] rounded-2xl text-white font-semibold placeholder:text-white/15 focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.07] focus:ring-4 focus:ring-orange-500/10 transition-all"
                placeholder="e.g. 500"
              />
            </div>
          </div>

          {/* Selling Prices */}
          <div className="border-t border-white/[0.06] pt-4">
            <h3 className="text-xs font-bold text-white/40 mb-3 uppercase tracking-widest">Selling Prices (fill at least one)</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-white/25 mb-2 uppercase tracking-widest">Price per KG (₹)</label>
                <input
                  type="number"
                  name="pricePerKg"
                  step="0.01"
                  defaultValue={product.pricePerKg ?? ''}
                  className="w-full px-4 py-3.5 bg-orange-500/[0.05] border border-orange-500/[0.15] rounded-2xl text-white font-semibold placeholder:text-white/15 focus:outline-none focus:border-orange-500/60 focus:ring-4 focus:ring-orange-500/10 transition-all"
                  placeholder="e.g. 900"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-white/25 mb-2 uppercase tracking-widest">Per Bowl (₹) — 1 bowl = 100g</label>
                <input
                  type="number"
                  name="pricePerBowl"
                  step="0.01"
                  defaultValue={product.pricePerBowl ?? ''}
                  className="w-full px-4 py-3.5 bg-orange-500/[0.05] border border-orange-500/[0.15] rounded-2xl text-white font-semibold placeholder:text-white/15 focus:outline-none focus:border-orange-500/60 focus:ring-4 focus:ring-orange-500/10 transition-all"
                  placeholder="e.g. 40"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 active:scale-[0.98] text-white font-black rounded-2xl shadow-[0_0_30px_rgba(249,115,22,0.25)] transition-all disabled:opacity-40 disabled:pointer-events-none text-base tracking-wide"
          >
            {isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
