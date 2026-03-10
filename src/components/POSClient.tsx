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

  // Calculate current amount (Removed Profit Tracking)
  let currentAmount = 0
  
  if (selectedProduct && typeof quantity === 'number') {
    if ((unitType === 'kg' || unitType === 'kg_actual') && selectedProduct.pricePerKg) {
      const effectiveGrams = unitType === 'kg_actual' ? quantity * 1000 : quantity
      currentAmount = (selectedProduct.pricePerKg / 1000) * effectiveGrams
    } else if (unitType === 'piece' && selectedProduct.pricePerPiece) {
      currentAmount = selectedProduct.pricePerPiece * quantity
    } else if (unitType === 'bowl' && selectedProduct.pricePerBowl) {
      currentAmount = selectedProduct.pricePerBowl * quantity
    }
  }

  const handleSale = async () => {
    if (!selectedProduct || typeof quantity !== 'number' || quantity <= 0) return

    setIsSubmitting(true)

    try {
      await createSale({
        items: [{
          productId: selectedProduct.id,
          quantity,
          amount: currentAmount,
          profit: 0, // Hardcoded to 0 to bypass profit tracking but satisfy DB schema
        }],
        totalAmount: currentAmount,
        totalProfit: 0, // Hardcoded to 0
      })

      setToast({ amount: currentAmount })
      setTimeout(() => setToast(null), 3000)

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
    <div className="space-y-6 pb-24">
      {/* Premium Toast */}
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white pl-4 pr-6 py-3 rounded-full shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] flex items-center gap-3 animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold tracking-wide">₹{toast.amount.toFixed(2)} Sale Recorded</span>
        </div>
      )}

      {/* Modern Search */}
      {products.length > 6 && (
        <div className="px-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full px-5 py-4 bg-white border-none rounded-2xl focus:ring-4 focus:ring-orange-500/10 outline-none text-[15px] font-medium shadow-[0_2px_10px_rgb(0,0,0,0.06)] placeholder:text-gray-400 transition-all"
            />
          </div>
        </div>
      )}

      {/* Premium Product Grid */}
      <div className="grid grid-cols-2 gap-3 px-4">
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
            className={`relative p-5 rounded-3xl transition-all duration-300 flex flex-col items-start justify-between min-h-[120px] overflow-hidden ${
              selectedProduct?.id === product.id
                ? 'bg-gradient-to-br from-orange-500 to-red-500 shadow-xl shadow-orange-500/30 scale-[0.98]'
                : 'bg-gradient-to-br from-orange-50 to-orange-100/50 shadow-[0_4px_15px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(249,115,22,0.12)] hover:-translate-y-0.5 border border-orange-200/60'
            }`}
          >
            {/* Background pattern for active state */}
            {selectedProduct?.id === product.id && (
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            )}

            <span className={`font-extrabold text-[15px] leading-tight text-left z-10 ${selectedProduct?.id === product.id ? 'text-white' : 'text-gray-800'}`}>
              {product.name}
            </span>
            
            <span className={`text-xs font-bold px-3 py-1.5 rounded-xl mt-4 z-10 transition-colors ${
              selectedProduct?.id === product.id 
                ? 'bg-white/20 text-white backdrop-blur-sm' 
                : 'bg-orange-50/80 text-orange-600'
            }`}>
              {product.pricePerKg && `₹${product.pricePerKg}/kg`}
              {!product.pricePerKg && product.pricePerPiece && `₹${product.pricePerPiece}/pc`}
              {!product.pricePerKg && !product.pricePerPiece && product.pricePerBowl && `₹${product.pricePerBowl}/bowl`}
            </span>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 py-12 text-center text-gray-400 text-sm font-medium">
            No products match your search.
          </div>
        )}
      </div>

      {/* Floating Action Drawer */}
      {selectedProduct && (
        <>
          <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-30 animate-in fade-in duration-200" onClick={() => setSelectedProduct(null)}></div>
          <div className="fixed bottom-0 left-0 right-0 p-6 bg-white rounded-t-[2.5rem] shadow-[0_-20px_40px_-15px_rgba(0,0,0,0.1)] z-40 animate-in slide-in-from-bottom-5 duration-300 pb-safe">
            <div className="max-w-md mx-auto space-y-6">

              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 leading-tight">{selectedProduct.name}</h3>
                  <p className="text-sm font-semibold tracking-wide text-orange-500 mt-1 uppercase">Configure Sale</p>
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 text-gray-500 transition-colors focus:outline-none"
                >
                  <span className="text-xl leading-none -mt-0.5">×</span>
                </button>
              </div>

              {/* Quick Presets */}
              <div className="grid grid-cols-4 gap-2">
                {PRESET_QUANTITIES.filter((p) => {
                  if (p.type.includes('kg') && !selectedProduct.pricePerKg) return false
                  if (p.type === 'piece' && !selectedProduct.pricePerPiece) return false
                  if (p.type === 'bowl' && !selectedProduct.pricePerBowl) return false
                  return true
                }).map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setUnitType(preset.type as any)
                      setQuantity(preset.value)
                    }}
                    className={`py-3 rounded-2xl font-bold text-sm transition-all focus:outline-none ${
                      quantity === preset.value && unitType === preset.type
                        ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20 scale-105'
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Premium Input */}
              <div className="bg-orange-50/50 p-5 rounded-3xl border border-orange-100/50">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Amount</label>
                  {selectedProduct.pricePerKg && (
                    <div className="flex bg-white shadow-sm p-1 rounded-xl">
                      <button
                        onClick={() => setUnitType('kg')}
                        className={`px-4 py-1.5 rounded-lg text-[13px] font-bold transition-all ${unitType === 'kg' ? 'bg-orange-100 text-orange-700' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        Grams
                      </button>
                      <button
                        onClick={() => setUnitType('kg_actual')}
                        className={`px-4 py-1.5 rounded-lg text-[13px] font-bold transition-all ${unitType === 'kg_actual' ? 'bg-orange-100 text-orange-700' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        KG
                      </button>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : '')}
                    placeholder="0"
                    className="w-full bg-white border-none px-5 py-5 rounded-2xl text-[40px] leading-none font-black text-gray-900 focus:ring-4 focus:ring-orange-500/20 outline-none transition-all placeholder:text-gray-200 shadow-[0_2px_20px_rgb(0,0,0,0.04)]"
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 font-bold text-2xl">
                    {unitType === 'piece' ? 'pc' : unitType === 'bowl' ? 'bowl' : unitType === 'kg_actual' ? 'KG' : 'g'}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSale}
                disabled={isSubmitting || !quantity}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 active:scale-[0.98] text-white p-5 rounded-2xl flex justify-between items-center shadow-[0_8px_30px_-10px_rgba(249,115,22,0.6)] transition-all disabled:opacity-50 disabled:active:scale-100 disable:cursor-not-allowed mt-4"
              >
                <span className="font-extrabold text-xl tracking-wide">{isSubmitting ? 'Processing...' : 'Complete Sale'}</span>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                  <span className="font-black text-2xl">₹{currentAmount.toFixed(2)}</span>
                </div>
              </button>

            </div>
          </div>
        </>
      )}
    </div>
  )
}
