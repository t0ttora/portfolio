import { NextResponse } from "next/server";
import crypto from "node:crypto";

function sha256(input: string) {
  return crypto.createHash("sha256").update(input, "utf8").digest();
}

export async function POST(request: Request) {
  const secret = process.env.ADMIN_SECRET_PHRASE;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "Misconfigured" },
      { status: 500 },
    );
  }

  let phrase = "";
  try {
    const body = (await request.json()) as { phrase?: unknown };
    phrase = typeof body.phrase === "string" ? body.phrase : "";
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const expected = sha256(secret);
  const provided = sha256(phrase);

  const ok = crypto.timingSafeEqual(expected, provided);
  if (!ok) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
