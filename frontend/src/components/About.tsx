"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Award, 
  GraduationCap, 
  Users, 
  Flame, 
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  User,
  Clock
} from "lucide-react";

export default function About() {
  const defaultData = {
    title_prefix: "درباره مربی و",
    title_highlight: "آکادمی ناظری",
    coach_name: "محمد مهدی ناظری",
    coach_role: "مربی رسمی فدراسیون پرورش اندام و متخصص فیزیولوژی",
    experience_badge: "۸+ سال سابقه تخصصی",
    coach_bio: "«با بیش از ۸ سال سابقه حرفه‌ای در حوزه مربیگری و بدنسازی علمی، هدف من طراحی برنامه‌هایی است که کاملاً با فیزیولوژی، ژنتیک و سفره غذایی واقعی شما منطبق باشند. در این مسیر، سلامت مفاصل، پیشرفت اصولی عضلانی و عدم بازگشت وزن اولویت شماره یک ماست.»",
    coach_image_url: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=1000&auto=format&fit=crop",
    section_title: "رویکرد علمی به تناسب اندام و سبک زندگی",
    paragraph1: "آکادمی فیتنس و بدنسازی ناظری با هدایت محمد مهدی ناظری، متدی نوین و متکی بر دانش روز دنیا را در عرصه تناسب اندام و مربیگری حرفه‌ای ارائه می‌دهد. باور بنیادین ما این است که بدن هر فرد یک ساختار فیزیولوژیکی و ژنتیکی کاملاً منحصربه‌فرد دارد؛ از این رو رویکردهای سنتی، کپی‌برداری از برنامه‌های عمومی و اعمال رژیم‌های طاقت‌فرسا نه تنها به نتیجه پایدار ختم نمی‌شوند، بلکه فرسودگی مفاصل و آسیب‌های جبران‌ناپذیر را به همراه دارند.",
    paragraph2: "برنامه‌های تغذیه و تمرین این مجموعه بدون حذف غیرمنطقی گروه‌های غذایی و متناسب با متابولیسم فردی طراحی می‌شوند تا در کنار ارتقای توان فیزیکی، فرم‌گیری ماندگار عضلات بدون بازگشت محقق شود.",
    btn_text: "دریافت برنامه",
    btn_href: "#packages",
  };

  const [data, setData] = useState(defaultData);

  // Fetch live About Section data from Go backend and sanitize coach name
  useEffect(() => {
    fetch("https://fitbynazeri.com/api/about-section")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.status === "success" && resData.about) {
          const ab = resData.about;
          const cleanText = (str: string) => {
            if (!str) return str;
            return str
              .replaceAll("استاد احسان ناظری", "محمد مهدی ناظری")
              .replaceAll("استاد محمد مهدی ناظری", "محمد مهدی ناظری")
              .replaceAll("استاد مهدی ناظری", "محمد مهدی ناظری")
              .replaceAll("احسان ناظری", "محمد مهدی ناظری")
              .replaceAll("مهدی ناظری", "محمد مهدی ناظری")
              .replaceAll("استاد ", "");
          };

          setData((prev) => ({
            ...prev,
            ...ab,
            coach_name: "محمد مهدی ناظری",
            paragraph1: cleanText(ab.paragraph1) || prev.paragraph1,
            paragraph2: cleanText(ab.paragraph2) || prev.paragraph2,
            coach_bio: cleanText(ab.coach_bio) || prev.coach_bio,
            experience_badge: "۸+ سال سابقه تخصصی",
          }));
        }
      })
      .catch(() => {
        // Fallback to default state
      });
  }, []);

  const coachCards = [
    { 
      title: "مدرک رسمی IFBB", 
      desc: "گواهینامه بین‌المللی مربیگری", 
      icon: Award 
    },
    { 
      title: "فیزیولوژی ورزشی", 
      desc: "کارشناس ارشد تربیت بدنی", 
      icon: GraduationCap 
    },
    { 
      title: "+۱,۵۰۰ ترنسفورمیشن", 
      desc: "شاگردان موفق سراسر کشور", 
      icon: Users 
    },
    { 
      title: "۸+ سال سابقه", 
      desc: "مربیگری تخصصی و علمی", 
      icon: Clock 
    },
  ];

  const academyFeatures = [
    {
      title: "طراحی مبتنی بر ژنتیک",
      desc: "برنامه‌ریزی دقیق بر پایه ساختار اسکلتی و متابولیسم فردی",
    },
    {
      title: "تغذیه اصولی و بدون گرسنگی",
      desc: "رژیم غذایی منعطف متناسب با سفره ایرانی و سبک زندگی شما",
    },
    {
      title: "پایش هفتگی مستقیم",
      desc: "تحلیل مستمر عکس‌ها، سایزها و پیشرفت با نظارت شخص مربی",
    },
    {
      title: "هایپرتروفی با حفظ مفاصل",
      desc: "رعایت دقیق زوایای بیومکانیکی برای جلوگیری از فرسودگی مفصلی",
    },
  ];

  return (
    <section id="about" className="relative w-full py-20 sm:py-28 lg:py-32 bg-[#141414] text-[#e5e2e1] border-t border-[#2c2c2e]/60 overflow-hidden" dir="rtl">
      
      {/* Background Subtle Noir Glows */}
      <div className="absolute top-10 right-1/4 w-96 h-96 bg-[#ff6600]/8 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#3e59a8]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container - Exact padding matching Header & Hero */}
      <div className="w-full px-6 sm:px-10 lg:px-16 relative z-10">
        
        {/* Outer 2-Column Grid:
            Right (lg:col-span-7): Island Box (Coach Mohammad Mehdi Nazeri: right text + left image)
            Left (lg:col-span-5): Outside Island (About Section text, pillars & 2 CTA buttons)
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-stretch">
          
          {/* سمت راست: باکس آیلند مربی محمد مهدی ناظری (Island Box) */}
          <div className="lg:col-span-7 w-full h-full flex flex-col">
            <div className="relative rounded-2xl bg-[#1a1a1c]/85 border border-[#2c2c2e] hover:border-[#ff6600]/40 transition-all duration-300 backdrop-blur-xl p-6 sm:p-7 xl:p-8 shadow-2xl shadow-black/80 overflow-hidden group h-full flex flex-col justify-between">
              
              {/* Inner ambient glow on top */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#ff6600]/10 rounded-full blur-3xl pointer-events-none" />

              {/* Inside Island: 2 Columns
                  Right inside island: Coach Info (Mohammad Mehdi Nazeri)
                  Left inside island: Coach Photo
              */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-7 items-stretch">
                
                {/* سمت راستِ درون آیلند: توضیحات مربی محمد مهدی ناظری */}
                <div className="md:col-span-7 flex flex-col justify-between space-y-4 text-right order-2 md:order-1 pt-0.5">
                  
                  {/* Top: Name & Role */}
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {data.coach_name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#ff8532] font-semibold mt-1">
                      {data.coach_role}
                    </p>
                  </div>

                  {/* Coach Bio Quote */}
                  <p className="text-xs sm:text-[13px] text-[#acabb1] leading-relaxed italic bg-black/30 p-3 rounded-lg border-r-2 border-[#ff6600]">
                    {data.coach_bio}
                  </p>

                  {/* 2x2 Grid Cards: Fills space cleanly without bullet points */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    {coachCards.map((card, idx) => {
                      const Icon = card.icon;
                      return (
                        <div 
                          key={idx} 
                          className="p-2.5 sm:p-3 rounded-xl bg-[#141414]/90 border border-white/5 hover:border-[#ff6600]/40 transition-all flex flex-col justify-between gap-1 group/card"
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#ff6600]/10 border border-[#ff6600]/20 flex items-center justify-center text-[#ff6600]">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs sm:text-[13px] font-bold text-white mt-1">
                              {card.title}
                            </div>
                            <div className="text-[10px] sm:text-[11px] text-[#87868b] leading-tight mt-0.5">
                              {card.desc}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bottom Verification Status Bar */}
                  <div className="pt-2.5 flex items-center justify-between text-xs border-t border-white/5">
                    <span className="text-[#ffe0cc] font-bold text-xs bg-[#542201]/60 border border-[#ff6600]/30 px-3 py-1 rounded">
                      {data.experience_badge}
                    </span>
                    <span className="text-[#87868b] text-[11px] flex items-center gap-1 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      مربی رسمی فدراسیون
                    </span>
                  </div>

                </div>

                {/* سمت چپِ درون آیلند: عکس مربی محمد مهدی ناظری */}
                <div className="md:col-span-5 order-1 md:order-2 flex">
                  <div className="relative aspect-[3/4] md:aspect-auto w-full h-full min-h-[380px] rounded-xl overflow-hidden border border-white/10 bg-[#141414] shadow-xl group-hover:border-[#ff6600]/30 transition-colors">
                    <img
                      src={data.coach_image_url || defaultData.coach_image_url}
                      alt={data.coach_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter contrast-105 brightness-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-80" />
                    
                    {/* Bottom Tag over Image */}
                    <div className="absolute bottom-3 inset-x-3 p-2.5 rounded-lg bg-[#141414]/90 backdrop-blur-md border border-white/10 text-center">
                      <div className="text-xs font-bold text-white tracking-wide">
                        محمد مهدی ناظری
                      </div>
                      <div className="text-[10px] text-[#acabb1] mt-0.5">
                        طراح متد تمرینی اختصاصی
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* سمت چپ (خارج از آیلند): متن درباره سکشن و فلسفه آکادمی - کاملاً هم‌ارتفاع با آیلند */}
          <div className="lg:col-span-5 w-full h-full flex flex-col justify-between text-right py-1">
            
            {/* بخش بالایی: تیتر، پاراگراف‌ها با فاصله بیشتر و کارت‌های ویژگی */}
            <div className="space-y-5 sm:space-y-6">
              
              {/* Header */}
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#f5f5f7] leading-tight tracking-tight">
                  {data.title_prefix}{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#ff6600] to-[#ffa366]">
                    {data.title_highlight}
                  </span>
                </h2>
              </div>

              {/* Paragraphs with increased line height and spacing */}
              <div className="space-y-4 text-xs sm:text-sm text-[#acabb1] leading-relaxed sm:leading-loose text-justify">
                <p>{data.paragraph1}</p>
                <p>{data.paragraph2}</p>
              </div>

              {/* Academy Core Pillars rendered as Cards filling the vertical space */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {academyFeatures.map((feat, idx) => (
                  <div 
                    key={idx} 
                    className="p-3 sm:p-3.5 rounded-xl bg-[#1a1a1c]/80 border border-[#2c2c2e] hover:border-[#ff6600]/40 transition-all flex items-start gap-3 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#ff6600]/10 border border-[#ff6600]/25 flex items-center justify-center text-[#ff6600] flex-shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="text-right">
                      <div className="text-xs sm:text-[13px] font-bold text-white group-hover:text-[#ffe0cc] transition-colors">
                        {feat.title}
                      </div>
                      <div className="text-[11px] text-[#87868b] leading-relaxed mt-0.5">
                        {feat.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* بخش پایینی: دو دکمه هم‌تراز با انتهای باکس آیلند */}
            <div className="pt-6 flex flex-wrap items-center gap-3.5">
              <Link
                href="#packages"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-sm text-xs sm:text-sm font-bold bg-[#ff6600] hover:bg-[#ff8532] text-white transition-all duration-200 shadow-lg shadow-[#ff6600]/25 hover:scale-[1.02] active:scale-[0.98] group"
              >
                <span>دریافت برنامه</span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-sm text-xs sm:text-sm font-medium text-[#f5f5f7] bg-[#1a1a1c] hover:bg-[#2c2c2e] border border-white/15 hover:border-[#ff6600]/50 backdrop-blur-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <User className="w-4 h-4 text-[#ff6600]" />
                <span>مشاهده درباره من</span>
              </Link>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
