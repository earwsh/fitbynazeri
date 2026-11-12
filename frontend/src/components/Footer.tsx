"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  Dumbbell, 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  ArrowUp, 
  Clock,
  ChevronLeft
} from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on authentication and dashboard pages
  if (pathname === "/login" || pathname === "/dashboard" || pathname.startsWith("/dashboard")) {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative w-full bg-[#ff6600] text-black border-t-2 border-black/20 overflow-hidden selection:bg-black selection:text-white" dir="rtl">
      
      {/* Background Subtle Noir Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-black/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Footer Container */}
      <div className="w-full px-6 sm:px-10 lg:px-16 pt-16 sm:pt-20 pb-12 relative z-10">
        
        {/* Top Row: Brand & Quick Action */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pb-14 border-b border-black/15 items-start">
          
          {/* Col 1: Brand Info (5 Cols) */}
          <div className="lg:col-span-5 space-y-5 text-right">
            <Link href="/" className="inline-flex items-center gap-3.5 group">
              <div className="w-12 h-12 rounded bg-black/90 p-1 flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-200">
                <Image
                  src="/logo.png"
                  alt="لوگوی آکادمی ناظری"
                  width={44}
                  height={44}
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div>
                <span className="text-2xl font-black text-black block tracking-tight">آکادمی ناظری</span>
                <span className="text-xs text-black/75 font-bold">مربیگری حرفه‌ای و هوشمند فیتنس</span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-black/85 leading-relaxed font-medium max-w-md text-justify">
              آکادمی تخصصی فیتنس و بدنسازی ناظری با هدایت استاد احسان ناظری، متدی علمی و یکپارچه برای رسیدن به اوج آمادگی جسمانی، تناسب اندام پایدار و ترنسفورمیشن قهرمانی ارائه می‌دهد.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded bg-black text-white hover:bg-[#1a1a1a] flex items-center justify-center transition-all shadow-md hover:scale-110"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5 fill-current text-[#ff6600]" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded bg-black text-white hover:bg-[#1a1a1a] flex items-center justify-center transition-all shadow-md hover:scale-110"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4 text-[#ff6600]" />
              </a>
              <a
                href="tel:09120000000"
                className="w-10 h-10 rounded bg-black text-white hover:bg-[#1a1a1a] flex items-center justify-center transition-all shadow-md hover:scale-110"
                aria-label="Phone"
              >
                <Phone className="w-4 h-4 text-[#ff6600]" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links (2 Cols) */}
          <div className="lg:col-span-2 space-y-4 text-right">
            <h4 className="text-sm font-black text-black border-b border-black/15 pb-2 inline-block">
              بخش‌های سایت
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-bold text-black/85">
              <li>
                <Link href="#about" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>درباره مربی و آکادمی</span>
                </Link>
              </li>
              <li>
                <Link href="#consultation" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>مشاوره رایگان تلفنی</span>
                </Link>
              </li>
              <li>
                <Link href="#champions" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>قهرمانان</span>
                </Link>
              </li>
              <li>
                <Link href="#testimonials" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>نظرات و نتایج قهرمانان</span>
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>مقالات تخصصی فیتنس</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>تماس با ما و پشتیبانی</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct User Portals (2 Cols) */}
          <div className="lg:col-span-2 space-y-4 text-right">
            <h4 className="text-sm font-black text-black border-b border-black/15 pb-2 inline-block">
              سامانه کاربری
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-bold text-black/85">
              <li>
                <Link href="/login?redirect=/get-plan" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>دریافت برنامه اختصاصی</span>
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>ورود به پنل کاربری قهرمان</span>
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>ورود مربیان و مدیریت</span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>میز کار و آنالیز هفتگی</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Direct Column matching other columns (3 Cols) */}
          <div className="lg:col-span-3 space-y-4 text-right">
            <h4 className="text-sm font-black text-black border-b border-black/15 pb-2 inline-block">
              ارتباط با مربی و پشتیبانی
            </h4>
            
            <ul className="space-y-3 text-xs sm:text-sm font-bold text-black/85">
              <li>
                <a href="tel:09120000000" className="hover:text-white transition-colors flex items-center gap-2">
                  <Phone className="w-4 h-4 text-black flex-shrink-0" />
                  <span dir="ltr">0912 000 0000</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@nazeri.fit" className="hover:text-white transition-colors flex items-center gap-2">
                  <Mail className="w-4 h-4 text-black flex-shrink-0" />
                  <span dir="ltr">info@nazeri.fit</span>
                </a>
              </li>
              <li className="flex items-start gap-2 pt-1 text-black/75">
                <Clock className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">
                  ساعات پاسخگویی: شنبه تا پنج‌شنبه ۹ الی ۲۱
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Designer link & Scroll to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-black/85">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-center sm:text-right">
            <span>© ۲۰۲۶ تمامی حقوق مادی و معنوی متعلق به آکادمی بدنسازی و فیتنس ناظری است.</span>
            <span className="hidden sm:inline text-black/40">|</span>
            <span>
              طراحی و توسعه توسط:{" "}
              <a
                href="https://onsupp.com"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4 hover:text-white transition-colors font-mono-tag tracking-wider"
              >
                onsupp.com
              </a>
            </span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2 rounded bg-black text-white hover:bg-[#1a1a1a] transition-all shadow-md group flex-shrink-0"
          >
            <span>بازگشت به بالای صفحه</span>
            <ArrowUp className="w-4 h-4 text-[#ff6600] group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

      </div>

    </footer>
  );
}
