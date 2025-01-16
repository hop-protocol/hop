import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Add a new header x-current-path which passes the path to downstream components
  const headers = new Headers(request.headers)

  headers.set('x-current-path', request.nextUrl.pathname)
  const response = NextResponse.next({ headers })

  // const theme = request.nextUrl.searchParams.get('theme')
  // if (theme) {
  //   response.cookies.set('theme', theme)
  // }

  // Check if the theme parameter is present and set it if not
  // if (!theme) {
  //   const url = request.nextUrl.clone()
  //   const cachedTheme = request.cookies.get('theme')?.value
  //   if (cachedTheme) {
  //     url.searchParams.set('theme', cachedTheme)
  //     return NextResponse.redirect(url)
  //   }
  // }

  return response
}

export const config = {
  matcher: [
    // match all routes except static files and APIs
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
