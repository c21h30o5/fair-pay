import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('promptpay_number')
    .eq('id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
  }

  return NextResponse.json({
    promptpay_number: data?.promptpay_number || '',
  });
}

export async function PUT(request: Request) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { promptpay_number } = await request.json();

  if (!promptpay_number || typeof promptpay_number !== 'string') {
    return NextResponse.json({ error: "promptpay_number is required" }, { status: 400 });
  }

  const { error } = await supabase
    .from('profiles')
    .upsert({ id: user.id, promptpay_number: promptpay_number.trim() });

  if (error) {
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }

  return NextResponse.json({ message: "Profile saved successfully" });
}
