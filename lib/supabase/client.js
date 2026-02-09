import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL, // Where the database lives
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // The key to access the database
    )
}
