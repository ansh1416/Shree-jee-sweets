import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from './lib/auth'

export async function middleware(request: NextRequest) {
  const session = await getSession()

  // Exclude auth routes and static assets from protection
  const path = request.nextUrl.pathname
  const isPublicRoute = path === '/login' || path.startsWith('/api/auth')
  const isStatic = path.startsWith('/_next') || path.includes('.')

  if (isStatic) {
    return NextResponse.next()
  }

  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (session && isPublicRoute && path === '/login') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api/cron|_next/static|_next/image|favicon.ico).*)'],
}
