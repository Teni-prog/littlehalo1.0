import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * GET /api/parents
 * Get all parents or filter by preferences
 * 
 * Query Parameters:
 * - has_preferences (optional): If 'true', only return parents with preferred_languages set
 * - id (optional): Get a specific parent by ID
 * 
 * Examples:
 * - GET /api/parents - Returns all parents
 * - GET /api/parents?has_preferences=true - Returns only parents with preferences
 * - GET /api/parents?id=123 - Returns specific parent
 */
export async function GET(request) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        const hasPreferences = searchParams.get('has_preferences');
        const id = searchParams.get('id');

        let query = supabase
            .from('users')
            .select('*')
            .eq('user_type', 'parent');

        // Filter by ID if provided
        if (id) {
            query = query.eq('id', id).single();
        }

        // Filter by preferences if requested
        if (hasPreferences === 'true') {
            query = query.not('preferred_languages', 'is', null);
        }

        const { data, error } = await query;

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json(
                    { error: 'Parent not found' },
                    { status: 404 }
                );
            }
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ data });
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
