"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Truck, ShieldCheck, Smartphone, Clock } from "lucide-react";

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: 0.35 + i * 0.1, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  }),
};

interface Props {
  order: {
    id: string;
    customer_name?: string;
    customer_phone: string;
    payment_method: string;
    payment_status: string;
    total_amount: number;
    fulfillment_method?: string;
  };
}

const paymentLabel: Record<string, string> = {
  mpesa: "M-Pesa",
  pay_on_pickup: "Pay at Pickup",
  cash_on_delivery: "Cash on Delivery",
};

export function OrderConfirmationClient({ order }: Props) {
  const isPaid = order.payment_status === "paid";
  const isMpesaPending = order.payment_method === "mpesa" && order.payment_status === "pending";

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero */}
      <section className="bg-slate-950 px-4 py-16 sm:px-6 overflow-hidden">
        <div className="max-w-xl mx-auto text-center">

          {/* Animated checkmark */}
          <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
            {/* Pulse rings */}
            <motion.span
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 1.6, ease: "easeOut", repeat: Infinity, delay: 0.5 }}
              className="absolute inset-0 rounded-full border border-emerald-500/40"
            />
            <motion.span
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 1.6, ease: "easeOut", repeat: Infinity, delay: 0.9 }}
              className="absolute inset-0 rounded-full border border-emerald-500/20"
            />

            {/* Circle background */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, ease: [0.175, 0.885, 0.32, 1.275] }}
              className="absolute inset-0 rounded-full bg-emerald-500/10 border border-emerald-500/25"
            />

            {/* SVG checkmark */}
            <svg viewBox="0 0 52 52" className="w-14 h-14 text-emerald-400 relative z-10" fill="none">
              <motion.path
                d="M14 27 L22 35 L38 17"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.55, delay: 0.4, ease: "easeOut" }}
              />
            </svg>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="text-xs font-bold uppercase tracking-[0.3em] text-sky-400 mb-3"
          >
            Order received
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.7 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4"
          >
            You&apos;re all set!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            className="text-slate-400 text-base max-w-sm mx-auto"
          >
            Your jersey is being prepared. We&apos;ll keep you updated every step of the way.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.95, type: "spring", stiffness: 300, damping: 22 }}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-5 py-2.5"
          >
            <span className="text-xs text-slate-400">Order</span>
            <span className="font-mono font-bold text-white tracking-wider text-sm">
              #{order.id.slice(0, 8).toUpperCase()}
            </span>
          </motion.div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-5">

        {/* M-Pesa pending notice */}
        {isMpesaPending && (
          <motion.div
            custom={-1}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5"
          >
            <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center flex-none">
              <Smartphone className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-bold text-amber-800 text-sm">Complete your M-Pesa payment</p>
              <p className="text-sm text-amber-700 mt-0.5">
                An STK push has been sent to your phone. Enter your M-Pesa PIN to confirm the payment and finalise your order.
              </p>
            </div>
          </motion.div>
        )}

        {/* Order details + next steps grid */}
        <div className="grid sm:grid-cols-2 gap-5">

          <motion.div
            custom={0}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Order Details</p>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Customer</dt>
                <dd className="font-semibold text-slate-900">{order.customer_name || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Phone</dt>
                <dd className="font-semibold text-slate-900">{order.customer_phone}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Payment</dt>
                <dd className="font-semibold text-slate-900">{paymentLabel[order.payment_method] ?? order.payment_method}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Payment status</dt>
                <dd className={`font-bold ${isPaid ? "text-emerald-600" : "text-amber-600"}`}>
                  {isPaid ? "Paid" : "Pending"}
                </dd>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-3">
                <dt className="font-bold text-slate-900">Total</dt>
                <dd className="font-extrabold text-slate-900">KES {order.total_amount.toLocaleString()}</dd>
              </div>
            </dl>
          </motion.div>

          <motion.div
            custom={1}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">What Happens Next</p>
            <ul className="space-y-4">
              {[
                {
                  icon: Clock,
                  title: "Order processing",
                  desc: "We verify and prepare your jersey within 24 hours",
                },
                {
                  icon: Truck,
                  title: order.fulfillment_method === "pickup" ? "Ready for pickup" : "Out for delivery",
                  desc: order.fulfillment_method === "pickup"
                    ? "You'll be notified when your order is ready to collect"
                    : "Delivered in 1–3 business days across Kenya",
                },
              ].map(({ icon: Icon, title, desc }, i) => (
                <motion.li
                  key={title}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.35 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center flex-none mt-0.5">
                    <Icon className="w-3.5 h-3.5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* CTAs */}
        <motion.div
          custom={2}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row gap-3"
        >
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3.5 text-sm font-bold text-white hover:bg-sky-600 transition-colors shadow-sm"
          >
            Continue Shopping
          </Link>
          <Link
            href="/orders"
            className="flex-1 inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            View My Orders
          </Link>
        </motion.div>

        <motion.p
          custom={3}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="text-center text-xs text-slate-400"
        >
          Questions? Call <span className="font-medium text-slate-600">+254 700 000 000</span> or email{" "}
          <span className="font-medium text-slate-600">support@jerseystore.co.ke</span>
        </motion.p>
      </div>
    </div>
  );
}
