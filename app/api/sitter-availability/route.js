import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// GET /api/sitter-availability
// Get current sitter's availability
export async function GET(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from("sitter_profiles")
      .select("recurring_availability, availability_overrides, repeat_weekly")
      .eq("user_id", user.id)
      .single();

    if (error || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      availability: {
        recurring_availability: profile.recurring_availability || {},
        availability_overrides: profile.availability_overrides || {},
        repeat_weekly: profile.repeat_weekly ?? true,
      },
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST /api/sitter-availability
// Update current sitter's availability
export async function POST(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { recurring_availability, availability_overrides, repeat_weekly } = await request.json();

    // Validate structure
    if (recurring_availability && typeof recurring_availability !== "object") {
      return NextResponse.json(
        { error: "recurring_availability must be an object" },
        { status: 400 }
      );
    }
    if (availability_overrides && typeof availability_overrides !== "object") {
      return NextResponse.json(
        { error: "availability_overrides must be an object" },
        { status: 400 }
      );
    }

    // Update the profile
    const { data: updated, error } = await supabase
      .from("sitter_profiles")
      .update({
        recurring_availability: recurring_availability || {},
        availability_overrides: availability_overrides || {},
        repeat_weekly: repeat_weekly ?? true,
      })
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      availability: {
        recurring_availability: updated.recurring_availability,
        availability_overrides: updated.availability_overrides,
        repeat_weekly: updated.repeat_weekly,
      },
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
