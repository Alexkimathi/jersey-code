"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useSupabase } from "@/app/providers";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface TeamListEntry {
  id: string;
  name: string;
  list_type: "epl" | "national" | "other";
  sort_order: number;
}

const LIST_TYPE_LABELS: Record<string, string> = {
  epl: "Premier League Teams",
  national: "National Teams",
  other: "Other Teams",
};

export default function AdminCategoriesPage() {
  const { supabase } = useSupabase();
  const [teams, setTeams] = useState<TeamListEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newTeam, setNewTeam] = useState<{ name: string; list_type: "epl" | "national" | "other" }>({
    name: "",
    list_type: "epl",
  });

  async function fetchTeams() {
    const { data, error: fetchError } = await supabase
      .from("team_lists")
      .select("*")
      .order("list_type")
      .order("sort_order");

    if (!fetchError && data) {
      setTeams(data as TeamListEntry[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchTeams();
  }, [supabase]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newTeam.name.trim()) return;
    setAdding(true);
    setError(null);
    setSuccess(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(newTeam),
      });

      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "Failed to add team.");
      } else {
        setSuccess(`"${newTeam.name}" added.`);
        setNewTeam((prev) => ({ ...prev, name: "" }));
        await fetchTeams();
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Remove "${name}" from the list?`)) return;
    setDeleting(id);
    setError(null);
    setSuccess(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });

      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "Failed to remove team.");
      } else {
        setSuccess(`"${name}" removed.`);
        await fetchTeams();
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setDeleting(null);
    }
  }

  // Group teams by list_type
  const grouped = teams.reduce<Record<string, TeamListEntry[]>>((acc, team) => {
    if (!acc[team.list_type]) acc[team.list_type] = [];
    acc[team.list_type].push(team);
    return acc;
  }, {});

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Football Categories</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage which teams appear in the Premier League and National Teams tabs on the storefront.
          </p>
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

        {/* Add team form */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Add Team</h2>
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newTeam.name}
              onChange={(e) => setNewTeam((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Team name (e.g. Chelsea FC)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <select
              value={newTeam.list_type}
              onChange={(e) =>
                setNewTeam((prev) => ({
                  ...prev,
                  list_type: e.target.value as "epl" | "national" | "other",
                }))
              }
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="epl">Premier League</option>
              <option value="national">National Teams</option>
              <option value="other">Other</option>
            </select>
            <Button type="submit" disabled={adding}>
              {adding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </>
              )}
            </Button>
          </form>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(LIST_TYPE_LABELS).map(([listType, label]) => {
              const groupTeams = grouped[listType] || [];
              return (
                <div
                  key={listType}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                >
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-700">{label}</h3>
                    <span className="text-xs text-gray-400">
                      {groupTeams.length} team{groupTeams.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  {groupTeams.length === 0 ? (
                    <div className="px-6 py-6 text-sm text-gray-400 text-center">
                      No teams in this category. Add one above.
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-100">
                      {groupTeams.map((team) => (
                        <li
                          key={team.id}
                          className="flex items-center justify-between px-6 py-3 hover:bg-gray-50"
                        >
                          <span className="text-sm text-gray-900">{team.name}</span>
                          <button
                            onClick={() => handleDelete(team.id, team.name)}
                            disabled={deleting === team.id}
                            className="text-red-400 hover:text-red-600 disabled:opacity-40 transition-colors"
                            title="Remove team"
                          >
                            {deleting === team.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
