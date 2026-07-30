"use client";

import { useState } from "react";
import { X, ArrowLeft, ArrowRight, Ruler } from "lucide-react";

interface SizeGuideModalProps {
  onClose: () => void;
}

type Unit      = "cm" | "in";
type View      = "guide" | "profile" | "result";
type HeightUnit = "ft" | "cm";
type WeightUnit = "kg" | "lb";
type Preference = "men" | "unisex";

// ── Size data ─────────────────────────────────────────────────────────────────

const MEN_SIZES  = ["S", "M", "L", "XL", "2XL"];
const KIDS_SIZES = ["16", "18", "20", "22", "24", "26", "28"];

type Rows = Record<Unit, { label: string; values: string[] }[]>;

const MEN_JERSEY_ROWS: Rows = {
  cm: [
    { label: "Chest",        values: ["82–90",   "90–98",   "98–106",  "106–114", "114–120"] },
    { label: "½ Length",     values: ["50",      "52",      "54",      "56",      "58"     ] },
    { label: "Shirt Length", values: ["69",      "71",      "73",      "75",      "77"     ] },
    { label: "Height",       values: ["160–170", "170–185", "178–192", "182–195", "190–210"] },
  ],
  in: [
    { label: "Chest",        values: ['32–35"', '35–39"', '39–42"', '42–45"', '45–47"'] },
    { label: "½ Length",     values: ['20"',   '20.5"',  '21"',    '22"',    '23"'   ] },
    { label: "Shirt Length", values: ['27"',   '28"',    '29"',    '29.5"',  '30"'   ] },
    { label: "Height",       values: ['63–67"', '67–73"', '70–76"', '72–77"', '75–83"'] },
  ],
};

const KIDS_ROWS: Rows = {
  cm: [
    { label: "½ Chest",       values: ["32",     "34",     "36",      "38",      "40",      "42",      "44"     ] },
    { label: "Shirt Length",  values: ["43",     "47",     "50",      "53",      "56",      "58",      "61"     ] },
    { label: "Shorts Length", values: ["32",     "34",     "36",      "38",      "39",      "40",      "43"     ] },
    { label: "½ Waist",       values: ["20–37",  "21–39",  "22–41",   "23–42",   "24–44",   "25–47",   "26–50"  ] },
    { label: "Rec. Age",      values: ["2–3",    "3–4",    "4–5",     "6–7",     "8–9",     "10–11",   "12–13"  ] },
    { label: "Rec. Height",   values: ["95–105", "105–115","115–125", "125–135", "135–145", "145–155", "155–166"] },
  ],
  in: [
    { label: "½ Chest",       values: ['12.5"', '13.5"', '14"',    '15"',    '15.5"',  '16.5"',  '17"'    ] },
    { label: "Shirt Length",  values: ['17"',   '18.5"', '19.5"',  '21"',    '22"',    '23"',    '24"'    ] },
    { label: "Shorts Length", values: ['12.5"', '13.5"', '14"',    '15"',    '15.5"',  '16"',    '17"'    ] },
    { label: "½ Waist",       values: ['8–14.5"','8.5–15"','8.5–16"','9–16.5"','9.5–17"','10–18.5"','10–20"'] },
    { label: "Rec. Age",      values: ["2–3",   "3–4",   "4–5",    "6–7",    "8–9",    "10–11",  "12–13"  ] },
    { label: "Rec. Height",   values: ['37–41"','41–45"','45–49"', '49–53"', '53–57"', '57–61"', '61–65"' ] },
  ],
};

// ── Size recommendation ───────────────────────────────────────────────────────

function recommendSize(heightCm: number, weightKg: number) {
  const bmi = weightKg / Math.pow(heightCm / 100, 2);

  let idx: number;
  if      (heightCm < 168.5) idx = 0; // S
  else if (heightCm < 173.5) idx = 1; // M
  else if (heightCm < 178.5) idx = 2; // L
  else if (heightCm < 183.5) idx = 3; // XL
  else                        idx = 4; // 2XL
  if (bmi > 27 && idx < 4) idx++;
  else if (bmi < 18.5 && idx > 0) idx--;
  return MEN_SIZES[idx];
}

// ── Table component ───────────────────────────────────────────────────────────

