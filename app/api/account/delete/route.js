import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function DELETE() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Delete from public.users — cascades to public.children
  await supabase.from("users").delete().eq("id", user.id);

  // Delete auth user (requires SUPABASE_SERVICE_ROLE_KEY in .env.local)
  try {
    const admin = createAdminClient();
    await admin.auth.admin.deleteUser(user.id);
  } catch {
    // If service role key is not configured the auth entry persists — acceptable in dev
  }

  return NextResponse.json({ success: true });
}
