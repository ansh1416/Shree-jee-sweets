'use server'

import prisma from '@/lib/db'

export async function getSalesHistory(days: number = 7) {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)
  cutoffDate.setHours(0, 0, 0, 0)

  return await prisma.sale.findMany({
    where: {
      createdAt: {
        gte: cutoffDate,
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export async function deleteSale(id: string) {
  try {
    await prisma.saleItem.deleteMany({
      where: { saleId: id },
    })
    
    await prisma.sale.delete({
      where: { id },
    })
    
    return { success: true }
  } catch (error) {
    console.error('Failed to delete sale:', error)
    return { error: 'Failed to delete sale' }
  }
}
