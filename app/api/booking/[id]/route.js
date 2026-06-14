import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = await createClient();

    // ── Path 1: mark_complete (either party signals the session is done) ──────
    if (body.action === "mark_complete") {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { data: booking, error: fetchError } = await supabase
        .from("bookings")
        .select(
          "id, status, parent_id, sitter_id, parent_marked_complete, sitter_marked_complete",
        )
        .eq("id", id)
        .single();

      if (fetchError || !booking) {
        return NextResponse.json(
          { error: "Booking not found" },
          { status: 404 },
        );
      }

      if (booking.status !== "confirmed") {
        return NextResponse.json(
          { error: "Only confirmed bookings can be marked complete." },
          { status: 409 },
        );
      }

      // Determine the caller's role from the booking data
      const isParent = user.id === booking.parent_id;
      let isSitter = false;

      if (!isParent) {
        const { data: profile } = await supabase
          .from("sitter_profiles")
          .select("user_id")
          .eq("id", booking.sitter_id)
          .single();
        isSitter = profile?.user_id === user.id;
      }

      if (!isParent && !isSitter) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      const updates = {};
      if (isParent) updates.parent_marked_complete = true;
      if (isSitter) updates.sitter_marked_complete = true;

      // Auto-complete when both parties have marked it done
      const parentDone = isParent ? true : booking.parent_marked_complete;
      const sitterDone = isSitter ? true : booking.sitter_marked_complete;
      if (parentDone && sitterDone) updates.status = "completed";

      const { data, error } = await supabase
        .from("bookings")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ booking: data });
    }

    // ── Path 2: sitter accepting or declining a pending booking ───────────────
    const { status } = body;

    if (!["confirmed", "declined"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const { data: existing, error: fetchError } = await supabase
      .from("bookings")
      .select("id, status, sitter_id")
      .eq("id", id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (existing.status !== "pending_sitter") {
      return NextResponse.json(
        { error: "Booking is no longer awaiting sitter confirmation" },
        { status: 409 },
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
