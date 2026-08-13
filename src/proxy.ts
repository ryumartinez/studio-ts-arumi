import { type NextRequest, NextResponse } from 'next/server'

import { isRouteEnabled } from '@/lib/featureFlags'

export function proxy(request: NextRequest) {
  if (isRouteEnabled(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  return NextResponse.redirect(new URL('/', request.url))
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\..*).*)'],
}
