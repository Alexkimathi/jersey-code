// SERVER-ONLY — never import this file in client components.
// SUPABASE_SERVICE_ROLE_KEY has no NEXT_PUBLIC_ prefix so it is not
// bundled into the browser, but importing createServiceClient in a
// client component would cause a silent auth failure. Keep all imports
// of this module inside API routes and Server Components only.
import { createClient } from "@supabase/supabase-js";
import { Database } from "./types";

export const createServerClient = () =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

export const createServiceClient = () =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
