"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Product, ProductVariant, JerseyEdition, JerseyBadge } from "@/lib/supabase/types";
import { useCartStore } from "@/hooks/useCartStore";
import { Button } from "@/components/ui/Button";
import { ShoppingBag, Minus, Plus, ShieldCheck, Sparkles, Star } from "lucide-react";

interface ProductDetailClientProps {
  product: Product;
  variants: ProductVariant[];
}

const FONTS: { name: string; style: React.CSSProperties }[] = [
  { name: "Block",   style: { fontFamily: '"Impact","Arial Narrow",sans-serif', fontWeight: 900, letterSpacing: "0.04em" } },
  { name: "Classic", style: { fontFamily: '"Georgia","Times New Roman",serif', fontWeight: 700, letterSpacing: "0.02em" } },
  { name: "Slim",    style: { fontFamily: '"Arial",sans-serif', fontWeight: 700, letterSpacing: "0.14em" } },
  { name: "Modern",  style: { fontFamily: '"Helvetica Neue","Arial",sans-serif', fontWeight: 900, letterSpacing: "-0.02em" } },
];

const PRINT_COLORS = [
  { name: "White", hex: "#FFFFFF", ring: "border-slate-300" },
  { name: "Black", hex: "#0F172A", ring: "border-slate-700" },
  { name: "Gold",  hex: "#D4AF37", ring: "border-yellow-500" },
  { name: "Navy",  hex: "#001F5B", ring: "border-blue-900" },
  { name: "Red",   hex: "#CC0000", ring: "border-red-600" },
];

const BADGES: { value: JerseyBadge; label: string }[] = [
  { value: "none",   label: "No Badge" },
  { value: "league", label: "League Badge  +KES 200" },
  { value: "crest",  label: "Club Crest  +KES 200" },
];

