import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Hash password once
  const password = await bcrypt.hash('password123', 10)
  
  const users = [
    { email: 'viewer@demo.com', role: 'VIEWER', name: 'Viewer User' },
    { email: 'editor@demo.com', role: 'EDITOR', name: 'Editor User' },
    { email: 'admin@demo.com', role: 'ADMIN', name: 'Admin User' },
    { email: 'super@demo.com', role: 'SUPER_ADMIN', name: 'Super Admin' },
  ]

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: { ...user, password },
    })
  }
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })