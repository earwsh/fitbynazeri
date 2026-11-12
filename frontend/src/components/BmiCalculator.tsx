"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Calculator, 
  Scale, 
  Flame, 
  ArrowLeft, 
  Sparkles
} from "lucide-react";

type Gender = "male" | "female";
type ActivityLevel = "sedentary" | "moderate" | "active";

export default function BmiCalculator() {
  const [gender, setGender] = useState<Gender>("male");
  const [height, setHeight] = useState<number | "">(178);
  const [weight, setWeight] = useState<number | "">(75);
  const [age, setAge] = useState<number | "">(26);
  const [activity, setActivity] = useState<ActivityLevel>("moderate");

  // Calculations
  const calculations = useMemo(() => {
    const h = typeof height === "number" ? height : 0;
    const w = typeof weight === "number" ? weight : 0;
    const a = typeof age === "number" ? age : 25;

    if (h <= 0 || w <= 0) {
      return null;
    }

    const heightInMeters = h / 100;
    const bmi = Number((w / (heightInMeters * heightInMeters)).toFixed(1));

    // Category
    let category = "";
    let categoryColor = "";
    let categoryBg = "";
    let advice = "";

    if (bmi < 18.5) {
      category = "کمبود وزن";
      categoryColor = "text-sky-400";
      categoryBg = "bg-sky-500/15 border-sky-500/30";
      advice = "بدن شما نیاز به برنامه افزایش وزن اصولی (Clean Bulk)، تغذیه پرکالری با درشت‌مغذی‌های متوازن و تمرینات هایپرتروفی برای عضله‌سازی بدون چربی دارد.";
    } else if (bmi <= 24.9) {
      category = "وزن استاندارد و نرمال";
      categoryColor = "text-emerald-400";
      categoryBg = "bg-emerald-500/15 border-emerald-500/30";
      advice = "شاخص بدنی شما در وضعیت عالی و سلامت قرار دارد! برای بهبود تفکیک عضلانی، افزایش توان متابولیکی و ارتقای تناسب اندام، برنامه تمرینی اختصاصی پیشنهاد می‌شود.";
    } else if (bmi <= 29.9) {
      category = "اضافه وزن";
      categoryColor = "text-amber-400";
      categoryBg = "bg-amber-500/15 border-amber-500/30";
      advice = "شما در محدوده اضافه وزن هستید. با یک رژیم غذایی علمی بدون گرسنگی همراه با تمرینات ترکیبی مقاومتی و متابولیک، چربی‌های مازاد بدون آسیب به مفاصل سوزانده می‌شوند.";
    } else {
      category = "چاقی و نیازمند اقدام فوری";
      categoryColor = "text-rose-400";
      categoryBg = "bg-rose-500/15 border-rose-500/30";
      advice = "شاخص توده بدنی نشان‌دهنده چربی انباشته است که ممکن است به مفاصل زانو و ستون فقرات فشار وارد کند. شروع هرچه سریع‌تر دوره چربی‌سوزی علمی و اصلاح عادات غذایی ضروری است.";
    }

    // Ideal weight range (BMI 18.5 to 24.9)
    const minIdealWeight = Math.round(18.5 * (heightInMeters * heightInMeters));
    const maxIdealWeight = Math.round(24.9 * (heightInMeters * heightInMeters));

    // Daily calories estimate (Mifflin-St Jeor)
    let bmr = (10 * w) + (6.25 * h) - (5 * a);
    bmr = gender === "male" ? bmr + 5 : bmr - 161;

    let activityMultiplier = 1.375;
    if (activity === "sedentary") activityMultiplier = 1.2;
    if (activity === "active") activityMultiplier = 1.55;

    const maintenanceCalories = Math.round(bmr * activityMultiplier);

    return {
      bmi,
      category,
      categoryColor,
      categoryBg,
      advice,
      minIdealWeight,
      maxIdealWeight,
      maintenanceCalories,
    };
  }, [height, weight, age, gender, activity]);

  return (
    <section 
      id="bmi" 
      className="relative w-full py-16 sm:py-24 bg-[#ff6600] text-black overflow-hidden selection:bg-black selection:text-white flex items-center justify-center border-t border-[#2c2c2e]"
    >
      {/* Background Subtle Noir Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-black/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Full Width Container */}
      <div className="w-full px-6 sm:px-10 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* ستون راست: عنوان، توضیحات، ویژگی‌ها و دکمه ارجاع به برنامه (۵ ستون) */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-right">
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-black leading-snug">
              محاسبه آنلاین <br />
              <span className="text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]">
                شاخص توده بدنی (BMI)
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-black/90 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0 text-justify">
              شاخص توده بدنی (BMI) معتبرترین معیار پایه بین‌المللی برای سنجش تناسب وزن نسبت به قد است. با وارد کردن قد و وزن خود، وضعیت متابولیکی، محدوده وزن ایده‌آل و تخمین کالری مصرفی روزانه خود را در لحظه مشاهده کنید.
            </p>

            {/* ویژگی‌های کلیدی آنالیز */}
            <div className="space-y-3 pt-1 text-right max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-3 bg-black/10 p-3 rounded-lg border border-black/10">
                <Scale className="w-5 h-5 text-black flex-shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-black">سنجش علمی محدوده وزن استاندارد و سلامت مفاصل</span>
              </div>
              <div className="flex items-center gap-3 bg-black/10 p-3 rounded-lg border border-black/10">
                <Flame className="w-5 h-5 text-black flex-shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-black">تخمین کالری مصرفی روزانه و نرخ متابولیسم پایه (BMR)</span>
              </div>
              <div className="flex items-center gap-3 bg-black/10 p-3 rounded-lg border border-black/10">
                <Sparkles className="w-5 h-5 text-black flex-shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-black">پیشنهاد مسیر تمرینی و تغذیه‌ای مناسب وضعیت شما</span>
              </div>
            </div>

            {/* دکمه ارجاع مستقیم به دریافت برنامه */}
            <div className="pt-2">
              <Link
                href="/get-plan"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded bg-black hover:bg-[#1a1a1a] text-white text-xs sm:text-sm font-bold transition-all shadow-2xl hover:scale-[1.02] active:scale-[0.98] group"
              >
                <span>دریافت برنامه اختصاصی بر پایه این آنالیز</span>
                <ArrowLeft className="w-4 h-4 text-[#ff6600] group-hover:-translate-x-1.5 transition-transform duration-200" />
              </Link>
            </div>

          </div>

          {/* ستون چپ: کارت تعاملی تاریک محاسبه‌گر (۷ ستون) */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#141414] text-[#e5e2e1] border border-black/40 shadow-2xl space-y-6">
              
              {/* هدر کارت */}
              <div className="border-b border-[#2c2c2e] pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#e5e2e1] flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-[#ff6600]" />
                    <span>آنالیزور توده بدنی و کالری</span>
                  </h3>
                  <p className="text-xs text-[#64748b] mt-1">مشخصات خود را وارد کنید تا محاسبات به صورت لحظه‌ای انجام شوند</p>
                </div>

                {/* انتخاب جنسیت */}
                <div className="flex items-center bg-[#161616] p-1 rounded-sm border border-[#2c2c2e]">
                  <button
                    type="button"
                    onClick={() => setGender("male")}
                    className={`px-3 py-1.5 rounded-sm text-xs font-bold transition-colors ${
                      gender === "male"
                        ? "bg-[#ff6600] text-white shadow-sm"
                        : "text-[#64748b] hover:text-[#e5e2e1]"
                    }`}
                  >
                    آقا
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender("female")}
                    className={`px-3 py-1.5 rounded-sm text-xs font-bold transition-colors ${
                      gender === "female"
                        ? "bg-[#ff6600] text-white shadow-sm"
                        : "text-[#64748b] hover:text-[#e5e2e1]"
                    }`}
                  >
                    بانو
                  </button>
                </div>
              </div>

              {/* ورودی‌ها: قد، وزن، سن، سطح فعالیت */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* قد */}
                <div className="space-y-1.5 text-right">
                  <label className="text-xs font-bold text-[#e5e2e1]/90 flex items-center justify-between">
                    <span>قد (سانتی‌متر)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={100}
                      max={240}
                      value={height}
                      onChange={(e) => setHeight(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full bg-[#161616] border border-[#2c2c2e] focus:border-[#ff6600] rounded px-4 py-2.5 text-[#e5e2e1] font-bold text-sm focus:outline-none transition-colors"
                      placeholder="مثلاً ۱۷۸"
                    />
                    <span className="absolute left-3 top-3 text-[11px] text-[#64748b]">cm</span>
                  </div>
                </div>

                {/* وزن */}
                <div className="space-y-1.5 text-right">
                  <label className="text-xs font-bold text-[#e5e2e1]/90 flex items-center justify-between">
                    <span>وزن (کیلوگرم)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={35}
                      max={220}
                      value={weight}
                      onChange={(e) => setWeight(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full bg-[#161616] border border-[#2c2c2e] focus:border-[#ff6600] rounded px-4 py-2.5 text-[#e5e2e1] font-bold text-sm focus:outline-none transition-colors"
                      placeholder="مثلاً ۷۵"
                    />
                    <span className="absolute left-3 top-3 text-[11px] text-[#64748b]">kg</span>
                  </div>
                </div>

                {/* سن */}
                <div className="space-y-1.5 text-right">
                  <label className="text-xs font-bold text-[#e5e2e1]/90 flex items-center justify-between">
                    <span>سن (سال)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={12}
                      max={90}
                      value={age}
                      onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))}
                      className="w-full bg-[#161616] border border-[#2c2c2e] focus:border-[#ff6600] rounded px-4 py-2.5 text-[#e5e2e1] font-bold text-sm focus:outline-none transition-colors"
                      placeholder="مثلاً ۲۶"
                    />
                    <span className="absolute left-3 top-3 text-[11px] text-[#64748b]">سال</span>
                  </div>
                </div>

              </div>

              {/* سطح فعالیت روزانه */}
              <div className="space-y-2 text-right">
                <label className="text-xs font-bold text-[#e5e2e1]/90 block">
                  میزان تحرک و فعالیت هفتگی:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setActivity("sedentary")}
                    className={`py-2 px-2 text-center rounded text-xs font-medium border transition-colors ${
                      activity === "sedentary"
                        ? "bg-[#ff6600]/20 border-[#ff6600] text-[#ff6600] font-bold"
                        : "bg-[#161616] border-[#2c2c2e] text-[#64748b] hover:text-[#e5e2e1]"
                    }`}
                  >
                    کم‌تحرک (پشت‌میز)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivity("moderate")}
                    className={`py-2 px-2 text-center rounded text-xs font-medium border transition-colors ${
                      activity === "moderate"
                        ? "bg-[#ff6600]/20 border-[#ff6600] text-[#ff6600] font-bold"
                        : "bg-[#161616] border-[#2c2c2e] text-[#64748b] hover:text-[#e5e2e1]"
                    }`}
                  >
                    متوسط (۲-۳ روز تمرین)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivity("active")}
                    className={`py-2 px-2 text-center rounded text-xs font-medium border transition-colors ${
                      activity === "active"
                        ? "bg-[#ff6600]/20 border-[#ff6600] text-[#ff6600] font-bold"
                        : "bg-[#161616] border-[#2c2c2e] text-[#64748b] hover:text-[#e5e2e1]"
                    }`}
                  >
                    بسیار فعال (ورزشکار)
                  </button>
                </div>
              </div>

              {/* بخش نتایج زنده */}
              {calculations && (
                <div className="pt-2 space-y-4 border-t border-[#2c2c2e]">
                  
                  {/* نمایش عدد BMI و برچسب وضعیت */}
                  <div className="p-4 rounded-xl bg-[#141414] border border-[#2c2c2e] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="text-right space-y-1">
                      <span className="text-[11px] text-[#64748b] block">شاخص توده بدنی شما</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl sm:text-4xl font-extrabold text-[#ff6600]">
                          {calculations.bmi}
                        </span>
                        <span className="text-xs text-[#64748b]">kg/m²</span>
                      </div>
                    </div>

                    <div className={`px-4 py-2 rounded-lg border text-xs sm:text-sm font-bold text-center sm:text-right ${calculations.categoryBg} ${calculations.categoryColor}`}>
                      {calculations.category}
                    </div>
                  </div>

                  {/* گیج بصری BMI (چهار محدوده) */}
                  <div className="space-y-1.5">
                    <div className="relative h-3 w-full bg-[#202020] rounded-full overflow-hidden flex">
                      <div className="h-full w-1/4 bg-sky-500" title="کمبود وزن (< 18.5)" />
                      <div className="h-full w-1/4 bg-emerald-500" title="نرمال (18.5 - 24.9)" />
                      <div className="h-full w-1/4 bg-amber-500" title="اضافه وزن (25 - 29.9)" />
                      <div className="h-full w-1/4 bg-rose-500" title="چاقی (30+)" />
                    </div>

                    {/* راهنمای زیر گیج */}
                    <div className="flex items-center justify-between text-[10px] text-[#64748b] px-0.5">
                      <span>کمبود وزن</span>
                      <span>ایده‌آل (۱۸.۵ - ۲۴.۹)</span>
                      <span>اضافه وزن</span>
                      <span>چاقی</span>
                    </div>
                  </div>

                  {/* کارت‌های تکمیلی: محدوده وزن ایده‌آل و کالری روزانه */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    
                    <div className="p-3.5 rounded-lg bg-[#141414] border border-[#2c2c2e] text-right space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-[#64748b]">
                        <Scale className="w-3.5 h-3.5 text-[#ff6600]" />
                        <span>محدوده وزن ایده‌آل شما</span>
                      </div>
                      <div className="text-base sm:text-lg font-bold text-[#e5e2e1]">
                        {calculations.minIdealWeight} تا {calculations.maxIdealWeight} کیلوگرم
                      </div>
                    </div>

                    <div className="p-3.5 rounded-lg bg-[#141414] border border-[#2c2c2e] text-right space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-[#64748b]">
                        <Flame className="w-3.5 h-3.5 text-[#ff6600]" />
                        <span>تخمین کالری تثبیت روزانه</span>
                      </div>
                      <div className="text-base sm:text-lg font-bold text-[#e5e2e1]">
                        ~ {calculations.maintenanceCalories.toLocaleString("fa-IR")} کالری
                      </div>
                    </div>

                  </div>

                  {/* توصیه مربی بر اساس وضعیت */}
                  <div className="p-3.5 rounded-lg bg-[#181818] border border-[#282828] text-right space-y-1 text-xs leading-relaxed text-[#e5e2e1]/85">
                    <span className="font-bold text-[#ff6600] block">تحلیل مربی:</span>
                    <p>{calculations.advice}</p>
                  </div>

                </div>
              )}

            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
