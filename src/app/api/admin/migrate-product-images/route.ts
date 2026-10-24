import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { createServiceClient } from "@/lib/supabase/server";
import { Product } from "@/lib/supabase/types";

const IMAGE_FIELDS = ["image_url", "back_image_url", "side_image_url", "badge_url"] as const;
type ImageField = (typeof IMAGE_FIELDS)[number];

async function verifyAdmin(token: string) {
  const supabase = createServiceClient();
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("id, role")
    .eq("id", user.id)
    .single();
  return adminUser ?? null;
}

/** Parse bucket and object path from a Supabase public storage URL.
 *  Format: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path...>
 */
function parseSupabaseStorageUrl(url: string): { bucket: string; path: string } | null {
  const match = url.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/);
  if (!match) return null;
  return { bucket: match[1], path: match[2] };
}

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = await verifyAdmin(token);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((admin as any).role !== "super_admin") {
    return NextResponse.json({ error: "super_admin required" }, { status: 403 });
  }

  const supabase = createServiceClient();

  const { data: rawProducts, error: fetchError } = await supabase
    .from("products")
    .select("*");
  const products = rawProducts as Product[] | null;

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  let migrated = 0;
  let skipped = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const product of products ?? []) {
    const updates: Partial<Record<ImageField, string>> = {};

    for (const field of IMAGE_FIELDS) {
      const url = product[field] as string | null;
      if (!url || !url.includes(".supabase.co/storage")) {
        skipped++;
        continue;
      }

      const parsed = parseSupabaseStorageUrl(url);
      if (!parsed) {
        errors.push(`${product.id}/${field}: could not parse URL: ${url}`);
        failed++;
        continue;
      }

      try {
        const { data: fileData, error: downloadError } = await supabase.storage
          .from(parsed.bucket)
          .download(parsed.path);

        if (downloadError || !fileData) {
          errors.push(`${product.id}/${field}: download failed: ${downloadError?.message ?? "no data"}`);
          failed++;
          continue;
        }

        const ext = parsed.path.split(".").pop()?.toLowerCase() ?? "jpg";
        const fieldSlug = field.replace("_url", "").replace("_image", "");
        const blobPath = `products/${product.id}/${fieldSlug}-migrated.${ext}`;

        const blob = await put(blobPath, fileData, {
          access: "public",
          contentType: fileData.type,
          allowOverwrite: true,
        });

        updates[field] = blob.url;
        migrated++;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`${product.id}/${field}: ${msg}`);
        failed++;
      }
    }

    if (Object.keys(updates).length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: updateError } = await (supabase as any)
        .from("products")
        .update(updates)
        .eq("id", product.id);

      if (updateError) {
        errors.push(`${product.id}: DB update failed: ${updateError.message}`);
      }
    }
  }

  return NextResponse.json({ migrated, skipped, failed, errors });
}
