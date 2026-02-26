import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req: any) => {
  // Protected routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!req.auth) {
      const url = req.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
    
    // Check if user has ADMIN role
    if (req.auth.user?.role !== 'ADMIN') {
      const url = req.nextUrl.clone()
      url.pathname = '/unauthorized'
      return NextResponse.redirect(url)
    }
  }
  
  if (req.nextUrl.pathname.startsWith('/organizer')) {
    if (!req.auth) {
      const url = req.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
    
    // Check if user has ORGANIZER or ADMIN role
    if (!['ORGANIZER', 'ADMIN'].includes(req.auth.user?.role)) {
      const url = req.nextUrl.clone()
      url.pathname = '/unauthorized'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*', '/organizer/:path*', '/api/:path*']
}