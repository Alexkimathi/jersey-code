'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard } from '@/components/storefront/ProductCard';
import { Product, ProductVariant } from '@/lib/supabase/types';

const SPORTS = ['football', 'rugby', 'basketball', 'cricket'];
const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-slate-100 bg-white shadow-sm">
      <div className="h-64 skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-4 skeleton rounded-lg w-3/4" />
        <div className="h-3 skeleton rounded-lg w-1/2" />
        <div className="flex items-center justify-between pt-1">
          <div className="h-5 skeleton rounded-lg w-24" />
          <div className="h-8 w-8 skeleton rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function SearchClient() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [variants, setVariants] = useState<(ProductVariant & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sport, setSport] = useState(searchParams.get('sport') || '');
  const [team, setTeam] = useState(searchParams.get('team') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [size, setSize] = useState(searchParams.get('size') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  const query = searchParams.get('q') || '';

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (query) params.append('q', query);
        if (sport) params.append('sport', sport);
        if (team) params.append('team', team);
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);
        if (size) params.append('size', size);
        params.append('sort', sort);

        const res = await fetch(`/api/search?${params}`);
        const data = await res.json();

        if (data.error) {
          setError(data.error);
          setProducts([]);
        } else {
          const prods = data.products || [];
          setProducts(prods);

          const { createClient } = await import('@supabase/supabase-js');
          const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL || '',
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
          );
          if (prods.length > 0) {
            const productIds = prods.map((p: Product) => p.id);
            const { data: variantData } = await supabase
              .from('product_variants')
              .select('*')
              .in('product_id', productIds);
            setVariants(variantData || []);
          } else {
            setVariants([]);
          }
        }
      } catch {
        setError('Failed to search products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, sport, team, minPrice, maxPrice, size, sort]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">

        {/* Page header */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-500 mb-1">
            {query ? 'Search results' : 'Browse'}
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {query ? `"${query}"` : 'All Products'}
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Filters sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6 sticky top-24">
              <h2 className="text-base font-semibold text-slate-900">Filters</h2>

              {/* Sport */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-[0.15em] text-slate-400 mb-3">
                  Sport
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSport('')}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      sport === '' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All
                  </button>
                  {SPORTS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSport(sport === s ? '' : s)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all capitalize ${
                        sport === s ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Team */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-[0.15em] text-slate-400 mb-3">
                  Team
                </label>
                <input
                  type="text"
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  placeholder="Search team..."
                  className="w-full rounded-xl bg-slate-100 border-0 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
                />
              </div>

              {/* Price range */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-[0.15em] text-slate-400 mb-3">
                  Price (KES)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min"
                    className="w-1/2 rounded-xl bg-slate-100 border-0 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max"
                    className="w-1/2 rounded-xl bg-slate-100 border-0 px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
                  />
                </div>
              </div>

              {/* Size */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-[0.15em] text-slate-400 mb-3">
                  Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(size === s ? '' : s)}
                      className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
                        size === s
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-[0.15em] text-slate-400 mb-3">
                  Sort By
                </label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full rounded-xl bg-slate-100 border-0 px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="skeletons"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <p className="text-slate-400 text-sm">{error}</p>
                </motion.div>
              ) : products.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <p className="text-2xl font-bold text-slate-800 mb-2">No products found</p>
                  <p className="text-sm text-slate-400">Try adjusting your filters or search term.</p>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-sm text-slate-400 mb-6">
                    {products.length} product{products.length !== 1 ? 's' : ''} found
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {products.map((product, index) => {
                      const productVariants = variants.filter((v) => v.product_id === product.id);
                      return (
                        <div key={product.id} className="h-[420px]">
                          <ProductCard product={product} variants={productVariants} index={index} />
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
