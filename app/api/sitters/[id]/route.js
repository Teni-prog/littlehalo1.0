import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * GET /api/sitters/[id]
 * Get a single sitter by ID with their profile and user data
 *
 * @param {Object} context - Next.js route context
 * @param {Object} context.params - Route parameters
 * @param {string} context.params.id - The sitter's user ID
 *
 * Example: GET /api/sitters/123
 */
export async function GET(request, { params }) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Fetch sitter with their user data
    const { data: sitterData, error } = await supabase
      .from("sitter_profiles")
      .select(
        `
                *,
                user:users!user_id(id, name, email, avatar)
            `,
      )
      .eq("user_id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!sitterData) {
      return NextResponse.json({ error: "Sitter not found" }, { status: 404 });
    }

    // Transform sitter to match frontend format (DRY - same format as /api/sitters)
    const formatted = {
      id: sitterData.user.id,
      email: sitterData.user.email,
      name: sitterData.user.name,
      image: sitterData.user.avatar,
      bio: sitterData.bio,
      hourly_rate: sitterData.hourly_rate,
      languages: sitterData.languages,
      location: sitterData.location,
      is_verified: sitterData.is_verified,
      rating: sitterData.rating,
      reviews: sitterData.reviews_count,
      background_check_status: sitterData.background_check_status,
      experience: sitterData.experience,
      special_needs: sitterData.special_needs,
      certifications: sitterData.certifications,
      availability: sitterData.availability,
    };

    return NextResponse.json({ data: formatted });
  } catch (error) {
    console.error("Error fetching sitter:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
