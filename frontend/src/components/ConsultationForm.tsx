"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Send, 
  Phone, 
  User, 
  ShieldCheck,
  Loader2
} from "lucide-react";

export default function ConsultationAndPlanGateway() {
  const [consultForm, setConsultForm] = useState({
    fullName: "",
    phone: "",
    topic: "مشاوره انتخاب پکیج مناسب",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleConsultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("https://fitbynazeri.com/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: consultForm.fullName,
          phone: consultForm.phone,
          topic: consultForm.topic,
        }),
      });

      const data = await res.json();
      if (res.ok && data.status === "success") {
        setIsSubmitted(true);
      } else {
        setErrorMsg(data.message || "خطا در ثبت درخواست، لطفاً دوباره تلاش کنید.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("خطا در برقراری ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="consultation" className="relative w-full py-16 sm:py-20 bg-[#ff6600] text-black overflow-hidden selection:bg-black selection:text-white flex items-center justify-center">
      
      {/* Background Subtle Noir Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-black/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl pointer-events-none" />

      {/* Full Width Container matching Header, Hero & About */}
      <div className="w-full px-6 sm:px-10 lg:px-16 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Right Column: Direct Gateway CTA to Paid Plan (5 Cols) */}
          <div className="lg:col-span-5 space-y-5 text-center lg:text-right">
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-black leading-snug">
              دریافت برنامه <br />
              <span className="text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]">تمرینی و غذایی آنلاین</span>
            </h2>

            <p className="text-xs sm:text-sm text-black/90 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0">
              برای دریافت برنامه اختصاصی خود، وارد سامانه شوید یا ثبت‌نام کنید. پس از تکمیل پرسشنامه تخصصی و پرداخت، برنامه شما مستقیماً در داشبورد قهرمان فعال و نظارت هفتگی آغاز می‌گردد.
            </p>

            {/* Direct Big Button to /get-plan */}
            <div className="pt-1 space-y-3">
              <Link
                href="/login?redirect=/get-plan"
                className="w-full py-3.5 sm:py-4 rounded bg-black hover:bg-[#1a1a1a] text-white text-xs sm:text-sm font-bold transition-all shadow-2xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group"
              >
                <span>ورود به سیستم و دریافت برنامه اختصاصی</span>
                <ArrowLeft className="w-4 h-4 text-[#ff6600] group-hover:-translate-x-1.5 transition-transform duration-200" />
              </Link>

              <div className="flex items-center justify-center lg:justify-start gap-4 text-xs font-bold text-black/80">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-black" />
                  <span>ثبت در داشبورد کاربری</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-black" />
                  <span>پرداخت امن و تحویل ۲۴ ساعته</span>
                </span>
              </div>
            </div>

          </div>

          {/* Left Column: Free Consultation Form Card (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-lg bg-[#141414] text-[#e5e2e1] border border-black/40 shadow-2xl space-y-5">
              
              <div className="border-b border-[#2c2c2e] pb-3.5 flex items-center justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#e5e2e1]">درخواست مشاوره تلفنی</h3>
                  <p className="text-xs text-[#64748b] mt-0.5">هنوز سوال دارید؟ شماره خود را بگذارید تا کمتر از ۲ ساعت آینده با شما تماس بگیریم</p>
                </div>
                <div className="w-9 h-9 rounded-sm bg-[#ff6600] flex items-center justify-center text-white font-bold shadow-md shadow-[#ff6600]/25">
                  <Phone className="w-4 h-4" />
                </div>
              </div>

              {isSubmitted ? (
                <div className="p-6 rounded bg-emerald-950/40 border border-emerald-500/40 text-center space-y-2.5 animate-in fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-emerald-400">درخواست مشاوره شما ثبت شد!</h4>
                  <p className="text-xs text-[#e5e2e1]/80 max-w-md mx-auto leading-relaxed">
                    اطلاعات شما در پنل مربی ثبت گردید. به زودی با شماره <strong className="text-white" dir="ltr">{consultForm.phone}</strong> تماس خواهیم گرفت.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setConsultForm({ fullName: "", phone: "", topic: "مشاوره انتخاب پکیج مناسب" });
                    }}
                    className="mt-2 text-xs text-[#ff6600] underline"
                  >
                    ثبت درخواست جدید
                  </button>
                </div>
              ) : (
                <form onSubmit={handleConsultSubmit} className="space-y-3.5 text-right text-xs">
                  
                  {errorMsg && (
                    <div className="p-3 rounded bg-red-950/40 border border-red-500/40 text-red-400 text-xs">
                      {errorMsg}
                    </div>
                  )}

                  {/* Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block font-medium text-[#e5e2e1] mb-1">نام و نام خانوادگی</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="مثال: علی رضایی"
                          value={consultForm.fullName}
                          onChange={(e) => setConsultForm({ ...consultForm, fullName: e.target.value })}
                          className="w-full bg-[#141414] border border-[#2c2c2e] rounded px-3.5 py-2.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600] pr-10 text-xs"
                        />
                        <User className="w-4 h-4 text-[#64748b] absolute right-3 top-3" />
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium text-[#e5e2e1] mb-1">شماره تماس (جهت تماس مربی)</label>
                      <div className="relative">
                        <input
                          type="tel"
                          required
                          dir="ltr"
                          placeholder="0912xxxxxxx"
                          value={consultForm.phone}
                          onChange={(e) => setConsultForm({ ...consultForm, phone: e.target.value })}
                          className="w-full bg-[#141414] border border-[#2c2c2e] rounded px-3.5 py-2.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600] text-left pr-10 text-xs"
                        />
                        <Phone className="w-4 h-4 text-[#64748b] absolute right-3 top-3" />
                      </div>
                    </div>
                  </div>

                  {/* Topic Select */}
                  <div>
                    <label className="block font-medium text-[#e5e2e1] mb-1">موضوع مشاوره</label>
                    <select
                      value={consultForm.topic}
                      onChange={(e) => setConsultForm({ ...consultForm, topic: e.target.value })}
                      className="w-full bg-[#141414] border border-[#2c2c2e] rounded px-3.5 py-2.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600] text-xs"
                    >
                      <option value="مشاوره انتخاب پکیج مناسب">مشاوره انتخاب پکیج و دوره مناسب</option>
                      <option value="بررسی آسیب‌دیدگی‌های بدنی قبل از ثبت‌نام">بررسی آسیب‌دیدگی‌های بدنی و مفاصل قبل از شروع</option>
                      <option value="سوال درباره رژیم غذایی و مکمل‌ها">سوال درباره رژیم غذایی و مکمل‌ها</option>
                      <option value="مشاوره دوره‌های آمادگی مسابقات">مشاوره دوره‌های آمادگی مسابقات بدنسازی</option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded bg-[#ff6600] hover:bg-[#ff8532] text-white text-xs sm:text-sm font-bold transition-all shadow-xl shadow-[#ff6600]/30 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>در حال ثبت درخواست در دیتابیس...</span>
                        </div>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>ثبت درخواست مشاوره تلفنی</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
