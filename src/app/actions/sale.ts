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
    // 1. Create the Sale record
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

    // 2. Reduce Inventory for today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Process inventory reduction sequentially
    for (const item of data.items) {
      // Find today's inventory record for this product
      const inventory = await prisma.inventory.findFirst({
        where: {
          productId: item.productId,
          date: {
            gte: today,
          },
        },
      })

      if (inventory) {
        // Reduce stock (quantity could be in grams or pieces)
        // If the product is sold in KG but tracked in KG (e.g., 200g = 0.2kg)
        // For simplicity: We assume quantity passed to 'amount' reflects the display unit
        // We will just directly subtract the raw quantity number passed.
        // E.g., if sold 200g, and inventory is in grams, we subtract 200. We will standardise to KG in the UI.
        const stockToDeduct = item.quantity >= 100 ? (item.quantity / 1000) : item.quantity // if >= 100 it's likely grams, converting to KG for inventory
        
        await prisma.inventory.update({
          where: { id: inventory.id },
          data: {
            currentStock: {
              decrement: stockToDeduct,
            },
          },
        })
      }
    }

    return { success: true, sale }
  } catch (error) {
    console.error('Sale creation failed:', error)
    return { error: 'Failed to record sale' }
  }
}
