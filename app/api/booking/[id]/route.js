import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    if (!["confirmed", "declined"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const supabase = await createClient();

    // Verify the booking exists and is still pending before updating
    const { data: existing, error: fetchError } = await supabase
      .from("bookings")
      .select("id, status")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (existing.status !== "pending_sitter") {
      return NextResponse.json(
        { error: "Booking is no longer awaiting sitter confirmation" },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ booking: data });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
