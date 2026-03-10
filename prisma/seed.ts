import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// ============================================================
// EDIT THESE to set up your family members' accounts
// ============================================================
const USERS = [
  {
    username: 'admin',       // login username
    password: 'admin123',    // login password  ← CHANGE THIS
    role: 'admin',           // admin = can manage products
  },
  {
    username: 'shop',        // second account for shop staff
    password: 'shop123',     // ← CHANGE THIS
    role: 'user',
  },
]
// ============================================================

async function main() {
  console.log('🌱 Seeding users...\n')

  for (const user of USERS) {
    const hashedPassword = await bcrypt.hash(user.password, 10)

    const created = await prisma.user.upsert({
      where: { username: user.username },
      update: { password: hashedPassword, role: user.role },
      create: {
        username: user.username,
        password: hashedPassword,
        role: user.role,
      },
    })

    console.log(
      `✅  ${created.role === 'admin' ? '👑 Admin' : '👤 User '} | username: "${created.username}" | password: "${user.password}"`
    )
  }

  console.log('\n✨ Done! Share the usernames and passwords with your family.')
  console.log('   They can log in at your Vercel URL.\n')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
