import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

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
          return NextResponse.redirect(`${origin}/profile/Sitter`)
        }
        return NextResponse.redirect(`${origin}/profile/Parents`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
