import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { Database } from "./types";

// Singleton — one client per browser context to avoid the multiple GoTrueClient warning
let _client: ReturnType<typeof createSupabaseClient<Database>> | null = null;

export const createClient = () => {
  if (!_client) {
    _client = createSupabaseClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "fake-key"
    );
  }
  return _client;
};
