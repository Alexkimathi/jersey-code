"use client";

import Link from "next/link";
import { useCartStore } from "@/hooks/useCartStore";
import { ShoppingBag, Menu, X, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const menuItemVariants = {
  hidden: { opacity: 0, y: -6 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.2, ease: "easeOut" as const },
  }),
};

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b transition-all duration-300 ${
        scrolled ? "border-slate-200 shadow-md" : "border-slate-100 shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-6">

          {/* Logo */}
          <Link href="/" className="flex-none flex items-center gap-2.5 group">
            <motion.span
              whileHover={{ rotate: [0, -8, 8, 0], transition: { duration: 0.4 } }}
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900 text-white text-xs font-black tracking-tight group-hover:bg-sky-600 transition-colors"
            >
              JS
            </motion.span>
            <span className="text-lg font-extrabold tracking-tight text-slate-900 hidden sm:block">
              Jersey Code
            </span>
          </Link>

          {/* Search */}
          <form action="/search" method="get" className="hidden md:flex flex-1 max-w-md relative">
            <input
              type="search"
              name="q"
              placeholder="Search jerseys, teams, players..."
              className="w-full rounded-full bg-slate-100 border-0 py-2.5 pl-4 pr-11 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40 transition-shadow"
            />
            <button
              type="submit"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-500 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="relative px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all group"
              >
                {label}
                <span className="absolute bottom-1 left-3 right-3 h-0.5 bg-sky-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left rounded-full" />
              </Link>
            ))}
          </nav>

          {/* Cart + hamburger */}
          <div className="flex items-center gap-2">
            <Link
              href="/cart"
              className="relative inline-flex items-center justify-center w-9 h-9 rounded-full bg-slate-900 text-white hover:bg-sky-600 transition-colors shadow-sm"
              aria-label="View cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <AnimatePresence mode="popLayout">
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 18 }}
                    className="absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-sky-500 text-[10px] font-bold text-white ring-2 ring-white"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            <button
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileMenuOpen ? (
                  <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X className="w-5 h-5" />
                  </motion.span>
                ) : (
                  <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <Menu className="w-5 h-5" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:hidden overflow-hidden border-t border-slate-100 bg-white"
          >
            <div className="px-4 pt-3 pb-4 space-y-3">
              <form action="/search" method="get" className="relative">
                <input
                  type="search"
                  name="q"
                  placeholder="Search jerseys, teams, players..."
                  className="w-full rounded-full bg-slate-100 border-0 py-3 pl-4 pr-11 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
                />
                <button type="submit" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Search className="w-4 h-4" />
                </button>
              </form>
              <div className="grid grid-cols-2 gap-2">
                {navLinks.map(({ label, href }, i) => (
                  <motion.div key={href} custom={i} variants={menuItemVariants} initial="hidden" animate="visible">
                    <Link
                      href={href}
                      className="flex items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
