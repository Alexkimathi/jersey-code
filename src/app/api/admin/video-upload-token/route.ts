import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
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
  const body = (await req.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        if (!clientPayload) throw new Error("Unauthorized");
        const admin = await verifyAdminToken(clientPayload);
        if (!admin) throw new Error("Forbidden");

        return {
          allowedContentTypes: ["video/mp4", "video/webm", "video/quicktime", "video/ogg"],
          maximumSizeInBytes: 500 * 1024 * 1024, // 500 MB
          addRandomSuffix: false,
        };
      },
      onUploadCompleted: async () => {
        // DB save is handled by the client after upload
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
