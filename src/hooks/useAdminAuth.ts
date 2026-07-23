"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "@/app/providers";
import { useRouter } from "next/navigation";
import { AdminUser } from "@/lib/supabase/types";

export function useAdminAuth() {
  const { user, isLoading } = useSupabase();
  const { supabase } = useSupabase();
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [permissions, setPermissions] = useState<{ can_create: boolean; can_edit: boolean; can_hide: boolean } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchAdminData() {
      if (!user) {
        if (!cancelled) {
          setAdminUser(null);
          setPermissions(null);
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
          setPermissions(perms);
        } else {
          setPermissions({
            can_create: true,
            can_edit: true,
            can_hide: true,
          });
        }
      } else {
        setAdminUser(null);
        setPermissions(null);
      }
    }

    fetchAdminData();

    return () => {
      cancelled = true;
    };
  }, [user, supabase, router]);

  return { user, adminUser, permissions, isLoading };
}
