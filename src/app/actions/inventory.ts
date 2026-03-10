'use server'

import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'

function todayStart() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

export async function getInventoryWithProducts() {
  const products = await prisma.product.findMany({
    orderBy: { name: 'asc' },
    include: {
      inventoryStocks: {
        where: { date: { gte: todayStart() } },
        take: 1,
        orderBy: { date: 'desc' },
      },
    },
  })

  return products.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    stock: p.inventoryStocks[0] ?? null,
  }))
}

export async function setMorningStock(productId: string, morningStock: number) {
  const today = todayStart()

  const existing = await prisma.inventory.findFirst({
    where: { productId, date: { gte: today } },
  })

  if (existing) {
    await prisma.inventory.update({
      where: { id: existing.id },
      data: { morningStock, currentStock: morningStock },
    })
  } else {
    await prisma.inventory.create({
      data: { productId, morningStock, currentStock: morningStock, date: today },
    })
  }

  revalidatePath('/inventory')
  revalidatePath('/')
}
