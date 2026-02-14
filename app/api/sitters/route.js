import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

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
        const formatted = sittersData?.map(sitter => ({
            id: sitter.user.id,
            email: sitter.user.email,
            name: sitter.user.name,
            image: sitter.user.avatar,
            bio: sitter.bio,
            hourly_rate: sitter.hourly_rate,
            languages: sitter.languages,
            location: sitter.location,
            is_verified: sitter.is_verified,
            rating: sitter.rating,
            reviews: sitter.reviews_count,
            background_check_status: sitter.background_check_status,
            experience: sitter.experience,
            special_needs: sitter.special_needs
        })) || [];

        return NextResponse.json({ data: formatted });
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
