"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/Button";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useSupabase } from "@/app/providers";
import { Trash2, GripVertical, Plus } from "lucide-react";

interface MarqueeItem {
  id: string;
  title: string;
  is_active: boolean;
  sort_order: number;
}

export default function MarqueePage() {
  const { adminUser, isLoading } = useAdminAuth();
  const { supabase } = useSupabase();
  const [items, setItems] = useState<MarqueeItem[]>([]);
  const [newText, setNewText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const { data } = await (supabase as any)
      .from("banners")
      .select("id, title, is_active, sort_order")
      .eq("position", "marquee")
      .order("sort_order", { ascending: true });
    setItems(data ?? []);
  }

  useEffect(() => { load(); }, [supabase]);

  const handleAdd = async () => {
    const text = newText.trim();
    if (!text) return;
    setSaving(true);
    setError(null);
    const nextOrder = items.length > 0 ? Math.max(...items.map(i => i.sort_order)) + 1 : 0;
    const { error: err } = await (supabase as any)
      .from("banners")
      .insert({
        title: text,
        position: "marquee",
        is_active: true,
        sort_order: nextOrder,
        image_url: "",
      });
    if (err) { setError(err.message); } else { setNewText(""); await load(); }
    setSaving(false);
  };

  const handleToggle = async (item: MarqueeItem) => {
    await (supabase as any)
      .from("banners")
      .update({ is_active: !item.is_active })
      .eq("id", item.id);
    await load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this marquee item?")) return;
    await (supabase as any).from("banners").delete().eq("id", id);
    await load();
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const a = items[index];
    const b = items[index - 1];
    await (supabase as any).from("banners").update({ sort_order: b.sort_order }).eq("id", a.id);
    await (supabase as any).from("banners").update({ sort_order: a.sort_order }).eq("id", b.id);
    await load();
  };

  const handleMoveDown = async (index: number) => {
    if (index === items.length - 1) return;
    const a = items[index];
    const b = items[index + 1];
    await (supabase as any).from("banners").update({ sort_order: b.sort_order }).eq("id", a.id);
    await (supabase as any).from("banners").update({ sort_order: a.sort_order }).eq("id", b.id);
    await load();
  };

  if (isLoading) return <AdminLayout><div className="p-8">Loading...</div></AdminLayout>;
  if (!adminUser) return <AdminLayout><div className="p-8 text-red-600">Access denied.</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="max-w-2xl p-8">
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Marquee Text</h1>
        </div>
        <p className="text-sm text-gray-500 mb-8">
          These messages scroll across the banner on the homepage. Add, remove, reorder, or toggle them on/off.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Add new item */}
        <div className="flex gap-2 mb-8">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="e.g. 🏆 Official licensed jerseys — 100% authentic"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Button onClick={handleAdd} disabled={saving || !newText.trim()}>
            <Plus className="w-4 h-4 mr-1.5" />
            Add
          </Button>
        </div>

        {/* Items list */}
        {items.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-12 border border-dashed border-gray-200 rounded-xl">
            No marquee items yet. Add one above.
          </p>
        ) : (
          <ul className="space-y-2">
            {items.map((item, i) => (
              <li
                key={item.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
                  item.is_active ? "bg-white border-gray-200" : "bg-gray-50 border-gray-200 opacity-60"
                }`}
              >
                <GripVertical className="w-4 h-4 text-gray-300 flex-none" />

                <span className="flex-1 text-sm text-gray-800">{item.title}</span>

                {/* Up / Down */}
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => handleMoveUp(i)}
                    disabled={i === 0}
                    className="text-[10px] text-gray-400 hover:text-gray-700 disabled:opacity-20 leading-none"
                    aria-label="Move up"
                  >▲</button>
                  <button
                    onClick={() => handleMoveDown(i)}
                    disabled={i === items.length - 1}
                    className="text-[10px] text-gray-400 hover:text-gray-700 disabled:opacity-20 leading-none"
                    aria-label="Move down"
                  >▼</button>
                </div>

                {/* Active toggle */}
                <button
                  onClick={() => handleToggle(item)}
                  className={`text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                    item.is_active
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {item.is_active ? "Active" : "Hidden"}
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8">
          <Link href="/admin/banners">
            <Button variant="outline" type="button">Back</Button>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
