'use server'

import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function addProduct(
  prevState: { error?: string; success?: boolean },
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const name = formData.get('name') as string
  const category = formData.get('category') as string
  const costPrice = parseFloat(formData.get('costPrice') as string)
  
  const pricePerKgStr = formData.get('pricePerKg') as string
  const pricePerPieceStr = formData.get('pricePerPiece') as string
  const pricePerBowlStr = formData.get('pricePerBowl') as string

  if (!name || isNaN(costPrice) || (!pricePerKgStr && !pricePerPieceStr && !pricePerBowlStr)) {
    return { error: 'Please provide name, cost price, and at least one selling price.', success: false }
  }

  try {
    await prisma.product.create({
      data: {
        name,
        category,
        costPrice,
        pricePerKg: pricePerKgStr ? parseFloat(pricePerKgStr) : null,
        pricePerPiece: pricePerPieceStr ? parseFloat(pricePerPieceStr) : null,
        pricePerBowl: pricePerBowlStr ? parseFloat(pricePerBowlStr) : null,
      },
    })
    
    revalidatePath('/admin')
    return { success: true }
  } catch (e) {
    return { error: 'Failed to create product', success: false }
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id }
    })
    revalidatePath('/admin')
    return { success: true }
  } catch (e) {
    return { error: 'Failed to delete product' }
  }
}

export async function getProducts() {
  return await prisma.product.findMany({
    orderBy: { name: 'asc' }
  })
}
