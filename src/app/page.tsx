import { getDashboardStats } from '@/app/actions/dashboard'
import { IndianRupee, TrendingUp, Package, Trophy } from 'lucide-react'

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-orange-600 mb-2">
            <IndianRupee className="w-5 h-5" />
            <h3 className="font-semibold text-sm">Today's Sales</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">₹{stats.totalSales.toFixed(2)}</p>
        </div>

        <div className="bg-green-50 p-4 rounded-2xl border border-green-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <TrendingUp className="w-5 h-5" />
            <h3 className="font-semibold text-sm">Today's Profit</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">₹{stats.totalProfit.toFixed(2)}</p>
        </div>

        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Package className="w-5 h-5" />
            <h3 className="font-semibold text-sm">Items Sold</h3>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <Trophy className="w-5 h-5 cursor-pointer" />
            <h3 className="font-semibold text-sm">Top Sweet</h3>
          </div>
          <p className="text-lg font-bold text-gray-900 truncate" title={stats.topProduct}>{stats.topProduct}</p>
        </div>
      </div>

      {/* Live Sales List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 p-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">Live Sales Feed</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {stats.recentSales.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No sales recorded today yet.
            </div>
          ) : (
              <div key={sale.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {new Date(sale.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="font-bold text-green-600">₹{sale.totalAmount.toFixed(2)}</span>
                </div>
                <div className="space-y-1">
                  {sale.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.product.name}
                      </span>
                      <span className="text-gray-500 font-medium">
                        {item.quantity < 100 ? `${item.quantity} pc` : `${item.quantity}g`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
