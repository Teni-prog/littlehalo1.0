import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET /api/reviews?parentId=<user_id>
// Returns sitter-written feedback about a specific parent/family.
// Only readable by the parent themselves (enforced by RLS + auth check).
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const parentId = searchParams.get("parentId");
  if (!parentId) return NextResponse.json({ error: "parentId is required" }, { status: 400 });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.id !== parentId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("id, session_rating, review_text, created_at, reviewer_id")
    .eq("reviewee_id", parentId)
    .eq("reviewer_role", "sitter")
    .order("created_at", { ascending: false });

  // Return empty list gracefully if the migration hasn't been applied yet
  if (error) return NextResponse.json({ reviews: [] });

  const sitterIds = [...new Set((reviews || []).map((r) => r.reviewer_id))];
  let nameMap = {};
  if (sitterIds.length) {
    const { data: users } = await supabase
      .from("users")
      .select("id, name")
      .in("id", sitterIds);
    nameMap = Object.fromEntries((users || []).map((u) => [u.id, u.name]));
  }

  return NextResponse.json({
    reviews: (reviews || []).map((r) => ({
      id: r.id,
      rating: r.session_rating,
      comment: r.review_text,
      created_at: r.created_at,
      sitter: { name: nameMap[r.reviewer_id] || "Sitter" },
    })),
  });
}

// POST /api/reviews
// Body: { booking_id, reviewer_role, session_rating, adventure_rating?, review_text?, would_rebook? }
export async function POST(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const {
      booking_id,
      reviewer_role,
      session_rating,
      adventure_rating,
      review_text,
      would_rebook,
    } = await request.json();

    // Validate required fields
    if (!booking_id || !reviewer_role || !session_rating) {
      return NextResponse.json(
        { error: "booking_id, reviewer_role, and session_rating are required" },
        { status: 400 }
      );
    }
    if (!["parent", "sitter"].includes(reviewer_role)) {
      return NextResponse.json({ error: "reviewer_role must be 'parent' or 'sitter'" }, { status: 400 });
    }
    if (session_rating < 1 || session_rating > 5) {
      return NextResponse.json({ error: "session_rating must be between 1 and 5" }, { status: 400 });
    }
    if (adventure_rating != null && (adventure_rating < 1 || adventure_rating > 5)) {
      return NextResponse.json({ error: "adventure_rating must be between 1 and 5" }, { status: 400 });
    }

    // Fetch booking — use role-specific ownership filter so RLS doesn't block the read.
    // For parents: filter by parent_id = auth.uid() directly.
    // For sitters: join through sitter_profiles to match by auth user_id.
    let booking = null;
    let reviewer_id, reviewee_id;

    if (reviewer_role === "parent") {
      // First fetch by ID only to see what parent_id the booking actually has
      const { data: anyBooking, error: bookingFetchError } = await supabase
        .from("bookings")
        .select("id, status, parent_id, sitter_id, created_at")
        .eq("id", booking_id)
        .maybeSingle();

      if (!anyBooking) {
        return NextResponse.json({ error: "Booking not found." }, { status: 404 });
      }
      if (anyBooking.parent_id !== user.id) {
        return NextResponse.json({ error: `Not your booking. booking.parent_id=${anyBooking.parent_id} | auth.user.id=${user.id}` }, { status: 403 });
      }
      booking = anyBooking;

      // Resolve sitter's auth user ID
      const { data: sitterProfile } = await supabase
        .from("sitter_profiles")
        .select("user_id")
        .eq("id", booking.sitter_id)
        .single();

      reviewer_id = user.id;
      reviewee_id = sitterProfile?.user_id ?? null;
    } else {
      // Sitter path: find this sitter's profile first, then look up the booking by sitter_id
      const { data: myProfile } = await supabase
        .from("sitter_profiles")
        .select("id, user_id")
        .eq("user_id", user.id)
        .single();

      if (!myProfile) return NextResponse.json({ error: "Sitter profile not found." }, { status: 404 });

      const { data } = await supabase
        .from("bookings")
        .select("id, status, parent_id, sitter_id, created_at")
        .eq("id", booking_id)
        .eq("sitter_id", myProfile.id)
        .single();
      booking = data;

      if (!booking) return NextResponse.json({ error: "Booking not found or you are not the sitter for this booking." }, { status: 404 });

      reviewer_id = user.id;
      reviewee_id = booking.parent_id;
    }

    if (!reviewee_id) return NextResponse.json({ error: "Could not resolve reviewee" }, { status: 500 });

    if (booking.status !== "completed") {
      return NextResponse.json(
        { error: "Session must be completed before a review can be submitted." },
        { status: 409 }
      );
    }

    // 7-day submission window
    const completedAt = new Date(booking.created_at);
    const deadline    = new Date(completedAt.getTime() + 7 * 24 * 60 * 60 * 1000);
    if (new Date() > deadline) {
      return NextResponse.json(
        { error: "The 7-day review window for this session has closed." },
        { status: 403 }
      );
    }

    // Insert review
    const { data: review, error: insertError } = await supabase
      .from("reviews")
      .insert({
        booking_id,
        reviewer_id,
        reviewee_id,
        reviewer_role,
        session_rating,
        adventure_rating: reviewer_role === "parent" ? (adventure_rating ?? null) : null,
        review_text:      review_text || null,
        would_rebook:     would_rebook ?? null,
        submission_deadline: deadline.toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      if (insertError.code === "23505") {
        return NextResponse.json(
          { error: "You have already submitted a review for this session." },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Recalculate sitter's public rating after a parent review
    if (reviewer_role === "parent" && reviewee_id) {
      const { data: allReviews } = await supabase
        .from("reviews")
        .select("session_rating, adventure_rating")
        .eq("reviewee_id", reviewee_id)
        .eq("reviewer_role", "parent");

      if (allReviews?.length) {
        const sessionAvg = allReviews.reduce((s, r) => s + r.session_rating, 0) / allReviews.length;
        const advRatings = allReviews.filter((r) => r.adventure_rating != null).map((r) => r.adventure_rating);
        const advAvg     = advRatings.length ? advRatings.reduce((s, v) => s + v, 0) / advRatings.length : null;
        const overall    = advAvg != null ? (sessionAvg + advAvg) / 2 : sessionAvg;

        await supabase
          .from("sitter_profiles")
          .update({
            rating:        Math.round(overall * 10) / 10,
            reviews_count: allReviews.length,
          })
          .eq("user_id", reviewee_id);
      }
    }

    return NextResponse.json({ review }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
