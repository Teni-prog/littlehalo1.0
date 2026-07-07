import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import crypto from "node:crypto";

const SUMSUB_BASE_URL = process.env.SUMSUB_BASE_URL;
const SUMSUB_APP_TOKEN = process.env.SUMSUB_APP_TOKEN;
const SUMSUB_SECRET_KEY = process.env.SUMSUB_SECRET_KEY;
const LEVEL_NAME = "basic-kyc-level";

// SumSub request signing: HMAC-SHA256 of (timestamp + METHOD + path + body),
// sent as X-App-Access-Sig alongside X-App-Access-Ts and X-App-Token.
function signRequest({ ts, method, path, body }) {
  return crypto
    .createHmac("sha256", SUMSUB_SECRET_KEY)
    .update(`${ts}${method}${path}${body}`)
    .digest("hex");
}

// GET /api/sumsub/access-token
// Generates a SumSub WebSDK access token for the current sitter, using their
// Supabase auth user id as the SumSub externalUserId.
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const method = "POST";
    const path = `/resources/accessTokens?userId=${encodeURIComponent(user.id)}&levelName=${encodeURIComponent(LEVEL_NAME)}`;
    const body = "";
    const ts = Math.floor(Date.now() / 1000);
    const signature = signRequest({ ts, method, path, body });

    const res = await fetch(`${SUMSUB_BASE_URL}${path}`, {
      method,
      headers: {
        "X-App-Token": SUMSUB_APP_TOKEN,
        "X-App-Access-Sig": signature,
        "X-App-Access-Ts": String(ts),
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { error: data?.description || "Failed to generate SumSub access token" },
        { status: res.status },
      );
    }

    return NextResponse.json({ token: data.token });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
