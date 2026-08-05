"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {children}
      </motion.div>
      <Footer />

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/254743616717"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg bg-[#25D366] hover:bg-[#1ebe5d] transition-colors duration-200"
      >
        <span className="absolute inline-flex w-full h-full rounded-full bg-[#25D366] opacity-60 animate-ping" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          className="w-8 h-8 fill-white relative"
        >
          <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.472 2.025 7.773L0 32l8.437-2.01A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 0 1-6.771-1.854l-.485-.288-5.008 1.194 1.24-4.874-.317-.5A13.27 13.27 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.878c-.398-.199-2.354-1.162-2.72-1.294-.365-.133-.631-.199-.897.199-.265.398-1.029 1.294-1.261 1.56-.232.265-.465.298-.863.1-.398-.199-1.681-.62-3.203-1.977-1.184-1.056-1.983-2.36-2.215-2.758-.232-.398-.025-.613.174-.811.179-.178.398-.465.597-.697.199-.232.265-.398.398-.664.133-.265.066-.497-.033-.697-.1-.199-.897-2.162-1.228-2.96-.324-.778-.652-.672-.897-.685l-.764-.013c-.265 0-.697.1-1.062.497-.365.398-1.394 1.362-1.394 3.323 0 1.96 1.428 3.855 1.627 4.12.199.265 2.81 4.29 6.808 6.016.951.41 1.693.655 2.272.839.954.304 1.822.261 2.508.158.765-.114 2.354-.962 2.686-1.892.332-.93.332-1.727.232-1.892-.099-.165-.365-.265-.763-.464z" />
        </svg>
      </a>
    </>
  );
}
