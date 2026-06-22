import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("micro_adventures")
      .select("*")
      .order("is_featured", { ascending: false })
      .order("name");

    if (error) {
      console.error("Supabase Database Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Return the clean direct array that matches the frontend's internal state parser
    return NextResponse.json(data ?? []);

  } catch (err) {
    console.error("Internal Catch Server Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}