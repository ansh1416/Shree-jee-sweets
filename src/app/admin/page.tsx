export const dynamic = "force-dynamic"
export const revalidate = 0

import { getProducts, deleteProduct } from '@/app/actions/product'
import { PlusCircle, Trash2 } from 'lucide-react'
import Link from 'next/link'

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
        <div className="divide-y divide-gray-100">
          {products.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No products available. Click "Add New" to create one.
            </div>
          ) : (
            products.map((product: any) => (
              <div key={product.id} className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                <div>
                  <h3 className="font-bold text-gray-800">{product.name}</h3>
                  <div className="text-sm text-gray-500 flex gap-3 mt-1">
                    <span className="capitalize px-2 py-0.5 bg-gray-100 rounded-md text-xs font-semibold">{product.category}</span>
                    <span>Cost: ₹{product.costPrice}</span>
                  </div>
                  <div className="text-sm font-medium text-orange-600 mt-1">
                    {product.pricePerKg && `₹${product.pricePerKg}/kg `}
                    {product.pricePerPiece && `₹${product.pricePerPiece}/pc `}
                    {product.pricePerBowl && `₹${product.pricePerBowl}/bowl `}
                  </div>
                </div>

                <form action={async () => {
                  'use server'
                  await deleteProduct(product.id)
                }}>
                  <button
                    type="submit"
                    className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    title="Delete Product"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </form>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
