import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { code } = await request.json();
  const passcode = process.env.APP_PASSCODE || "1507";

  if (code === passcode) {
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false }, { status: 401 });
}
