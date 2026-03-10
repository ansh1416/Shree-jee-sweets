import { getProducts } from '@/app/actions/product'
import { notFound } from 'next/navigation'
import EditProductForm from './EditProductForm'

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const products = await getProducts()
  const product = products.find(p => p.id === params.id)

  if (!product) {
    notFound()
  }

  return <EditProductForm product={product} />
}
