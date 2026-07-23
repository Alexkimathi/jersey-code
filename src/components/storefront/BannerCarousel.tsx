"use client";

import Image from "next/image";
import { Banner } from "@/lib/supabase/types";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const textVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: 0.1 + i * 0.13, ease: "easeOut" as const },
  }),
};

export function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const backgroundVideo = banners.find((b) => b.video_url)?.video_url || null;
  const currentBanner = banners[currentIndex];

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) return null;

  return (
    <div className="relative h-80 sm:h-[500px] w-full overflow-hidden bg-slate-950">
      {/* Background */}
      {backgroundVideo ? (
        <video
          src={backgroundVideo}
          poster={banners[0]?.image_url || undefined}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
        />
      ) : currentBanner?.image_url ? (
        <AnimatePresence mode="sync">
          <motion.div
            key={currentBanner.id + "-bg"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 overflow-hidden"
          >
            <Image
              src={currentBanner.image_url}
              alt=""
              fill
              className="object-cover animate-ken-burns"
              priority
            />
          </motion.div>
        </AnimatePresence>
      ) : null}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/48" />

      {/* Slide content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentBanner?.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {currentBanner?.title && (
            <div className="text-center text-white px-6 max-w-3xl mx-auto">
              <motion.h2
                custom={0}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight mb-3 drop-shadow-lg"
              >
                {currentBanner.title}
              </motion.h2>

              {currentBanner.subtitle && (
                <motion.p
                  custom={1}
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-base sm:text-lg text-white/75 max-w-md mx-auto leading-relaxed"
                >
                  {currentBanner.subtitle}
                </motion.p>
              )}

              {currentBanner.link_url && (
                <motion.div
                  custom={2}
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  className="mt-7"
                >
                  <a
                    href={currentBanner.link_url}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-slate-900 shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                  >
                    Shop Now
                  </a>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Pill dot indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-white w-6"
                  : "bg-white/50 w-2 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
