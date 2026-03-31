import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    // Look up the sitter_profile ID from the user ID
    const { data: sitterProfile, error: profileError } = await supabase
      .from("sitter_profiles")
      .select("id")
      .eq("user_id", body.sitterId)
      .single();

    if (profileError || !sitterProfile) {
      return NextResponse.json(
        { error: "Sitter profile not found" },
        { status: 404 },
      );
    }

    const { data, error } = await supabase
      .from("bookings")
      .insert({
        sitter_id: sitterProfile.id, // ← use the sitter_profiles ID
        parent_id: body.parentId,
        date: body.date,
        start_time: body.startTime,
        end_time: body.endTime,
        children: body.children,
        adventure_id: body.adventureId || null,
        notes: body.notes,
        total_amount: body.totalAmount,
        status: "pending_payment",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // ── Record a pending match outcome for post-session rating ────────────────
    // Fetch parent's preferred language so we can compute the language_match feature
    let outcomeId = null;
    try {
      const [{ data: parent }, { data: sitterFull }] = await Promise.all([
        supabase.from("users").select("preferred_languages").eq("id", body.parentId).single(),
        supabase.from("sitter_profiles").select("hourly_rate, rating, experience, languages").eq("id", sitterProfile.id).single(),
      ]);

      const preferredLanguage = parent?.preferred_languages?.[0] || "English";
      const features = {
        language: sitterFull?.languages?.includes(preferredLanguage) ? 1 : 0,
        price:      sitterFull?.hourly_rate  ?? 20,
        rating:     sitterFull?.rating       ?? 3.5,
        experience: sitterFull?.experience   ?? 1,
      };

      const { data: outcome } = await supabase
        .from("match_outcomes")
        .insert({ booking_id: data.id, sitter_id: body.sitterId, parent_id: body.parentId, features, label: null })
        .select("id")
        .single();

      outcomeId = outcome?.id ?? null;
    } catch {
      // Outcome recording is non-critical — booking still succeeds without it
    }

    return NextResponse.json({ bookingId: data.id, outcomeId });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
