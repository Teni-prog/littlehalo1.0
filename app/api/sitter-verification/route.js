import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const DOCUMENT_TYPES = ["passport", "drivers_license", "provincial_id"];

// GET /api/sitter-verification
// Get current sitter's verification record (null if none exists yet)
export async function GET(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: verification, error } = await supabase
      .from("sitter_verifications")
      .select("*")
      .eq("sitter_id", user.id)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ verification: verification || null });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST /api/sitter-verification
// Mark the current sitter's verification as submitted (status -> 'pending').
// Identity data and documents are now collected by the SumSub WebSDK rather
// than through this route, so the body is optional — any of these fields are
// stored if provided (e.g. for callers that still send them), but none are
// required anymore.
export async function POST(request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const {
      full_legal_name,
      date_of_birth,
      document_type,
      document_front_url,
      document_back_url,
      proof_of_address_url,
    } = body;

    if (document_type !== undefined && !DOCUMENT_TYPES.includes(document_type)) {
      return NextResponse.json({ error: "document_type must be one of: " + DOCUMENT_TYPES.join(", ") }, { status: 400 });
    }

    const { data: updated, error } = await supabase
      .from("sitter_verifications")
      .upsert(
        {
          sitter_id: user.id,
          status: "pending",
          submitted_at: new Date().toISOString(),
          rejection_reason: null,
          ...(full_legal_name ? { full_legal_name: full_legal_name.trim() } : {}),
          ...(date_of_birth ? { date_of_birth } : {}),
          ...(document_type ? { document_type } : {}),
          ...(document_front_url ? { document_front_url } : {}),
          ...(document_back_url !== undefined
            ? { document_back_url: document_type === "passport" ? null : document_back_url }
            : {}),
          ...(proof_of_address_url ? { proof_of_address_url } : {}),
        },
        { onConflict: "sitter_id" },
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ verification: updated });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
