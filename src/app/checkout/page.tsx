import Link from "next/link";
import { ChevronLeft, ShieldCheck } from "lucide-react";
import { CheckoutForm } from "./CheckoutForm";

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Top nav */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to cart
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-sky-500" />
            Secure checkout
          </div>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-8">Checkout</h1>

        <CheckoutForm />
      </div>
    </div>
  );
}
