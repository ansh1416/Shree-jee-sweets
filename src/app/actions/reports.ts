'use server'

import prisma from '@/lib/db'

export async function getReportsData() {
  // Last 7 days for the bar chart
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
  sevenDaysAgo.setHours(0, 0, 0, 0)

  const sales = await prisma.sale.findMany({
    where: { createdAt: { gte: sevenDaysAgo } },
    orderBy: { createdAt: 'asc' },
  })

  // Build daily buckets for last 7 days
  const dailyMap: Record<string, { revenue: number; profit: number }> = {}
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
    dailyMap[key] = { revenue: 0, profit: 0 }
  }

  for (const sale of sales) {
    const key = new Date(sale.createdAt).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
    })
    if (dailyMap[key]) {
      dailyMap[key].revenue += sale.totalAmount
      dailyMap[key].profit += sale.totalProfit
    }
  }

  const daily = Object.entries(dailyMap).map(([date, v]) => ({ date, ...v }))

  // Top products this week by quantity
  const topItems = await prisma.saleItem.groupBy({
    by: ['productId'],
    where: { sale: { createdAt: { gte: sevenDaysAgo } } },
    _sum: { quantity: true, amount: true },
    orderBy: { _sum: { amount: 'desc' } },
    take: 5,
  })

  const topProducts = await Promise.all(
    topItems.map(async (item) => {
      const product = await prisma.product.findUnique({ where: { id: item.productId } })
      return {
        name: product?.name ?? 'Unknown',
        revenue: item._sum.amount ?? 0,
        quantity: item._sum.quantity ?? 0,
      }
    })
  )

  // Weekly totals
  const weekTotal = await prisma.sale.aggregate({
    where: { createdAt: { gte: sevenDaysAgo } },
    _sum: { totalAmount: true, totalProfit: true },
    _count: true,
  })

  // Monthly totals
  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)

  const monthTotal = await prisma.sale.aggregate({
    where: { createdAt: { gte: monthStart } },
    _sum: { totalAmount: true, totalProfit: true },
    _count: true,
  })

  return {
    daily,
    topProducts,
    week: {
      revenue: weekTotal._sum.totalAmount ?? 0,
      profit: weekTotal._sum.totalProfit ?? 0,
      count: weekTotal._count,
    },
    month: {
      revenue: monthTotal._sum.totalAmount ?? 0,
      profit: monthTotal._sum.totalProfit ?? 0,
      count: monthTotal._count,
    },
  }
}
