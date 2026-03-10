export const dynamic = "force-dynamic"
export const revalidate = 0

import { getProducts, deleteProduct } from '@/app/actions/product'
import { PlusCircle, Trash2 } from 'lucide-react'
import Link from 'next/link'
import AdminProductList from '@/components/AdminProductList'

export default async function AdminProductsPage() {
  const products = await getProducts()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Products</h2>
        <Link
          href="/admin/add"
          className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-xl flex items-center gap-2 shadow-sm transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
          <span className="font-semibold pr-2">Add New</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <AdminProductList products={products} />
      </div>
    </div>
  )
}
