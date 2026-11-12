"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X, UserCheck } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const navMenuItems = [
    { name: "صفحه اصلی", href: "/" },
    { name: "دریافت برنامه", href: "/get-plan" },
    { name: "قهرمانان", href: "/students" },
    { name: "وبلاگ و مقالات", href: "/blog" },
    { name: "درباره مربی", href: "/about" },
    { name: "تماس با ما", href: "/contact" },
  ];

  // Dynamically determine active menu item based on current URL pathname
  const getActiveItemName = () => {
    if (pathname.startsWith("/get-plan")) {
      return "دریافت برنامه";
    }
    if (pathname.startsWith("/students")) {
      return "قهرمانان";
    }
    if (pathname.startsWith("/blog")) {
      return "وبلاگ و مقالات";
    }
    if (pathname.startsWith("/about")) {
      return "درباره مربی";
    }
    if (pathname.startsWith("/contact")) {
      return "تماس با ما";
    }
    if (pathname === "/") {
      return "صفحه اصلی";
    }
    return "صفحه اصلی";
  };

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activeItem = getActiveItemName();
  const currentSelection = hoveredItem || activeItem;
  const isTransparent = pathname === "/" && !isScrolled && !isMobileMenuOpen;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isTransparent 
          ? "bg-transparent border-none shadow-none" 
          : "backdrop-blur-xl bg-[#141414]/90 border-b border-[#2c2c2e]/80 shadow-xl shadow-black/40"
      }`}
      style={{
        backdropFilter: isTransparent ? "none" : "blur(20px)",
        WebkitBackdropFilter: isTransparent ? "none" : "blur(20px)",
      }}
    >
      {/* Full width container matching hero with generous uniform padding */}
      <div className="w-full px-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between h-20 relative">
          
          {/* موبایل: دکمه منوی همبرگر در سمت راست */}
          <div className="flex lg:hidden items-center z-10">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-sm bg-[#1a1a1c]/80 text-[#e5e2e1] hover:text-[#ff6600] border border-[#2c2c2e] transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* لوگو: فقط آیکون برند بدون اسم | در موبایل کاملاً در مرکز، در دسکتاپ سمت راست */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:static lg:translate-x-0 lg:translate-y-0 flex items-center flex-shrink-0 z-10">
            <Link href="/" className="group flex items-center justify-center">
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="Fit By Nazeri"
                  width={48}
                  height={48}
                  className="w-10 h-10 sm:w-11 sm:h-11 object-contain drop-shadow-[0_0_12px_rgba(255,102,0,0.45)]"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* وسط دسکتاپ: منوی ناوبری با انیمیشن Framer Motion بر اساس مسیر زنده URL */}
          <nav 
            onMouseLeave={() => setHoveredItem(null)}
            className="hidden lg:flex items-center justify-center relative gap-4 xl:gap-6"
          >
            {navMenuItems.map((item) => {
              const isSelected = currentSelection === item.name;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onMouseEnter={() => setHoveredItem(item.name)}
                  className={`relative text-xs xl:text-sm font-medium px-3 xl:px-3.5 py-2 rounded-sm whitespace-nowrap transition-colors duration-200 flex items-center ${
                    isSelected ? "text-white font-bold" : "text-[#e5e2e1]/75 hover:text-white"
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="header-gliding-pill"
                      className="absolute inset-0 bg-[#ff6600] rounded-sm -z-10 shadow-[0_0_20px_rgba(255,102,0,0.25)]"
                      transition={{
                        type: "spring",
                        stiffness: 280,
                        damping: 26,
                        mass: 0.8,
                      }}
                    />
                  )}

                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* سمت چپ دسکتاپ: دکمه ورود / ثبت‌نام */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <Link
              href="/login"
              className="text-xs xl:text-sm font-bold bg-[#ff6600] hover:bg-[#ff8532] text-white px-5 py-2.5 rounded-sm transition-all duration-200 flex items-center gap-2 group hover:scale-[1.02] active:scale-[0.98]"
            >
              <UserCheck className="w-4 h-4 text-white group-hover:scale-105 transition-transform" />
              <span>ورود | ثبت‌نام</span>
            </Link>
          </div>

          {/* سمت چپ موبایل: دکمه ورود */}
          <div className="flex lg:hidden items-center z-10">
            <Link
              href="/login"
              className="text-xs font-bold bg-[#ff6600] hover:bg-[#ff8532] text-white px-3.5 py-2 rounded-sm flex items-center gap-1.5 shadow-md shadow-[#ff6600]/25 transition-all"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>ورود</span>
            </Link>
          </div>

        </div>
      </div>

      {/* منوی دراور موبایل و پس‌زمینه بلر */}
      {isMobileMenuOpen && (
        <>
          {/* پس‌زمینه تیره و بلر کل صفحه برای جلوگیری از تداخل متن صفحه */}
          <div
            className="fixed inset-0 top-20 bg-black/75 -z-10 transition-opacity duration-300"
            style={{
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
            }}
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div 
            className="lg:hidden border-t border-[#3a3a3c] bg-[#141414]/98 px-6 py-6 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl shadow-black/90"
            style={{
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {navMenuItems.map((item) => {
                const isSelected = activeItem === item.name;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-sm text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-[#ff6600] text-white font-bold shadow-md shadow-[#ff6600]/30"
                        : "bg-[#1a1a1c] border border-[#2c2c2e] text-[#f5f5f7] hover:border-[#ff6600]/50 hover:bg-[#222224] hover:text-[#ff6600]"
                    }`}
                  >
                    <span>{item.name}</span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-[#2c2c2e]">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center text-xs font-bold bg-[#ff6600] hover:bg-[#ff8532] text-white py-3.5 rounded-sm flex items-center justify-center gap-2 shadow-lg shadow-[#ff6600]/25 transition-all"
              >
                <UserCheck className="w-4 h-4" />
                <span>ورود | ثبت‌نام در آکادمی</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
