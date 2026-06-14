import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { NEIGHBOURHOOD_COORDS } from '@/lib/neighbourhoods';

/**
 * GET /api/sitters
 * Get all sitters with their profiles and user data
 * 
 * Query Parameters:
 * - location (optional): Filter by location (case-insensitive partial match)
 * - minRate (optional): Minimum hourly rate
 * - maxRate (optional): Maximum hourly rate
 * - experience (optional): Minimum years of experience
 * - languages (optional): Comma-separated list of languages
 * - specialNeeds (optional): Comma-separated list of special needs
 * 
 * Examples:
 * - GET /api/sitters - Returns all sitters
 * - GET /api/sitters?location=Halifax&minRate=15 - Returns sitters in Halifax with rate >= $15
 */
export async function GET(request) {
    try {
        const supabase = await createClient();

        // Fetch all sitters with their user data
        const { data: sittersData, error } = await supabase
            .from('sitter_profiles')
            .select(`
                *,
                user:users!user_id(id, name, email, avatar)
            `);

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        // Transform sitters to match frontend format
        const formatted = (sittersData || [])
            .filter(sitter => sitter.user != null)
            .map(sitter => ({
                id: sitter.user.id,
                email: sitter.user.email,
                name: sitter.user.name,
                image: sitter.user.avatar,
                bio: sitter.bio,
                hourly_rate: sitter.hourly_rate ?? 20,
                languages: sitter.languages || [],
                location: sitter.location,
                neighbourhood: sitter.neighbourhood ?? null,
                latitude:  sitter.latitude  ?? (sitter.neighbourhood ? (NEIGHBOURHOOD_COORDS[sitter.neighbourhood]?.lat ?? null) : null),
                longitude: sitter.longitude ?? (sitter.neighbourhood ? (NEIGHBOURHOOD_COORDS[sitter.neighbourhood]?.lng ?? null) : null),
                is_verified: sitter.is_verified ?? false,
                rating: sitter.rating ?? 0,
                reviews: sitter.reviews_count ?? 0,
                background_check_status: sitter.background_check_status,
                experience: sitter.experience ?? 0,
                special_needs: sitter.special_needs_experience || [],
                availability: sitter.availability ?? {},
            }));

        return NextResponse.json({ data: formatted });
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
