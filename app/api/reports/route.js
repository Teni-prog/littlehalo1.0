import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// POST /api/reports
// Create a new issue report
export async function POST(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { booking_id, issue_type, description } = await request.json();

    // Validate required fields
    if (!booking_id || !issue_type || !description) {
      return NextResponse.json(
        { error: "booking_id, issue_type, and description are required" },
        { status: 400 }
      );
    }

    if (!["no-show", "safety-concern", "payment-issue", "other"].includes(issue_type)) {
      return NextResponse.json(
        { error: "Invalid issue_type" },
        { status: 400 }
      );
    }

    // Verify the booking exists and the user is involved
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("id, parent_id, sitter_id, status")
      .eq("id", booking_id)
      .single();

    if (!booking || bookingError) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Check if user is the parent or sitter for this booking
    let isInvolved = booking.parent_id === user.id;
    if (!isInvolved) {
      const { data: sitterProfile } = await supabase
        .from("sitter_profiles")
        .select("id, user_id")
        .eq("id", booking.sitter_id)
        .single();
      isInvolved = sitterProfile?.user_id === user.id;
    }

    if (!isInvolved) {
      return NextResponse.json(
        { error: "You are not involved in this booking" },
        { status: 403 }
      );
    }

    // Booking must be completed to report an issue
    if (booking.status !== "completed") {
      return NextResponse.json(
        { error: "Issue can only be reported on completed bookings" },
        { status: 409 }
      );
    }

    // Create the report
    const { data: report, error: insertError } = await supabase
      .from("reports")
      .insert({
        booking_id,
        reporter_id: user.id,
        issue_type,
        description,
        status: "open",
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ report }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// GET /api/reports?bookingId=<id>
// Get reports for a specific booking
export async function GET(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get("bookingId");
    if (!bookingId) {
      return NextResponse.json({ error: "bookingId is required" }, { status: 400 });
    }

    // Verify the user is involved in the booking
    const { data: booking } = await supabase
      .from("bookings")
      .select("id, parent_id, sitter_id")
      .eq("id", bookingId)
      .single();

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    let isInvolved = booking.parent_id === user.id;
    if (!isInvolved) {
      const { data: sitterProfile } = await supabase
        .from("sitter_profiles")
        .select("user_id")
        .eq("id", booking.sitter_id)
        .single();
      isInvolved = sitterProfile?.user_id === user.id;
    }

    if (!isInvolved) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Get all reports for this booking
    const { data: reports, error } = await supabase
      .from("reports")
      .select("*")
      .eq("booking_id", bookingId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ reports: reports || [] });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
