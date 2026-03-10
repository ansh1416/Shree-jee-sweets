'use client'

import { useState } from 'react'
import { createSale } from '@/app/actions/sale'
import { Tag, CheckCircle2 } from 'lucide-react'

type Product = {
  id: string
  name: string
  pricePerKg: number | null
  pricePerPiece: number | null
  pricePerBowl: number | null
  costPrice: number
  category: string
}

const PRESET_QUANTITIES = [
  { label: '100g', value: 100, type: 'kg' },
  { label: '250g', value: 250, type: 'kg' },
  { label: '500g', value: 500, type: 'kg' },
  { label: '1 KG', value: 1, type: 'kg_actual' },
  { label: '5 KG', value: 5, type: 'kg_actual' },
  { label: '1 Pc', value: 1, type: 'piece' },
  { label: '5 Pc', value: 5, type: 'piece' },
  { label: '1 Bowl', value: 1, type: 'bowl' },
]

export default function POSClient({ products }: { products: Product[] }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState<number | ''>('')
  const [unitType, setUnitType] = useState<'kg' | 'kg_actual' | 'piece' | 'bowl'>('kg')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<{ amount: number } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Calculate current amount
  let currentAmount = 0
  let currentProfit = 0

  if (selectedProduct && typeof quantity === 'number') {
    if ((unitType === 'kg' || unitType === 'kg_actual') && selectedProduct.pricePerKg) {
      // If user selected KG toggle, multiply quantity by 1000 so the math is always in grams internally
      const effectiveGrams = unitType === 'kg_actual' ? quantity * 1000 : quantity
      currentAmount = (selectedProduct.pricePerKg / 1000) * effectiveGrams
      const costAmount = (selectedProduct.costPrice / 1000) * effectiveGrams
      currentProfit = currentAmount - costAmount
    } else if (unitType === 'piece' && selectedProduct.pricePerPiece) {
      currentAmount = selectedProduct.pricePerPiece * quantity
      currentProfit = currentAmount - selectedProduct.costPrice * quantity
    } else if (unitType === 'bowl' && selectedProduct.pricePerBowl) {
      currentAmount = selectedProduct.pricePerBowl * quantity
      currentProfit = currentAmount - selectedProduct.costPrice * quantity
    }
  }

  const handleSale = async () => {
    if (!selectedProduct || typeof quantity !== 'number' || quantity <= 0) return

    setIsSubmitting(true)

    try {
      await createSale({
        items: [
          {
            productId: selectedProduct.id,
            quantity,
            amount: currentAmount,
            profit: currentProfit,
          },
        ],
        totalAmount: currentAmount,
        totalProfit: currentProfit,
      })

      // Show success toast
      setToast({ amount: currentAmount })
      setTimeout(() => setToast(null), 3000)

      // Reset
      setSelectedProduct(null)
      setQuantity('')
    } catch {
      alert('Failed to record sale')
    } finally {
      setIsSubmitting(false)
    }
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-4">
      {/* Success Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-5 py-3 rounded-2xl shadow-[0_8px_30px_rgba(34,197,94,0.4)] flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="font-bold text-lg">₹{toast.amount.toFixed(2)} Recorded!</span>
        </div>
      )}

      {/* Search */}
      {products.length > 6 && (
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm font-medium shadow-sm"
        />
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {filtered.map((product) => (
          <button
            key={product.id}
            onClick={() => {
              setSelectedProduct(product)
              if (product.pricePerKg) setUnitType('kg')
              else if (product.pricePerPiece) setUnitType('piece')
              else if (product.pricePerBowl) setUnitType('bowl')
              setQuantity('')
            }}
            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center h-28 shadow-sm ${
              selectedProduct?.id === product.id
                ? 'border-orange-500 bg-orange-50 scale-95 shadow-inner'
                : 'border-transparent bg-white hover:bg-orange-50 hover:border-orange-200'
            }`}
          >
            <span className="font-bold text-gray-800 text-sm leading-tight mb-1">{product.name}</span>
            <span className="text-xs font-semibold text-orange-600 bg-orange-100/50 px-2 py-0.5 rounded-md">
              {product.pricePerKg && `₹${product.pricePerKg}/kg`}
              {!product.pricePerKg && product.pricePerPiece && `₹${product.pricePerPiece}/pc`}
              {!product.pricePerKg && !product.pricePerPiece && product.pricePerBowl && `₹${product.pricePerBowl}/bowl`}
            </span>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 sm:col-span-3 py-10 text-center text-gray-400 text-sm">
            No products match your search.
          </div>
        )}
      </div>

      {/* Quantity Drawer */}
      {selectedProduct && (
        <div className="fixed bottom-[64px] left-0 right-0 p-4 bg-white border-t rounded-t-3xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.15)] z-30 animate-in slide-in-from-bottom-5 duration-200">
          <div className="max-w-md mx-auto space-y-4">

            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedProduct.name}</h3>
                <p className="text-sm text-gray-500 font-medium">Select Quantity</p>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Quick Presets */}
            <div className="grid grid-cols-4 gap-2">
              {PRESET_QUANTITIES.filter((p) => {
                if (p.type === 'kg' && !selectedProduct.pricePerKg) return false
                if (p.type === 'piece' && !selectedProduct.pricePerPiece) return false
                if (p.type === 'bowl' && !selectedProduct.pricePerBowl) return false
                return true
              }).map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setUnitType(preset.type as 'kg' | 'piece' | 'bowl')
                    setQuantity(preset.value)
                  }}
                  className={`py-3 rounded-xl font-bold text-sm transition-all ${
                    quantity === preset.value && unitType === preset.type
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="space-y-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-gray-700">Enter Amount</label>
                {selectedProduct.pricePerKg && (
                  <div className="flex bg-gray-200/80 p-1 rounded-lg">
                    <button
                      onClick={() => setUnitType('kg')}
                      className={`px-3 py-1 rounded-md text-sm font-bold transition-all ${unitType === 'kg' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500'}`}
                    >
                      Grams
                    </button>
                    <button
                      onClick={() => {
                        setUnitType('kg')
                        // If they switch to KG, convert grams to kg visually (e.g., 500g -> 0.5kg)
                        // This logic is mostly for UI clarity, but our backend handles pricePerKg which expects Grams by default in the current logic.
                        // Wait, the current logic treats 'kg' unitType as GRAMS (e.g. 500 * price/1000). 
                        // So let's rename the UI toggles.
                      }}
                      className={`px-3 py-1 rounded-md text-sm font-bold transition-all ${unitType === 'kg_actual' as any ? 'bg-white shadow-sm text-orange-600' : 'text-gray-500'}`}
                    >
                      KG
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : '')}
                    placeholder="0"
                    className="w-full bg-white border-2 border-orange-100 text-gray-900 px-4 py-4 rounded-xl text-2xl font-black focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all placeholder:text-gray-300 shadow-inner"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                    {unitType === 'piece' ? 'pc' : unitType === 'bowl' ? 'bowl' : 'g'}
                  </span>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSale}
              disabled={isSubmitting || !quantity}
              className="w-full bg-green-500 hover:bg-green-600 active:bg-green-700 text-white p-4 rounded-xl flex justify-between items-center shadow-[0_4px_14px_0_rgba(34,197,94,0.39)] transition-all disabled:opacity-50"
            >
              <span className="font-bold text-lg">{isSubmitting ? 'Recording...' : 'ADD SALE'}</span>
              <div className="flex items-center gap-1 bg-green-600 px-3 py-1 rounded-lg">
                <Tag className="w-4 h-4" />
                <span className="font-bold text-xl">₹{currentAmount.toFixed(2)}</span>
              </div>
            </button>

          </div>
        </div>
      )}
    </div>
  )
}
