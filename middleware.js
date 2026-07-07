import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

const protectedRoutes = ['/profile', '/booking', '/search', '/onboarding']
const authRoutes = ['/signin', '/login', '/signup']

function stripLocale(pathname) {
  const segments = pathname.split('/')
  const maybeLocale = segments[1]
  if (routing.locales.includes(maybeLocale)) {
    const rest = '/' + segments.slice(2).join('/')
    return { locale: maybeLocale, pathname: rest === '/' ? '/' : rest.replace(/\/+$/, '') || '/' }
  }
  return { locale: routing.defaultLocale, pathname }
}

export async function middleware(request) {
  // Run Supabase's session-refresh step first, but don't build a response
  // from it yet — the cookies it wants to set get merged onto whatever
  // response next-intl produces below, so neither side clobbers the other.
  let supabaseCookies = []

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseCookies = cookiesToSet
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Let next-intl resolve/redirect the locale. This becomes the base
  // response object for the rest of the function.
  const intlResponse = intlMiddleware(request)

  function withSupabaseCookies(response) {
    supabaseCookies.forEach(({ name, value, options }) =>
      response.cookies.set(name, value, options)
    )
    return response
  }

  // If next-intl needed to redirect (bare/invalid locale prefix), return
  // that immediately — the browser's follow-up request re-enters
  // middleware normally and gets evaluated against the auth rules below.
  if (intlResponse.headers.get('location')) {
    return withSupabaseCookies(intlResponse)
  }

  const { locale, pathname } = stripLocale(request.nextUrl.pathname)
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // Redirect unauthenticated users away from protected routes
  if (isProtected && !user) {
    return withSupabaseCookies(NextResponse.redirect(new URL(`/${locale}/login`, request.url)))
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && user) {
    const userType = user.user_metadata?.user_type
    const destination = userType === 'sitter' ? '/profile/Sitter' : '/profile/Parents'
    return withSupabaseCookies(NextResponse.redirect(new URL(`/${locale}${destination}`, request.url)))
  }

  return withSupabaseCookies(intlResponse)
}

export const config = {
  matcher: [
    '/((?!api|auth|LearningDemo|Testmatching|demo-matching|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