function SizeTable({ rows, sizes }: { rows: { label: string; values: string[] }[]; sizes: string[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-100">
      <table className="text-sm" style={{ minWidth: "max-content", width: "100%" }}>
        <thead>
          <tr className="bg-slate-900">
            <th className="px-3 py-2.5 text-left font-bold text-white whitespace-nowrap">Measurement</th>
            {sizes.map((s) => (
              <th key={s} className="px-3 py-2.5 text-center font-bold text-white whitespace-nowrap">{s}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, i) => (
            <tr key={row.label} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
              <td className="px-3 py-2.5 font-semibold text-slate-700 whitespace-nowrap">{row.label}</td>
              {row.values.map((v, j) => (
                <td key={j} className="px-3 py-2.5 text-center text-slate-600 whitespace-nowrap">{v}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function SizeGuideModal({ onClose }: SizeGuideModalProps) {
  const [view, setView] = useState<View>("guide");
  const [unit, setUnit] = useState<Unit>("cm");

  // Profile form state
  const [heightUnit, setHeightUnit] = useState<HeightUnit>("cm");
  const [heightCm,   setHeightCm]   = useState("");
  const [heightFt,   setHeightFt]   = useState("");
  const [heightIn,   setHeightIn]   = useState("");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");
  const [weightVal,  setWeightVal]  = useState("");
  const [age,        setAge]        = useState("");
  const [pref,       setPref]       = useState<Preference>("men");

  // Result
  const [result, setResult] = useState<string | null>(null);

  function handleFindSize() {
    const hCm = heightUnit === "cm"
      ? parseFloat(heightCm)
      : (parseFloat(heightFt) || 0) * 30.48 + (parseFloat(heightIn) || 0) * 2.54;
    const wKg = weightUnit === "kg"
      ? parseFloat(weightVal)
      : parseFloat(weightVal) * 0.453592;

    if (!hCm || !wKg || hCm < 50 || hCm > 250 || wKg < 20 || wKg > 300) {
      setResult(null);
    } else {
      setResult(recommendSize(hCm, wKg));
    }
    setView("result");
  }

  const canSubmit = heightUnit === "cm"
    ? !!heightCm
    : !!(heightFt || heightIn);

  const headerTitle =
    view === "guide"   ? "Size Guide" :
    view === "profile" ? "Size Profile" :
                         "Find Your Size";

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Size Guide">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md bg-white h-full flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 flex-none">
          <div className="flex items-center gap-3">
            {view !== "guide" && (
              <button
                type="button"
                onClick={() => setView(view === "result" ? "profile" : "guide")}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 transition"
                aria-label="Back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h2 className="text-sm font-extrabold uppercase tracking-[0.2em] text-slate-900">{headerTitle}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 transition"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── GUIDE VIEW ── */}
        {view === "guide" && (
          <div className="overflow-y-auto flex-1 px-6 py-6 space-y-7">

            {/* Find your size card */}
            <div className="rounded-2xl border border-slate-200 p-5 flex items-start gap-4">
              <div className="flex-none w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                <Ruler className="w-5 h-5 text-slate-700" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-900 text-sm">Find your size</p>
                <p className="text-sm text-slate-500 mt-0.5">Get your personalised size recommendation</p>
                <button
                  type="button"
                  onClick={() => setView("profile")}
                  className="mt-3 inline-flex items-center gap-2 border border-slate-900 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-900 hover:text-white transition-colors rounded-xl"
                >
                  Start <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Unit toggle */}
            <div className="flex flex-wrap gap-3">
              <div className="inline-flex items-center bg-slate-100 rounded-full p-1">
                {(["cm", "in"] as Unit[]).map((u) => (
                  <button key={u} type="button" onClick={() => setUnit(u)}
                    className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${unit === u ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                    {u === "cm" ? "cm" : "Inches"}
                  </button>
                ))}
              </div>
            </div>

            {/* Men's Jersey */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-900 mb-3">Men&apos;s Jersey</p>
              <SizeTable rows={MEN_JERSEY_ROWS[unit]} sizes={MEN_SIZES} />
            </div>

            {/* Kids */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-900 mb-1">Kids / Youth</p>
              <p className="text-xs text-slate-400 mb-3">Includes jersey &amp; shorts. Allow for a slight variation of 1–3 cm.</p>
              <SizeTable rows={KIDS_ROWS[unit]} sizes={KIDS_SIZES} />
            </div>

            {/* Fit tips */}
            <div className="rounded-2xl bg-sky-50 border border-sky-100 px-5 py-4 space-y-2 text-sm text-slate-600">
              <p className="font-bold text-slate-900 text-sm mb-1">Fit tips</p>
              <p>If you are between sizes, order the <strong className="text-slate-800">smaller size</strong> for a tighter, athletic fit or the <strong className="text-slate-800">larger size</strong> for a looser, relaxed fit.</p>
              <p>Chest is your body measurement. ½ Length and Shirt Length are garment dimensions.</p>
            </div>

            {/* How to measure */}
            <div>
              <p className="text-sm font-bold text-slate-900 mb-3">How to measure</p>
              <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-5">
                <div className="flex gap-4 items-start">
                  <div className="flex-none w-36">
                    <svg viewBox="0 0 126 305" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <circle cx="58" cy="20" r="16" stroke="#1e293b" strokeWidth="1.5"/>
                      <path d="M52,36 L52,44 L28,54 L30,72 L40,106 L30,133 L48,148 L68,148 L86,133 L76,106 L86,72 L88,54 L64,44 L64,36" stroke="#1e293b" strokeWidth="1.5" strokeLinejoin="round"/>
                      <path d="M28,54 L18,132 L28,135 L36,68 Z" stroke="#1e293b" strokeWidth="1.5" strokeLinejoin="round"/>
                      <path d="M88,54 L98,132 L88,135 L80,68 Z" stroke="#1e293b" strokeWidth="1.5" strokeLinejoin="round"/>
                      <path d="M30,133 L26,292 L38,295 L48,148 Z" stroke="#1e293b" strokeWidth="1.5" strokeLinejoin="round"/>
                      <path d="M86,133 L90,292 L78,295 L68,148 Z" stroke="#1e293b" strokeWidth="1.5" strokeLinejoin="round"/>
                      <line x1="18" y1="72" x2="100" y2="72" stroke="#64748b" strokeWidth="1" strokeDasharray="3 2"/>
                      <line x1="18" y1="106" x2="100" y2="106" stroke="#64748b" strokeWidth="1" strokeDasharray="3 2"/>
                      <line x1="18" y1="133" x2="100" y2="133" stroke="#64748b" strokeWidth="1" strokeDasharray="3 2"/>
                      <line x1="46" y1="148" x2="46" y2="292" stroke="#64748b" strokeWidth="1" strokeDasharray="3 2"/>
                      <line x1="46" y1="220" x2="100" y2="220" stroke="#64748b" strokeWidth="1" strokeDasharray="3 2"/>
                      <line x1="109" y1="4" x2="109" y2="296" stroke="#1e293b" strokeWidth="1"/>
                      <path d="M107,9 L109,4 L111,9" fill="none" stroke="#1e293b" strokeWidth="1"/>
                      <path d="M107,291 L109,296 L111,291" fill="none" stroke="#1e293b" strokeWidth="1"/>
                      <text x="103" y="75"  fontSize="9" fontWeight="700" fill="#0f172a">1</text>
                      <text x="103" y="109" fontSize="9" fontWeight="700" fill="#0f172a">2</text>
                      <text x="103" y="136" fontSize="9" fontWeight="700" fill="#0f172a">3</text>
                      <text x="103" y="223" fontSize="9" fontWeight="700" fill="#0f172a">4</text>
                      <text x="116" y="155" fontSize="9" fontWeight="700" fill="#0f172a">5</text>
                    </svg>
                  </div>
                  <div className="flex-1 space-y-3 text-sm text-slate-600 pt-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Hold tape horizontally</p>
                    <p><strong className="text-slate-800">1. Chest</strong> — around the fullest part, arms at your sides</p>
                    <p><strong className="text-slate-800">2. Waist</strong> — around the narrowest part of your torso</p>
                    <p><strong className="text-slate-800">3. Hips</strong> — around the widest part, feet together</p>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 pt-2">Hold tape vertically</p>
                    <p><strong className="text-slate-800">4. Inseam</strong> — from the crotch seam to the floor</p>
                    <p><strong className="text-slate-800">5. Height</strong> — top of head to floor, standing straight</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ── PROFILE VIEW ── */}
        {view === "profile" && (
          <>
            <div className="overflow-y-auto flex-1 px-6 py-6 space-y-6">
              <p className="text-sm text-slate-600">This information will help us recommend the best size for you.</p>

              {/* Height */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-bold text-slate-900">Height</label>
                  <div className="flex gap-3 text-sm">
                    {(["ft", "cm"] as HeightUnit[]).map((u) => (
                      <label key={u} className="flex items-center gap-1.5 cursor-pointer">
                        <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${heightUnit === u ? "border-slate-900" : "border-slate-300"}`}>
                          {heightUnit === u && <span className="w-2 h-2 rounded-full bg-slate-900 block"/>}
                        </span>
                        <span className={heightUnit === u ? "font-semibold text-slate-900" : "text-slate-500"}
                          onClick={() => setHeightUnit(u)}>{u}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {heightUnit === "ft" ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <input type="number" placeholder="0" value={heightFt} onChange={e => setHeightFt(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 pr-10 focus:outline-none focus:ring-2 focus:ring-slate-900/20"/>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">ft</span>
                    </div>
                    <div className="relative">
                      <input type="number" placeholder="0" value={heightIn} onChange={e => setHeightIn(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 pr-12 focus:outline-none focus:ring-2 focus:ring-slate-900/20"/>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">inch</span>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <input type="number" placeholder="0" value={heightCm} onChange={e => setHeightCm(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 pr-10 focus:outline-none focus:ring-2 focus:ring-slate-900/20"/>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">cm</span>
                  </div>
                )}
              </div>

              {/* Weight */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-bold text-slate-900">Weight</label>
                  <div className="flex gap-3 text-sm">
                    {(["kg", "lb"] as WeightUnit[]).map((u) => (
                      <label key={u} className="flex items-center gap-1.5 cursor-pointer">
                        <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${weightUnit === u ? "border-slate-900" : "border-slate-300"}`}>
                          {weightUnit === u && <span className="w-2 h-2 rounded-full bg-slate-900 block"/>}
                        </span>
                        <span className={weightUnit === u ? "font-semibold text-slate-900" : "text-slate-500"}
                          onClick={() => setWeightUnit(u)}>{u}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <input type="number" placeholder="0" value={weightVal} onChange={e => setWeightVal(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 pr-10 focus:outline-none focus:ring-2 focus:ring-slate-900/20"/>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">{weightUnit}</span>
                </div>
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-3">
                  Age <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <div className="relative">
                  <input type="number" placeholder="0" value={age} onChange={e => setAge(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 pr-14 focus:outline-none focus:ring-2 focus:ring-slate-900/20"/>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">years</span>
                </div>
              </div>

              {/* Shopping preference */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-3">
                  Shopping preference <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {(["men", "unisex"] as Preference[]).map((p) => (
                    <button key={p} type="button" onClick={() => setPref(p)}
                      className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${pref === p ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 text-slate-600 hover:border-slate-300"}`}>
                      {p === "men" ? "Men's" : "Unisex"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Fixed bottom CTA */}
            <div className="flex-none border-t border-slate-100 p-4">
              <button
                type="button"
                onClick={handleFindSize}
                disabled={!canSubmit}
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl flex items-center justify-between px-6 hover:bg-slate-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>Find size</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </>
        )}

        {/* ── RESULT VIEW ── */}
        {view === "result" && (
          <>
            <div className="overflow-y-auto flex-1 px-6 py-6 space-y-5">
              {result ? (
                <>
                  <div className="rounded-2xl border-2 border-slate-900 bg-slate-50 p-6 text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Your recommended size</p>
                    <p className="text-6xl font-extrabold tracking-tight text-slate-900">{result}</p>
                    <p className="text-sm text-slate-500 mt-2">Men&apos;s jersey</p>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Your size recommendation is based on the height and weight you shared. If you prefer a looser fit, consider sizing up.
                  </p>
                </>
              ) : (
                <>
                  <div className="rounded-2xl border border-dashed border-slate-400 p-6 bg-[repeating-linear-gradient(-45deg,transparent,transparent_6px,rgba(0,0,0,0.03)_6px,rgba(0,0,0,0.03)_12px)]">
                    <p className="text-sm font-bold uppercase tracking-wide text-slate-900 mb-2">No recommended size found</p>
                    <p className="text-sm text-slate-600">We couldn&apos;t find a size match. Please check your measurements and try again.</p>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Your size recommendation is calculated using the information you have shared and how true to size this item is.
                  </p>
                </>
              )}
            </div>

            {/* Fixed bottom actions */}
            <div className="flex-none border-t border-slate-100 p-4 space-y-2">
              <button
                type="button"
                onClick={() => setView("guide")}
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl flex items-center justify-between px-6 hover:bg-slate-800 transition"
              >
                <span>View size chart</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setView("profile")}
                className="w-full border border-slate-200 text-slate-700 font-semibold py-3.5 rounded-2xl flex items-center justify-between px-6 hover:bg-slate-50 transition"
              >
                <span>Edit measurements</span>
                <span className="text-slate-400 text-lg">✎</span>
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
