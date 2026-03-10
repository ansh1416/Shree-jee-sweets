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
