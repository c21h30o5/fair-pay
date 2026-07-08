// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // ดึงข้อมูล session
  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // 1. กำหนดว่าหน้าไหนเป็นหน้าสาธารณะ (เช่น หน้าแรก `/` และหน้า `/login`)
  const isPublicRoute = pathname === '/' || pathname.startsWith('/login')

  // 2. ถ้าผู้ใช้ไม่ได้ล็อกอิน และไม่ใช่หน้าสาธารณะ ให้ส่งกลับไปหน้าล็อกอิน
  if (!user && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 3. ถ้าล็อกอินอยู่แล้ว และจะพยายามเข้าหน้าล็อกอินซ้ำ ให้เด้งกลับไปหน้าแรกแทน
  if (user && pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}