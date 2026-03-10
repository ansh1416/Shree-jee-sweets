'use server'

import prisma from '@/lib/db'

export async function getDashboardStats() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // 1. Today's Sales Total
  const todaySales = await prisma.sale.aggregate({
    where: {
      createdAt: {
        gte: today,
      },
    },
    _sum: {
      totalAmount: true,
    },
  })

  // 2. Total Items Sold Today
  const todayItems = await prisma.saleItem.aggregate({
    where: {
      sale: {
        createdAt: {
          gte: today,
        },
      },
    },
    _sum: {
      quantity: true,
    },
  })

  // 3. Most Selling Sweet (All time / Today)
  const mostSellingItems = await prisma.saleItem.groupBy({
    by: ['productId'],
    where: {
      sale: {
        createdAt: {
          gte: today,
        },
      },
    },
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: 'desc',
      },
    },
    take: 1,
  })

  let topProduct = null
  if (mostSellingItems.length > 0) {
    topProduct = await prisma.product.findUnique({
      where: { id: mostSellingItems[0].productId },
    })
  }

  // 4. Live Recent Sales
  const recentSales = await prisma.sale.findMany({
    where: {
      createdAt: {
        gte: today,
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
    take: 10,
  })

  return {
    totalSales: todaySales._sum.totalAmount || 0,
    totalItems: todayItems._sum.quantity || 0,
    topProduct: topProduct?.name || 'No Sales Yet',
    recentSales,
  }
}
