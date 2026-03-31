import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/matching/outcome
// Called automatically from /api/booking when a booking is confirmed.
// Creates a pending outcome row (label = null) so we can attach a rating later.
//
// Required Supabase table:
//   create table match_outcomes (
//     id           uuid primary key default gen_random_uuid(),
//     booking_id   uuid references bookings(id),
//     parent_id    uuid references users(id),
//     sitter_id    uuid references users(id),
//     features     jsonb not null,   -- {language, price, rating, experience}
//     label        smallint,         -- null until rated; 1 = good match, 0 = bad match
//     rated_at     timestamptz,
//     created_at   timestamptz default now()
//   );
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req) {
  try {
    const { bookingId, sitterId, parentId, features } = await req.json();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("match_outcomes")
      .insert({ booking_id: bookingId, sitter_id: sitterId, parent_id: parentId, features, label: null })
      .select("id")
      .single();

    if (error) {
      console.error("Outcome insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ outcomeId: data.id });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/matching/outcome
// Called from the success page when the parent submits their post-session rating.
// Sets label (1 = good match, 0 = not a good fit) and triggers retraining
// every 5 new ratings.
// ─────────────────────────────────────────────────────────────────────────────
export async function PATCH(req) {
  try {
    const { outcomeId, label } = await req.json(); // label: 1 | 0

    if (outcomeId === null || outcomeId === undefined || ![0, 1].includes(label)) {
      return NextResponse.json({ error: "outcomeId and label (0 or 1) are required" }, { status: 400 });
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from("match_outcomes")
      .update({ label, rated_at: new Date().toISOString() })
      .eq("id", outcomeId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Count rated outcomes — trigger background retraining every 5 new ratings
    const { count } = await supabase
      .from("match_outcomes")
      .select("id", { count: "exact", head: true })
      .not("rated_at", "is", null);

    if (count && count % 5 === 0) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      fetch(`${appUrl}/api/matching/train`, { method: "POST" }).catch(() => {});
    }

    return NextResponse.json({ ok: true, ratedOutcomes: count });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
