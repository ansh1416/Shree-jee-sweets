'use client'

import { useState, useTransition } from 'react'
import { setMorningStock } from '@/app/actions/inventory'
import { Package, Check, Edit2 } from 'lucide-react'

type InventoryItem = {
  id: string
  name: string
  category: string
  stock: {
    morningStock: number
    currentStock: number
  } | null
}

export default function InventoryClient({ items }: { items: InventoryItem[] }) {
  const [editing, setEditing] = useState<string | null>(null)
  const [values, setValues] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState<Record<string, boolean>>({})
  const [isPending, startTransition] = useTransition()

  const handleSave = (productId: string) => {
    const val = parseFloat(values[productId] ?? '')
    if (isNaN(val) || val < 0) return

    startTransition(async () => {
      await setMorningStock(productId, val)
      setSaved((prev) => ({ ...prev, [productId]: true }))
      setEditing(null)
      setTimeout(() => setSaved((prev) => ({ ...prev, [productId]: false })), 2000)
    })
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="divide-y divide-gray-100">
        {items.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            <Package className="w-10 h-10 mx-auto mb-2 opacity-20" />
            <p>No products found. Add products first.</p>
          </div>
        ) : (
          items.map((item) => {
            const isEditing = editing === item.id
            const isSaved = saved[item.id]
            const stock = item.stock

            const pct =
              stock && stock.morningStock > 0
                ? Math.min((stock.currentStock / stock.morningStock) * 100, 100)
                : null

            let barColor = 'bg-green-400'
            if (pct !== null) {
              if (pct <= 20) barColor = 'bg-red-400'
              else if (pct <= 50) barColor = 'bg-yellow-400'
            }

            return (
              <div key={item.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-gray-800">{item.name}</h3>
                    <span className="text-xs font-semibold text-gray-400 capitalize">
                      {item.category}
                    </span>
                  </div>

                  {isSaved ? (
                    <span className="flex items-center gap-1 text-green-600 text-sm font-bold">
                      <Check className="w-4 h-4" /> Saved
                    </span>
                  ) : isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        autoFocus
                        placeholder="kg"
                        value={values[item.id] ?? ''}
                        onChange={(e) =>
                          setValues((prev) => ({ ...prev, [item.id]: e.target.value }))
                        }
                        onKeyDown={(e) => e.key === 'Enter' && handleSave(item.id)}
                        className="w-24 px-3 py-1.5 bg-gray-50 border border-orange-300 rounded-lg text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none"
                      />
                      <button
                        onClick={() => handleSave(item.id)}
                        disabled={isPending}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditing(null)}
                        className="text-gray-400 hover:text-gray-600 px-2 py-1.5 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditing(item.id)
                        setValues((prev) => ({
                          ...prev,
                          [item.id]: stock ? String(stock.morningStock) : '',
                        }))
                      }}
                      className="flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      {stock ? 'Update' : 'Set Stock'}
                    </button>
                  )}
                </div>

                {stock ? (
                  <>
                    <div className="flex justify-between text-xs text-gray-500 mb-1 font-medium">
                      <span>Remaining: <strong className="text-gray-700">{stock.currentStock.toFixed(2)} kg</strong></span>
                      <span>Morning: {stock.morningStock.toFixed(2)} kg</span>
                    </div>
                    <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full ${barColor} rounded-full transition-all`}
                        style={{ width: `${pct ?? 0}%` }}
                      />
                    </div>
                    {pct !== null && pct <= 20 && (
                      <p className="text-xs font-bold text-red-500 mt-1">⚠ Low stock!</p>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-gray-400 italic">No stock set for today</p>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
