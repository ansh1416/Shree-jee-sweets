import { getDashboardStats } from '@/app/actions/dashboard'
import { IndianRupee, Package, Trophy, TrendingUp } from 'lucide-react'

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-8 bg-gray-50/50 min-h-screen pb-24">
      
      {/* Premium Header */}
      <div className="bg-gradient-to-br from-orange-500 relative via-orange-600 to-red-600 rounded-b-[2.5rem] p-8 pt-10 shadow-lg shadow-orange-500/20 overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-20 translate-x-20"></div>
        
        <h2 className="text-orange-50 font-medium tracking-wide text-sm mb-1 uppercase">Today's Revenue</h2>
        <div className="flex items-center gap-3">
          <IndianRupee className="w-8 h-8 text-white stroke-[2.5]" />
          <p className="text-5xl font-extrabold text-white tracking-tight">
            {stats.totalSales.toFixed(0)}<span className="text-2xl text-orange-200">.{(stats.totalSales % 1).toFixed(2).substring(2)}</span>
          </p>
        </div>
      </div>

      <div className="px-5 space-y-6">
        {/* Mini Stats Grid */}
        <div className="grid grid-cols-2 gap-4 -mt-12 relative z-10">
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center mb-3">
              <Package className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-gray-400 font-semibold text-xs uppercase tracking-wider mb-1">Items Sold</h3>
            <p className="text-2xl font-extrabold text-gray-800">{stats.totalItems}</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center mb-3">
              <Trophy className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="text-gray-400 font-semibold text-xs uppercase tracking-wider mb-1">Top Sweet</h3>
            <p className="text-lg font-extrabold text-gray-800 truncate" title={stats.topProduct}>{stats.topProduct}</p>
          </div>
        </div>

        {/* Live Sales List */}
        <div>
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="font-extrabold text-xl text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              Live Sales Feed
            </h2>
          </div>

          <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 overflow-hidden">
            <div className="divide-y divide-gray-50/80">
              {stats.recentSales.length === 0 ? (
                <div className="p-10 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                    <Package className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-400 font-medium">No sales recorded today yet.</p>
                </div>
              ) : (
                stats.recentSales.map((sale: any) => (
                  <div key={sale.id} className="p-5 hover:bg-orange-50/30 transition-colors group">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[11px] font-bold text-gray-400 bg-gray-100/80 px-2.5 py-1 rounded-full tracking-wide">
                        {new Date(sale.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="font-black text-lg text-gray-800 flex items-center">
                        <span className="text-gray-400 text-sm mr-1">₹</span>
                        {sale.totalAmount.toFixed(2)}
                      </span>
                    </div>

                    <div className="space-y-2 pl-1">
                      {sale.items.map((item: any) => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                          <span className="font-semibold text-gray-600 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                            {item.product.name}
                          </span>
                          <span className="text-orange-600 font-bold bg-orange-50 px-2.5 py-0.5 rounded-lg text-xs">
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
      </div>
    </div>
  )
}
