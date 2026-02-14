import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * GET /api/users/[id]
 * Fetch a single user by ID
 * 
 * Example: GET /api/users/a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d
 */
export async function GET(request, { params }) {
    try {
        const supabase = await createClient();
        const { id } = params;

        const { data: user, error } = await supabase
            .from('users')
            .select(`
        *,
        sitter_profile:sitter_profiles(*),
        children:children(*)
      `)
            .eq('id', id)
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
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
