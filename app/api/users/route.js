import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * GET /api/users
 * Get all users or filter by email
 * 
 * Query Parameters:
 * - email (optional): Filter users by email address
 * 
 * Examples:
 * - GET /api/users - Returns all users
 * - GET /api/users?email=sarah.johnson@example.com - Returns user with that email
 */
export async function GET(request) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        // If email is provided, filter by email
        if (email) {
            const { data: user, error } = await supabase
                .from('users')
                .select(`
          *,
          sitter_profile:sitter_profiles(*)
        `)
                .eq('email', email)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return NextResponse.json(
                        { error: 'User not found' },
                        { status: 404 }
                    );
                }
                return NextResponse.json(
                    { error: error.message },
                    { status: 500 }
                );
            }

            return NextResponse.json({ data: user });
        }

        // Otherwise, return all users
        const { data: users, error } = await supabase
            .from('users')
            .select(`
        *,
        sitter_profile:sitter_profiles(*)
      `)
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ data: users });
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
