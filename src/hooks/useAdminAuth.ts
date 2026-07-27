"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "@/app/providers";
import { useRouter } from "next/navigation";
import { AdminUser } from "@/lib/supabase/types";

export function useAdminAuth() {
  const { user, isLoading: isAuthLoading } = useSupabase();
  const { supabase } = useSupabase();
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [permissions, setPermissions] = useState<{ can_create: boolean; can_edit: boolean; can_hide: boolean } | null>(null);
  // Separate loading state for the admin_users DB fetch so the layout never
  // briefly shows "not logged in" while the fetch is in-flight.
  const [isAdminLoading, setIsAdminLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchAdminData() {
      // Wait until the auth session is fully resolved before querying the DB.
      if (isAuthLoading) return;

      if (!user) {
        if (!cancelled) {
          setAdminUser(null);
          setPermissions(null);
          setIsAdminLoading(false);
        }
        return;
      }

      const { data: admin } = await supabase
        .from("admin_users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (cancelled) return;

      if (admin) {
        setAdminUser(admin);

        if (admin.role === "admin") {
          const { data: perms } = await supabase
            .from("admin_permissions")
            .select("*")
            .eq("admin_id", user.id)
            .single();
          if (!cancelled) setPermissions(perms);
        } else {
          if (!cancelled) setPermissions({ can_create: true, can_edit: true, can_hide: true });
        }
      } else {
        if (!cancelled) {
          setAdminUser(null);
          setPermissions(null);
        }
      }

      if (!cancelled) setIsAdminLoading(false);
    }

    fetchAdminData();

    return () => {
      cancelled = true;
    };
  }, [user, supabase, router, isAuthLoading]);

  // Expose a single isLoading that covers both auth and admin DB fetch.
  return { user, adminUser, permissions, isLoading: isAuthLoading || isAdminLoading };
}
