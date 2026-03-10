import { getSalesHistory } from '@/app/actions/history'
import { CalendarDays, PackageOpen } from 'lucide-react'
import Link from 'next/link'

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>
}) {
  const params = await searchParams
  const days = params.days ? parseInt(params.days) : 7

  const sales = await getSalesHistory(days)

  // Group sales by date
  const grouped: Record<string, typeof sales> = {}
  for (const sale of sales) {
    const key = new Date(sale.createdAt).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    })
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(sale)
  }

  const dayOptions = [
    { label: '7 Days', value: 7 },
    { label: '14 Days', value: 14 },
    { label: '30 Days', value: 30 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">History</h2>

        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {dayOptions.map((opt) => (
            <Link
              key={opt.value}
              href={`/history?days=${opt.value}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                days === opt.value
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {opt.label}
            </Link>
          ))}
        </div>
      </div>

      {sales.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center text-gray-400">
          <PackageOpen className="w-12 h-12 mb-3 opacity-20" />
          <p>No sales in the last {days} days.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([date, daySales]) => {
            const dayTotal = daySales.reduce((sum, s) => sum + s.totalAmount, 0)
            const dayProfit = daySales.reduce((sum, s) => sum + s.totalProfit, 0)

            return (
              <div key={date} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Day Header */}
                <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                    <CalendarDays className="w-4 h-4 text-orange-500" />
                    {date}
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-green-600">₹{dayTotal.toFixed(0)}</span>
                    <span className="text-xs text-gray-400 ml-2">+₹{dayProfit.toFixed(0)} profit</span>
                  </div>
                </div>

                {/* Sales in day */}
                <div className="divide-y divide-gray-50">
                  {daySales.map((sale) => (
                    <div key={sale.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                          {new Date(sale.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <div className="text-right">
                          <span className="font-bold text-gray-800">₹{sale.totalAmount.toFixed(2)}</span>
                          <span className="text-xs text-green-600 ml-2">+₹{sale.totalProfit.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="bg-orange-50/70 rounded-xl p-3 border border-orange-100/50 space-y-1.5">
                        {sale.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center text-sm">
                            <span className="font-medium text-gray-800 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                              {item.product.name}
                            </span>
                            <div className="flex items-center gap-3">
                              <span className="text-gray-500 font-medium">
                                {item.quantity < 100 ? `${item.quantity} pc` : `${item.quantity}g`}
                              </span>
                              <span className="text-gray-900 font-semibold w-14 text-right">
                                ₹{item.amount.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
