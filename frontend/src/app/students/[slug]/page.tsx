import Link from "next/link";
import { 
  Trophy, 
  Medal, 
  ArrowLeft, 
  TrendingDown, 
  TrendingUp, 
  Flame, 
  User, 
  CheckCircle2, 
  Dumbbell, 
  ChevronRight
} from "lucide-react";
import Header from "@/components/Header";

async function getStudent(slug: string) {
  try {
    const res = await fetch(`https://fitbynazeri.com/api/students/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.student;
  } catch (e) {
    return null;
  }
}

export default async function StudentProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const student = await getStudent(resolvedParams.slug);

  if (!student) {
    return (
      <main className="min-h-screen bg-[#141414] text-[#e5e2e1] flex flex-col justify-center items-center p-6 text-center" dir="rtl">
        <div className="w-16 h-16 rounded-full bg-[#1e1e1e] border border-[#2c2c2e] flex items-center justify-center text-[#ff6600] mb-4">
          <User className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-[#e5e2e1] mb-2">پرونده قهرمان یافت نشد</h1>
        <p className="text-xs text-[#64748b] max-w-sm mb-6">
          قهرمانی با آدرس <span className="font-mono-tag text-emerald-400">/{resolvedParams.slug}</span> در سامانه آکادمی ثبت نشده یا دسترسی به آن محدود است.
        </p>
        <Link
          href="/students"
          className="px-6 py-2.5 rounded bg-[#ff6600] hover:bg-[#ff8532] text-white text-xs font-bold transition-all shadow-md shadow-[#ff6600]/30"
        >
          مشاهده لیست قهرمانان
        </Link>
      </main>
    );
  }

  const weightDiff = (student.initial_weight - student.current_weight).toFixed(1);
  const isLoss = student.initial_weight >= student.current_weight;
  const medalsList = student.medals ? student.medals.split("|").map((m: string) => m.trim()) : [];

  // JSON-LD Schema.org for Student Profile SEO (Person + Athlete + Achievements)
  const studentJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": student.full_name,
    "description": student.bio || `پرونده ترنسفورمیشن و قهرمانی ${student.full_name} در آکادمی ناظری`,
    "image": student.image_url,
    "jobTitle": student.category || "ورزشکار فیتنس و بدنسازی",
    "award": medalsList,
    "memberOf": {
      "@type": "SportsClub",
      "name": "آکادمی فیتنس و بدنسازی احسان ناظری",
      "url": "https://nazeri.fit",
    },
  };

  return (
    <main className="min-h-screen bg-[#141414] text-[#e5e2e1] flex flex-col selection:bg-[#ff6600] selection:text-white pb-20" dir="rtl">
      
      {/* Schema.org Person & Athlete Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(studentJsonLd) }}
      />

      {/* Header */}
      <Header />

      {/* Main Container */}
      <div className="w-full px-6 sm:px-10 lg:px-16 pt-28 sm:pt-36">
        
        {/* Breadcrumb Navigation linked to /students */}
        <div className="flex items-center gap-2 text-xs text-[#64748b] pb-8 border-b border-[#2c2c2e]">
          <Link href="/" className="hover:text-white transition-colors">صفحه اصلی</Link>
          <ChevronRight className="w-3.5 h-3.5 rotate-180" />
          <Link href="/students" className="hover:text-white transition-colors">قهرمانان</Link>
          <ChevronRight className="w-3.5 h-3.5 rotate-180" />
          <span className="text-[#ff6600] font-bold">{student.full_name}</span>
        </div>

        {/* Profile Hero Grid: Left Coach Analysis & Bio | Right Large Photo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pt-10 items-start">
          
          {/* Col Right in RTL: Image Card (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-xl bg-[#141414] border border-[#2c2c2e] p-3 overflow-hidden shadow-2xl relative">
              <div className="aspect-[4/5] rounded-lg overflow-hidden bg-[#141414] relative">
                <img
                  src={student.image_url || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop"}
                  alt={student.full_name}
                  className="w-full h-full object-cover filter contrast-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-80" />

                <div className="absolute top-4 right-4 px-3 py-1 rounded bg-black/80 backdrop-blur-md border border-[#2c2c2e] text-xs font-bold text-[#ff6600]">
                  {student.duration}
                </div>

                <div className="absolute bottom-4 inset-x-4 p-4 rounded bg-[#161616]/95 border border-[#2c2c2e] backdrop-blur-md">
                  <h1 className="text-xl font-bold text-[#e5e2e1]">{student.full_name}</h1>
                  <p className="text-xs text-[#64748b] mt-0.5">{student.category}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Col Left in RTL: Metrics, Transformation Stats, Medals & Coach Analysis (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Title */}
            <div className="space-y-2 text-right">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#e5e2e1] leading-tight">
                کارنامه ترنسفورمیشن و روند مربیگری
              </h2>
              <p className="text-xs sm:text-sm text-[#64748b]">
                پرونده ورزشی و نتایج ثبت‌شده تحت نظارت آکادمی فیتنس و بدنسازی ناظری
              </p>
            </div>

            {/* 4 Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              
              <div className="p-4 rounded-lg bg-[#141414] border border-[#2c2c2e] space-y-1">
                <span className="text-[11px] text-[#64748b] block">وزن شروع دوره</span>
                <div className="text-xl font-bold text-[#e5e2e1]">{student.initial_weight} کیلوگرم</div>
              </div>

              <div className="p-4 rounded-lg bg-[#141414] border border-[#2c2c2e] space-y-1">
                <span className="text-[11px] text-[#64748b] block">وزن فعلی</span>
                <div className="text-xl font-bold text-emerald-400">{student.current_weight} کیلوگرم</div>
              </div>

              <div className="p-4 rounded-lg bg-[#141414] border border-[#2c2c2e] space-y-1">
                <span className="text-[11px] text-[#64748b] block">درصد چربی</span>
                <div className="text-xl font-bold text-[#ff6600]">{student.body_fat}%</div>
              </div>

              <div className="p-4 rounded-lg bg-[#141414] border border-[#2c2c2e] space-y-1">
                <span className="text-[11px] text-[#64748b] block">تغییر کل وزن</span>
                <div className="text-xl font-bold text-emerald-400">
                  {isLoss ? `-${weightDiff}` : `+${Math.abs(parseFloat(weightDiff))}`} کیلوگرم
                </div>
              </div>

            </div>

            {/* Medals & Honors */}
            {medalsList.length > 0 && (
              <div className="p-6 rounded-lg bg-[#141414] border border-[#2c2c2e] space-y-4 text-right">
                <h3 className="text-sm font-bold text-[#e5e2e1] flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#ff6600]" />
                  <span>عناوین، مدال‌ها و افتخارات کسب‌شده</span>
                </h3>

                <div className="space-y-2.5">
                  {medalsList.map((medal: string, idx: number) => (
                    <div key={idx} className="p-3 rounded bg-[#1a1a1c] border border-[#2c2c2e] flex items-center gap-3 text-xs">
                      <Medal className="w-4 h-4 text-[#ff6600] flex-shrink-0" />
                      <span className="font-bold text-[#e5e2e1]">{medal}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Case Study / Bio */}
            {student.bio && (
              <div className="p-6 rounded-lg bg-[#141414] border border-[#2c2c2e] space-y-3 text-right">
                <h3 className="text-sm font-bold text-[#e5e2e1] flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-[#ff6600]" />
                  <span>شرح روند تمرینی و ترنسفورمیشن</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#e5e2e1]/80 leading-relaxed text-justify">
                  {student.bio}
                </p>
              </div>
            )}

            {/* Coach Analysis note */}
            {student.coach_notes && (
              <div className="p-6 rounded-lg bg-[#1a1a1c] border border-[#ff6600]/30 space-y-3 text-right">
                <h3 className="text-sm font-bold text-[#ff6600] flex items-center gap-2">
                  <Flame className="w-4 h-4" />
                  <span>یادداشت و تحلیل تخصصی استاد احسان ناظری</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#e5e2e1]/90 leading-relaxed text-justify">
                  {student.coach_notes}
                </p>
              </div>
            )}

            {/* Direct CTA */}
            <div className="p-6 rounded-lg bg-[#ff6600] text-black flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-black">می‌خواهید شما هم نتیجه‌ای مشابه بگیرید؟</h4>
                <p className="text-xs font-bold text-black/80 mt-0.5">دریافت برنامه تمرینی و تغذیه اختصاصی تحت نظارت مستقیم احسان ناظری</p>
              </div>
              <Link
                href="/login?redirect=/get-plan"
                className="px-6 py-3 rounded bg-black text-white hover:bg-[#1a1a1a] text-xs font-bold transition-all shadow-lg flex items-center gap-2 flex-shrink-0"
              >
                <span>شروع دوره اختصاصی</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>

          </div>

        </div>

      </div>

    </main>
  );
}
