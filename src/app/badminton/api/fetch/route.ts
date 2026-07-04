import { NextResponse } from 'next/server';
import type { NextRequest } from "next/server";
import { supabase } from "@/lib/supabaseClient"; // Import Supabase Client

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    let query = supabase
      .from("badminton_bills")
      .select("id, created_at, bill_data")
      .order("created_at", { ascending: false });

    if (id) {
      query = query.eq("id", id).limit(1);
    }

    const { data, error } = await query;

    if (error) throw error;
    
    return NextResponse.json({ data: id ? data?.[0] || null : data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
