import { generateClientTokenFromReadWriteToken } from "@vercel/blob/client";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

async function verifyAdminToken(token: string) {
  const supabase = createServiceClient();
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", user.id)
    .single();
  return adminUser ?? null;
}

export async function POST(req: NextRequest) {
  let body: { type: string; payload?: { pathname?: string; clientPayload?: string; multipart?: boolean } };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // blob.upload-completed callback — no-op, client saves URL to DB itself
  if (body.type === "blob.upload-completed") {
    return NextResponse.json({ type: "blob.upload-completed", response: "ok" });
  }

  // blob.generate-client-token — the only step that needs BLOB_READ_WRITE_TOKEN
  if (body.type === "blob.generate-client-token") {
    const { pathname = "" } = body.payload ?? {};

    // Auth via Authorization header (same as all other admin routes)
    const authToken = req.headers.get("authorization")?.split(" ")[1];
    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await verifyAdminToken(authToken);
    if (!admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const ext = pathname.split(".").pop()?.toLowerCase();
    if (!ext || !["mp4", "webm", "mov", "ogg"].includes(ext)) {
      return NextResponse.json({ error: "Unsupported video format" }, { status: 400 });
    }

    const validUntil = Date.now() + 60 * 60 * 1000; // 1 hour

    let clientToken: string;
    try {
      clientToken = await generateClientTokenFromReadWriteToken({
        token: process.env.BLOB_READ_WRITE_TOKEN,
        pathname,
        allowOverwrite: true,
        validUntil,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("generateClientTokenFromReadWriteToken failed:", msg);
      return NextResponse.json({
        error: `Token generation failed: ${msg}`,
        tokenPresent: !!process.env.BLOB_READ_WRITE_TOKEN,
      }, { status: 500 });
    }

    return NextResponse.json({ type: "blob.generate-client-token", clientToken });
  }

  return NextResponse.json({ error: "Unknown request type" }, { status: 400 });
}
