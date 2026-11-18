"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useSupabase } from "@/app/providers";
import { Wrench, Play, CheckCircle, AlertCircle, Loader2, ImageOff } from "lucide-react";

interface BatchResult {
  offset: number;
  migrated: number;
  skipped: number;
  failed: number;
  count: number;
  errors: string[];
}

interface ProductWithoutImage {
  id: string;
  name: string;
  sport: string | null;
  team: string | null;
}

export default function AdminToolsPage() {
  const { supabase } = useSupabase();

  const [running, setRunning] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [totals, setTotals] = useState({ migrated: 0, skipped: 0, failed: 0 });

  const [noImageRunning, setNoImageRunning] = useState(false);
  const [noImageProducts, setNoImageProducts] = useState<ProductWithoutImage[] | null>(null);

  async function getToken() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? null;
  }

  async function runMigration() {
    const token = await getToken();
    if (!token) {
      setLog(["ERROR: Not authenticated."]);
      return;
    }

    setRunning(true);
    setDone(false);
    setLog(["Starting migration…"]);
    setTotals({ migrated: 0, skipped: 0, failed: 0 });

    const BATCH = 50;
    let offset = 0;
    let totalMigrated = 0;
    let totalSkipped = 0;
    let totalFailed = 0;

    while (true) {
      setLog(prev => [...prev, `  Batch offset=${offset}…`]);

      let result: BatchResult;
      try {
        const res = await fetch(
          `/api/admin/migrate-product-images?offset=${offset}&limit=${BATCH}`,
          { method: "POST", headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) {
          const text = await res.text();
          setLog(prev => [...prev, `  ERROR ${res.status}: ${text}`]);
          break;
        }
        result = await res.json();
      } catch (err) {
        setLog(prev => [...prev, `  Network error: ${(err as Error).message}`]);
        break;
      }

      totalMigrated += result.migrated;
      totalSkipped  += result.skipped;
      totalFailed   += result.failed;

      setLog(prev => [
        ...prev,
        `  ✓ migrated=${result.migrated} skipped=${result.skipped} failed=${result.failed}`,
        ...result.errors.map(e => `    ⚠ ${e}`),
      ]);
      setTotals({ migrated: totalMigrated, skipped: totalSkipped, failed: totalFailed });

      // If the batch returned fewer products than requested, we've hit the end
      if (result.count < BATCH) break;
      offset += BATCH;
    }

    setLog(prev => [
      ...prev,
      "",
      `Done. Total migrated: ${totalMigrated} | skipped: ${totalSkipped} | failed: ${totalFailed}`,
    ]);
    setRunning(false);
    setDone(true);
  }

  async function findProductsWithoutImages() {
    setNoImageRunning(true);
    setNoImageProducts(null);
    const { data } = await supabase
      .from("products")
      .select("id, name, sport, team")
      .is("image_url", null)
      .order("name");
    setNoImageProducts((data as ProductWithoutImage[]) ?? []);
    setNoImageRunning(false);
  }

  return (
    <AdminLayout>
      <div className="p-4 sm:p-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-8">
          <Wrench className="w-6 h-6 text-gray-700" />
          <h1 className="text-2xl font-bold text-gray-900">Tools</h1>
        </div>

        {/* ── Migrate product images ── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Fix Broken Product Images</h2>
            <p className="mt-1 text-sm text-gray-500">
              Scans every product and re-uploads any images still stored in Supabase Storage
              into Vercel Blob. Run this whenever product images stop showing.
            </p>
          </div>

          {/* Summary badges */}
          {(totals.migrated > 0 || totals.failed > 0) && (
            <div className="flex gap-3 text-sm font-medium">
              <span className="px-3 py-1 rounded-full bg-green-50 text-green-700">
                {totals.migrated} migrated
              </span>
              <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                {totals.skipped} already on Blob
              </span>
              {totals.failed > 0 && (
                <span className="px-3 py-1 rounded-full bg-red-50 text-red-700">
                  {totals.failed} failed
                </span>
              )}
            </div>
          )}

          {/* Log output */}
          {log.length > 0 && (
            <pre className="bg-gray-950 text-gray-100 text-xs rounded-lg p-4 max-h-64 overflow-y-auto whitespace-pre-wrap font-mono leading-5">
              {log.join("\n")}
            </pre>
          )}

          <button
            onClick={runMigration}
            disabled={running}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-blue-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {running ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Running…</>
            ) : done ? (
              <><CheckCircle className="w-4 h-4 text-green-400" /> Run again</>
            ) : (
              <><Play className="w-4 h-4" /> Run Migration</>
            )}
          </button>

          {done && totals.failed === 0 && (
            <div className="flex items-center gap-2 text-sm text-green-700 font-medium">
              <CheckCircle className="w-4 h-4" />
              All product images are now on Vercel Blob.
            </div>
          )}
          {done && totals.failed > 0 && (
            <div className="flex items-start gap-2 text-sm text-amber-700">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-none" />
              <span>
                {totals.failed} image(s) could not be migrated automatically. Check the log above,
                then re-upload those product images manually from the Products page.
              </span>
            </div>
          )}
        </div>

        {/* ── Products Without Images ── */}
        <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Products Without Images</h2>
            <p className="mt-1 text-sm text-gray-500">
              Lists all products where no front image has been uploaded. Use the Edit links to upload images directly.
            </p>
          </div>

          <button
            onClick={findProductsWithoutImages}
            disabled={noImageRunning}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-blue-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {noImageRunning ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Searching…</>
            ) : (
              <><ImageOff className="w-4 h-4" /> Find Products Without Images</>
            )}
          </button>

          {noImageProducts !== null && (
            noImageProducts.length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-green-700 font-medium">
                <CheckCircle className="w-4 h-4" />
                All products have a front image.
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  {noImageProducts.length} product{noImageProducts.length !== 1 ? "s" : ""} without a front image:
                </p>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-2.5 text-left">Name</th>
                        <th className="px-4 py-2.5 text-left">Sport</th>
                        <th className="px-4 py-2.5 text-left">Team</th>
                        <th className="px-4 py-2.5 text-left"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {noImageProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2.5 font-medium text-gray-900">{p.name}</td>
                          <td className="px-4 py-2.5 text-gray-500 capitalize">{p.sport ?? "—"}</td>
                          <td className="px-4 py-2.5 text-gray-500">{p.team ?? "—"}</td>
                          <td className="px-4 py-2.5">
                            <Link
                              href={`/admin/products/${p.id}/edit`}
                              className="text-blue-600 hover:text-blue-800 font-semibold"
                            >
                              Edit →
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
