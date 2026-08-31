import { createServiceClient } from "./server";
import { ProductVariant } from "./types";

/**
 * Fetches ALL product variants using pagination.
 * The Supabase project has db_max_rows=1000 (server-side hard cap).
 * Calling .limit(N) where N>1000 is silently ignored by PostgREST.
 * We must page through in batches of 1000.
 */
export async function getAllProductVariants(): Promise<ProductVariant[]> {
  const supabase = createServiceClient();
  const all: ProductVariant[] = [];
  let from = 0;

  for (;;) {
    const { data } = await supabase
      .from("product_variants")
      .select("*")
      .range(from, from + 999);

    if (!data?.length) break;
    all.push(...(data as ProductVariant[]));
    if (data.length < 1000) break;
    from += 1000;
  }

  return all;
}
