import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * GET /api/example-crud/[id]
 * Fetch a single item by ID
 * Example: GET http://localhost:3000/api/example-crud/123
 */
export async function GET(request, { params }) {
    try {
        const supabase = await createClient();
        const { id } = params;

        const { data, error } = await supabase
            .from('todos')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json(
                    { error: 'Item not found' },
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

/**
 * PATCH /api/example-crud/[id]
 * Update an existing item
 * Example body: { "completed": true }
 */
export async function PATCH(request, { params }) {
    try {
        const supabase = await createClient();
        const { id } = params;
        const body = await request.json();

        const { data, error } = await supabase
            .from('todos')
            .update(body)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json(
                    { error: 'Item not found' },
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
            { error: 'Invalid request body' },
            { status: 400 }
        );
    }
}

/**
 * DELETE /api/example-crud/[id]
 * Delete an item by ID
 * Example: DELETE http://localhost:3000/api/example-crud/123
 */
export async function DELETE(request, { params }) {
    try {
        const supabase = await createClient();
        const { id } = params;

        const { error } = await supabase
            .from('todos')
            .delete()
            .eq('id', id);

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: 'Item deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
