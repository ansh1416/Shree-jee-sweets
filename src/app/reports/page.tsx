export const dynamic = 'force-dynamic'

import { getReportsData } from '@/app/actions/reports'
import ReportsClient from '@/components/ReportsClient'
import { BarChart2 } from 'lucide-react'

export default async function ReportsPage() {
  const data = await getReportsData()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
          <BarChart2 className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 leading-none">Reports</h2>
          <p className="text-sm text-gray-500 mt-0.5">Sales & Profit Analysis</p>
        </div>
      </div>

      <ReportsClient
        daily={data.daily}
        topProducts={data.topProducts}
        week={data.week}
        month={data.month}
      />
    </div>
  )
}
