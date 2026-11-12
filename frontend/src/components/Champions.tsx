"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Trophy, 
  Medal, 
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Eye
} from "lucide-react";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Champions() {
  const [champions, setChampions] = useState<any[]>([
    {
      id: 1,
      slug: "amir-reza-shams",
      full_name: "امیررضا شمس",
      category: "فیزیک کلاسیک - قهرمانی کشور",
      duration: "۱۴ ماه تمرین",
      image_url: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop",
      medals: "مدال طلا کشوری ۱۴۰۴ | اورال کاپ استان تهران",
    },
    {
      id: 2,
      slug: "mahyar-taheri",
      full_name: "مهیار طاهری",
      category: "بادی بیلدینگ - دسته ۸۵ کیلو",
      duration: "۱۸ ماه تمرین",
      image_url: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1000&auto=format&fit=crop",
      medals: "مدال طلا شمال کشور | مدال برنز انتخابی تیم ملی",
    },
    {
      id: 3,
      slug: "hossein-bagheri",
      full_name: "حسین باقری",
      category: "فیزیک و ماسکولار فیزیک",
      duration: "۱۰ ماه تمرین",
      image_url: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1000&auto=format&fit=crop",
      medals: "نفر اول دسته ۱۷۸cm",
    },
  ]);

  // Fetch live champions from Go backend
  useEffect(() => {
    fetch("https://fitbynazeri.com/api/students")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success" && data.students && data.students.length > 0) {
          const champsOnly = data.students.filter((s: any) => s.is_champion);
          if (champsOnly.length > 0) {
            setChampions(champsOnly);
          } else {
            setChampions(data.students);
          }
        }
      })
      .catch((err) => console.log("Using initial champions", err));
  }, []);

  const hasMoreThanFour = champions.length > 4;

  const renderChampionCard = (champ: any) => {
    const medalsArr = champ.medals ? champ.medals.split("|").map((m: string) => m.trim()) : [];
    const topMedal = medalsArr[0] || "دوره ترنسفورمیشن و قهرمانی";
    const extraCount = medalsArr.length > 1 ? medalsArr.length - 1 : 0;

    return (
      <div className="rounded-lg bg-[#141414] border border-[#2c2c2e] hover:border-[#ff6600]/60 overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-2xl hover:shadow-[#ff6600]/10">
        
        {/* Champion Image Frame */}
        <div className="relative aspect-[4/4.5] w-full overflow-hidden bg-[#141414]">
          <img
            src={champ.image_url || "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop"}
            alt={champ.full_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter contrast-110 brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-90" />

          {/* Top Duration Badge */}
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-sm bg-black/80 backdrop-blur-md border border-[#2c2c2e] text-[10px] font-bold text-[#ff6600]">
            {champ.duration}
          </div>
        </div>

        {/* Champion Simplified Body Content */}
        <div className="p-4 space-y-3.5 text-right">
          
          {/* Name & Category */}
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-[#e5e2e1] group-hover:text-[#ff6600] transition-colors truncate">
              {champ.full_name}
            </h3>
            <div className="text-[11px] text-[#64748b] font-medium truncate">{champ.category}</div>
          </div>

          {/* Highlight Medal Pill - Persian Vazirmatn Font */}
          <div className="p-2 rounded-sm bg-[#1a1a1c] border border-[#2c2c2e] flex items-center justify-between gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 truncate">
              <Medal className="w-3.5 h-3.5 text-[#ff6600] flex-shrink-0" />
              <span className="text-[#e5e2e1] font-bold truncate">{topMedal}</span>
            </div>
            {extraCount > 0 && (
              <span className="text-[10px] text-[#ff6600] font-bold flex-shrink-0">
                +{extraCount} دیگر...
              </span>
            )}
          </div>

          {/* View Details Button linked to /students/[slug] */}
          <div className="pt-1">
            <Link
              href={`/students/${champ.slug}`}
              className="w-full py-2.5 rounded-sm bg-[#1e1e1e] hover:bg-[#ff6600] text-[#e5e2e1] hover:text-white border border-[#2c2c2e] hover:border-[#ff6600] text-xs font-bold transition-all flex items-center justify-center gap-2 group/btn shadow-sm"
            >
              <Eye className="w-3.5 h-3.5 text-[#ff6600] group-hover/btn:text-white transition-colors" />
              <span>مشاهده کارنامه و تصاویر</span>
            </Link>
          </div>

        </div>

      </div>
    );
  };

  return (
    <section id="champions" className="relative w-full py-20 sm:py-28 bg-[#0d0d0d] text-[#e5e2e1] border-t border-[#2c2c2e] overflow-hidden">
      
      {/* Full Width Container matching Header & Hero */}
      <div className="w-full px-6 sm:px-10 lg:px-16 relative z-10">
        
        {/* Section Header with Navigation Arrows if Swiper is active */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-10 sm:pb-12 border-b border-[#2c2c2e]">
          <div className="text-right">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#e5e2e1] leading-tight">
              قهرمانان برتر و <span className="text-[#ff6600]">افتخارآفرینان آکادمی</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Custom Navigation buttons mapped for intuitive left/right sliding */}
            {hasMoreThanFour && (
              <div className="flex items-center gap-2 ml-2" dir="ltr">
                <button
                  id="champ-swiper-left"
                  className="w-10 h-10 rounded-sm bg-[#1e1e1e] hover:bg-[#ff6600] text-[#e5e2e1] hover:text-white border border-[#2c2c2e] flex items-center justify-center transition-all shadow-sm group"
                  aria-label="Slide Left"
                >
                  <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
                <button
                  id="champ-swiper-right"
                  className="w-10 h-10 rounded-sm bg-[#1e1e1e] hover:bg-[#ff6600] text-[#e5e2e1] hover:text-white border border-[#2c2c2e] flex items-center justify-center transition-all shadow-sm group"
                  aria-label="Slide Right"
                >
                  <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            )}

            <Link
              href="#consultation"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-[#1e1e1e] hover:bg-[#2c2c2e] text-xs font-bold text-[#e5e2e1] border border-[#2c2c2e] hover:border-[#ff6600]/50 transition-all"
            >
              <span>مشاوره آمادگی مسابقات</span>
              <Trophy className="w-4 h-4 text-[#ff6600]" />
            </Link>
          </div>
        </div>

        {/* Content: Swiper Slider if > 4, Grid if <= 4 */}
        <div className="pt-10 w-full overflow-hidden">
          {hasMoreThanFour ? (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              navigation={{
                nextEl: "#champ-swiper-left",
                prevEl: "#champ-swiper-right",
              }}
              autoplay={{
                delay: 4500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 24 },
                1280: { slidesPerView: 4, spaceBetween: 24 },
              }}
              className="w-full overflow-hidden pb-6"
            >
              {champions.map((champ) => (
                <SwiperSlide key={champ.id} className="h-auto pb-2">
                  {renderChampionCard(champ)}
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {champions.map((champ) => (
                <div key={champ.id}>{renderChampionCard(champ)}</div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Callout */}
        <div className="mt-10 p-6 sm:p-8 rounded-lg bg-[#161616] border border-[#2c2c2e] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1 text-right">
            <h4 className="text-base sm:text-lg font-bold text-[#e5e2e1]">
              می‌خواهید قهرمان بعدی آکادمی ناظری باشید؟
            </h4>
            <p className="text-xs text-[#64748b]">
              دوره‌های تخصصی آمادگی استیج و ترنسفورمیشن VIP تحت نظارت مستقیم استاد احسان ناظری
            </p>
          </div>

          <Link
            href="/login?redirect=/get-plan"
            className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-sm bg-[#ff6600] hover:bg-[#ff8532] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#ff6600]/30 transition-all hover:scale-105 active:scale-95 flex-shrink-0"
          >
            <span>شروع دوره قهرمانی و VIP</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

      </div>

    </section>
  );
}
