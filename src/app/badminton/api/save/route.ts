import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // ใส่ Logic การบันทึกลง Database ของคุณที่นี่
    return NextResponse.json({ message: "Saved successfully", data: body });
  } catch {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
