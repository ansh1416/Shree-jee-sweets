import { getDashboardStats } from '@/app/actions/dashboard'
import { IndianRupee, Package, Trophy, TrendingUp, Clock } from 'lucide-react'

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-6 pb-4">
      
      {/* Revenue Hero Card */}
      <div className="relative bg-gradient-to-br from-orange-600 via-orange-500 to-red-600 rounded-3xl p-6 overflow-hidden shadow-[0_20px_60px_rgba(249,115,22,0.25)]">
        <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-12 -left-8 w-52 h-52 bg-red-900/30 rounded-full blur-3xl"></div>
        
        <p className="text-orange-100/70 text-xs font-bold uppercase tracking-widest mb-3 relative">Today&apos;s Revenue</p>
        <div className="flex items-start gap-2 relative">
          <IndianRupee className="w-7 h-7 text-orange-200 mt-2 stroke-[2.5]" />
          <p className="text-6xl font-black text-white tracking-tight">
            {Math.floor(stats.totalSales).toLocaleString()}
            <span className="text-2xl text-orange-200/70">
              .{(stats.totalSales % 1).toFixed(2).substring(2)}
            </span>
          </p>
        </div>
        <div className="flex gap-3 mt-5 relative">
          <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Items</p>
            <p className="text-white font-black text-lg">{stats.totalItems}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10 flex-1 min-w-0">
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Top Sweet</p>
            <p className="text-white font-black text-lg truncate">{stats.topProduct}</p>
          </div>
        </div>
      </div>

      {/* Live Sales Feed */}
      <div>
        <h2 className="flex items-center gap-2 text-sm font-bold text-white/40 uppercase tracking-widest mb-3 px-1">
          <TrendingUp className="w-4 h-4" />
          Live Feed
        </h2>

        <div className="bg-[#13131e] rounded-3xl border border-white/[0.06] overflow-hidden">
          {stats.recentSales.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center gap-3">
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center">
                <Package className="w-7 h-7 text-white/20" />
              </div>
              <p className="text-white/25 font-semibold text-sm">No sales today yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {stats.recentSales.map((sale: any) => (
                <div key={sale.id} className="p-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2 text-white/30 text-xs font-bold">
                      <Clock className="w-3 h-3" />
                      <span className="uppercase tracking-wider">
                        {new Date(sale.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' })}
                      </span>
                    </div>
                    <span className="font-black text-white text-lg">
                      ₹{sale.totalAmount.toFixed(2)}
                    </span>
                  </div>

                  <div className="space-y-1.5 pl-1">
                    {sale.items.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <span className="font-semibold text-white/60 text-sm flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-orange-500"></span>
                          {item.product.name}
                        </span>
                        <span className="text-[11px] font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-lg">
                          {item.quantity < 100 ? `${item.quantity} pc` : `${item.quantity}g`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
