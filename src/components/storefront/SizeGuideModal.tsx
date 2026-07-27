"use client";

import { useState } from "react";
import { X, ArrowLeft, ArrowRight, Ruler } from "lucide-react";

interface SizeGuideModalProps {
  onClose: () => void;
}

type Unit      = "cm" | "in";
type Gender    = "men" | "women";
type View      = "guide" | "profile" | "result";
type HeightUnit = "ft" | "cm";
type WeightUnit = "kg" | "lb";
type Preference = "men" | "women" | "unisex";

// ── Size data ─────────────────────────────────────────────────────────────────

const MEN_SIZES   = ["S", "M", "L", "XL", "XXL"];
const WOMEN_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const KIDS_SIZES  = ["XS", "S", "M", "L", "XL", "XXL"];

type Rows = Record<Unit, { label: string; values: string[] }[]>;

const MEN_JERSEY_ROWS: Rows = {
  cm: [
    { label: "Height", values: ["165–172", "170–177", "175–182", "180–187", "185–192"] },
    { label: "Chest",  values: ["86–91",   "96–101",  "106–111", "116–121", "126–131"] },
    { label: "Waist",  values: ["71–76",   "81–86",   "91–96",   "101–106", "111–116"] },
    { label: "Hip",    values: ["86–91",   "96–101",  "106–111", "116–121", "126–131"] },
  ],
  in: [
    { label: "Height", values: ['65–68"', '67–70"', '69–72"', '71–74"', '73–76"'] },
    { label: "Chest",  values: ['34–36"', '38–40"', '42–44"', '46–48"', '50–52"'] },
    { label: "Waist",  values: ['28–30"', '32–34"', '36–38"', '40–42"', '44–46"'] },
    { label: "Hip",    values: ['34–36"', '38–40"', '42–44"', '46–48"', '50–52"'] },
  ],
};

const WOMEN_JERSEY_ROWS: Rows = {
  cm: [
    { label: "Height", values: ["155–160", "160–165", "165–170", "170–175", "175–180", "180–185"] },
    { label: "Chest",  values: ["76–81",   "81–86",   "86–91",   "96–101",  "106–111", "116–121"] },
    { label: "Waist",  values: ["60–65",   "65–70",   "70–75",   "80–85",   "90–95",   "100–105"] },
    { label: "Hip",    values: ["83–88",   "88–93",   "93–98",   "103–108", "113–118", "123–128"] },
  ],
  in: [
    { label: "Height", values: ['61–63"', '63–65"', '65–67"', '67–69"', '69–71"', '71–73"'] },
    { label: "Chest",  values: ['30–32"', '32–34"', '34–36"', '38–40"', '42–44"', '46–48"'] },
    { label: "Waist",  values: ['24–26"', '26–28"', '28–30"', '32–34"', '36–38"', '40–42"'] },
    { label: "Hip",    values: ['33–35"', '35–37"', '37–39"', '41–43"', '45–47"', '49–51"'] },
  ],
};

const MEN_SHORTS_ROWS: Rows = {
  cm: [
    { label: "Waist",  values: ["71–76",   "81–86",   "91–96",   "101–106", "111–116"] },
    { label: "Hip",    values: ["86–91",   "96–101",  "106–111", "116–121", "126–131"] },
    { label: "Length", values: ["46",      "48",      "50",      "52",      "54"     ] },
  ],
  in: [
    { label: "Waist",  values: ['28–30"', '32–34"', '36–38"', '40–42"', '44–46"'] },
    { label: "Hip",    values: ['34–36"', '38–40"', '42–44"', '46–48"', '50–52"'] },
    { label: "Length", values: ['18"',    '19"',    '20"',    '20.5"',  '21"'   ] },
  ],
};

const WOMEN_SHORTS_ROWS: Rows = {
  cm: [
    { label: "Waist",  values: ["60–65",   "65–70",   "70–75",   "80–85",   "90–95",   "100–105"] },
    { label: "Hip",    values: ["83–88",   "88–93",   "93–98",   "103–108", "113–118", "123–128"] },
    { label: "Length", values: ["36",      "38",      "40",      "42",      "44",      "46"     ] },
  ],
  in: [
    { label: "Waist",  values: ['24–26"', '26–28"', '28–30"', '32–34"', '36–38"', '40–42"'] },
    { label: "Hip",    values: ['33–35"', '35–37"', '37–39"', '41–43"', '45–47"', '49–51"'] },
    { label: "Length", values: ['14"',    '15"',    '16"',    '17"',    '17.5"',  '18"'   ] },
  ],
};

const KIDS_ROWS: Rows = {
  cm: [
    { label: "Age",    values: ["3–4 yrs", "5–6 yrs", "7–8 yrs", "9–10 yrs", "11–12 yrs", "13–14 yrs"] },
    { label: "Height", values: ["98–104",  "110–116", "122–128", "134–140",  "146–152",   "158–164"  ] },
    { label: "Chest",  values: ["53–55",   "56–59",   "60–64",   "65–69",    "70–75",     "76–82"    ] },
    { label: "Waist",  values: ["52–54",   "54–57",   "57–60",   "60–63",    "63–66",     "66–70"    ] },
  ],
  in: [
    { label: "Age",    values: ["3–4 yrs", "5–6 yrs", "7–8 yrs", "9–10 yrs", "11–12 yrs", "13–14 yrs"] },
    { label: "Height", values: ['39–41"',  '43–46"',  '48–50"',  '53–55"',   '57–60"',    '62–65"'   ] },
    { label: "Chest",  values: ['21–22"',  '22–23"',  '24–25"',  '26–27"',   '28–30"',    '30–32"'   ] },
    { label: "Waist",  values: ['20–21"',  '21–22"',  '22–24"',  '24–25"',   '25–26"',    '26–28"'   ] },
  ],
};

