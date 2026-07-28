"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/Button";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Sport, ProductVariant } from "@/lib/supabase/types";
import { Plus, Trash2 } from "lucide-react";

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

async function compressImage(file: File, maxWidth = 1200, quality = 0.82): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let { width, height } = img;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => resolve(blob ?? file), "image/jpeg", quality);
    };
    img.onerror = () => { URL.revokeObjectURL(objectUrl); resolve(file); };
    img.src = objectUrl;
  });
}

interface ProductFormProps {
  params: Promise<{ id?: string }>;
}

// ── Variants manager (only shown when editing an existing product) ──────────

function VariantsManager({
  productId,
  supabase,
}: {
  productId: string;
  supabase: ReturnType<typeof createClient>;
}) {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [variantError, setVariantError] = useState<string | null>(null);
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [editingStockValue, setEditingStockValue] = useState("");

  const [newVariant, setNewVariant] = useState({
    size: "M",
    customSize: "",
    stock_quantity: "10",
    sku: "",
  });

  const fetchVariants = useCallback(async () => {
    const { data, error } = await (supabase as any)
      .from("product_variants")
      .select("*")
      .eq("product_id", productId)
      .order("size");
    if (!error) setVariants((data ?? []) as ProductVariant[]);
    setLoading(false);
  }, [productId, supabase]);

  useEffect(() => {
    fetchVariants();
  }, [fetchVariants]);

  const handleAddVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    setVariantError(null);

    const size = newVariant.size === "custom" ? newVariant.customSize.trim() : newVariant.size;
    if (!size) {
      setVariantError("Size is required.");
      return;
    }

    const qty = parseInt(newVariant.stock_quantity, 10);
    if (isNaN(qty) || qty < 0) {
      setVariantError("Stock quantity must be a non-negative number.");
      return;
    }

    if (variants.some((v) => v.size === size)) {
      setVariantError(`Size "${size}" already exists for this product.`);
      return;
    }

    setSaving(true);
    const { error } = await (supabase as any).from("product_variants").insert({
      product_id: productId,
      size,
      stock_quantity: qty,
      sku: newVariant.sku.trim() || null,
    });

    if (error) {
      setVariantError(error.message);
    } else {
      setNewVariant({ size: "M", customSize: "", stock_quantity: "10", sku: "" });
      setShowAddForm(false);
      await fetchVariants();
    }
    setSaving(false);
  };

  const handleDeleteVariant = async (id: string) => {
    if (!confirm("Delete this size? Orders with this variant will not be affected.")) return;
    await (supabase as any).from("product_variants").delete().eq("id", id);
    await fetchVariants();
  };

  const handleStockSave = async (id: string) => {
    const qty = parseInt(editingStockValue, 10);
    if (isNaN(qty) || qty < 0) {
      setEditingStockId(null);
      return;
    }
    await (supabase as any)
      .from("product_variants")
      .update({ stock_quantity: qty })
      .eq("id", id);
    setEditingStockId(null);
    await fetchVariants();
  };

  const inputClass =
    "px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm";

  return (
    <div className="mt-10 border-t border-gray-200 pt-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Sizes &amp; Stock</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage available sizes and their inventory levels.
          </p>
        </div>
        {!showAddForm && (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add size
          </button>
        )}
      </div>

      {variantError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg mb-4 text-sm">
          {variantError}
        </div>
      )}

      {/* Add variant form */}
      {showAddForm && (
        <form
          onSubmit={handleAddVariant}
          className="bg-gray-50 rounded-xl border border-gray-200 p-4 mb-4 space-y-3"
        >
          <p className="text-sm font-medium text-gray-700">New Size</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Size</label>
              <select
                value={newVariant.size}
                onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value })}
                className={`w-full ${inputClass}`}
              >
                {SIZE_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
                <option value="custom">Custom…</option>
              </select>
            </div>
            {newVariant.size === "custom" && (
              <div>
                <label className="block text-xs text-gray-500 mb-1">Custom size</label>
                <input
                  type="text"
                  placeholder="e.g. 38"
                  value={newVariant.customSize}
                  onChange={(e) => setNewVariant({ ...newVariant, customSize: e.target.value })}
                  className={`w-full ${inputClass}`}
                />
              </div>
            )}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Stock qty</label>
              <input
                type="number"
                min="0"
                value={newVariant.stock_quantity}
                onChange={(e) => setNewVariant({ ...newVariant, stock_quantity: e.target.value })}
                className={`w-full ${inputClass}`}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">SKU (optional)</label>
              <input
                type="text"
                placeholder="e.g. JRS-001-M"
                value={newVariant.sku}
                onChange={(e) => setNewVariant({ ...newVariant, sku: e.target.value })}
                className={`w-full ${inputClass}`}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Adding…" : "Add size"}
            </button>
            <button
              type="button"
              onClick={() => { setShowAddForm(false); setVariantError(null); }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Variants table */}
      {loading ? (
        <p className="text-sm text-gray-400">Loading sizes…</p>
      ) : variants.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
          <p className="text-sm text-gray-500">No sizes added yet.</p>
          <p className="text-xs text-gray-400 mt-1">
            Add at least one size so customers can add this product to their cart.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {variants.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">{v.size}</td>
                  <td className="px-4 py-3 text-sm">
                    {editingStockId === v.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          value={editingStockValue}
                          onChange={(e) => setEditingStockValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleStockSave(v.id);
                            if (e.key === "Escape") setEditingStockId(null);
                          }}
                          autoFocus
                          className="w-20 px-2 py-1 border border-blue-400 rounded text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => handleStockSave(v.id)}
                          className="text-xs text-blue-600 font-medium hover:text-blue-700"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingStockId(null)}
                          className="text-xs text-gray-400 hover:text-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingStockId(v.id);
                          setEditingStockValue(v.stock_quantity.toString());
                        }}
                        className={`font-medium hover:underline ${
                          v.stock_quantity === 0
                            ? "text-red-600"
                            : v.stock_quantity <= 5
                            ? "text-amber-600"
                            : "text-gray-900"
                        }`}
                      >
                        {v.stock_quantity}
                        <span className="ml-1 text-xs text-gray-400 font-normal">(click to edit)</span>
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 font-mono">
                    {v.sku ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteVariant(v.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete size"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Main product edit form ───────────────────────────────────────────────────

export default function ProductForm({ params }: ProductFormProps) {
  const router = useRouter();
  const { adminUser, permissions, isLoading } = useAdminAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productId, setProductId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setProductId(p.id || null));
  }, [params]);

  type ImageSlot = "front" | "back" | "side" | "badge";
  const IMAGE_SLOTS: { slot: ImageSlot; label: string; field: "image_url" | "back_image_url" | "side_image_url" | "badge_url" }[] = [
    { slot: "front", label: "Front",  field: "image_url" },
    { slot: "back",  label: "Back",   field: "back_image_url" },
    { slot: "side",  label: "Side",   field: "side_image_url" },
    { slot: "badge", label: "Badge",  field: "badge_url" },
  ];

  const [formData, setFormData] = useState({
    name: "",
    sport: "football" as Sport,
    team: "",
    description: "",
    price: "",
    image_url: "",
    back_image_url: "",
    side_image_url: "",
    badge_url: "",
    is_hidden: false,
    is_featured: false,
    is_clearance: false,
    sub_category: "",
  });
  const [selectedFiles, setSelectedFiles] = useState<Record<ImageSlot, File | null>>({ front: null, back: null, side: null, badge: null });
  const [previews, setPreviews] = useState<Record<ImageSlot, string>>({ front: "", back: "", side: "", badge: "" });
  const [uploading, setUploading] = useState(false);

  const supabase = useMemo(
    () =>
      createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "fake-key"
      ),
    []
  );

  useEffect(() => {
    async function loadProduct() {
      if (!productId) return;

      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (data) {
        setFormData({
          name: data.name,
          sport: data.sport,
          team: data.team || "",
          description: data.description || "",
          price: data.price.toString(),
          image_url: data.image_url || "",
          back_image_url: data.back_image_url || "",
          side_image_url: data.side_image_url || "",
          badge_url: data.badge_url || "",
          is_hidden: data.is_hidden,
          is_featured: data.is_featured,
          is_clearance: (data as any).is_clearance ?? false,
          sub_category: (data as any).sub_category ?? "",
        });
        setPreviews({
          front: data.image_url || "",
          back:  data.back_image_url || "",
          side:  data.side_image_url || "",
          badge: data.badge_url || "",
        });
      }
    }

    loadProduct();
  }, [productId, supabase]);

  useEffect(() => {
    return () => {
      Object.values(previews).forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleDelete = async () => {
    if (!productId || !confirm("Delete this product and all its sizes? This cannot be undone.")) return;
    setIsDeleting(true);
    setError(null);

    const { error: variantsError } = await supabase
      .from("product_variants")
      .delete()
      .eq("product_id", productId);

    if (variantsError) {
      setError(variantsError.message);
      setIsDeleting(false);
      return;
    }

    const { error: productError } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (productError) {
      setError(productError.message);
      setIsDeleting(false);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("Product name is required.");
      return;
    }

    const priceValue = parseFloat(formData.price);
    if (Number.isNaN(priceValue) || priceValue < 0) {
      setError("Please enter a valid product price.");
      return;
    }

    setIsSubmitting(true);

    // Upload any pending image files (compress first for speed)
    const updatedUrls: Partial<Record<"image_url" | "back_image_url" | "side_image_url" | "badge_url", string>> = {};
    const hasPending = Object.values(selectedFiles).some(Boolean);

    if (hasPending) {
      setUploading(true);
      for (const { slot, field } of IMAGE_SLOTS) {
        const file = selectedFiles[slot];
        if (!file) continue;
        try {
          const compressed = await compressImage(file);
          const ext = file.name.split(".").pop() ?? "jpg";
          const filePath = `products/${productId || "draft"}/${slot}-${Date.now()}.${ext}`;
          const { data, error: uploadError } = await supabase.storage
            .from("product-images")
            .upload(filePath, compressed, { cacheControl: "3600", upsert: false, contentType: "image/jpeg" });
          if (uploadError || !data) {
            setError(`Failed to upload ${slot} image: ${uploadError?.message ?? "unknown error"}`);
            setIsSubmitting(false);
            setUploading(false);
            return;
          }
          const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(data.path);
          updatedUrls[field] = urlData.publicUrl;
          setPreviews((prev) => ({ ...prev, [slot]: urlData.publicUrl }));
        } catch {
          setError(`Failed to upload ${slot} image.`);
          setIsSubmitting(false);
          setUploading(false);
          return;
        }
      }
      setSelectedFiles({ front: null, back: null, side: null, badge: null });
      setUploading(false);
    }

    const payload = {
      ...formData,
      ...updatedUrls,
      price: priceValue,
    };

    let error;
    if (productId) {
      const result = await supabase
        .from("products")
        .update(payload)
        .eq("id", productId);
      error = result.error;
    } else {
      const result = await supabase
        .from("products")
        .insert(payload)
        .select()
        .single();
      error = result.error;
      if (!error && result.data) {
        router.push(`/admin/products/${result.data.id}/edit`);
        return;
      }
    }

    if (error) {
      setError(error.message);
      setIsSubmitting(false);
    } else if (productId) {
      router.push("/admin/products");
      router.refresh();
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-8">Loading...</div>
      </AdminLayout>
    );
  }

  const canEdit = adminUser?.role === "super_admin" || permissions?.can_edit;
  const canCreate = adminUser?.role === "super_admin" || permissions?.can_create;

  if (!productId && !canCreate) {
    return (
      <AdminLayout>
        <div className="p-8 text-red-600">You don&apos;t have permission to create products.</div>
      </AdminLayout>
    );
  }

  if (productId && !canEdit) {
    return (
      <AdminLayout>
        <div className="p-8 text-red-600">You don&apos;t have permission to edit products.</div>
      </AdminLayout>
    );
  }

  const fieldClass =
    "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    <AdminLayout>
      <div className="max-w-3xl p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {productId ? "Edit Product" : "New Product"}
          </h1>
          {productId && adminUser?.role === "super_admin" && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
            >
              {isDeleting ? "Deleting…" : "Delete product"}
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={fieldClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sport *</label>
              <select
                value={formData.sport}
                onChange={(e) => setFormData({ ...formData, sport: e.target.value as Sport, sub_category: "" })}
                className={fieldClass}
              >
                <option value="football">Football (EPL / World Football)</option>
                <option value="rugby">Rugby</option>
                <option value="formula_one">Formula One</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sub-category</label>
              <select
                value={formData.sub_category}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({
                    ...formData,
                    sub_category: val,
                    is_clearance: val === "world_clearance",
                  });
                }}
                className={fieldClass}
              >
                {formData.sport === "football" && <>
                  <option value="">— Select sub-category —</option>
                  <optgroup label="Premier League (EPL page)">
                    <option value="epl_club">Club Jersey</option>
                    <option value="epl_kids">Kids Jersey</option>
                    <option value="epl_vintage">Vintage Jersey</option>
                    <option value="epl_special">Special Edition Kit</option>
                  </optgroup>
                  <optgroup label="World Football page">
                    <option value="world_club">Club Jersey</option>
                    <option value="world_kids">Kids Jersey</option>
                    <option value="world_vintage">Vintage Jersey</option>
                    <option value="world_special">Special Edition Kit</option>
                    <option value="world_tracksuit">Tracksuit</option>
                    <option value="world_clearance">Clearance Sale</option>
                  </optgroup>
                  <optgroup label="Both pages">
                    <option value="national">National Team Kit</option>
                  </optgroup>
                </>}
                {formData.sport === "rugby" && <>
                  <option value="">Jersey</option>
                </>}
                {formData.sport === "formula_one" && <>
                  <option value="">Jersey</option>
                  <option value="hoodie_polo">Hoodie &amp; Polo</option>
                </>}
                {formData.sport === "accessories" && <>
                  <option value="">— Select type —</option>
                  <option value="Balls">Balls</option>
                  <option value="Flags">Flags</option>
                  <option value="Socks">Socks</option>
                </>}
              </select>
              <p className="mt-1 text-xs text-gray-400">
                Determines which page and tab this product appears under on the storefront.
              </p>
            </div>
          </div>

          <div className="max-w-xs">
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (KES) *</label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className={fieldClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={fieldClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Product Images
            </label>
            {uploading && (
              <p className="text-sm text-blue-600 font-medium mb-3">Compressing &amp; uploading images...</p>
            )}
            <div className="grid grid-cols-2 gap-4">
              {IMAGE_SLOTS.map(({ slot, label, field }) => (
                <div key={slot} className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
                  {previews[slot] && (
                    <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                      <img src={previews[slot]} alt={`${label} preview`} className="w-full h-36 object-cover" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      if (!file) return;
                      setSelectedFiles((prev) => ({ ...prev, [slot]: file }));
                      setPreviews((prev) => ({ ...prev, [slot]: URL.createObjectURL(file) }));
                    }}
                    className="block w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-slate-100 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
                  />
                  {selectedFiles[slot] && !uploading && (
                    <p className="text-xs text-amber-600">Ready — uploads on save</p>
                  )}
                  <input
                    type="url"
                    value={formData[field]}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://... or leave blank"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">Visibility &amp; Placement</p>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_hidden}
                  onChange={(e) => setFormData({ ...formData, is_hidden: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Hidden</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="rounded border-gray-300 text-amber-500 focus:ring-amber-400"
                />
                <span className="text-sm text-gray-700">
                  Best Seller
                  <span className="ml-1.5 text-xs text-gray-400 font-normal">(Featured page)</span>
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_clearance}
                  onChange={(e) => setFormData({ ...formData, is_clearance: e.target.checked })}
                  className="rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                />
                <span className="text-sm text-gray-700">
                  Clearance Sale
                  <span className="ml-1.5 text-xs text-gray-400 font-normal">(Clearance tab)</span>
                </span>
              </label>
            </div>
            <p className="text-xs text-gray-400">
              All products with images automatically appear in <strong>Featured &rsaquo; New Arrival</strong>. Tick &ldquo;Best Seller&rdquo; to also appear in the Best Seller tab.
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <Button type="submit" disabled={isSubmitting}>
              {uploading ? "Uploading images..." : isSubmitting ? "Saving..." : productId ? "Update Product" : "Create Product"}
            </Button>
            <Link href="/admin/products">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
          </div>
        </form>

        {/* Variants section — only available after the product is created */}
        {productId ? (
          <VariantsManager productId={productId} supabase={supabase as any} />
        ) : (
          <p className="mt-8 text-sm text-gray-400 border-t border-gray-200 pt-6">
            Save the product first to manage its sizes and stock.
          </p>
        )}
      </div>
    </AdminLayout>
  );
}
