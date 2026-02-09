import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * GET /api/example-crud
 * Fetch all items from your database table
 * Example: GET http://localhost:3000/api/example-crud
 */
export async function GET(request) {
    try {
        const supabase = await createClient();

        // Example: Fetch from a 'todos' table
        // Replace 'todos' with your actual table name
        const { data, error } = await supabase
            .from('todos')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
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

/**
 * POST /api/example-crud
 * Create a new item in your database table
 * Example body: { "title": "My todo", "completed": false }
 */
export async function POST(request) {
    try {
        const supabase = await createClient();
        const body = await request.json();

        // Validate required fields
        if (!body.title) {
            return NextResponse.json(
                { error: 'Title is required' },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('todos')
            .insert([{
                title: body.title,
                completed: body.completed || false,
                // Add other fields as needed
            }])
            .select()
            .single();

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ data }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: 'Invalid request body' },
            { status: 400 }
        );
    }
}
