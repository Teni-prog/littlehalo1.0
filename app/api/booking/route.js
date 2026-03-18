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

    return NextResponse.json({ bookingId: data.id });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
