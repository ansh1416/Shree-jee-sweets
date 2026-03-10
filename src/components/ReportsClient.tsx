'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

type DailyData = { date: string; revenue: number; profit: number }
type TopProduct = { name: string; revenue: number; quantity: number }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-sm">
        <p className="font-bold text-gray-700 mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }} className="font-semibold">
            {p.name === 'revenue' ? 'Revenue' : 'Profit'}: ₹{p.value.toFixed(0)}
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
  week: { revenue: number; profit: number; count: number }
  month: { revenue: number; profit: number; count: number }
}) {
  const maxRevenue = Math.max(...daily.map((d) => d.revenue), 1)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-4 rounded-2xl text-white shadow-md">
          <p className="text-orange-100 text-xs font-semibold uppercase tracking-wider mb-1">
            This Week
          </p>
          <p className="text-2xl font-bold">₹{week.revenue.toFixed(0)}</p>
          <p className="text-orange-200 text-sm mt-1">
            +₹{week.profit.toFixed(0)} profit · {week.count} sales
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-400 to-green-600 p-4 rounded-2xl text-white shadow-md">
          <p className="text-green-100 text-xs font-semibold uppercase tracking-wider mb-1">
            This Month
          </p>
          <p className="text-2xl font-bold">₹{month.revenue.toFixed(0)}</p>
          <p className="text-green-200 text-sm mt-1">
            +₹{month.profit.toFixed(0)} profit · {month.count} sales
          </p>
        </div>
      </div>

      {/* Bar Chart - Last 7 Days */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <h3 className="font-bold text-gray-800 mb-4">Revenue & Profit — Last 7 Days</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={daily} barCategoryGap="30%" barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
              formatter={(value) => (value === 'revenue' ? 'Revenue' : 'Profit')}
            />
            <Bar dataKey="revenue" fill="#f97316" radius={[6, 6, 0, 0]} name="revenue" />
            <Bar dataKey="profit" fill="#22c55e" radius={[6, 6, 0, 0]} name="profit" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Products */}
      {topProducts.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="font-bold text-gray-800">Top Products This Week</h3>
          </div>
          <div className="divide-y divide-gray-50">
              <div key={p.name} className="p-4 flex items-center gap-3">
                <span
                      ? 'bg-yellow-400 text-yellow-900'
                      : i === 1
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{p.name}</p>
                  <div className="mt-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full bg-orange-400 rounded-full transition-all"
                      style={{ width: `${(p.revenue / maxRevenue) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="font-bold text-green-600 text-sm shrink-0">
                  ₹{p.revenue.toFixed(0)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {topProducts.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
          No sales data yet for this week.
        </div>
      )}
    </div>
  )
}
