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
      <div className="bg-white/90 backdrop-blur-md border border-gray-100 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-4 text-sm font-medium">
        <p className="font-bold text-gray-500 mb-2 uppercase tracking-wider text-xs">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} className="font-black text-orange-600 text-lg flex items-center gap-1">
            <span className="text-sm text-gray-400 font-bold">₹</span>{p.value.toFixed(0)}
          </p>
        ))}
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
    <div className="space-y-6 pb-24 top-0">
      
      {/* Premium Header */}
      <div className="px-4 pt-6 pb-2">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-orange-500" />
          Analytics
        </h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 px-4">
        <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-5 rounded-3xl text-white shadow-lg shadow-orange-500/30 relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -translate-y-10 translate-x-10"></div>
          <p className="text-orange-100 text-[11px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5" />
            This Week
          </p>
          <div className="flex items-start gap-1">
            <span className="text-lg font-bold text-orange-200 mt-1">₹</span>
            <p className="text-3xl font-black tracking-tight">{week.revenue.toFixed(0)}</p>
          </div>
          <p className="text-orange-50 text-xs font-medium mt-2 bg-black/10 inline-block px-2 py-1 rounded-lg">
            {week.count} total sales
          </p>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-5 rounded-3xl text-white shadow-lg shadow-gray-900/20 relative overflow-hidden group hover:scale-[1.02] transition-transform">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-10 translate-x-10"></div>
          <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5" />
            This Month
          </p>
          <div className="flex items-start gap-1">
            <span className="text-lg font-bold text-gray-500 mt-1">₹</span>
            <p className="text-3xl font-black tracking-tight">{month.revenue.toFixed(0)}</p>
          </div>
          <p className="text-gray-300 text-xs font-medium mt-2 bg-white/10 inline-block px-2 py-1 rounded-lg">
            {month.count} total sales
          </p>
        </div>
      </div>

      {/* Bar Chart - Last 7 Days */}
      <div className="px-4">
        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 pt-7">
          <h3 className="font-extrabold text-gray-800 text-sm tracking-wide uppercase mb-6 flex items-center gap-2">
            Weekly Revenue
            <div className="h-1 w-1 bg-orange-500 rounded-full"></div>
          </h3>
          <div className="h-[220px] w-full -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={daily} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${v}`}
                  dx={-10}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f97316', opacity: 0.05 }} />
                <Bar dataKey="revenue" fill="url(#colorRevenue)" radius={[6, 6, 6, 6]}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#f97316" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="px-4">
        {topProducts.length > 0 && (
          <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden mt-6">
            <div className="p-5 border-b border-gray-50 flex items-center gap-2">
              <div className="p-2 bg-yellow-50 rounded-xl">
                <Trophy className="w-5 h-5 text-yellow-600" />
              </div>
              <h3 className="font-extrabold text-gray-800 tracking-wide">Top Products This Week</h3>
            </div>
            
            <div className="divide-y divide-gray-50/80 p-2">
              {topProducts.map((p, i) => (
                <div key={p.name} className="p-3 flex items-center gap-4 hover:bg-gray-50/50 rounded-2xl transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shrink-0 ${
                    i === 0 ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 text-yellow-900 shadow-sm shadow-yellow-500/20' : 
                    i === 1 ? 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700 shadow-sm shadow-gray-400/20' : 
                    i === 2 ? 'bg-gradient-to-br from-orange-300 to-orange-400 text-orange-900 shadow-sm shadow-orange-500/20' : 
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {i + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0 py-1">
                    <div className="flex justify-between items-end mb-1.5">
                      <p className="font-bold text-gray-800 truncate text-[15px]">{p.name}</p>
                      <span className="font-black text-gray-900 text-[15px] shrink-0">
                        ₹{p.revenue.toFixed(0)}
                      </span>
                    </div>
                    <div className="bg-gray-100 rounded-full h-1.5 overflow-hidden w-full">
                      <div
                        className="h-full bg-orange-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${Math.max((p.revenue / maxRevenue) * 100, 2)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {topProducts.length === 0 && (
          <div className="bg-white rounded-[2rem] border border-gray-100 p-12 text-center flex flex-col items-center mt-6">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8 opacity-40 text-gray-500" />
            </div>
            <p className="text-gray-400 font-bold">No sales data yet for this week.</p>
          </div>
        )}
      </div>
    </div>
  )
}
