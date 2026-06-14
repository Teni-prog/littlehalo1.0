import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET /api/reviews/sitter/[id]
// [id] = sitter's auth user ID (reviewee_id in the reviews table)
// Returns all parent-written reviews for this sitter, plus aggregate stats.
// Public endpoint — no auth required (parent reviews are publicly readable via RLS).
export async function GET(request, { params }) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("id, session_rating, adventure_rating, review_text, created_at, reviewer_id")
    .eq("reviewee_id", id)
    .eq("reviewer_role", "parent")
    .order("created_at", { ascending: false });

  // Return empty list gracefully if the migration hasn't been applied yet
  if (error) {
    return NextResponse.json({
      reviews: [], overall_rating: null, avg_session_rating: null,
      avg_adventure_rating: null, total_reviews: 0,
    });
  }

  if (!reviews?.length) {
    return NextResponse.json({
      reviews: [],
      overall_rating: null,
      avg_session_rating: null,
      avg_adventure_rating: null,
      total_reviews: 0,
    });
  }

  // Fetch reviewer names to build initials + formatted display name
  const reviewerIds = [...new Set(reviews.map((r) => r.reviewer_id))];
  const { data: reviewerUsers } = await supabase
    .from("users")
    .select("id, name")
    .in("id", reviewerIds);

  const nameMap = Object.fromEntries((reviewerUsers || []).map((u) => [u.id, u.name]));

  // "Nadia Paulson" → "Nadia P."
  function formatName(fullName) {
    if (!fullName) return "Anonymous";
    const parts = fullName.trim().split(/\s+/);
    return parts.length === 1 ? parts[0] : `${parts[0]} ${parts[parts.length - 1][0]}.`;
  }

  // "Nadia Paulson" → "NP"
  function getInitials(fullName) {
    if (!fullName) return "?";
    const parts = fullName.trim().split(/\s+/);
    return parts.length === 1
      ? parts[0][0].toUpperCase()
      : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  // Aggregate stats
  const sessionAvg = reviews.reduce((s, r) => s + r.session_rating, 0) / reviews.length;
  const advRatings = reviews.filter((r) => r.adventure_rating != null).map((r) => r.adventure_rating);
  const advAvg     = advRatings.length ? advRatings.reduce((s, v) => s + v, 0) / advRatings.length : null;
  const overall    = advAvg != null ? (sessionAvg + advAvg) / 2 : sessionAvg;

  return NextResponse.json({
    reviews: reviews.map((r) => {
      const fullName = nameMap[r.reviewer_id] || "";
      return {
        id:                 r.id,
        reviewer_name:      formatName(fullName),
        reviewer_initials:  getInitials(fullName),
        session_rating:     r.session_rating,
        adventure_rating:   r.adventure_rating,
        review_text:        r.review_text,
        created_at:         r.created_at,
      };
    }),
    overall_rating:      Math.round(overall * 10) / 10,
    avg_session_rating:  Math.round(sessionAvg * 10) / 10,
    avg_adventure_rating: advAvg != null ? Math.round(advAvg * 10) / 10 : null,
    total_reviews:       reviews.length,
  });
}
