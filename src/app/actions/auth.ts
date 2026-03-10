'use server'

import { createSession, destroySession } from '@/lib/auth'
import prisma from '@/lib/db'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'

export async function login(
  prevState: { error?: string; success?: boolean },
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (!username || !password) {
    return { error: 'Username and password are required' }
  }

  const user = await prisma.user.findUnique({
    where: { username },
  })

  if (!user) {
    return { error: 'Invalid username or password' }
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    return { error: 'Invalid username or password' }
  }

  await createSession(user.id, user.role)

  return { success: true }
}

export async function logout() {
  await destroySession()
  redirect('/login')
}
