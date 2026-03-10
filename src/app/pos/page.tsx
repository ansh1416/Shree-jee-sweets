import POSClient from '@/components/POSClient'
import { getProducts } from '@/app/actions/product'

export default async function POSPage() {
  const products = await getProducts()

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Point of Sale</h2>
        <span className="bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Quick Tap
        </span>
      </div>

      {products.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500 mb-4">No products found. Please add sweets first.</p>
        </div>
      ) : (
        <POSClient products={products} />
      )}
    </div>
  )
}