export function ProductDetailClient({ product, variants }: ProductDetailClientProps) {
  const [selectedSize, setSelectedSize] = useState<string>(variants[0]?.size || "");
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  // Customization state
  const [edition, setEdition]         = useState<JerseyEdition>("fan");
  const [printEnabled, setPrintEnabled] = useState(false);
  const [printName, setPrintName]     = useState("");
  const [printNumber, setPrintNumber] = useState("");
  const [font, setFont]               = useState("Block");
  const [printColor, setPrintColor]   = useState("White");
  const [badge, setBadge]             = useState<JerseyBadge>("none");

  const selectedVariant = variants.find((v) => v.size === selectedSize);
  const inStock = selectedVariant && selectedVariant.stock_quantity > 0;

  const addOnPrice = useMemo(() => {
    let total = 0;
    if (edition === "player") total += 1500;
    if (printEnabled)          total += 700;
    if (badge !== "none")      total += 200;
    return total;
  }, [edition, printEnabled, badge]);

  const totalPerItem = product.price + addOnPrice;

  const handleAddToCart = () => {
    if (!selectedVariant || !inStock) return;

    const cartKey = [
      selectedVariant.id,
      edition,
      printEnabled ? printName : "",
      printEnabled ? printNumber : "",
      printEnabled ? font : "",
      printEnabled ? printColor : "",
      badge,
    ].join("::");

    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      cartKey,
      name: product.name,
      size: selectedSize,
      price: product.price,
      quantity,
      image_url: product.image_url,
      customization: {
        edition,
        printName:   printEnabled && printName   ? printName   : undefined,
        printNumber: printEnabled && printNumber ? printNumber : undefined,
        font:        printEnabled ? font       : undefined,
        printColor:  printEnabled ? printColor : undefined,
        badge,
        addOnPrice,
      },
    });
    setQuantity(1);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[0.95fr_0.75fr] items-start">
      {/* Left — image + info tiles */}
      <div className="space-y-8">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-gray-100 aspect-[4/3] shadow-sm">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              No Image Available
            </div>
          )}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {product.is_featured && (
              <span className="rounded-full bg-sky-500 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white shadow-sm">
                Featured
              </span>
            )}
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-widest text-slate-700 shadow-sm">
              {product.sport}
            </span>
          </div>
        </div>

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

      {/* Right — purchase panel */}
      <div className="rounded-[1.75rem] border border-slate-100 bg-white p-8 shadow-sm space-y-6">

        {/* Header */}
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-500">Official Jersey</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">{product.name}</h1>
          {product.team && <p className="mt-1.5 text-base text-slate-500">{product.team}</p>}
        </div>

        {product.description && (
          <p className="text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-5">{product.description}</p>
        )}

        {/* Size */}
        {variants.length > 0 && (
          <div className="border-t border-slate-100 pt-5">
            <label className="block text-sm font-bold text-slate-700 mb-3">Size</label>
            <div className="flex flex-wrap gap-2">
              {variants.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => setSelectedSize(variant.size)}
                  disabled={variant.stock_quantity === 0}
                  className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                    selectedSize === variant.size
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  } ${variant.stock_quantity === 0 ? "opacity-40 cursor-not-allowed line-through" : ""}`}
                >
                  {variant.size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Customization ── */}
        <div className="border-t border-slate-100 pt-5 space-y-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-500">Customize Your Jersey</p>

          {/* Edition */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">Edition</label>
            <div className="grid grid-cols-2 gap-2">
              {([
                { value: "fan",    label: "Fan Edition",       sub: "Replica · standard fit" },
                { value: "player", label: "Player Authentic",  sub: "+KES 1,500 · match quality" },
              ] as const).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setEdition(opt.value)}
                  className={`rounded-xl border p-3.5 text-left transition ${
                    edition === opt.value
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <p className="text-sm font-bold leading-tight">{opt.label}</p>
                  <p className={`text-[11px] mt-0.5 ${edition === opt.value ? "text-slate-300" : "text-slate-400"}`}>{opt.sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Print toggle */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-bold text-slate-700">Name &amp; Number Printing</p>
                {!printEnabled && <p className="text-xs text-slate-400 mt-0.5">+KES 700 — printed on the back</p>}
              </div>
              <button
                type="button"
                aria-pressed={printEnabled}
                onClick={() => setPrintEnabled(!printEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400/50 ${
                  printEnabled ? "bg-slate-900" : "bg-slate-200"
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  printEnabled ? "translate-x-6" : "translate-x-1"
                }`} />
              </button>
            </div>

            {printEnabled && (
              <div className="mt-3 rounded-2xl bg-slate-50 p-4 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Name on back <span className="font-normal text-slate-400">(max 14 chars)</span>
                  </label>
                  <input
                    type="text"
                    value={printName}
                    onChange={(e) => setPrintName(e.target.value.toUpperCase().slice(0, 14))}
                    placeholder="e.g. MESSI"
                    className="w-full rounded-xl bg-white border border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-900 uppercase tracking-wide placeholder:normal-case placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
                  />
                </div>

                {/* Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Number <span className="font-normal text-slate-400">(1–99)</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={printNumber}
                    onChange={(e) => setPrintNumber(e.target.value)}
                    placeholder="10"
                    className="w-full rounded-xl bg-white border border-slate-200 px-3 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
                  />
                </div>

                {/* Font */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">Font Style</label>
                  <div className="grid grid-cols-4 gap-2">
                    {FONTS.map((f) => (
                      <button
                        key={f.name}
                        type="button"
                        onClick={() => setFont(f.name)}
                        className={`rounded-xl border py-3 text-center transition ${
                          font === f.name
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <span className="block text-base leading-tight" style={f.style}>
                          {printNumber || "10"}
                        </span>
                        <span className="block text-[10px] mt-1 font-medium opacity-80">{f.name}</span>
                      </button>
                    ))}
                  </div>
                  {(printName || printNumber) && (
                    <div className="mt-3 rounded-xl bg-white border border-slate-200 py-3 text-center">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Preview</p>
                      <p className="text-slate-900 text-xl" style={FONTS.find((f2) => f2.name === font)?.style}>
                        {printName && <span className="block">{printName}</span>}
                        {printNumber && <span className="block text-3xl">{printNumber}</span>}
                      </p>
                    </div>
                  )}
                </div>

                {/* Color */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">Print Color</label>
                  <div className="flex gap-2.5">
                    {PRINT_COLORS.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        title={c.name}
                        onClick={() => setPrintColor(c.name)}
                        className={`w-8 h-8 rounded-full border-2 transition ${c.ring} ${
                          printColor === c.name ? "ring-2 ring-sky-500 ring-offset-2" : ""
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5">Selected: {printColor}</p>
                </div>
              </div>
            )}
          </div>

          {/* Badge */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">Badge / Patch</label>
            <div className="flex flex-wrap gap-2">
              {BADGES.map((b) => (
                <button
                  key={b.value}
                  type="button"
                  onClick={() => setBadge(b.value)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                    badge === b.value
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quantity */}
        <div className="border-t border-slate-100 pt-5">
          <label className="block text-sm font-bold text-slate-700 mb-3">Quantity</label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="inline-flex min-w-[2.75rem] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-base font-bold text-slate-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              disabled={!!(selectedVariant && quantity >= selectedVariant.stock_quantity)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 disabled:opacity-40"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Price breakdown */}
        {addOnPrice > 0 && (
          <div className="rounded-2xl bg-sky-50 border border-sky-100 px-4 py-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Base price</span>
              <span>KES {product.price.toLocaleString()}</span>
            </div>
            {edition === "player" && (
              <div className="flex justify-between text-slate-500">
                <span>Player Authentic</span>
                <span>+KES 1,500</span>
              </div>
            )}
            {printEnabled && (
              <div className="flex justify-between text-slate-500">
                <span>Name &amp; number printing</span>
                <span>+KES 700</span>
              </div>
            )}
            {badge !== "none" && (
              <div className="flex justify-between text-slate-500">
                <span>Badge / patch</span>
                <span>+KES 200</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-slate-900 border-t border-sky-200 pt-1.5">
              <span>Total per item</span>
              <span>KES {totalPerItem.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Add to cart */}
        <Button
          onClick={handleAddToCart}
          disabled={!selectedVariant || !inStock}
          size="lg"
          className="w-full"
        >
          <ShoppingBag className="w-5 h-5 mr-2" />
          {!selectedVariant ? "Select a size" : !inStock ? "Out of Stock" : `Add to Cart — KES ${(totalPerItem * quantity).toLocaleString()}`}
        </Button>

        {selectedVariant && !inStock && (
          <p className="text-sm font-semibold text-red-600">This size is currently out of stock.</p>
        )}

        {/* Trust badges */}
        <div className="space-y-3.5 border-t border-slate-100 pt-5 text-sm text-slate-500">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 text-sky-500 flex-none" />
            <span><strong className="text-slate-800">Authentic quality</strong> — genuine fabric and stitching built for fans</span>
          </div>
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-4 w-4 text-sky-500 flex-none" />
            <span><strong className="text-slate-800">Professional printing</strong> — heat-pressed, wash-resistant lettering</span>
          </div>
          <div className="flex items-start gap-3">
            <Star className="mt-0.5 h-4 w-4 text-sky-500 flex-none" />
            <span><strong className="text-slate-800">Free delivery</strong> on orders over KES 5,000</span>
          </div>
        </div>
      </div>
    </div>
  );
}
