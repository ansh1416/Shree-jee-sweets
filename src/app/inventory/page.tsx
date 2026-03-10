export const dynamic = "force-dynamic"
export const revalidate = 0
import { getInventoryWithProducts } from '@/app/actions/inventory'
import InventoryClient from '@/components/InventoryClient'
import { Package } from 'lucide-react'

export default async function InventoryPage() {
  const items = await getInventoryWithProducts()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <Package className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 leading-none">Inventory</h2>
          <p className="text-sm text-gray-500 mt-0.5">Set morning stock levels</p>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl border border-blue-100 p-3 text-sm text-blue-700 font-medium">
        💡 Enter morning stock in <strong>KG</strong>. Stock reduces automatically as sales are recorded.
      </div>

      <InventoryClient items={items} />
    </div>
  )
}
