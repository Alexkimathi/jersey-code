"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useSupabase } from "@/app/providers";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { AdminUser, AdminPermissions } from "@/lib/supabase/types";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface AdminUserWithPermissions extends AdminUser {
  permissions?: AdminPermissions | null;
}

const defaultForm = {
  email: "",
  password: "",
  full_name: "",
  role: "admin" as "admin" | "super_admin",
  can_create: false,
  can_edit: false,
  can_hide: false,
};

export default function AdminUsersPage() {
  const { supabase } = useSupabase();
  const { adminUser } = useAdminAuth();
  const [users, setUsers] = useState<AdminUserWithPermissions[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [creating, setCreating] = useState(false);

  const isSuperAdmin = adminUser?.role === "super_admin";

  async function fetchUsers() {
    setLoading(true);
    const { data: usersData, error: usersError } = await supabase
      .from("admin_users")
      .select("*")
      .order("created_at", { ascending: false });

    if (!usersError && usersData) {
      const adminRoleIds = usersData.filter((u) => u.role === "admin").map((u) => u.id);

      let permsMap: Record<string, AdminPermissions> = {};
      if (adminRoleIds.length > 0) {
        const { data: permsData } = await supabase
          .from("admin_permissions")
          .select("*")
          .in("admin_id", adminRoleIds);
        if (permsData) {
          permsMap = Object.fromEntries(permsData.map((p) => [p.admin_id, p]));
        }
      }

      setUsers(
        usersData.map((u) => ({
          ...u,
          permissions: u.role === "admin" ? (permsMap[u.id] ?? null) : undefined,
        }))
      );
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchUsers();
  }, [supabase]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError(null);
    setSuccess(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(form),
      });

      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "Failed to create admin user.");
      } else {
        setSuccess(`Admin user "${form.email}" created successfully.`);
        setForm(defaultForm);
        setShowCreateForm(false);
        await fetchUsers();
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(userId: string, userName: string | null) {
    if (!confirm(`Delete admin user "${userName || userId}"? This cannot be undone.`)) return;

    setDeleting(userId);
    setError(null);
    setSuccess(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });

      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "Failed to delete admin user.");
      } else {
        setSuccess("Admin user deleted.");
        await fetchUsers();
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Users</h1>
          {isSuperAdmin && (
            <Button onClick={() => setShowCreateForm((v) => !v)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Admin User
            </Button>
          )}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Create Form */}
        {showCreateForm && isSuperAdmin && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">New Admin User</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="admin@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={form.full_name}
                    onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Min. 8 characters"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                  <select
                    value={form.role}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        role: e.target.value as "admin" | "super_admin",
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
              </div>

              {form.role === "admin" && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Permissions</p>
                  <div className="flex flex-wrap gap-6">
                    {(["can_create", "can_edit", "can_hide"] as const).map((perm) => (
                      <label
                        key={perm}
                        className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={form[perm]}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, [perm]: e.target.checked }))
                          }
                          className="rounded border-gray-300"
                        />
                        {perm === "can_create"
                          ? "Can Create"
                          : perm === "can_edit"
                          ? "Can Edit"
                          : "Can Hide"}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={creating}>
                  {creating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create User"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowCreateForm(false);
                    setForm(defaultForm);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name / ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                {isSuperAdmin && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={isSuperAdmin ? 5 : 4} className="px-6 py-12 text-center">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400 mx-auto" />
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u.id}
                    className={`hover:bg-gray-50 ${u.id === adminUser?.id ? "bg-blue-50/50" : ""}`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{u.full_name || "—"}</div>
                      <div className="text-xs text-gray-400 font-mono mt-0.5">
                        {u.id.slice(0, 12)}…
                      </div>
                      {u.id === adminUser?.id && (
                        <span className="text-xs text-blue-600">you</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          u.role === "super_admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {u.role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {u.role === "super_admin" ? (
                        <span className="text-gray-400 text-xs">Full access</span>
                      ) : u.permissions ? (
                        <div className="flex flex-wrap gap-1">
                          {u.permissions.can_create && (
                            <span className="bg-green-50 text-green-700 px-1.5 py-0.5 rounded text-xs">
                              Create
                            </span>
                          )}
                          {u.permissions.can_edit && (
                            <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-xs">
                              Edit
                            </span>
                          )}
                          {u.permissions.can_hide && (
                            <span className="bg-yellow-50 text-yellow-700 px-1.5 py-0.5 rounded text-xs">
                              Hide
                            </span>
                          )}
                          {!u.permissions.can_create &&
                            !u.permissions.can_edit &&
                            !u.permissions.can_hide && (
                              <span className="text-gray-400 text-xs">No permissions</span>
                            )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    {isSuperAdmin && (
                      <td className="px-6 py-4 text-right">
                        {u.id !== adminUser?.id && (
                          <button
                            onClick={() => handleDelete(u.id, u.full_name)}
                            disabled={deleting === u.id}
                            className="text-red-400 hover:text-red-600 disabled:opacity-40 transition-colors"
                            title="Delete admin user"
                          >
                            {deleting === u.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
              {!loading && users.length === 0 && (
                <tr>
                  <td
                    colSpan={isSuperAdmin ? 5 : 4}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No admin users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!isSuperAdmin && (
          <p className="mt-4 text-sm text-gray-400">
            Contact a super admin to add or remove admin users.
          </p>
        )}
      </div>
    </AdminLayout>
  );
}
