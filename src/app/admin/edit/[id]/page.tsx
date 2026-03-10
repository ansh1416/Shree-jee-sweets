import { getProducts } from '@/app/actions/product'
import { notFound } from 'next/navigation'
import EditProductForm from '@/app/admin/edit/[id]/EditProductForm'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const products = await getProducts()
  const product = products.find(p => p.id === id)

  if (!product) {
    notFound()
  }

  return <EditProductForm product={product!} />
}
