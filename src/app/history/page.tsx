import { getSalesHistory } from '@/app/actions/history'
import { CalendarDays, PackageOpen } from 'lucide-react'
import Link from 'next/link'

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: { days?: string }
}) {
  const days = searchParams.days ? parseInt(searchParams.days) : 7
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
    <div className="space-y-6 pb-24 px-4 pt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Sales History</h2>
      </div>

      <div className="bg-gray-100/80 p-1.5 rounded-2xl flex gap-1 shadow-inner">
        {dayOptions.map((opt) => (
          <Link
            key={opt.value}
            href={`/history?days=${opt.value}`}
            className={`flex-1 text-center py-2.5 rounded-xl text-sm font-bold transition-all ${
              days === opt.value
                ? 'bg-white text-orange-600 shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {opt.label}
          </Link>
        ))}
      </div>

      {sales.length === 0 ? (
        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-gray-100 p-12 text-center flex flex-col items-center text-gray-400 mt-8">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <PackageOpen className="w-8 h-8 opacity-40 text-gray-500" />
          </div>
          <p className="font-semibold text-gray-500">No sales in the last {days} days.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, daySales]) => {
            const dayTotal = daySales.reduce((sum: number, s: any) => sum + s.totalAmount, 0)

            return (
              <div key={date} className="animate-in fade-in slide-in-from-bottom-5">
                {/* Day Header */}
                <div className="flex justify-between items-end mb-3 px-2">
                  <h3 className="font-extrabold text-gray-800 text-lg sticky top-0 py-1 flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-orange-500" />
                    {date}
                  </h3>
                  <div className="text-right pb-1">
                    <p className="font-black text-green-600 text-lg flex items-center justify-end">
                      <span className="text-sm mr-1 text-green-500/70">₹</span>
                      {dayTotal.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Sales in day */}
                <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                  <div className="divide-y divide-gray-50">
                    {daySales.map((sale: any) => (
                      <div key={sale.id} className="p-5 hover:bg-orange-50/30 transition-colors">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[11px] font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-wider">
                            {new Date(sale.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          <span className="font-black text-gray-900 text-lg">₹{sale.totalAmount.toFixed(2)}</span>
                        </div>

                        <div className="space-y-2 pl-1 mt-3">
                          {sale.items.map((item: any) => (
                            <div key={item.id} className="flex justify-between items-center text-sm">
                              <span className="font-semibold text-gray-600 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                                {item.product.name}
                              </span>
                              <span className="text-gray-500 font-bold bg-gray-50/80 px-2.5 py-1 rounded-lg text-[11px]">
                                {item.quantity < 100 ? `${item.quantity} pc` : `${item.quantity}g`}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
