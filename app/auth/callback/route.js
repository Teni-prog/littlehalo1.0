import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { routing } from '@/i18n/routing'

function resolveLocale(request) {
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
  return routing.locales.includes(cookieLocale) ? cookieLocale : routing.defaultLocale
}

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const locale = resolveLocale(request)

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Check user type and redirect to correct dashboard
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('user_type')
          .eq('id', user.id)
          .single()

        if (profile?.user_type === 'sitter') {
          return NextResponse.redirect(`${origin}/${locale}/profile/Sitter`)
        }
        return NextResponse.redirect(`${origin}/${locale}/profile/Parents`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/${locale}/login?error=auth_callback_failed`)
}
