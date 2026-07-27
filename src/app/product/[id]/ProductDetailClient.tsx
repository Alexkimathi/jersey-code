"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Product, ProductVariant } from "@/lib/supabase/types";
import { useCartStore } from "@/hooks/useCartStore";
import { TEAM_IMAGES } from "@/lib/teamImages";
import { getLeagueBadges, getBadgeLabel } from "@/lib/football-customization";
import { Button } from "@/components/ui/Button";
import { SizeGuideModal } from "@/components/storefront/SizeGuideModal";
import { getProductDescription, getProductDetailPoints } from "@/lib/product-descriptions";
import { ShoppingBag, Minus, Plus, ChevronDown } from "lucide-react";

interface ProductDetailClientProps {
  product: Product;
  variants: ProductVariant[];
}

const JERSEY_VIEWS = ["Front", "Back", "Side", "Badge"] as const;

const FONT_STYLES: Record<"league" | "team", React.CSSProperties> = {
  league:  { fontFamily: '"Impact","Arial Narrow",sans-serif', fontWeight: 900, letterSpacing: "0.06em" },
  team:    { fontFamily: '"Georgia","Times New Roman",serif',  fontWeight: 700, letterSpacing: "0.02em" },
};

export function ProductDetailClient({ product, variants }: ProductDetailClientProps) {
  const [selectedSize, setSelectedSize] = useState<string>(variants[0]?.size || "");
  const [quantity, setQuantity]         = useState(1);
  const [activeView, setActiveView]     = useState(0);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [descOpen, setDescOpen] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const teamExtra = product.team ? (TEAM_IMAGES[product.team] ?? {}) : {};
  const viewImages: (string | null)[] = [
    product.image_url      ?? null,
    product.back_image_url ?? teamExtra.back  ?? null,
    product.side_image_url ?? teamExtra.side  ?? null,
    product.badge_url      ?? teamExtra.badge ?? null,
  ];
  const activeImageUrl = viewImages[activeView] ?? null;

  // ── Which customizations apply ───────────────────────────────
  const isFootball = product.sport === "football";
  const isRugby    = product.sport === "rugby";

  // ── Customization state ──────────────────────────────────────

  // Badge (football only)
  const [badge, setBadge] = useState<string>("none");
  const badgeOptions = useMemo(() => getLeagueBadges(product.team), [product.team]);

  // Name & Number mode: none | personalize
  const [nameMode, setNameMode] = useState<"none" | "personalize">("none");

  // Personalize sub-state
  const [nameEnabled,   setNameEnabled]   = useState(false);
  const [numberEnabled, setNumberEnabled] = useState(false);
  const [printName,     setPrintName]     = useState("");
  const [printNumber,   setPrintNumber]   = useState("");

  // Font (shown when name/number active)
  const [fontType, setFontType] = useState<"league" | "team">("league");

  // ── Derived values ───────────────────────────────────────────
  const selectedVariant = variants.find((v) => v.size === selectedSize);
  const inStock = selectedVariant && selectedVariant.stock_quantity > 0;

  const activeName = useMemo(() => {
    if (nameMode === "personalize" && nameEnabled) return printName;
    return "";
  }, [nameMode, nameEnabled, printName]);

  const activeNumber = useMemo(() => {
    if (nameMode === "personalize" && numberEnabled) return printNumber;
    return "";
  }, [nameMode, numberEnabled, printNumber]);

  const addOnPrice = useMemo(() => {
    let total = 0;
    if (badge !== "none") total += 200;
    if (nameMode === "personalize") {
      if (nameEnabled)   total += 200;
      if (numberEnabled) total += 200;
    }
    return total;
  }, [badge, nameMode, nameEnabled, numberEnabled]);

  const totalPerItem = product.price + addOnPrice;

  // ── Add to cart ──────────────────────────────────────────────
  const handleAddToCart = () => {
    if (!selectedVariant || !inStock) return;

    const cartKey = [
      selectedVariant.id,
      badge,
      nameMode,
      activeName,
      activeNumber,
      fontType,
    ].join("::");

    addItem({
      productId:  product.id,
      variantId:  selectedVariant.id,
      cartKey,
      name:       product.name,
      size:       selectedSize,
      price:      product.price,
      quantity,
      image_url:  product.image_url,
      customization: {
        edition: "fan",
        badge,
        printName:   activeName   || undefined,
        printNumber: activeNumber || undefined,
        font:        (activeName || activeNumber) ? fontType : undefined,
        addOnPrice,
      },
    });
    setQuantity(1);
  };

  // ── Badge overlay label ──────────────────────────────────────
  const badgeOverlayLabel = badge !== "none" ? getBadgeLabel(badge, product.team) : "";

  return (
    <>
    <div className="grid gap-10 lg:grid-cols-[0.95fr_0.75fr] items-start">

      {/* ── Left: image + info tiles ── */}
      <div className="space-y-8">

        {/* Main image */}
        <div className="relative overflow-hidden rounded-[1.75rem] bg-gray-100 aspect-[4/3] shadow-sm">
          {activeImageUrl ? (
            <Image
              src={activeImageUrl}
              alt={`${product.name} — ${JERSEY_VIEWS[activeView]} view`}
              fill unoptimized
              className="object-contain p-6"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
              <svg className="w-10 h-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">{JERSEY_VIEWS[activeView]} view coming soon</span>
            </div>
          )}

          {/* Product badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {product.is_featured && (
              <span className="rounded-full bg-sky-500 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white shadow-sm">Featured</span>
            )}
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-widest text-slate-700 shadow-sm">{product.sport}</span>
          </div>

          {/* Badge overlay */}
          {badgeOverlayLabel && (
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-sm border border-slate-100">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 leading-none mb-0.5">Badge</p>
              <p className="text-xs font-bold text-slate-900">{badgeOverlayLabel}</p>
            </div>
          )}

          {/* Name/Number overlay (back view) */}
          {activeView === 1 && (activeName || activeNumber) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              {activeName && (
                <p className="text-white text-2xl drop-shadow-lg" style={FONT_STYLES[fontType]}>{activeName}</p>
              )}
              {activeNumber && (
                <p className="text-white text-5xl drop-shadow-lg leading-tight" style={FONT_STYLES[fontType]}>{activeNumber}</p>
              )}
            </div>
          )}
        </div>

        {/* Thumbnail strip */}
        {viewImages.some(Boolean) && (
          <div className="flex gap-3">
            {JERSEY_VIEWS.map((label, i) => {
              if (!viewImages[i]) return null;
              return (
                <button key={label} type="button" onClick={() => setActiveView(i)}
                  className={`relative flex-1 aspect-square rounded-xl overflow-hidden border-2 transition-all duration-150 ${
                    activeView === i ? "border-slate-900 shadow-sm" : "border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <Image src={viewImages[i]!} alt={`${label} view`} fill unoptimized className="object-contain p-2" sizes="10vw"/>
                  <span className={`absolute bottom-1 left-0 right-0 text-center text-[9px] font-bold uppercase tracking-wider ${activeView === i ? "text-slate-900" : "text-slate-400"}`}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Info tiles */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Team</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{product.team || "Official Jersey"}</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Base Price</p>
            <p className="mt-2 text-base font-semibold text-slate-900">KES {product.price.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Availability</p>
            <p className={`mt-2 text-base font-semibold ${selectedVariant && !inStock ? "text-red-600" : "text-slate-900"}`}>
              {selectedVariant ? (inStock ? "In Stock" : "Out of Stock") : "Select a size"}
            </p>
          </div>
        </div>
      </div>

      {/* ── Right: purchase panel ── */}
      <div className="rounded-[1.75rem] border border-slate-100 bg-white p-8 shadow-sm space-y-6">

        {/* Header */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-500">Official Jersey</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">{product.name}</h1>
          {product.team && <p className="mt-1.5 text-base text-slate-500">{product.team}</p>}
        </div>

        {/* Size */}
        {variants.length > 0 && (
          <div className="border-t border-slate-100 pt-5">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold text-slate-700">Size</label>
              <button type="button" onClick={() => setSizeGuideOpen(true)}
                className="text-xs font-semibold text-sky-500 hover:text-sky-600 transition-colors underline underline-offset-2">
                Size Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {variants.map((variant) => (
                <button key={variant.id} type="button" onClick={() => setSelectedSize(variant.size)}
                  disabled={variant.stock_quantity === 0}
                  className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                    selectedSize === variant.size
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  } ${variant.stock_quantity === 0 ? "opacity-40 cursor-not-allowed line-through" : ""}`}>
                  {variant.size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Customization (football only) ── */}
        {isFootball && (
          <div className="border-t border-slate-100 pt-5 space-y-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-500">Customize Your Jersey</p>

            {/* Name & Number */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Name &amp; Number</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {([
                  { value: "none",        label: "None" },
                  { value: "personalize", label: "Personalize" },
                ] as const).map((m) => (
                  <button key={m.value} type="button"
                    onClick={() => setNameMode(m.value)}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                      nameMode === m.value
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}>
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Personalize */}
              {nameMode === "personalize" && (
                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 space-y-4">
                  {/* Name */}
                  <div className="flex items-start gap-3">
                    <button type="button" onClick={() => setNameEnabled(!nameEnabled)}
                      className={`mt-0.5 flex-none w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                        nameEnabled ? "border-slate-900 bg-slate-900" : "border-slate-300 bg-white"
                      }`}>
                      {nameEnabled && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-sm font-semibold text-slate-700">Name <span className="text-slate-400 font-normal">+KES 200</span></p>
                        <span className="text-xs text-slate-400">max 10 chars</span>
                      </div>
                      <input type="text" disabled={!nameEnabled} value={printName}
                        onChange={e => setPrintName(e.target.value.toUpperCase().slice(0, 10))}
                        placeholder="e.g. OCHIENG"
                        className="w-full rounded-xl bg-white border border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-900 uppercase tracking-wide placeholder:normal-case placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40 disabled:opacity-40 disabled:cursor-not-allowed"/>
                    </div>
                  </div>

                  {/* Number */}
                  <div className="flex items-start gap-3">
                    <button type="button" onClick={() => setNumberEnabled(!numberEnabled)}
                      className={`mt-0.5 flex-none w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                        numberEnabled ? "border-slate-900 bg-slate-900" : "border-slate-300 bg-white"
                      }`}>
                      {numberEnabled && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-sm font-semibold text-slate-700">Number <span className="text-slate-400 font-normal">+KES 200</span></p>
                        <span className="text-xs text-slate-400">0–99</span>
                      </div>
                      <input type="number" min="0" max="99" disabled={!numberEnabled} value={printNumber}
                        onChange={e => setPrintNumber(e.target.value.slice(0, 2))}
                        placeholder="10"
                        className="w-full rounded-xl bg-white border border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400/40 disabled:opacity-40 disabled:cursor-not-allowed"/>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Font type — shows when name/number is active */}
            {(activeName || activeNumber) && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">Font Style</label>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { value: "league", label: "League Font", sub: "+KES 0" },
                    { value: "team",   label: "Team Font",   sub: "+KES 0" },
                  ] as const).map((f) => (
                    <button key={f.value} type="button" onClick={() => setFontType(f.value)}
                      className={`rounded-xl border p-3 text-left transition ${
                        fontType === f.value
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      }`}>
                      <p className="text-sm font-bold leading-tight" style={FONT_STYLES[f.value]}>
                        {activeName || "NAME"}
                      </p>
                      <p className={`text-[11px] mt-1 ${fontType === f.value ? "text-slate-300" : "text-slate-400"}`}>
                        {f.label} · {f.sub}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Badge */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Badge / Patch</label>
              <div className="flex flex-wrap gap-2">
                {badgeOptions.map((b) => (
                  <button key={b.value} type="button" onClick={() => setBadge(b.value)}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                      badge === b.value
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}>
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Rugby customization ── */}
        {isRugby && (
          <div className="border-t border-slate-100 pt-5 space-y-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-500">Customize Your Kit</p>

            {/* Name & Number */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Name &amp; Number</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {([
                  { value: "none",        label: "None" },
                  { value: "personalize", label: "Personalize" },
                ] as const).map((m) => (
                  <button key={m.value} type="button"
                    onClick={() => { setNameMode(m.value as "none" | "personalize"); setNameEnabled(false); setNumberEnabled(false); }}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                      nameMode === m.value
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}>
                    {m.label}
                  </button>
                ))}
              </div>

              {nameMode === "personalize" && (
                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 space-y-4">
                  {/* Name */}
                  <div className="flex items-start gap-3">
                    <button type="button" onClick={() => setNameEnabled(!nameEnabled)}
                      className={`mt-0.5 flex-none w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                        nameEnabled ? "border-slate-900 bg-slate-900" : "border-slate-300 bg-white"
                      }`}>
                      {nameEnabled && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-sm font-semibold text-slate-700">Name <span className="text-slate-400 font-normal">+KES 200</span></p>
                        <span className="text-xs text-slate-400">max 10 chars</span>
                      </div>
                      <input type="text" disabled={!nameEnabled} value={printName}
                        onChange={e => setPrintName(e.target.value.toUpperCase().slice(0, 10))}
                        placeholder="e.g. LOMU"
                        className="w-full rounded-xl bg-white border border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-900 uppercase tracking-wide placeholder:normal-case placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40 disabled:opacity-40 disabled:cursor-not-allowed"/>
                    </div>
                  </div>

                  {/* Number */}
                  <div className="flex items-start gap-3">
                    <button type="button" onClick={() => setNumberEnabled(!numberEnabled)}
                      className={`mt-0.5 flex-none w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                        numberEnabled ? "border-slate-900 bg-slate-900" : "border-slate-300 bg-white"
                      }`}>
                      {numberEnabled && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-sm font-semibold text-slate-700">Number <span className="text-slate-400 font-normal">+KES 200</span></p>
                        <span className="text-xs text-slate-400">1–99</span>
                      </div>
                      <input type="number" min="1" max="99" disabled={!numberEnabled} value={printNumber}
                        onChange={e => setPrintNumber(e.target.value.slice(0, 2))}
                        placeholder="7"
                        className="w-full rounded-xl bg-white border border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400/40 disabled:opacity-40 disabled:cursor-not-allowed"/>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Font — shown when name/number active */}
            {(activeName || activeNumber) && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">Font Style</label>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { value: "league", label: "League Font", sub: "+KES 0" },
                    { value: "team",   label: "Team Font",   sub: "+KES 0" },
                  ] as const).map((f) => (
                    <button key={f.value} type="button" onClick={() => setFontType(f.value)}
                      className={`rounded-xl border p-3 text-left transition ${
                        fontType === f.value
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      }`}>
                      <p className="text-sm font-bold leading-tight" style={FONT_STYLES[f.value]}>
                        {activeName || "NAME"}
                      </p>
                      <p className={`text-[11px] mt-1 ${fontType === f.value ? "text-slate-300" : "text-slate-400"}`}>
                        {f.label} · {f.sub}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quantity */}
        <div className="border-t border-slate-100 pt-5">
          <label className="block text-sm font-bold text-slate-700 mb-3">Quantity</label>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300">
              <Minus className="w-4 h-4" />
            </button>
            <span className="inline-flex min-w-[2.75rem] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-base font-bold text-slate-900">
              {quantity}
            </span>
            <button type="button" onClick={() => setQuantity(quantity + 1)}
              disabled={!!(selectedVariant && quantity >= selectedVariant.stock_quantity)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 disabled:opacity-40">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Price breakdown */}
        {addOnPrice > 0 && (
          <div className="rounded-2xl bg-sky-50 border border-sky-100 px-4 py-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Base price</span><span>KES {product.price.toLocaleString()}</span>
            </div>
            {badge !== "none" && (
              <div className="flex justify-between text-slate-500">
                <span>{getBadgeLabel(badge, product.team)} badge</span><span>+KES 200</span>
              </div>
            )}
            {nameMode === "personalize" && nameEnabled && (
              <div className="flex justify-between text-slate-500">
                <span>Name printing</span><span>+KES 200</span>
              </div>
            )}
            {nameMode === "personalize" && numberEnabled && (
              <div className="flex justify-between text-slate-500">
                <span>Number printing</span><span>+KES 200</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-slate-900 border-t border-sky-200 pt-1.5">
              <span>Total per item</span><span>KES {totalPerItem.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Add to cart */}
        <Button onClick={handleAddToCart} disabled={!selectedVariant || !inStock} size="lg" className="w-full">
          <ShoppingBag className="w-5 h-5 mr-2" />
          {!selectedVariant ? "Select a size" : !inStock ? "Out of Stock" : `Add to Cart — KES ${(totalPerItem * quantity).toLocaleString()}`}
        </Button>

        {selectedVariant && !inStock && (
          <p className="text-sm font-semibold text-red-600">This size is currently out of stock.</p>
        )}

        {/* Product description accordion */}
        <div className="border-t border-slate-100">
          <button type="button" onClick={() => setDescOpen(!descOpen)}
            className="w-full flex items-center justify-between py-4 text-left">
            <span className="text-sm font-bold text-slate-900">Product description</span>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${descOpen ? "rotate-180" : ""}`} />
          </button>
          {descOpen && (
            <div className="pb-4 space-y-4">
              <div className="space-y-3">
                {getProductDescription(product).split("\n\n").map((para, i) => (
                  <p key={i} className="text-sm text-slate-600 leading-relaxed">{para}</p>
                ))}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 mb-3">Details:</p>
                <ul className="space-y-2">
                  {getProductDetailPoints(product).map((point, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-slate-300 flex-none" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>


      </div>
    </div>

    {sizeGuideOpen && <SizeGuideModal onClose={() => setSizeGuideOpen(false)} />}
    </>
  );
}
