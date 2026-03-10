export const dynamic = 'force-dynamic'

import { getSalesHistory } from '@/app/actions/history'
import { CalendarDays, PackageOpen } from 'lucide-react'
import Link from 'next/link'
import SaleDeleteButton from '@/components/SaleDeleteButton'

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: { days?: string }
}) {
  const days = searchParams.days ? parseInt(searchParams.days) : 7
  const sales = await getSalesHistory(days)

  const grouped: Record<string, typeof sales> = {}
  for (const sale of sales) {
    const key = new Date(sale.createdAt).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      timeZone: 'Asia/Kolkata',
    })
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(sale)
  }

  const dayOptions = [
    { label: '7d', value: 7 },
    { label: '14d', value: 14 },
    { label: '30d', value: 30 },
  ]

  return (
    <div className="space-y-5 pb-4">
      {/* Title + Filter */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black text-white tracking-tight">Sales History</h2>
        <div className="flex bg-white/[0.05] border border-white/[0.07] p-1 rounded-xl gap-1">
          {dayOptions.map((opt) => (
            <Link
              key={opt.value}
              href={`/history?days=${opt.value}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                days === opt.value
                  ? 'bg-orange-500 text-white shadow-[0_0_10px_rgba(249,115,22,0.4)]'
                  : 'text-white/30 hover:text-white/60'
              }`}
            >
              {opt.label}
            </Link>
          ))}
        </div>
      </div>

      {sales.length === 0 ? (
        <div className="bg-[#13131e] rounded-3xl border border-white/[0.06] p-12 text-center flex flex-col items-center gap-3">
          <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center">
            <PackageOpen className="w-7 h-7 text-white/20" />
          </div>
          <p className="text-white/25 font-semibold text-sm">No sales in the last {days} days.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {Object.entries(grouped).map(([date, daySales]) => {
            const dayTotal = daySales.reduce((sum: number, s: any) => sum + s.totalAmount, 0)

            return (
              <div key={date}>
                {/* Day header */}
                <div className="flex justify-between items-center mb-2.5 px-1">
                  <h3 className="text-sm font-bold text-white/40 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-orange-500/60" />
                    {date}
                  </h3>
                  <span className="text-sm font-black text-white/70">₹{dayTotal.toFixed(2)}</span>
                </div>

                {/* Sales */}
                <div className="bg-[#13131e] rounded-3xl border border-white/[0.06] overflow-hidden">
                  <div className="divide-y divide-white/[0.04]">
                    {daySales.map((sale: any) => (
                      <div key={sale.id} className="p-4 hover:bg-white/[0.02] transition-colors group">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[11px] font-bold text-white/25 uppercase tracking-widest">
                            {new Date(sale.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' })}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="font-black text-white text-base">₹{sale.totalAmount.toFixed(2)}</span>
                            <SaleDeleteButton saleId={sale.id} />
                          </div>
                        </div>

                        <div className="space-y-1.5 pl-1">
                          {sale.items.map((item: any) => (
                            <div key={item.id} className="flex justify-between items-center">
                              <span className="text-sm font-semibold text-white/50 flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-orange-500/70"></span>
                                {item.product.name}
                              </span>
                              <span className="text-[11px] font-bold text-orange-400/80 bg-orange-500/10 px-2.5 py-1 rounded-lg">
                                {item.product.pricePerKg
                                  ? item.quantity >= 1000
                                    ? `${(item.quantity / 1000).toFixed(1)}kg`
                                    : `${item.quantity}g`
                                  : item.product.pricePerBowl
                                  ? `${item.quantity} bowl`
                                  : `${item.quantity} pc`}
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
