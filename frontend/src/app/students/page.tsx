import Link from "next/link";
import { 
  Trophy, 
  Medal, 
  ArrowLeft, 
  ChevronRight, 
  Eye
} from "lucide-react";
import Header from "@/components/Header";

async function getStudents() {
  try {
    const res = await fetch("https://fitbynazeri.com/api/students", {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.students || [];
  } catch (e) {
    return [];
  }
}

export default async function StudentsIndexPage() {
  const students = await getStudents();

  return (
    <main className="min-h-screen bg-[#141414] text-[#e5e2e1] flex flex-col selection:bg-[#ff6600] selection:text-white pb-24" dir="rtl">
      
      {/* Header */}
      <Header />

      {/* Main Container */}
      <div className="w-full px-6 sm:px-10 lg:px-16 pt-28 sm:pt-36">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#64748b] pb-6 border-b border-[#2c2c2e]">
          <Link href="/" className="hover:text-white transition-colors">صفحه اصلی</Link>
          <ChevronRight className="w-3.5 h-3.5 rotate-180" />
          <span className="text-[#ff6600] font-bold">بانک قهرمانان آکادمی</span>
        </div>

        {/* Page Header without badge and single-line compact heading */}
        <div className="py-8 sm:py-10 text-right space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#e5e2e1] leading-tight">
            قهرمانان و <span className="text-[#ff6600]">افتخارآفرینان آکادمی ناظری</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed max-w-2xl font-medium">
            مشاهده پرونده ورزشی، روند کاهش چربی، افزایش حجم عضلانی و عناوین قهرمانی قهرمانان تحت نظارت استاد احسان ناظری
          </p>
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4">
          {students.map((st: any) => {
            const medalsArr = st.medals ? st.medals.split("|").map((m: string) => m.trim()) : [];
            const topMedal = medalsArr[0] || "دوره فیتنس و ترنسفورمیشن";
            const extraCount = medalsArr.length > 1 ? medalsArr.length - 1 : 0;

            return (
              <div
                key={st.id}
                className="rounded-lg bg-[#141414] border border-[#2c2c2e] hover:border-[#ff6600]/60 overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:shadow-2xl hover:shadow-[#ff6600]/10"
              >
                {/* Image Frame */}
                <div className="relative aspect-[4/4.8] w-full overflow-hidden bg-[#141414]">
                  <img
                    src={st.image_url || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop"}
                    alt={st.full_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter contrast-110 brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-90" />

                  {/* Top Duration Badge */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-sm bg-black/80 backdrop-blur-md border border-[#2c2c2e] text-[10px] font-bold text-[#ff6600]">
                    {st.duration || "دوره فیتنس"}
                  </div>

                  {st.is_champion && (
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded-sm bg-[#ff6600] text-white text-[10px] font-bold shadow-md">
                      قهرمان برتر
                    </div>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between text-right">
                  
                  {/* Name & Category */}
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-[#e5e2e1] group-hover:text-[#ff6600] transition-colors truncate">
                      {st.full_name}
                    </h3>
                    <div className="text-[11px] text-[#64748b] font-medium truncate">{st.category}</div>
                  </div>

                  {/* Highlight Medal Pill - Pure Vazirmatn Font */}
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

                  {/* Stats snippet */}
                  <div className="grid grid-cols-2 gap-2 text-center text-[10px] pt-1">
                    <div className="p-1.5 rounded-sm bg-[#1a1a1c] border border-[#2c2c2e] text-emerald-400 font-bold truncate">
                      وزن فعلی: {st.current_weight} کیلوگرم
                    </div>
                    <div className="p-1.5 rounded-sm bg-[#1a1a1c] border border-[#2c2c2e] text-[#ff6600] font-bold truncate">
                      چربی: {st.body_fat}%
                    </div>
                  </div>

                  {/* View Profile Button */}
                  <div className="pt-2 border-t border-[#2c2c2e]">
                    <Link
                      href={`/students/${st.slug}`}
                      className="w-full py-2.5 rounded-sm bg-[#1e1e1e] hover:bg-[#ff6600] text-[#e5e2e1] hover:text-white border border-[#2c2c2e] hover:border-[#ff6600] text-xs font-bold transition-all flex items-center justify-center gap-2 group/btn shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#ff6600] group-hover/btn:text-white transition-colors" />
                      <span>مشاهده پرونده کامل و کارنامه</span>
                    </Link>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 p-8 rounded-lg bg-[#ff6600] text-black flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1 text-right">
            <h3 className="text-xl font-black">شما هم می‌خواهید ترنسفورمیشن بعدی آکادمی باشید؟</h3>
            <p className="text-xs sm:text-sm font-bold text-black/80">
              شروع آنالیز اختصاصی و دریافت رژیم غذایی و برنامه تمرینی تحت نظارت مستقیم احسان ناظری
            </p>
          </div>

          <Link
            href="/login?redirect=/get-plan"
            className="px-8 py-3.5 rounded bg-black text-white hover:bg-[#1a1a1a] text-xs sm:text-sm font-bold transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2 flex-shrink-0"
          >
            <span>دریافت برنامه اختصاصی</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

      </div>

    </main>
  );
}
