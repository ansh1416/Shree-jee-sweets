'use client'

import { useState } from 'react'
import { createSale } from '@/app/actions/sale'
import { CheckCircle2, Search, X, IndianRupee, Weight } from 'lucide-react'

type Product = {
  id: string
  name: string
  pricePerKg: number | null
  pricePerBowl: number | null
  costPrice: number
  category: string
}

const BOWL_IN_GRAMS = 100

const PRESET_QUANTITIES = [
  { label: '100g', value: 100, type: 'g' },
  { label: '250g', value: 250, type: 'g' },
  { label: '500g', value: 500, type: 'g' },
  { label: '1 KG', value: 1000, type: 'g' },
  { label: '2 KG', value: 2000, type: 'g' },
  { label: '5 KG', value: 5000, type: 'g' },
  { label: '1 Bowl', value: 1, type: 'bowl' },
  { label: '2 Bowl', value: 2, type: 'bowl' },
]

type InputMode = 'quantity' | 'amount'

export default function POSClient({ products }: { products: Product[] }) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState<number | ''>('')
  const [unitType, setUnitType] = useState<'g' | 'kg' | 'bowl'>('g')
  const [inputMode, setInputMode] = useState<InputMode>('quantity')
  // For "by amount" mode — user types rupees
  const [rupeesInput, setRupeesInput] = useState<number | ''>('')
  const [toast, setToast] = useState<{ amount: number } | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // ── Quantity mode calculations ──────────────────────────────────────────
  const computeStoredGrams = (): number => {
    if (typeof quantity !== 'number') return 0
    if (unitType === 'kg') return quantity * 1000
    if (unitType === 'bowl') return quantity * BOWL_IN_GRAMS
    return quantity
  }

  let quantityModeAmount = 0
  if (selectedProduct && typeof quantity === 'number') {
    if (unitType === 'bowl' && selectedProduct.pricePerBowl) {
      quantityModeAmount = selectedProduct.pricePerBowl * quantity
    } else if (selectedProduct.pricePerKg) {
      const grams = unitType === 'kg' ? quantity * 1000 : quantity
      quantityModeAmount = (selectedProduct.pricePerKg / 1000) * grams
    }
  }

  // ── Amount mode calculations ─────────────────────────────────────────────
  // How many grams does the typed ₹ amount buy?
  const computeAmountModeGrams = (): number => {
    if (!selectedProduct?.pricePerKg || typeof rupeesInput !== 'number' || rupeesInput <= 0) return 0
    return (rupeesInput / selectedProduct.pricePerKg) * 1000
  }

  const amountModeGrams = computeAmountModeGrams()
  const amountModeDisplay =
    amountModeGrams >= 1000
      ? `${(amountModeGrams / 1000).toFixed(amountModeGrams % 1000 === 0 ? 0 : 2)} KG`
      : amountModeGrams > 0
      ? `${amountModeGrams.toFixed(0)}g`
      : '—'

  // ── Unified values for sale submission ───────────────────────────────────
  const finalAmount = inputMode === 'amount' ? (typeof rupeesInput === 'number' ? rupeesInput : 0) : quantityModeAmount
  const finalGrams  = inputMode === 'amount' ? amountModeGrams : computeStoredGrams()
  const canSubmit   = inputMode === 'amount'
    ? typeof rupeesInput === 'number' && rupeesInput > 0 && amountModeGrams > 0
    : typeof quantity === 'number' && quantity > 0

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSale = async () => {
    if (!selectedProduct || !canSubmit) return

    const product = selectedProduct
    const amount = finalAmount
    const grams = finalGrams

    // Optimistic reset
    setSelectedProduct(null)
    setQuantity('')
    setRupeesInput('')
    setInputMode('quantity')
    setToast({ amount })
    setTimeout(() => setToast(null), 3000)

    createSale({
      items: [{ productId: product.id, quantity: grams, amount, profit: 0 }],
      totalAmount: amount,
      totalProfit: 0,
    }).catch(() => {
      setToast(null)
      alert('Sale failed to save. Please try again.')
    })
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const unitLabel = unitType === 'kg' ? 'KG' : unitType === 'bowl' ? 'bowl' : 'g'

  return (
    <div className="space-y-4 pb-4">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-[#13131e] text-white border border-emerald-500/30 px-5 py-3 rounded-full shadow-[0_0_40px_rgba(34,197,94,0.2)] flex items-center gap-3 animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="font-bold text-sm tracking-wide">₹{toast.amount.toFixed(2)} <span className="text-white/40">Sale Recorded</span></span>
        </div>
      )}

      {/* Search */}
      {products.length > 6 && (
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/[0.07] rounded-2xl text-white/80 font-medium placeholder:text-white/20 focus:outline-none focus:border-orange-500/40 focus:bg-white/[0.07] transition-all text-sm"
          />
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {filtered.map((product) => (
          <button
            key={product.id}
            onClick={() => {
              setSelectedProduct(product)
              if (product.pricePerKg) setUnitType('g')
              else if (product.pricePerBowl) setUnitType('bowl')
              setQuantity('')
              setRupeesInput('')
              setInputMode('quantity')
            }}
            className={`relative p-4 rounded-2xl text-left flex flex-col justify-between min-h-[110px] overflow-hidden transition-all duration-200 ${
              selectedProduct?.id === product.id
                ? 'bg-gradient-to-br from-orange-500 to-red-600 shadow-[0_0_30px_rgba(249,115,22,0.35)] scale-[0.97]'
                : 'bg-[#1a1a26] hover:bg-[#1f1f30] border border-white/[0.06] hover:border-orange-500/20 hover:-translate-y-0.5'
            }`}
          >
            {selectedProduct?.id === product.id && (
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/10 rounded-full blur-xl" />
            )}
            <span className={`font-bold text-sm leading-snug z-10 ${selectedProduct?.id === product.id ? 'text-white' : 'text-white/80'}`}>
              {product.name}
            </span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg mt-3 z-10 self-start ${
              selectedProduct?.id === product.id
                ? 'bg-black/20 text-white/80'
                : 'bg-orange-500/10 text-orange-400'
            }`}>
              {product.pricePerKg && `₹${product.pricePerKg}/kg`}
              {!product.pricePerKg && product.pricePerBowl && `₹${product.pricePerBowl}/bowl`}
            </span>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 py-12 text-center text-white/20 text-sm font-medium">
            No products match your search.
          </div>
        )}
      </div>

      {/* Floating Drawer */}
      {selectedProduct && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] animate-in fade-in duration-200"
            onClick={() => setSelectedProduct(null)}
          />
          <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-[#13131e] border-t border-white/[0.07] rounded-t-[2.5rem] z-[70] animate-in slide-in-from-bottom-4 duration-300 pb-[88px] shadow-[0_-30px_60px_rgba(0,0,0,0.6)]">
            <div className="p-6 space-y-5">

              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-black text-white">{selectedProduct.name}</h3>
                  <p className="text-xs font-bold text-orange-500/80 uppercase tracking-widest mt-1">Configure Sale</p>
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="w-9 h-9 bg-white/[0.06] rounded-full flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/10 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mode switcher — only for kg products */}
              {selectedProduct.pricePerKg && (
                <div className="flex bg-white/[0.05] border border-white/[0.07] p-1 rounded-2xl gap-1">
                  <button
                    onClick={() => { setInputMode('quantity'); setRupeesInput('') }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      inputMode === 'quantity'
                        ? 'bg-orange-500/20 text-orange-400 shadow-inner'
                        : 'text-white/30 hover:text-white/60'
                    }`}
                  >
                    <Weight className="w-3.5 h-3.5" />
                    By Weight
                  </button>
                  <button
                    onClick={() => { setInputMode('amount'); setQuantity(''); setUnitType('g') }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      inputMode === 'amount'
                        ? 'bg-orange-500/20 text-orange-400 shadow-inner'
                        : 'text-white/30 hover:text-white/60'
                    }`}
                  >
                    <IndianRupee className="w-3.5 h-3.5" />
                    By Amount
                  </button>
                </div>
              )}

              {/* ── BY WEIGHT MODE ── */}
              {inputMode === 'quantity' && (
                <>
                  {/* Presets */}
                  <div className="grid grid-cols-4 gap-2">
                    {PRESET_QUANTITIES.filter((p) => {
                      if (p.type !== 'bowl' && !selectedProduct.pricePerKg) return false
                      if (p.type === 'bowl' && !selectedProduct.pricePerBowl) return false
                      return true
                    }).map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setUnitType(preset.type === 'bowl' ? 'bowl' : 'g')
                          setQuantity(preset.value)
                        }}
                        className={`py-2.5 rounded-xl font-bold text-sm transition-all ${
                          quantity === preset.value &&
                          ((preset.type === 'bowl' && unitType === 'bowl') || preset.type === 'g')
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)]'
                            : 'bg-white/[0.05] text-white/40 hover:bg-white/10 hover:text-white/70 border border-white/[0.05]'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  {/* Input */}
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-xs font-bold text-white/30 uppercase tracking-widest">Quantity</label>
                      {selectedProduct.pricePerKg && (
                        <div className="flex bg-white/[0.07] p-1 rounded-xl">
                          <button onClick={() => setUnitType('g')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${unitType === 'g' ? 'bg-orange-500/20 text-orange-400' : 'text-white/30 hover:text-white/50'}`}>Grams</button>
                          <button onClick={() => setUnitType('kg')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${unitType === 'kg' ? 'bg-orange-500/20 text-orange-400' : 'text-white/30 hover:text-white/50'}`}>KG</button>
                          {selectedProduct.pricePerBowl && (
                            <button onClick={() => setUnitType('bowl')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${unitType === 'bowl' ? 'bg-orange-500/20 text-orange-400' : 'text-white/30 hover:text-white/50'}`}>Bowl</button>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : '')}
                        placeholder="0"
                        className="w-full bg-transparent border-none text-[48px] font-black text-white focus:outline-none placeholder:text-white/10 py-2"
                      />
                      <span className="absolute right-0 top-1/2 -translate-y-1/2 text-white/20 font-bold text-2xl">{unitLabel}</span>
                    </div>
                    {typeof quantity === 'number' && quantity > 0 && (() => {
                      const g = computeStoredGrams()
                      const display = g >= 1000 ? `${(g / 1000).toFixed(g % 1000 === 0 ? 0 : 2)} KG` : `${g}g`
                      return <p className="text-orange-400/50 text-xs font-bold mt-1">= {display}</p>
                    })()}
                  </div>
                </>
              )}

              {/* ── BY AMOUNT MODE ── */}
              {inputMode === 'amount' && selectedProduct.pricePerKg && (
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
                  <label className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3 block">Enter Amount (₹)</label>
                  <div className="relative">
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-white/20 font-black text-3xl">₹</span>
                    <input
                      type="number"
                      value={rupeesInput}
                      onChange={(e) => setRupeesInput(e.target.value ? Number(e.target.value) : '')}
                      placeholder="0"
                      className="w-full bg-transparent border-none text-[48px] font-black text-white focus:outline-none placeholder:text-white/10 py-2 pl-10"
                    />
                  </div>

                  {/* Weight result */}
                  {typeof rupeesInput === 'number' && rupeesInput > 0 && (
                    <div className="mt-3 bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-3 flex items-center justify-between">
                      <span className="text-xs font-bold text-orange-400/70 uppercase tracking-widest">You get</span>
                      <span className="text-2xl font-black text-orange-400">{amountModeDisplay}</span>
                    </div>
                  )}
                  <p className="text-white/20 text-[11px] font-semibold mt-2">
                    @ ₹{selectedProduct.pricePerKg}/kg
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                onClick={handleSale}
                disabled={!canSubmit}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 active:scale-[0.98] text-white font-black py-4 rounded-2xl flex justify-between items-center px-5 shadow-[0_0_30px_rgba(249,115,22,0.3)] transition-all disabled:opacity-30 disabled:pointer-events-none"
              >
                <span className="text-lg tracking-wide">Complete Sale</span>
                <span className="text-xl font-black text-white/80">₹{finalAmount.toFixed(2)}</span>
              </button>

            </div>
          </div>
        </>
      )}
    </div>
  )
}
