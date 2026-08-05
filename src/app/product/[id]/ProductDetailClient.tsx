"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Product, ProductVariant } from "@/lib/supabase/types";
import { useCartStore } from "@/hooks/useCartStore";
import { TEAM_IMAGES } from "@/lib/teamImages";
import { BADGE_OPTIONS, NATIONAL_BADGE_OPTIONS, getBadgeLabel, getBadgePrice } from "@/lib/football-customization";
import { Button } from "@/components/ui/Button";
import { SizeGuideModal } from "@/components/storefront/SizeGuideModal";
import { getProductDescription } from "@/lib/product-descriptions";
import { ShoppingBag, Minus, Plus, ChevronDown } from "lucide-react";

interface ProductDetailClientProps {
  product: Product;
  variants: ProductVariant[];
}

const JERSEY_VIEWS = ["Front", "Back", "Side", "Badge"] as const;

const FONT_STYLES: Record<"league" | "team", React.CSSProperties> = {
  league:  { fontFamily: '"Impact","Arial Narrow",sans-serif', fontWeight: 900, letterSpacing: "0.08em" },
  team:    { fontFamily: '"Impact","Arial Narrow",sans-serif', fontWeight: 700, letterSpacing: "0.03em" },
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
  const isTracksuit    = product.name.toLowerCase().includes("tracksuit");
  const isFootball     = product.sport === "football" && !isTracksuit;
  const isRugby        = product.sport === "rugby"    && !isTracksuit;
  const isNationalTeam = product.sub_category === "national";
  const isKids         = product.sub_category === "world_kids";
  const isTracksuitHoodie = product.sub_category === "world_tracksuit";
  // Kids and tracksuits have no badge option; national teams have a limited set
  const hideBadges = isKids || isTracksuitHoodie;
  // Font style hidden for national/kids/tracksuits (name-number still allowed but no font choice)
  const hideExtraCustomization = isNationalTeam || isKids || isTracksuitHoodie;
  // Which badge list to display
  const activeBadgeList = isNationalTeam ? NATIONAL_BADGE_OPTIONS : BADGE_OPTIONS;

  // ── Customization state ──────────────────────────────────────

  // Badge (football only) — multi-select
  const [badges, setBadges] = useState<string[]>([]);
  const [badgeOpen, setBadgeOpen] = useState(false);
  const [badgeLimitMsg, setBadgeLimitMsg] = useState(false);

  function toggleBadge(value: string) {
    setBadges((prev) => {
      if (prev.includes(value)) return prev.filter((b) => b !== value);
      if (prev.length >= 3) {
        setBadgeLimitMsg(true);
        setTimeout(() => setBadgeLimitMsg(false), 2500);
        return prev;
      }
      return [...prev, value];
    });
  }

  // Name & Number mode: none | personalize
  const [nameMode, setNameMode] = useState<"none" | "personalize">("none");

  // Personalize sub-state
  const [nameEnabled,   setNameEnabled]   = useState(false);
  const [numberEnabled, setNumberEnabled] = useState(false);
  const [printName,     setPrintName]     = useState("");
  const [printNumber,   setPrintNumber]   = useState("");

  // Font (shown when name/number active)
  const [fontType, setFontType] = useState<"league" | "team">("league");

  // Validation errors shown after a failed add-to-cart attempt
  const [showErrors, setShowErrors] = useState(false);

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
    for (const b of badges) {
      total += getBadgePrice(b);
    }
    if (nameMode === "personalize") {
      if (nameEnabled && printName.trim())     total += 200;
      if (numberEnabled && printNumber.trim()) total += 200;
    }
    return total;
  }, [badges, nameMode, nameEnabled, numberEnabled, printName, printNumber]);

  const totalPerItem = product.price + addOnPrice;

  // ── Add to cart ──────────────────────────────────────────────
  const handleAddToCart = () => {
    if (!selectedVariant || !inStock) return;
    if (nameMode === "personalize") {
      const hasError =
        (nameEnabled && !printName.trim()) ||
        (numberEnabled && !printNumber.trim());
      if (hasError) {
        setShowErrors(true);
        return;
      }
    }
    setShowErrors(false);

    const cartKey = [
      selectedVariant.id,
      badges.join(","),
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
        badge:   badges[0] ?? "none",
        badges:  badges.length > 0 ? badges : undefined,
        printName:   activeName   || undefined,
        printNumber: activeNumber || undefined,
        font:        (activeName || activeNumber) ? fontType : undefined,
        addOnPrice,
      },
    });
    setQuantity(1);
  };

  // ── Badge overlay label ──────────────────────────────────────
  const badgeOverlayLabel = badges.length > 0 ? badges.map((b) => getBadgeLabel(b, product.team)).join(", ") : "";

  return (
    <>
    <div className="grid gap-6 lg:grid-cols-[0.95fr_0.75fr] items-start">

      {/* ── Left: image + thumbnails ── */}
      <div className="space-y-3">

        {/* Main image */}
        <div className="relative overflow-hidden rounded-[1.75rem] bg-gray-100 aspect-[4/3] shadow-sm">
          {activeImageUrl ? (
            <Image
              src={activeImageUrl}
              alt={`${product.name} — ${JERSEY_VIEWS[activeView]} view`}
              fill unoptimized
              className="object-contain"
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
          <div className="flex gap-2">
            {JERSEY_VIEWS.map((label, i) => {
              if (!viewImages[i]) return null;
              return (
                <button key={label} type="button" onClick={() => setActiveView(i)}
                  className={`relative w-20 h-20 flex-none rounded-lg overflow-hidden border-2 transition-all duration-150 ${
                    activeView === i ? "border-slate-900 shadow-sm" : "border-slate-200 hover:border-slate-400"
                  }`}
                >
                  <Image src={viewImages[i]!} alt={`${label} view`} fill unoptimized className="object-contain" sizes="10vw"/>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Right: purchase panel ── */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">

        {/* Header */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-500">Official Jersey</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">{product.name}</h1>
          {product.team && <p className="mt-1 text-sm text-slate-500">{product.team}</p>}
          <p className="mt-2 text-xl font-bold text-slate-900">KES {Math.round(product.price).toLocaleString()}</p>
        </div>

        {/* Size */}
        {variants.length > 0 && (
          <div className="border-t border-slate-100 pt-3">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold text-slate-700">Size</label>
              {product.sport !== "accessories" && (
                <button type="button" onClick={() => setSizeGuideOpen(true)}
                  className="text-xs font-semibold text-sky-500 hover:text-sky-600 transition-colors underline underline-offset-2">
                  Size Guide
                </button>
              )}
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
          <div className="border-t border-slate-100 pt-3 space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-500">Customize Your Jersey</p>

            {/* Name & Number */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Name &amp; Number</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {([
                  { value: "none",        label: "None" },
                  { value: "personalize", label: "Personalize" },
                ] as const).map((m) => (
                  <button key={m.value} type="button"
                    onClick={() => { setNameMode(m.value); setShowErrors(false); }}
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
                        <span className="text-xs text-slate-400">max 15 chars</span>
                      </div>
                      <input type="text" disabled={!nameEnabled} value={printName}
                        onChange={e => { setPrintName(e.target.value.toUpperCase().slice(0, 15)); setShowErrors(false); }}
                        placeholder="e.g. OCHIENG"
                        className={`w-full rounded-xl bg-white border px-3 py-2.5 text-sm font-bold text-slate-900 uppercase tracking-wide placeholder:normal-case placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:opacity-40 disabled:cursor-not-allowed ${
                          showErrors && nameEnabled && !printName.trim()
                            ? "border-red-400 focus:ring-red-400/40"
                            : "border-slate-200 focus:ring-sky-400/40"
                        }`}/>
                      {showErrors && nameEnabled && !printName.trim() && (
                        <p className="mt-1.5 text-xs font-semibold text-red-500">Please enter the name you want printed on the jersey.</p>
                      )}
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
                      <input type="text" inputMode="numeric" disabled={!numberEnabled} value={printNumber}
                        onChange={e => { setPrintNumber(e.target.value.replace(/\D/g, "").slice(0, 2)); setShowErrors(false); }}
                        placeholder="10"
                        className={`w-full rounded-xl bg-white border px-3 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 disabled:opacity-40 disabled:cursor-not-allowed ${
                          showErrors && numberEnabled && !printNumber.trim()
                            ? "border-red-400 focus:ring-red-400/40"
                            : "border-slate-200 focus:ring-sky-400/40"
                        }`}/>
                      {showErrors && numberEnabled && !printNumber.trim() && (
                        <p className="mt-1.5 text-xs font-semibold text-red-500">Please enter the number you want printed on the jersey.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Font type — shows when name/number is active (not for national team jerseys) */}
            {(activeName || activeNumber) && !hideExtraCustomization && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Font Style</label>
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
                        {f.label.toUpperCase()}
                      </p>
                      {(activeName || activeNumber) && (
                        <p className="text-[11px] font-semibold leading-tight mt-0.5" style={FONT_STYLES[f.value]}>
                          {[activeName, activeNumber].filter(Boolean).join(" · ")}
                        </p>
                      )}
                      <p className={`text-[11px] mt-1 ${fontType === f.value ? "text-slate-300" : "text-slate-400"}`}>
                        {f.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Badge — hidden for kids and tracksuits; national teams get a limited set */}
            {!hideBadges && (
              <div>
                {/* Toggle row */}
                <button type="button" onClick={() => { setBadgeOpen((o) => !o); if (badgeOpen) setBadges([]); }}
                  className="flex items-center gap-3 w-full group">
                  {/* Checkbox */}
                  <span className={`flex h-5 w-5 flex-none items-center justify-center rounded border-2 transition ${
                    badgeOpen ? "border-blue-500 bg-blue-500" : "border-slate-300 bg-white group-hover:border-blue-400"
                  }`}>
                    {badgeOpen && (
                      <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>
                  <div className="text-left">
                    <p className="text-sm font-bold text-blue-600">Add Sleeve Badge</p>
                    {badgeOpen && <p className="text-[11px] text-slate-400">Add a little flair to your wear</p>}
                  </div>
                </button>

                {/* Badge list */}
                {badgeOpen && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-blue-500">Choose your badge/s</p>
                      <p className={`text-[11px] font-semibold ${badges.length >= 3 ? "text-red-400" : "text-slate-400"}`}>
                        {badges.length}/3 max
                      </p>
                    </div>
                    {badgeLimitMsg && (
                      <p className="text-[11px] font-semibold text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-2">
                        You can only select a maximum of 3 sleeve badges.
                      </p>
                    )}
                    <div className="rounded-xl border border-blue-100 overflow-hidden divide-y divide-blue-50">
                      {activeBadgeList.map((b) => {
                        const isChecked = badges.includes(b.value);
                        const isAtLimit = !isChecked && badges.length >= 3;
                        return (
                          <button key={b.value} type="button" onClick={() => toggleBadge(b.value)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-xs transition ${
                              isAtLimit ? "bg-white opacity-40 cursor-not-allowed" : isChecked ? "bg-blue-50" : "bg-white hover:bg-blue-50"
                            }`}>
                            {/* Checkbox */}
                            <span className={`flex h-4 w-4 flex-none items-center justify-center rounded border-2 transition ${
                              isChecked ? "border-blue-500 bg-blue-500" : "border-slate-300"
                            }`}>
                              {isChecked && (
                                <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 12 12" fill="none">
                                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )}
                            </span>
                            <span className="flex-1 font-medium text-blue-700">
                              {b.label}
                            </span>
                            <span className="text-blue-400">
                              +KSh {b.price}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Rugby customization ── */}
        {isRugby && (
          <div className="border-t border-slate-100 pt-3 space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-500">Customize Your Kit</p>

            {/* Name & Number */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Name &amp; Number</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {([
                  { value: "none",        label: "None" },
                  { value: "personalize", label: "Personalize" },
                ] as const).map((m) => (
                  <button key={m.value} type="button"
                    onClick={() => { setNameMode(m.value as "none" | "personalize"); setNameEnabled(false); setNumberEnabled(false); setShowErrors(false); }}
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
                        <span className="text-xs text-slate-400">max 15 chars</span>
                      </div>
                      <input type="text" disabled={!nameEnabled} value={printName}
                        onChange={e => { setPrintName(e.target.value.toUpperCase().slice(0, 15)); setShowErrors(false); }}
                        placeholder="e.g. LOMU"
                        className={`w-full rounded-xl bg-white border px-3 py-2.5 text-sm font-bold text-slate-900 uppercase tracking-wide placeholder:normal-case placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:ring-2 disabled:opacity-40 disabled:cursor-not-allowed ${
                          showErrors && nameEnabled && !printName.trim()
                            ? "border-red-400 focus:ring-red-400/40"
                            : "border-slate-200 focus:ring-sky-400/40"
                        }`}/>
                      {showErrors && nameEnabled && !printName.trim() && (
                        <p className="mt-1.5 text-xs font-semibold text-red-500">Please enter the name you want printed on the kit.</p>
                      )}
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
                      <input type="text" inputMode="numeric" disabled={!numberEnabled} value={printNumber}
                        onChange={e => { setPrintNumber(e.target.value.replace(/\D/g, "").slice(0, 2)); setShowErrors(false); }}
                        placeholder="7"
                        className={`w-full rounded-xl bg-white border px-3 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 disabled:opacity-40 disabled:cursor-not-allowed ${
                          showErrors && numberEnabled && !printNumber.trim()
                            ? "border-red-400 focus:ring-red-400/40"
                            : "border-slate-200 focus:ring-sky-400/40"
                        }`}/>
                      {showErrors && numberEnabled && !printNumber.trim() && (
                        <p className="mt-1.5 text-xs font-semibold text-red-500">Please enter the number you want printed on the kit.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Font — shown when name/number active */}
            {(activeName || activeNumber) && !hideExtraCustomization && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Font Style</label>
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
                        {f.label.toUpperCase()}
                      </p>
                      {(activeName || activeNumber) && (
                        <p className="text-[11px] font-semibold leading-tight mt-0.5" style={FONT_STYLES[f.value]}>
                          {[activeName, activeNumber].filter(Boolean).join(" · ")}
                        </p>
                      )}
                      <p className={`text-[11px] mt-1 ${fontType === f.value ? "text-slate-300" : "text-slate-400"}`}>
                        {f.label}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quantity */}
        <div className="border-t border-slate-100 pt-3">
          <label className="block text-sm font-bold text-slate-700 mb-2">Quantity</label>
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
              <span>Base price</span><span>KES {Math.round(product.price).toLocaleString()}</span>
            </div>
            {badges.map((b) => (
              <div key={b} className="flex justify-between text-slate-500">
                <span>{getBadgeLabel(b, product.team)}</span>
                <span>+KES {getBadgePrice(b)}</span>
              </div>
            ))}
            {nameMode === "personalize" && nameEnabled && printName.trim() && (
              <div className="flex justify-between text-slate-500">
                <span>Name printing</span><span>+KES 200</span>
              </div>
            )}
            {nameMode === "personalize" && numberEnabled && printNumber.trim() && (
              <div className="flex justify-between text-slate-500">
                <span>Number printing</span><span>+KES 200</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-slate-900 border-t border-sky-200 pt-1.5">
              <span>Total per item</span><span>KES {Math.round(totalPerItem).toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Add to cart */}
        <Button onClick={handleAddToCart} disabled={!selectedVariant || !inStock} size="lg" className="w-full">
          <ShoppingBag className="w-5 h-5 mr-2" />
          {!selectedVariant ? "Select a size" : !inStock ? "Out of Stock" : `Add to Cart — KES ${Math.round(totalPerItem * quantity).toLocaleString()}`}
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
            <div className="pb-4 space-y-3">
              {getProductDescription(product).split("\n\n").map((para, i) => (
                <p key={i} className="text-sm text-slate-600 leading-relaxed">{para}</p>
              ))}
            </div>
          )}
        </div>

        {/* Washing guide */}
        <div className="border-t border-slate-100 pt-4 pb-2">
          <p className="text-sm font-bold text-slate-900 mb-3">Washing &amp; care guide</p>
          <ul className="space-y-2.5">
            {[
              "Do not wash in a washing machine.",
              "Do not iron the shirt, shorts, or any other apparel.",
              "Avoid squeezing the clothes while washing.",
              "Do not use a brush on stickers.",
              "Always dry inside out.",
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2.5 text-sm text-slate-600">
                <span className="mt-1.5 flex-none w-1.5 h-1.5 rounded-full bg-sky-400"/>
                {tip}
              </li>
            ))}
          </ul>
        </div>


      </div>
    </div>

    {sizeGuideOpen && <SizeGuideModal onClose={() => setSizeGuideOpen(false)} />}
    </>
  );
}
