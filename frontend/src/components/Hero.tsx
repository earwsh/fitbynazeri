"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Calculator,
  Sparkles
} from "lucide-react";

export default function Hero() {
  const [heroData, setHeroData] = useState({
    title_prefix: "طراحی علمی برنامه تمرین و تغذیه؛",
    title_highlight: "متناسب با ژنتیک و هدف شما",
    description: "بدون رژیم‌های طاقت‌فرسا و تمرینات خسته‌کننده غیراصولی؛ در آکادمی ناظری، برنامه‌های اختصاصی بر پایه فیزیولوژی ورزشی و سبک زندگی واقعی شما طراحی و با پایش مستمر تا رسیدن به نتیجه همراهی می‌شوید.",
    primary_btn_text: "دریافت برنامه اختصاصی",
    primary_btn_href: "#packages",
    secondary_btn_text: "مشاهده نتایج شاگردان",
    secondary_btn_href: "#transformations",
    image_url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
  });

  // Optional: fetch hero data if backend provides it
  useEffect(() => {
    fetch("https://fitbynazeri.com/api/hero-slides")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success" && data.slides && data.slides.length > 0) {
          const active = data.slides.find((s: any) => s.is_active) || data.slides[0];
          if (active) {
            setHeroData((prev) => ({
              ...prev,
              title_prefix: active.title_prefix || prev.title_prefix,
              title_highlight: active.title_highlight || prev.title_highlight,
              description: active.description || prev.description,
              primary_btn_text: active.primary_btn_text || prev.primary_btn_text,
              primary_btn_href: active.primary_btn_href || prev.primary_btn_href,
              secondary_btn_text: active.secondary_btn_text || prev.secondary_btn_text,
              secondary_btn_href: active.secondary_btn_href || prev.secondary_btn_href,
              image_url: active.image_url || prev.image_url,
            }));
          }
        }
      })
      .catch(() => {
        // Fallback to default static data
      });
  }, []);

  return (
    <section 
      id="hero" 
      className="relative w-full min-h-screen lg:h-screen overflow-hidden bg-[#141414] flex flex-col justify-center lg:justify-end pt-24 sm:pt-28 pb-12 sm:pb-16 lg:pb-14"
    >
      {/* 1. Static High-Res Background Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transform scale-[1.01] filter brightness-95"
        style={{ backgroundImage: `url('${heroData.image_url}')` }}
      />

      {/* 2. Layered Overlays for High Legibility & Charcoal Stack Vibe */}
      {/* Top Scrim (keeps the transparent header navigation crystal clear without harsh lines) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/40 to-[#141414]/90 pointer-events-none" />

      {/* Right Gradient (for Persian RTL typography focus) */}
      <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#141414]/70 to-[#141414]/95 pointer-events-none" />

      {/* Ambient Brand Orange & Navy Glows */}
      <div 
        className="absolute top-1/4 right-0 w-[550px] h-[550px] bg-[#ff6600]/15 rounded-full blur-[150px] pointer-events-none" 
      />
      <div 
        className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-[#3e59a8]/15 rounded-full blur-[150px] pointer-events-none" 
      />

      {/* Subtle Bottom Fade to fuse seamlessly into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#141414] to-transparent pointer-events-none" />

      {/* 3. Main Content Layout - Centered on mobile, right-aligned on desktop */}
      <div className="w-full px-6 sm:px-10 lg:px-16 relative z-10">
        <div className="max-w-2xl xl:max-w-3xl space-y-4 sm:space-y-5 text-center lg:text-right mx-auto lg:mx-0 pb-1 lg:pb-2">
          
          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-2xl sm:text-3xl lg:text-4xl xl:text-[44px] font-extrabold text-[#f5f5f7] leading-[1.3] tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]"
          >
            {heroData.title_prefix}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#ff6600] via-[#ff8532] to-[#ffa366] drop-shadow-[0_0_35px_rgba(255,102,0,0.45)]">
              {heroData.title_highlight}
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="text-xs sm:text-sm lg:text-[15px] text-[#acabb1] max-w-xl xl:max-w-2xl leading-relaxed sm:leading-loose drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] font-normal mx-auto lg:mx-0"
          >
            {heroData.description}
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: "easeOut" }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-1"
          >
            <Link
              href={heroData.primary_btn_href || "#packages"}
              className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-sm text-xs sm:text-sm font-bold bg-[#ff6600] hover:bg-[#ff8532] text-white transition-all duration-200 shadow-[0_0_25px_rgba(255,102,0,0.35)] hover:shadow-[0_0_35px_rgba(255,102,0,0.5)] hover:scale-[1.02] active:scale-[0.98] group"
            >
              <span>{heroData.primary_btn_text}</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            </Link>

            <Link
              href={heroData.secondary_btn_href || "#transformations"}
              className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-sm text-xs sm:text-sm font-medium text-[#f5f5f7] bg-[#1a1a1c]/80 hover:bg-[#2c2c2e] border border-white/20 hover:border-[#ff6600]/50 backdrop-blur-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ff6600]" />
              <span>{heroData.secondary_btn_text}</span>
            </Link>

            <Link
              href="#calculator"
              className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-sm text-xs sm:text-sm font-medium text-[#f5f5f7] bg-[#1a1a1c]/80 hover:bg-[#2c2c2e] border border-white/20 hover:border-[#ff6600]/50 backdrop-blur-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Calculator className="w-3.5 h-3.5 text-[#ff6600]" />
              <span>محاسبه رایگان BMI</span>
            </Link>
          </motion.div>

        </div>
      </div>

    </section>
  );
}
