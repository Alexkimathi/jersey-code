"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleProductVisibility(
  productId: string,
  currentHidden: boolean
) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("products")
    .update({ is_hidden: !currentHidden })
    .eq("id", productId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/products");
}
