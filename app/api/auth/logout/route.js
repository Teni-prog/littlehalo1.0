import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: "Failed to logout" }, { status: 500 });
  }
}
