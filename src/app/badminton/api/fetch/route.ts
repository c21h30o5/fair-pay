import { NextResponse } from 'next/server';
import type { NextRequest } from "next/server";
import { createClient } from '@/lib/supabase/server';


export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = request.nextUrl.searchParams.get("id");
    let query = supabase
      .from("badminton_bills")
      .select("id, created_at, user_id, bill_data")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (id) {
      query = query.eq("id", id).limit(1);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ data: id ? data?.[0] || null : data });
  } catch {
    return NextResponse.json({ error: "Failed to fetch bills" }, { status: 500 });
  }
}
