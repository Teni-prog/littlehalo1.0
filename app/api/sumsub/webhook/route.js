import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";

const SUMSUB_SECRET_KEY = process.env.SUMSUB_SECRET_KEY;

// SumSub signs webhooks with HMAC-SHA256 of the raw request body, sent as
// the X-Payload-Digest header. Verify before trusting any payload.
function isValidSignature(rawBody, signatureHeader) {
  if (!signatureHeader) return false;
  const expected = crypto.createHmac("sha256", SUMSUB_SECRET_KEY).update(rawBody).digest("hex");
  const expectedBuf = Buffer.from(expected, "utf8");
  const providedBuf = Buffer.from(signatureHeader, "utf8");
  if (expectedBuf.length !== providedBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, providedBuf);
}

// POST /api/sumsub/webhook
// Receives applicant review events from SumSub and updates the matching
// sitter_verifications row. Runs outside user auth context, so it uses the
// service-role client (RLS only allows a sitter to write 'incomplete'/
// 'rejected' rows themselves — the transition to 'approved'/'rejected' after
// review is an admin-equivalent action performed here).
export async function POST(request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-payload-digest");

    if (!isValidSignature(rawBody, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const { type, externalUserId, reviewResult } = payload;

    if (type === "applicantReviewed" && externalUserId) {
      const supabase = createAdminClient();

      if (reviewResult?.reviewAnswer === "GREEN") {
        await supabase
          .from("sitter_verifications")
          .update({ status: "approved", reviewed_at: new Date().toISOString() })
          .eq("sitter_id", externalUserId);
      } else if (reviewResult?.reviewAnswer === "RED") {
        const rejectionReason = Array.isArray(reviewResult.rejectLabels)
          ? reviewResult.rejectLabels.join(", ")
          : null;
        await supabase
          .from("sitter_verifications")
          .update({
            status: "rejected",
            reviewed_at: new Date().toISOString(),
            rejection_reason: rejectionReason,
          })
          .eq("sitter_id", externalUserId);
      }
    }

    // Acknowledge every signature-verified webhook so SumSub doesn't retry —
    // only applicant.reviewed actually mutates state, other event types are
    // simply acknowledged.
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
