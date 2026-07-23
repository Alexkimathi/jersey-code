import { NextRequest, NextResponse } from "next/server";

// In-memory rate limiter — resets on server restart.
// Suitable for a small admin panel without external state (e.g. Redis).
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const now = Date.now();
  const entry = attempts.get(ip);

  if (entry && now < entry.resetAt && entry.count >= MAX_ATTEMPTS) {
    const minutesLeft = Math.ceil((entry.resetAt - now) / 60_000);
    return NextResponse.json(
      {
        error: `Too many login attempts. Try again in ${minutesLeft} minute${
          minutesLeft !== 1 ? "s" : ""
        }.`,
      },
      { status: 429 }
    );
  }

  let email: string, password: string;
  try {
    const body = await req.json();
    email = body.email;
    password = body.password;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  // Delegate to Supabase Auth REST API so the token is generated server-side
  const authRes = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      },
      body: JSON.stringify({ email, password }),
    }
  );

  const authData = await authRes.json();

  if (!authRes.ok) {
    // Increment the failure counter for this IP
    const current = attempts.get(ip) ?? { count: 0, resetAt: now + WINDOW_MS };
    const resetAt = now >= current.resetAt ? now + WINDOW_MS : current.resetAt;
    attempts.set(ip, { count: current.count + 1, resetAt });

    const remaining = MAX_ATTEMPTS - (current.count + 1);
    const message =
      remaining > 0
        ? `Invalid email or password. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.`
        : "Invalid email or password.";

    return NextResponse.json({ error: message }, { status: 401 });
  }

  // Successful login — clear the IP's rate-limit record
  attempts.delete(ip);

  return NextResponse.json({
    access_token: authData.access_token,
    refresh_token: authData.refresh_token,
  });
}
