"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Award, 
  GraduationCap, 
  Users, 
  ChevronRight, 
  ChevronLeft, 
  ArrowLeft, 
  Flame, 
  Target,
  HeartPulse,
  Activity,
  Calendar,
  X,
  Maximize2
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Header from "@/components/Header";

export default function AboutCoachPage() {
  const [cmsData, setCmsData] = useState<any>(null);
  const [activeModalImage, setActiveModalImage] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    fetch("https://fitbynazeri.com/api/about-section")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success" && data.about) {
          setCmsData(data.about);
        }
      })
      .catch(() => {});
  }, []);

  const coachName = cmsData?.coach_name || "استاد احسان ناظری";
  const coachRole = cmsData?.coach_role || "مربی ارشد فدراسیون بدنسازی و پرورش اندام";
  const coachExp = cmsData?.experience_badge || "+۸ سال سابقه حرفه‌ای";
  const coachHeroImg = cmsData?.coach_image_url || "https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=1200&auto=format&fit=crop";

  const p1 = cmsData?.paragraph1 || 
    "آکادمی فیتنس و بدنسازی ناظری با هدایت استاد ناظری، متدی نوین و متکی بر دانش روز دنیا را در عرصه تناسب اندام و مربیگری حرفه‌ای ارائه می‌دهد. باور بنیادین ما این است که بدن هر فرد یک ساختار فیزیولوژیکی و ژنتیکی کاملاً منحصربه‌فرد دارد؛ از این رو رویکردهای سنتی، کپی‌برداری از برنامه‌های عمومی و اعمال رژیم‌های طاقت‌فرسا نه تنها به نتیجه پایدار ختم نمی‌شوند، بلکه فرسودگی مفاصل و آسیب‌های جبران‌ناپذیر عضلانی را به همراه دارند.";
  
  const p2 = cmsData?.paragraph2 || 
    "در این مجموعه، برنامه‌های تمرینی بر پایه دقیق‌ترین اصول بیومکانیک حرکتی، تحریک هایپرتروفی و ارتقای توان متابولیکی تنظیم می‌گردند. رژیم‌های غذایی ارائه‌شده نیز با حفظ احترام به سفره خانواده ایرانی و ترجیحات غذایی روزمره قهرمان تدوین شده تا بدون گرسنگی مفرط و افت انرژی، کاهش چربی اصولی و فرم‌گیری عضلات محقق شود. نظارت هفتگی و به‌روزرسانی مستمر روند پیشرفت، تضمین‌کننده دستیابی شما به اندامی ماندگار و سالم خواهد بود.";

  // گالری تصاویر اسلایدری مربی
  const coachGallery = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop",
      title: "نظارت مستقیم بر تمرینات هایپرتروفی در باشگاه",
      category: "محیط تمرینی",
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1200&auto=format&fit=crop",
      title: "تمرینات تخصصی فیگورگیری و آمادگی استیج",
      category: "آمادگی مسابقات",
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1200&auto=format&fit=crop",
      title: "هدایت و اصلاح فرم بیومکانیک قهرمانان",
      category: "مربیگری اختصاصی",
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop",
      title: "آنالیز فاکتورهای بدنی و بررسی درصد چربی",
      category: "آنالیز فیزیولوژیک",
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1200&auto=format&fit=crop",
      title: "ثبت رکوردها و فاز پیشرفته بارگذاری وزنه",
      category: "تمرینات قدرتی",
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1200&auto=format&fit=crop",
      title: "جلسات برنامه‌ریزی متابولیکی و تغذیه اختصاصی",
      category: "تغذیه ورزشی",
    },
  ];

  const credentials = [
    {
      icon: Award,
      title: cmsData?.card1_title || "مدرک بین‌المللی مربیگری IFBB",
      desc: cmsData?.card1_desc || "دارای گواهینامه رسمی مربیگری حرفه‌ای فیتنس و پرورش اندام از آکادمی بین‌المللی",
    },
    {
      icon: GraduationCap,
      title: cmsData?.card2_title || "کارشناس ارشد فیزیولوژی ورزشی",
      desc: cmsData?.card2_desc || "طراحی تمرینات بر پایه علم بیومکانیک عضلات، متابولیسم و تحریک هایپرتروفی",
    },
    {
      icon: Users,
      title: cmsData?.card3_title || "بیش از ۱,۲۰۰ قهرمان موفق",
      desc: cmsData?.card3_desc || "ثبت تحولات عضلانی پایدار و نتایج درخشان در قهرمانان و ورزشکاران سراسر کشور",
    },
    {
      icon: Flame,
      title: cmsData?.card4_title || "متخصص تغذیه و متابولیسم ورزشی",
      desc: cmsData?.card4_desc || "تنظیم رژیم‌های علمی بدون گرسنگی مفرط، همگام با سفره خانواده ایرانی",
    },
  ];

  const methodologyPillars = [
    {
      icon: Target,
      title: "ارزیابی دقیق آناتومیک و فیزیولوژی",
      desc: "پیش از هر چیز، وضعیت اسکلتی، فرم مفاصل، آسیب‌های گذشته و تیپ بدنی شما بررسی می‌شود تا برنامه کاملاً منطبق بر ساختار شما باشد.",
    },
    {
      icon: HeartPulse,
      title: "تغذیه اصولی و پایدار (بدون گرسنگی)",
      desc: "هیچ گروه غذایی مفیدی حذف نمی‌شود؛ کالری و درشت‌مغذی‌ها به گونه‌ای محاسبه می‌شوند که سطح انرژی شما حین تمرین در اوج بماند.",
    },
    {
      icon: Activity,
      title: "پیشرفت تصاعدی بار تمرین (Progressive Overload)",
      desc: "سیستم تمرینی بر پایه افزایش هوشمند شدت، حجم و کنترل فاز اکسنتریک حرکات طراحی می‌شود تا عضلات مداوم در مسیر رشد قرار گیرند.",
    },
    {
      icon: Calendar,
      title: "پایش هفتگی و نظارت مداوم",
      desc: "هر هفته عکس‌ها، سایزها و تغییرات شما ارزیابی شده و در صورت نیاز ریزترین جزییات برنامه برای جلوگیری از استپ وزنی اصلاح می‌گردد.",
    },
  ];

  const timelineMilestones = [
    {
      year: "۱۳۹۶",
      title: "ورود حرفه‌ای به عرصه مسابقات و مربیگری",
      desc: "کسب عناوین استانی و کشوری در رشته بادی‌کلاسیک و فیزیک و آغاز مربیگری تخصصی در تهران.",
    },
    {
      year: "۱۳۹۸",
      title: "کسب مدارک بین‌المللی IFBB و مربیگری فدراسیون",
      desc: "تکمیل دوره‌های تخصصی فیزیولوژی ورزشی و دریافت گواهینامه معتبر مربیگری پرورش اندام.",
    },
    {
      year: "۱۴۰۰",
      title: "تاسیس آکادمی مربیگری آنلاین ناظری",
      desc: "ارائه خدمات مربیگری از راه دور با بالاترین استانداردها و پشتیبانی هفتگی برای قهرمانان سراسر ایران و خارج از کشور.",
    },
    {
      year: "۱۴۰۳ تا کنون",
      title: "تلفیق هوش مصنوعی و متدولوژی علمی",
      desc: "راهبری بیش از ۱۲۰۰ پرونده موفق ترنسفورمیشن، کاهش وزن و فرم‌دهی عضلانی به همراه توسعه پلتفرم هوشمند آکادمی.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#141414] text-[#e5e2e1] flex flex-col selection:bg-[#ff6600] selection:text-white pb-24" dir="rtl">
      
      {/* Header */}
      <Header />

      {/* Main Full-Width Container matching Header and other site sections */}
      <div className="w-full px-6 sm:px-10 lg:px-16 pt-28 sm:pt-36 space-y-16 sm:space-y-24">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#64748b] pb-6 border-b border-[#2c2c2e]">
          <Link href="/" className="hover:text-white transition-colors">صفحه اصلی</Link>
          <ChevronRight className="w-3.5 h-3.5 rotate-180" />
          <span className="text-[#ff6600] font-bold">درباره مربی</span>
        </div>

        {/* ۱. هیروسکشن دو ستونی متقارن با تصویر عریض و بزرگ مربی */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* ستون راست: متن بیوگرافی و مشخصات (۶ ستون) */}
          <div className="lg:col-span-6 space-y-6 text-right order-2 lg:order-1">
            
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#e5e2e1] leading-tight">
                سوابق و بیوگرافی <span className="text-[#ff6600]">{coachName}</span>
              </h1>

              <p className="text-base sm:text-lg text-[#ff6600] font-bold">
                {coachRole} <span className="text-[#64748b] font-normal mx-2">|</span> {coachExp}
              </p>
            </div>

            {/* متون بیوگرافی */}
            <div className="space-y-4 text-xs sm:text-sm lg:text-base text-[#e5e2e1]/85 leading-relaxed text-justify">
              <p>{p1}</p>
              <p>{p2}</p>
            </div>

            {/* آمار و شاخص‌های کلیدی (بدون هیچ بج) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-4 rounded-lg bg-[#141414] border border-[#2c2c2e] text-right space-y-1 shadow-sm">
                <span className="text-xl sm:text-2xl font-black text-[#ff6600] block">۱,۲۰۰+</span>
                <span className="text-xs text-[#64748b]">قهرمان موفق</span>
              </div>
              <div className="p-4 rounded-lg bg-[#141414] border border-[#2c2c2e] text-right space-y-1 shadow-sm">
                <span className="text-xl sm:text-2xl font-black text-[#ff6600] block">+۸</span>
                <span className="text-xs text-[#64748b]">سال سابقه رسمی</span>
              </div>
              <div className="p-4 rounded-lg bg-[#141414] border border-[#2c2c2e] text-right space-y-1 shadow-sm">
                <span className="text-xl sm:text-2xl font-black text-[#ff6600] block">۹۸٪</span>
                <span className="text-xs text-[#64748b]">رضایت قهرمانان</span>
              </div>
              <div className="p-4 rounded-lg bg-[#141414] border border-[#2c2c2e] text-right space-y-1 shadow-sm">
                <span className="text-xl sm:text-2xl font-black text-[#ff6600] block">۴,۰۰۰+</span>
                <span className="text-xs text-[#64748b]">برنامه تنظیم‌شده</span>
              </div>
            </div>

            {/* دکمه‌های اقدام سریع */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/get-plan"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-sm text-xs sm:text-sm font-bold bg-[#ff6600] hover:bg-[#ff8532] text-white transition-all duration-200 shadow-xl shadow-[#ff6600]/20 hover:scale-[1.02] active:scale-[0.98] group"
              >
                <span>دریافت برنامه اختصاصی از مربی</span>
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-sm text-xs sm:text-sm font-bold bg-[#1a1a1c] hover:bg-[#2c2c2e] text-[#e5e2e1] border border-[#2c2c2e] hover:border-[#ff6600]/40 transition-all"
              >
                <span>مشاوره و ارتباط مستقیم</span>
              </Link>
            </div>

          </div>

          {/* ستون چپ: تصویر عریض و بزرگ مربی پرکننده کل عرض ستون (۶ ستون) */}
          <div className="lg:col-span-6 order-1 lg:order-2 w-full">
            <div className="relative w-full h-[520px] sm:h-[620px] lg:h-[680px] rounded-2xl overflow-hidden bg-[#141414] border border-[#2c2c2e] shadow-2xl group">
              
              {/* عکس بزرگ و عریض مربی */}
              <img
                src={coachHeroImg}
                alt={coachName}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* گرادینت تیره روی تصویر جهت نمایش اطلاعات مربی */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-black/20 to-transparent opacity-95" />
              
              {/* نام و تخصص مربی روی تصویر در پایین */}
              <div className="absolute bottom-6 right-6 left-6 text-right space-y-1">
                <h3 className="text-xl sm:text-2xl font-bold text-white drop-shadow-md">
                  {coachName}
                </h3>
                <p className="text-xs sm:text-sm text-[#ff6600] font-medium drop-shadow-sm">
                  {coachRole}
                </p>
              </div>

            </div>
          </div>

        </section>

        {/* ۲. سکشن گالری تصاویر مربی به صورت اسلایدر حرفه‌ای */}
        <section className="space-y-8 pt-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#2c2c2e]">
            <div className="text-right space-y-1.5">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#e5e2e1] leading-tight">
                گالری تصاویر و <span className="text-[#ff6600]">فعالیت‌های مربی</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#64748b]">
                گوشه‌هایی از تمرینات در باشگاه، جلسات آنالیز بدنی و مربیگری اختصاصی استاد ناظری
              </p>
            </div>

            {/* دکمه‌های کنترل اسلایدر */}
            <div className="flex items-center gap-2" dir="ltr">
              <button
                id="gallery-slider-left"
                className="w-10 h-10 rounded-sm bg-[#1e1e1e] hover:bg-[#ff6600] text-[#e5e2e1] hover:text-white border border-[#2c2c2e] flex items-center justify-center transition-all shadow-sm group"
                aria-label="Slide Left"
              >
                <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
              <button
                id="gallery-slider-right"
                className="w-10 h-10 rounded-sm bg-[#1e1e1e] hover:bg-[#ff6600] text-[#e5e2e1] hover:text-white border border-[#2c2c2e] flex items-center justify-center transition-all shadow-sm group"
                aria-label="Slide Right"
              >
                <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>

          {/* اسلایدر با ماژول‌های Swiper */}
          <div className="pt-2 w-full overflow-hidden">
            <Swiper
              modules={[Navigation, Autoplay, Pagination]}
              navigation={{
                nextEl: "#gallery-slider-left",
                prevEl: "#gallery-slider-right",
              }}
              autoplay={{
                delay: 4000,
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
              className="w-full overflow-hidden pb-4"
            >
              {coachGallery.map((img) => (
                <SwiperSlide key={img.id} className="h-auto">
                  <div 
                    onClick={() => setActiveModalImage({ url: img.url, title: img.title })}
                    className="group relative rounded-lg bg-[#141414] border border-[#2c2c2e] hover:border-[#ff6600]/60 overflow-hidden cursor-pointer transition-all duration-300 shadow-md hover:shadow-2xl hover:shadow-[#ff6600]/10 flex flex-col justify-between"
                  >
                    <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-[#181818]">
                      <img
                        src={img.url}
                        alt={img.title}
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      
                      <div className="absolute top-3 left-3 w-8 h-8 rounded-sm bg-black/75 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Maximize2 className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="p-4 space-y-1 text-right bg-[#141414]">
                      <span className="text-[11px] text-[#ff6600] font-bold block">
                        {img.category}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-[#e5e2e1] group-hover:text-[#ff6600] transition-colors line-clamp-1">
                        {img.title}
                      </h3>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

        </section>

        {/* ۳. مدارک و گواهینامه‌های رسمی (۴ کارت مرتب، بدون هیچ بج) */}
        <section className="pt-10 border-t border-[#2c2c2e] space-y-8">
          
          <div className="text-right space-y-1.5">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#e5e2e1] leading-tight">
              مدارک، گواهینامه‌ها و <span className="text-[#ff6600]">سوابق علمی</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#64748b]">
              صلاحیت‌های تخصصی و مدارک رسمی بین‌المللی مربیگری
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {credentials.map((cred, idx) => {
              const Icon = cred.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-lg bg-[#141414] border border-[#2c2c2e] hover:border-[#ff6600]/50 transition-all duration-300 space-y-3.5 text-right group hover:shadow-xl hover:shadow-[#ff6600]/5"
                >
                  <div className="w-12 h-12 rounded-sm bg-[#1a1a1c] border border-[#2c2c2e] text-[#ff6600] group-hover:bg-[#ff6600] group-hover:text-white flex items-center justify-center transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-base font-bold text-[#e5e2e1] group-hover:text-[#ff6600] transition-colors leading-snug">
                    {cred.title}
                  </h3>

                  <p className="text-xs text-[#64748b] leading-relaxed">
                    {cred.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </section>

        {/* ۴. اصول متدولوژی مربیگری آکادمی (بدون هیچ بج) */}
        <section className="pt-10 border-t border-[#2c2c2e] space-y-8">
          
          <div className="text-right space-y-1.5">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#e5e2e1] leading-tight">
              اصول بنیادین متدولوژی <span className="text-[#ff6600]">آکادمی ناظری</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#64748b]">
              رویکرد علمی به تمرین، پیشگیری از آسیب و رسیدن به تناسب اندام ماندگار
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {methodologyPillars.map((pil, idx) => {
              const Icon = pil.icon;
              return (
                <div
                  key={idx}
                  className="p-6 sm:p-7 rounded-lg bg-[#141414] border border-[#2c2c2e] hover:border-[#ff6600]/40 transition-all flex items-start gap-4 text-right group"
                >
                  <div className="w-11 h-11 rounded-sm bg-[#1a1a1c] border border-[#2c2c2e] text-[#ff6600] group-hover:bg-[#ff6600] group-hover:text-white flex items-center justify-center flex-shrink-0 transition-colors mt-0.5">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-[#e5e2e1] group-hover:text-[#ff6600] transition-colors">
                      {pil.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed">
                      {pil.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </section>

        {/* ۵. مسیر حرفه‌ای و رشد آکادمی (بدون هیچ بج) */}
        <section className="pt-10 border-t border-[#2c2c2e] space-y-8">
          
          <div className="text-right space-y-1.5">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#e5e2e1] leading-tight">
              مسیر حرفه‌ای و <span className="text-[#ff6600]">رشد آکادمی</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#64748b]">
              مراحل طی‌شده از ورزش قهرمانی تا تأسیس آکادمی تخصصی مربیگری
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {timelineMilestones.map((m, idx) => (
              <div
                key={idx}
                className="p-6 rounded-lg bg-[#141414] border border-[#2c2c2e] hover:border-[#ff6600]/50 transition-all space-y-3 text-right group"
              >
                <span className="text-2xl font-black text-[#ff6600] block">
                  {m.year}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-[#e5e2e1] group-hover:text-[#ff6600] transition-colors">
                  {m.title}
                </h3>
                <p className="text-xs text-[#64748b] leading-relaxed">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>

        </section>

        {/* ۶. بنر اقدام نهایی (CTA) */}
        <section className="pt-8 pb-10">
          <div className="rounded-2xl bg-gradient-to-r from-[#1a1a1c] to-[#141414] border border-[#2c2c2e] p-8 sm:p-12 text-center lg:text-right flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
            
            <div className="space-y-3 max-w-2xl">
              <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                آماده‌اید تحول بدنی خود را تحت نظارت <span className="text-[#ff6600]">{coachName}</span> آغاز کنید؟
              </h3>
              <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed">
                با تکمیل پرسشنامه تخصصی، برنامه تمرینی و غذایی کاملاً اختصاصی شما بر اساس اهداف شخصی طراحی و در پنل کاربری فعال می‌گردد.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 flex-shrink-0">
              <Link
                href="/get-plan"
                className="px-8 py-4 rounded-sm bg-[#ff6600] hover:bg-[#ff8532] text-white font-bold text-xs sm:text-sm transition-all shadow-xl shadow-[#ff6600]/25 hover:scale-105 active:scale-95"
              >
                دریافت برنامه اختصاصی
              </Link>
              <Link
                href="/contact"
                className="px-6 py-4 rounded-sm bg-[#141414] hover:bg-[#2c2c2e] text-[#e5e2e1] border border-[#2c2c2e] font-bold text-xs sm:text-sm transition-colors"
              >
                درخواست مشاوره تلفنی
              </Link>
            </div>

          </div>
        </section>

      </div>

      {/* مودال مشاهده تصویر گالری با سایز بزرگ */}
      {activeModalImage && (
        <div 
          onClick={() => setActiveModalImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full bg-[#141414] border border-[#2c2c2e] rounded-xl overflow-hidden shadow-2xl space-y-3 p-4 text-right"
          >
            <div className="flex items-center justify-between border-b border-[#2c2c2e] pb-3">
              <span className="text-sm font-bold text-[#e5e2e1]">{activeModalImage.title}</span>
              <button 
                onClick={() => setActiveModalImage(null)}
                className="p-1.5 rounded-sm bg-[#1a1a1c] text-[#e5e2e1] hover:text-[#ff6600] border border-[#2c2c2e]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="relative max-h-[75vh] w-full flex items-center justify-center overflow-hidden rounded">
              <img 
                src={activeModalImage.url} 
                alt={activeModalImage.title}
                className="max-h-[70vh] w-auto object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