// ── Size recommendation ───────────────────────────────────────────────────────

function recommendSize(heightCm: number, weightKg: number, pref: Preference) {
  const bmi = weightKg / Math.pow(heightCm / 100, 2);
  const isMen = pref !== "women";

  let idx: number;
  if (isMen) {
    if      (heightCm < 168.5) idx = 0; // S
    else if (heightCm < 173.5) idx = 1; // M
    else if (heightCm < 178.5) idx = 2; // L
    else if (heightCm < 183.5) idx = 3; // XL
    else                        idx = 4; // XXL
    if (bmi > 27 && idx < 4) idx++;
    else if (bmi < 18.5 && idx > 0) idx--;
    return { size: MEN_SIZES[idx], gender: "men" as Gender };
  } else {
    if      (heightCm < 157.5) idx = 0; // XS
    else if (heightCm < 162.5) idx = 1; // S
    else if (heightCm < 167.5) idx = 2; // M
    else if (heightCm < 172.5) idx = 3; // L
    else if (heightCm < 177.5) idx = 4; // XL
    else                        idx = 5; // XXL
    if (bmi > 27 && idx < 5) idx++;
    else if (bmi < 18 && idx > 0) idx--;
    return { size: WOMEN_SIZES[idx], gender: "women" as Gender };
  }
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
  const [view,    setView]    = useState<View>("guide");
  const [unit,    setUnit]    = useState<Unit>("cm");
  const [gender,  setGender]  = useState<Gender>("men");

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
  const [result, setResult] = useState<{ size: string; gender: Gender } | null>(null);

  const jerseyRows  = gender === "men" ? MEN_JERSEY_ROWS[unit]  : WOMEN_JERSEY_ROWS[unit];
  const shortsRows  = gender === "men" ? MEN_SHORTS_ROWS[unit]  : WOMEN_SHORTS_ROWS[unit];
  const genderSizes = gender === "men" ? MEN_SIZES              : WOMEN_SIZES;

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
      setResult(recommendSize(hCm, wKg, pref));
    }
    setView("result");
  }

  const canSubmit = heightUnit === "cm"
    ? !!heightCm
    : !!(heightFt || heightIn);

  // Header title & back button
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

            {/* Gender + unit toggles */}
            <div className="flex flex-wrap gap-3">
              <div className="inline-flex items-center bg-slate-100 rounded-full p-1">
                {(["men", "women"] as Gender[]).map((g) => (
                  <button key={g} type="button" onClick={() => setGender(g)}
                    className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${gender === g ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                    {g === "men" ? "Men's" : "Women's"}
                  </button>
                ))}
              </div>
              <div className="inline-flex items-center bg-slate-100 rounded-full p-1">
                {(["cm", "in"] as Unit[]).map((u) => (
                  <button key={u} type="button" onClick={() => setUnit(u)}
                    className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${unit === u ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                    {u === "cm" ? "cm" : "Inches"}
                  </button>
                ))}
              </div>
            </div>

            {/* Jersey */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-900 mb-3">Jersey</p>
              <SizeTable rows={jerseyRows} sizes={genderSizes} />
            </div>

            {/* Shorts */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-900 mb-3">Shorts</p>
              <SizeTable rows={shortsRows} sizes={genderSizes} />
            </div>

            {/* Kids */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-900 mb-1">Kids / Youth</p>
              <p className="text-xs text-slate-400 mb-3">Applies to both jerseys and shorts.</p>
              <SizeTable rows={KIDS_ROWS[unit]} sizes={KIDS_SIZES} />
            </div>

            {/* Fit tips */}
            <div className="rounded-2xl bg-sky-50 border border-sky-100 px-5 py-4 space-y-2 text-sm text-slate-600">
              <p className="font-bold text-slate-900 text-sm mb-1">Fit tips</p>
              <p>If you are between sizes, order the <strong className="text-slate-800">smaller size</strong> for a tighter, athletic fit or the <strong className="text-slate-800">larger size</strong> for a looser, relaxed fit.</p>
              <p>All measurements are body measurements, not garment dimensions.</p>
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
                  {(["unisex", "men", "women"] as Preference[]).map((p) => (
                    <button key={p} type="button" onClick={() => setPref(p)}
                      className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${pref === p ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 text-slate-600 hover:border-slate-300"}`}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}{p !== "unisex" ? "'s" : ""}
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
                    <p className="text-6xl font-extrabold tracking-tight text-slate-900">{result.size}</p>
                    <p className="text-sm text-slate-500 mt-2">{result.gender === "men" ? "Men's" : "Women's"} jersey &amp; shorts</p>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Your size recommendation is based on the height and weight you shared. If you prefer a looser fit, consider sizing up.
                  </p>
                </>
              ) : (
                <>
                  <div className="rounded-2xl border border-dashed border-slate-400 p-6 bg-[repeating-linear-gradient(-45deg,transparent,transparent_6px,rgba(0,0,0,0.03)_6px,rgba(0,0,0,0.03)_12px)]">
                    <p className="text-sm font-bold uppercase tracking-wide text-slate-900 mb-2">No recommended size found</p>
                    <p className="text-sm text-slate-600">We couldn't find a size match. Please check your measurements and try again.</p>
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
