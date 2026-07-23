import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { Database } from "./types";

export const createClient = () =>
  createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "fake-key"
  );
