"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Phone, 
  Mail, 
  Send, 
  MessageSquare, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  HelpCircle, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  ChevronDown 
} from "lucide-react";
import Header from "@/components/Header";

// Custom SVG Icons for Social & Messaging Platforms
function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function TelegramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  );
}

function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.05 4.91A9.816 9.816 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01zm-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.14 8.14 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.98-.15.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.66.31-.23.25-.88.86-.88 2.1s.9 2.43 1.02 2.6c.12.17 1.77 2.7 4.28 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.12-.23-.19-.48-.31z"/>
    </svg>
  );
}

export default function ContactPage() {
  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    topic: "مشاوره عمومی و انتخاب پکیج",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // دو کارت اصلی و کامل (تماس مستقیم و ایمیل رسمی)
  const primaryChannels = [
    {
      id: "phone",
      title: "تماس تلفنی مستقیم",
      value: "۰۹۱۲۰۰۰۰۰۰۰",
      rawValue: "09120000000",
      description: "شنبه تا پنج‌شنبه از ساعت ۹:۰۰ الی ۲۱:۰۰",
      actionText: "برقراری تماس",
      actionHref: "tel:09120000000",
      icon: Phone,
    },
    {
      id: "email",
      title: "ایمیل رسمی آکادمی",
      value: "info@nazeri.fit",
      rawValue: "info@nazeri.fit",
      description: "همکاری‌های تجاری، اسپانسرینگ و مکاتبات اداری",
      actionText: "ارسال ایمیل",
      actionHref: "mailto:info@nazeri.fit",
      icon: Mail,
    },
  ];

  // سه کارت کوچک‌تر و منظم (واتساپ، تلگرام، اینستاگرام)
  const socialChannels = [
    {
      id: "telegram",
      title: "تلگرام",
      handle: "@Nazeri_Academy",
      actionHref: "https://t.me",
      icon: TelegramIcon,
    },
    {
      id: "whatsapp",
      title: "واتساپ",
      handle: "۰۹۱۲۰۰۰۰۰۰۰",
      actionHref: "https://wa.me/989120000000",
      icon: WhatsAppIcon,
    },
    {
      id: "instagram",
      title: "اینستاگرام",
      handle: "@nazeri.academy",
      actionHref: "https://instagram.com",
      icon: InstagramIcon,
    },
  ];

  const faqs = [
    {
      q: "چقدر بعد از ثبت درخواست، با من تماس گرفته می‌شود؟",
      a: "تیم مشاوره آکادمی ناظری معمولاً ظرف کمتر از ۲ الی ۳ ساعت کاری پس از ثبت درخواست با شما تماس خواهند گرفت تا وضعیت اولیه و اهداف ورزشی شما را بررسی کنند.",
    },
    {
      q: "آیا قبل از پرداخت وجه، مشاوره رایگان ارائه می‌شود؟",
      a: "بله! شما می‌توانید از طریق فرم همین صفحه یا تماس تلفنی، سوالات خود درباره نحوه اجرای برنامه، آسیب‌های احتمالی مفاصل و سطح آمادگی را کاملاً رایگان مطرح نمایید.",
    },
    {
      q: "برنامه‌ها حضوری تحویل داده می‌شوند یا آنلاین؟",
      a: "تمامی برنامه‌های تمرینی، رژیم غذایی و مکمل‌ها به همراه ویدیوهای آموزشی در پنل کاربری شما بارگذاری می‌شوند و پشتیبانی هفتگی به صورت آنلاین توسط استاد احسان ناظری انجام می‌گیرد.",
    },
    {
      q: "ساعات کاری و پاسخگویی تلفنی آکادمی به چه صورت است؟",
      a: "خطوط تلفنی روزهای شنبه تا پنج‌شنبه از ساعت ۹:۰۰ صبح تا ۲۱:۰۰ پاسخگوی شما هستند. همچنین پشتیبانی چت تلگرام در ۷ روز هفته فعال است.",
    },
    {
      q: "آیا برای دریافت برنامه نیاز به ارسال آزمایش خون هست؟",
      a: "در صورت داشتن آزمایش خون اخیر (کمتر از ۶ ماه)، ارسال آن در تلگرام کمک می‌کند برنامه غذایی و مکمل‌ها با حداکثر دقت فیزیولوژیک برای شما تنظیم گردند.",
    },
  ];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("https://fitbynazeri.com/api/consultations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: formData.fullName,
          phone: formData.phone,
          topic: formData.topic,
          notes: formData.message,
        }),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        setIsSuccess(true);
        setFormData({
          fullName: "",
          phone: "",
          topic: "مشاوره عمومی و انتخاب پکیج",
          message: "",
        });
      } else {
        setErrorMsg(data.message || "خطا در ثبت درخواست. لطفاً مجدداً تلاش کنید.");
      }
    } catch (err) {
      setErrorMsg("خطای برقراری ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی نمایید.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#141414] text-[#e5e2e1] flex flex-col selection:bg-[#ff6600] selection:text-white pb-24" dir="rtl">
      
      {/* Header */}
      <Header />

      {/* Main Full-Width Container matching Header & other site sections */}
      <div className="w-full px-6 sm:px-10 lg:px-16 pt-28 sm:pt-36">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#64748b] pb-6 border-b border-[#2c2c2e]">
          <Link href="/" className="hover:text-white transition-colors">صفحه اصلی</Link>
          <ChevronRight className="w-3.5 h-3.5 rotate-180" />
          <span className="text-[#ff6600] font-bold">تماس با ما</span>
        </div>

        {/* تک هدر صفحه: ارتباط و تماس با ما */}
        <div className="py-8 sm:py-12 space-y-3 text-right">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#e5e2e1] leading-tight">
            ارتباط و <span className="text-[#ff6600]">تماس با ما</span>
          </h1>

          <p className="text-xs sm:text-base text-[#64748b] leading-relaxed max-w-3xl font-medium">
            از طریق راه‌های ارتباطی مستقیم یا تکمیل فرم مشاوره زیر، با آکادمی و کادر فنی ناظری در ارتباط باشید.
          </p>
        </div>

        {/* دیزاین دو ستونی تمام‌عرض: سمت راست کارت‌ها روی هم، سمت چپ فرم مشاوره */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch pb-16">
          
          {/* سمت راست: کارت‌های ارتباطی (۵ ستون) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4">
            
            {/* ۱. دو کارت اصلی (تماس مستقیم و ایمیل رسمی) */}
            <div className="flex flex-col gap-4">
              {primaryChannels.map((c) => {
                const Icon = c.icon;
                const isCopied = copiedKey === c.id;

                return (
                  <div 
                    key={c.id}
                    className="p-5 sm:p-6 rounded-lg bg-[#141414] border border-[#2c2c2e] hover:border-[#ff6600]/50 transition-all duration-300 flex flex-col justify-between gap-4 shadow-lg group hover:shadow-xl hover:shadow-[#ff6600]/5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-sm bg-[#1a1a1c] border border-[#2c2c2e] text-[#ff6600] group-hover:bg-[#ff6600] group-hover:text-white flex items-center justify-center transition-colors flex-shrink-0">
                        <Icon className="w-6 h-6" />
                      </div>

                      <div className="space-y-1 text-right flex-1 min-w-0">
                        <h3 className="text-base font-bold text-[#e5e2e1] group-hover:text-[#ff6600] transition-colors truncate">
                          {c.title}
                        </h3>
                        <p className="text-xs text-[#64748b] leading-relaxed">
                          {c.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#2c2c2e] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono-tag font-bold text-xs sm:text-sm text-[#e5e2e1] tracking-wider" dir="ltr">
                          {c.value}
                        </span>
                        <button
                          onClick={() => handleCopy(c.rawValue, c.id)}
                          className="text-[#64748b] hover:text-[#ff6600] p-1.5 rounded transition-colors flex items-center gap-1 text-[11px]"
                          title="کپی"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400 text-[10px]">کپی شد</span>
                            </>
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      <a
                        href={c.actionHref}
                        target={c.actionHref.startsWith("http") ? "_blank" : undefined}
                        rel="noreferrer"
                        className="px-4 py-2 rounded-sm bg-[#1a1a1c] hover:bg-[#ff6600] text-[#e5e2e1] hover:text-white border border-[#2c2c2e] hover:border-[#ff6600] text-xs font-bold transition-all inline-flex items-center gap-2 group/btn shadow-sm"
                      >
                        <span>{c.actionText}</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover/btn:opacity-100" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ۲. کارت‌های کوچک‌تر و منظم پیام‌رسان‌ها و شبکه‌های اجتماعی (۳ کارت منظم در یک ردیف) */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              {socialChannels.map((s) => {
                const Icon = s.icon;

                return (
                  <a
                    key={s.id}
                    href={s.actionHref}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3.5 sm:p-4 rounded-lg bg-[#141414] border border-[#2c2c2e] hover:border-[#ff6600]/60 transition-all duration-200 flex flex-col items-center text-center gap-2.5 shadow-md group hover:bg-[#181818]"
                  >
                    <div className="w-9 h-9 rounded-sm bg-[#1a1a1c] border border-[#2c2c2e] text-[#ff6600] group-hover:bg-[#ff6600] group-hover:text-white flex items-center justify-center transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="space-y-0.5 w-full">
                      <span className="text-xs font-bold text-[#e5e2e1] block group-hover:text-[#ff6600] transition-colors">
                        {s.title}
                      </span>
                      <span className="text-[10px] text-[#64748b] font-mono-tag block truncate" dir="ltr">
                        {s.handle}
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>

          </div>

          {/* سمت چپ: فرم مشاوره و ارسال پیام (۷ ستون) */}
          <div className="lg:col-span-7 flex">
            <div className="w-full rounded-lg bg-[#141414] border border-[#2c2c2e] p-6 sm:p-8 lg:p-10 shadow-xl flex flex-col justify-between">
              
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="my-auto p-8 rounded-lg bg-emerald-950/30 border border-emerald-500/40 text-center space-y-4"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-emerald-400">پیام شما با موفقیت ثبت شد!</h3>
                  <p className="text-xs sm:text-sm text-[#e5e2e1]/80 max-w-md mx-auto leading-relaxed">
                    اطلاعات شما در سامانه مربیگری ناظری ثبت گردید. به زودی از طریق تماس تلفنی یا پیامک با شما ارتباط برقرار خواهیم کرد.
                  </p>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="px-6 py-2.5 rounded bg-[#1a1a1c] hover:bg-[#2c2c2e] text-xs font-bold text-[#ff6600] border border-[#2c2c2e] transition-all"
                  >
                    ارسال پیام دیگر
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 text-right text-xs sm:text-sm">
                  
                  {errorMsg && (
                    <div className="p-3.5 rounded bg-red-950/40 border border-red-500/40 text-red-400 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* نام و شماره تماس در دو ستون */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block font-medium text-[#e5e2e1]">نام و نام خانوادگی <span className="text-[#ff6600]">*</span></label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: احسان رضایی"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full bg-[#1a1a1c] border border-[#2c2c2e] rounded px-4 py-3 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600] text-xs sm:text-sm transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-medium text-[#e5e2e1]">شماره تماس <span className="text-[#ff6600]">*</span></label>
                      <input
                        type="tel"
                        required
                        dir="ltr"
                        placeholder="0912xxxxxxx"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[#1a1a1c] border border-[#2c2c2e] rounded px-4 py-3 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600] text-left text-xs sm:text-sm transition-colors"
                      />
                    </div>
                  </div>

                  {/* انتخاب موضوع */}
                  <div className="space-y-1.5">
                    <label className="block font-medium text-[#e5e2e1]">موضوع پیام / مشاوره</label>
                    <select
                      value={formData.topic}
                      onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                      className="w-full bg-[#1a1a1c] border border-[#2c2c2e] rounded px-4 py-3 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600] text-xs sm:text-sm transition-colors"
                    >
                      <option value="مشاوره عمومی و انتخاب پکیج">مشاوره عمومی و انتخاب پکیج مناسب</option>
                      <option value="بررسی آسیب‌های بدنی قبل از شروع">بررسی آسیب‌های بدنی و محدودیت‌های پزشکی</option>
                      <option value="پیگیری برنامه ورزشی و وضعیت سفارش">پیگیری برنامه ورزشی و وضعیت سفارش فعال</option>
                      <option value="سوالات مربوط به تغذیه و مکمل‌ها">سوالات مربوط به تغذیه و مکمل‌های ورزشی</option>
                      <option value="همکاری، اسپانسرینگ و امور تجاری">پیشنهاد همکاری، اسپانسرینگ یا تبلیغات</option>
                      <option value="سایر موارد">سایر موضوعات</option>
                    </select>
                  </div>

                  {/* متن پیام */}
                  <div className="space-y-1.5">
                    <label className="block font-medium text-[#e5e2e1]">متن پیام یا توضیحات تکمیلی</label>
                    <textarea
                      rows={5}
                      placeholder="در صورت تمایل سن، قد، وزن، سابقه تمرینی و سوالات خود را بنویسید..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[#1a1a1c] border border-[#2c2c2e] rounded px-4 py-3 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600] text-xs sm:text-sm transition-colors resize-none leading-relaxed"
                    />
                  </div>

                  {/* دکمه ارسال فرم */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 rounded bg-[#ff6600] hover:bg-[#ff8532] text-white font-bold text-xs sm:text-sm transition-all shadow-xl shadow-[#ff6600]/25 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2.5 group"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>در حال ثبت درخواست...</span>
                        </div>
                      ) : (
                        <>
                          <Send className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                          <span>ارسال درخواست مشاوره به آکادمی ناظری</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-[#64748b] text-center flex items-center justify-center gap-1.5 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>اطلاعات تماس شما نزد آکادمی ناظری محفوظ است و در اختیار هیچ شخص ثالثی قرار نخواهد گرفت.</span>
                  </p>

                </form>
              )}

            </div>
          </div>

        </div>

        {/* سوالات متداول به صورت تمام عرض (Full Width) و ردیف‌های زیر هم */}
        <div className="w-full pt-12 sm:pt-16 border-t border-[#2c2c2e] space-y-6 pb-16">
          <div className="text-right space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#ff6600]">
              <HelpCircle className="w-4 h-4" />
              <span>پرسش‌های پرتکرار</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#e5e2e1] leading-tight">
              سوالات متداول
            </h2>
          </div>

          <div className="w-full flex flex-col gap-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;

              return (
                <div
                  key={idx}
                  className="w-full rounded-lg bg-[#141414] border border-[#2c2c2e] hover:border-[#3a3a3c] overflow-hidden transition-all duration-200 shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-right flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[#e5e2e1] hover:text-[#ff6600] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-[#64748b] transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180 text-[#ff6600]" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-[#64748b] leading-relaxed border-t border-[#2c2c2e]/60 pt-3"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </main>
  );
}
