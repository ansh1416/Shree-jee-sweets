'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Trophy, TrendingUp, CalendarDays } from 'lucide-react'

type DailyData = { date: string; revenue: number }
type TopProduct = { name: string; revenue: number; quantity: number }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1e1e2e] border border-white/10 rounded-2xl shadow-xl p-3 text-sm">
        <p className="font-bold text-white/30 mb-1 text-xs uppercase tracking-wider">{label}</p>
        <p className="font-black text-white text-lg">₹{payload[0].value.toFixed(0)}</p>
      </div>
    )
  }
  return null
}

export default function ReportsClient({
  daily,
  topProducts,
  week,
  month,
}: {
  daily: DailyData[]
  topProducts: TopProduct[]
  week: { revenue: number; count: number }
  month: { revenue: number; count: number }
}) {
  const maxRevenue = Math.max(...topProducts.map((d) => d.revenue), 1)

  return (
    <div className="space-y-5 pb-4">

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-orange-500 to-red-600 p-5 rounded-3xl relative overflow-hidden shadow-[0_0_40px_rgba(249,115,22,0.2)]">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
          <p className="text-orange-100/60 text-[10px] font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
            <CalendarDays className="w-3 h-3" />
            This Week
          </p>
          <p className="text-3xl font-black text-white tracking-tight">₹{week.revenue.toFixed(0)}</p>
          <p className="text-orange-200/50 text-xs font-bold mt-2">{week.count} sales</p>
        </div>

        <div className="bg-[#1a1a26] border border-white/[0.06] p-5 rounded-3xl relative overflow-hidden">
          <p className="text-white/25 text-[10px] font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
            <CalendarDays className="w-3 h-3" />
            This Month
          </p>
          <p className="text-3xl font-black text-white tracking-tight">₹{month.revenue.toFixed(0)}</p>
          <p className="text-white/25 text-xs font-bold mt-2">{month.count} sales</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-[#13131e] border border-white/[0.06] rounded-3xl p-5">
        <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-5 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-orange-500" />
          Weekly Revenue
        </h3>
        <div className="h-[200px] -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={daily} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.2)', fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.2)', fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `₹${v}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(249,115,22,0.05)' }} />
              <Bar dataKey="revenue" fill="url(#darkGradient)" radius={[6, 6, 4, 4]}>
                <defs>
                  <linearGradient id="darkGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f97316" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products */}
      {topProducts.length > 0 ? (
        <div className="bg-[#13131e] border border-white/[0.06] rounded-3xl overflow-hidden">
          <div className="p-4 border-b border-white/[0.05] flex items-center gap-2">
            <div className="w-7 h-7 bg-yellow-500/10 rounded-xl flex items-center justify-center">
              <Trophy className="w-4 h-4 text-yellow-500" />
            </div>
            <h3 className="font-bold text-sm text-white/60 uppercase tracking-wider">Top Products</h3>
          </div>
          
          <div className="divide-y divide-white/[0.04] p-3">
            {topProducts.map((p, i) => (
              <div key={p.name} className="py-3 flex items-center gap-3 px-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                  i === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                  i === 1 ? 'bg-white/10 text-white/40' :
                  i === 2 ? 'bg-orange-500/10 text-orange-400' :
                  'bg-white/5 text-white/20'
                }`}>
                  {i + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1.5">
                    <p className="font-bold text-white/70 text-sm truncate">{p.name}</p>
                    <span className="font-black text-white text-sm ml-2 shrink-0">₹{p.revenue.toFixed(0)}</span>
                  </div>
                  <div className="bg-white/[0.05] rounded-full h-1 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-700"
                      style={{ width: `${Math.max((p.revenue / maxRevenue) * 100, 3)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-[#13131e] border border-white/[0.06] rounded-3xl p-12 text-center">
          <p className="text-white/20 font-semibold text-sm">No sales data this week.</p>
        </div>
      )}
    </div>
  )
}
