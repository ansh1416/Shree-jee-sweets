'use server'

import prisma from '@/lib/db'

export async function createSale(data: {
  items: {
    productId: string
    quantity: number
    amount: number
    profit: number
  }[]
  totalAmount: number
  totalProfit: number
}) {
  try {
    const sale = await prisma.sale.create({
      data: {
        totalAmount: data.totalAmount,
        totalProfit: data.totalProfit,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            amount: item.amount,
            profit: item.profit,
          })),
        },
      },
      include: {
        items: true,
      },
    })

    return { success: true, sale }
  } catch (error) {
    console.error('Sale creation failed:', error)
    return { error: 'Failed to record sale' }
  }
}
