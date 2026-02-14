import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import matchSitters from '@/lib/matching-algorithm';

/**
 * GET /api/matching
 * Get matched sitters for a parent based on preferences
 * 
 * Query Parameters:
 * - parent_id (optional): Parent ID to fetch preferences from database
 * - max_budget (optional): Maximum hourly rate budget
 * - preferred_location (optional): Preferred location/city
 * - preferred_language (optional): Preferred language
 * - limit (optional): Number of top matches to return (default: 3)
 * 
 * Examples:
 * - GET /api/matching?parent_id=123 - Returns top 3 matches for parent 123
 * - GET /api/matching?max_budget=25&preferred_location=Halifax&limit=5
 */
export async function GET(request) {
    try {
        const supabase = await createClient();
        const { searchParams } = new URL(request.url);
        const parentId = searchParams.get('parent_id');
        const maxBudget = searchParams.get('max_budget');
        const preferredLocation = searchParams.get('preferred_location');
        const preferredLanguage = searchParams.get('preferred_language');
        const limit = parseInt(searchParams.get('limit') || '3');

        let hardRules = {};
        let softPreferences = {};

        // If parent_id is provided, fetch parent preferences from database
        if (parentId) {
            const { data: parent, error: parentError } = await supabase
                .from('users')
                .select('*')
                .eq('id', parentId)
                .eq('user_type', 'parent')
                .single();

            if (parentError) {
                return NextResponse.json(
                    { error: 'Parent not found' },
                    { status: 404 }
                );
            }

            hardRules = {
                maxBudget: parent.max_budget || 30,
            };

            softPreferences = {
                city: parent.preferred_location?.split(',')[0] || 'Halifax',
                preferredLanguage: parent.preferred_languages?.[1] || parent.preferred_languages?.[0] || 'English',
            };
        } else {
            // Use query parameters for preferences
            hardRules = {
                maxBudget: maxBudget ? parseFloat(maxBudget) : 30,
            };

            softPreferences = {
                city: preferredLocation || 'Halifax',
                preferredLanguage: preferredLanguage || 'English',
            };
        }

        // Fetch all sitters with their profiles
        const { data: sitters, error: sitterError } = await supabase
            .from('sitter_profiles')
            .select(`
                id,
                bio,
                hourly_rate,
                languages,
                location,
                is_verified,
                rating,
                reviews_count,
                background_check_status,
                experience,
                users!user_id (
                    id,
                    name,
                    email,
                    avatar
                )
            `);

        if (sitterError) {
            return NextResponse.json(
                { error: sitterError.message },
                { status: 500 }
            );
        }

        // Transform sitters to match algorithm format
        const formattedSitters = sitters?.map(sitter => ({
            id: sitter.id,
            bio: sitter.bio,
            hourly_rate: sitter.hourly_rate,
            languages: sitter.languages,
            location: sitter.location,
            is_verified: sitter.is_verified,
            rating: sitter.rating,
            reviews_count: sitter.reviews_count,
            background_check_status: sitter.background_check_status,
            experience: sitter.experience,
            user: {
                id: sitter.users.id,
                name: sitter.users.name,
                email: sitter.users.email,
                avatar: sitter.users.avatar
            }
        })) || [];

        // Run matching algorithm
        const matches = matchSitters(formattedSitters, hardRules, softPreferences);

        // Return top N matches
        const topMatches = matches.slice(0, limit);

        return NextResponse.json({
            data: topMatches,
            preferences: { hardRules, softPreferences }
        });
    } catch (error) {
        console.error('Matching error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
