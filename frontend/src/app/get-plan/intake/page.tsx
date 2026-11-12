"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Dumbbell, 
  Flame, 
  ChevronRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  User, 
  Activity, 
  Scale, 
  Utensils, 
  TrendingUp,
  Camera,
  Upload,
  X,
  Zap,
  Target,
  AlertCircle,
  HeartHandshake,
  Check,
  FileText
} from "lucide-react";
import Header from "@/components/Header";

type Gender = "male" | "female";
type ActivityLevel = "sedentary" | "light" | "moderate" | "very_active";
type PhotoAngle = "front" | "back" | "right" | "left";

function PlanIntakeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPlanId = searchParams.get("package") || "combo";

  const [apiPackage, setApiPackage] = useState<any | null>(null);

  useEffect(() => {
    fetch(`https://fitbynazeri.com/api/packages/${encodeURIComponent(selectedPlanId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") setApiPackage(data.package);
      })
      .catch(() => {});
  }, [selectedPlanId]);

  const packageKind: string = apiPackage?.kind || selectedPlanId;
  const isDietIncluded = packageKind === "combo" || packageKind === "diet";
  const totalSteps = isDietIncluded ? 5 : 4;

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal & Physical Stats
    age: 26,
    gender: "male" as Gender,
    height: 178,
    weight: 75,
    activityLevel: "moderate" as ActivityLevel,

    // Step 2: Fitness Goal & Location
    primaryGoal: "hypertrophy", // weight_loss, hypertrophy, strength, recomp
    trainingLocation: "gym", // gym, home
    experienceLevel: "intermediate", // beginner, intermediate, advanced
    daysPerWeek: "4",

    // Step 3: Body Photos (4 Angles)
    photos: {
      front: null as string | null,
      back: null as string | null,
      right: null as string | null,
      left: null as string | null,
    },

    // Step 4 (Conditional): Nutrition & Dietary Habits
    allergies: [] as string[],
    customAllergies: "",
    badHabits: [] as string[],
    customBadHabits: "",
    favoriteFoods: "",
    dislikedFoods: "",
    dailyMealsCount: "4",
    supplements: "",

    // Medical & injuries (asked in nutrition or workout)
    injuries: "",

    // Final Step: Coach Notes
    coachNotes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("nazeri_user");
    const token = localStorage.getItem("nazeri_token");

    if (savedUser && token) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    } else {
      // Fallback guest session for previewing
      setCurrentUser({
        id: 0,
        full_name: "ورزشکار گرامی",
        email: "guest@nazeri.fit",
        phone: "۰۹۱۲۰۰۰۰۰۰۰",
        isGuest: true,
      });
    }
  }, []);

  const planTitles: Record<string, { title: string; price: string; icon: any }> = {
    workout: { title: "برنامه تمرینی اختصاصی", price: "۹۵۰,۰۰۰ تومان", icon: Dumbbell },
    diet: { title: "برنامه غذایی و رژیم علمی", price: "۹۵۰,۰۰۰ تومان", icon: Flame },
    combo: { title: "پکیج جامع تمرین + تغذیه (VIP)", price: "۱,۵۹۰,۰۰۰ تومان", icon: Sparkles },
  };

  const fallbackPlanInfo = planTitles[selectedPlanId] || planTitles.combo;
  const currentPlanInfo = apiPackage
    ? {
        title: `${apiPackage.title} (${Number(apiPackage.duration_months).toLocaleString("fa-IR")} ماهه)`,
        price: `${Number(apiPackage.price).toLocaleString("fa-IR")} تومان`,
        icon: planTitles[apiPackage.kind]?.icon || fallbackPlanInfo.icon,
      }
    : fallbackPlanInfo;

  // Live Biometric Calculations for Step 1
  const biometrics = useMemo(() => {
    const h = Number(formData.height) || 175;
    const w = Number(formData.weight) || 75;
    const a = Number(formData.age) || 25;
    const heightInMeters = h / 100;

    const bmi = Number((w / (heightInMeters * heightInMeters)).toFixed(1));

    let category = "وزن استاندارد و متناسب";
    let categoryColor = "text-emerald-400";
    let advice = "شاخص بدنی شما در وضعیت بهینه‌ای برای اجرای برنامه‌های افزایش تفکیک عضلانی و هایپرتروفی پاک قرار دارد.";

    if (bmi < 18.5) {
      category = "کمبود وزن (نیاز به افزایش حجم)";
      categoryColor = "text-sky-400";
      advice = "شما در فاز نیاز به اضافه بار تدریجی و افزایش کالری دریافتی با تمرکز بر عضله‌سازی بدون چربی (Clean Bulking) هستید.";
    } else if (bmi >= 25 && bmi < 30) {
      category = "اضافه وزن ملایم";
      categoryColor = "text-amber-400";
      advice = "تمرکز برنامه شما بر چربی‌سوزی تدریجی همراه با حفظ حداکثری فیبرهای عضلانی و کاهش فشار روی مفاصل خواهد بود.";
    } else if (bmi >= 30) {
      category = "چاقی (نیازمند اصلاح متابولیک)";
      categoryColor = "text-rose-400";
      advice = "دوره تمرینی با شیب ملایم، تمرینات هوازی کم‌برخورد و مدیریت دقیق کربوهیدرات برای کاهش ایمن بافت چربی طراحی خواهد شد.";
    }

    const minIdealWeight = Math.round(18.5 * (heightInMeters * heightInMeters));
    const maxIdealWeight = Math.round(24.9 * (heightInMeters * heightInMeters));

    // BMR estimate
    const bmr = Math.round((10 * w) + (6.25 * h) - (5 * a) + (formData.gender === "male" ? 5 : -161));

    return {
      bmi,
      category,
      categoryColor,
      advice,
      minIdealWeight,
      maxIdealWeight,
      bmr,
    };
  }, [formData.height, formData.weight, formData.age, formData.gender]);

  // Photo handlers
  const handlePhotoUpload = (angle: PhotoAngle, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({
        ...prev,
        photos: {
          ...prev.photos,
          [angle]: reader.result as string,
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = (angle: PhotoAngle) => {
    setFormData(prev => ({
      ...prev,
      photos: {
        ...prev.photos,
        [angle]: null,
      }
    }));
  };

  // Allergy toggle
  const toggleAllergy = (item: string) => {
    setFormData(prev => {
      const exists = prev.allergies.includes(item);
      return {
        ...prev,
        allergies: exists ? prev.allergies.filter(x => x !== item) : [...prev.allergies, item],
      };
    });
  };

  // Bad habits toggle
  const toggleBadHabit = (item: string) => {
    setFormData(prev => {
      const exists = prev.badHabits.includes(item);
      return {
        ...prev,
        badHabits: exists ? prev.badHabits.filter(x => x !== item) : [...prev.badHabits, item],
      };
    });
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleSubmitIntake();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmitIntake = async () => {
    if (currentUser?.isGuest) {
      router.push(`/login?redirect=/get-plan/intake?package=${selectedPlanId}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const photosUploadedCount = [
        formData.photos.front,
        formData.photos.back,
        formData.photos.right,
        formData.photos.left,
      ].filter(Boolean).length;

      const combinedNotes = [
        `شاخص BMI: ${biometrics.bmi} (${biometrics.category})`,
        `عکس‌های ارسالی: ${photosUploadedCount} از ۴ زاویه`,
        formData.badHabits.length > 0 ? `عادات بد غذایی: ${formData.badHabits.join(", ")} ${formData.customBadHabits}` : "",
        formData.allergies.length > 0 ? `آلرژی‌ها: ${formData.allergies.join(", ")} ${formData.customAllergies}` : "",
        formData.coachNotes ? `یادداشت قهرمان: ${formData.coachNotes}` : "",
      ].filter(Boolean).join(" | ");

      const payload = {
        user_id: currentUser?.id || 0,
        user_email: currentUser?.email || "",
        user_name: currentUser?.full_name || "",
        user_phone: currentUser?.phone || "",
        package_type: packageKind,
        package_slug: selectedPlanId,
        package_title: currentPlanInfo.title,
        price: currentPlanInfo.price,
        age: Number(formData.age) || 0,
        gender: formData.gender,
        height: Number(formData.height) || 0,
        weight: Number(formData.weight) || 0,
        activity_level: formData.activityLevel,
        primary_goal: formData.primaryGoal,
        training_location: formData.trainingLocation,
        experience_level: formData.experienceLevel,
        days_per_week: formData.daysPerWeek,
        injuries: formData.injuries,
        dietary_restrictions: formData.allergies.join(", ") + (formData.customAllergies ? ` (${formData.customAllergies})` : ""),
        daily_meals_count: formData.dailyMealsCount,
        supplements: formData.supplements,
        coach_notes: combinedNotes,
        photos_json: JSON.stringify(formData.photos),
      };

      const res = await fetch("https://fitbynazeri.com/api/plan-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsCompleted(true);
      } else {
        alert("خطا در ثبت اطلاعات در سامانه، لطفاً مجدداً بررسی فرمایید.");
      }
    } catch (e) {
      console.error(e);
      alert("خطا در برقراری ارتباط با سرور");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Steps Definition
  const stepsList = useMemo(() => {
    const list = [
      { step: 1, label: "مشخصات فیزیکی", icon: Scale },
      { step: 2, label: "هدف و تمرین", icon: Dumbbell },
      { step: 3, label: "ارسال تصاویر قدی", icon: Camera },
    ];

    if (isDietIncluded) {
      list.push({ step: 4, label: "رژیم و عادات غذایی", icon: Utensils });
      list.push({ step: 5, label: "توضیحات و ثبت", icon: ShieldCheck });
    } else {
      list.push({ step: 4, label: "توضیحات و ثبت", icon: ShieldCheck });
    }

    return list;
  }, [isDietIncluded]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#141414] text-[#e5e2e1] flex items-center justify-center text-xs">
        در حال بارگذاری سامانه دریافت برنامه...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#141414] text-[#e5e2e1] flex flex-col selection:bg-[#ff6600] selection:text-white pb-24" dir="rtl">
      
      <Header />

      <div className="w-full px-6 sm:px-10 lg:px-16 pt-28 sm:pt-36 max-w-5xl mx-auto space-y-6">
        
        {/* مسیر راهنما (Breadcrumb) */}
        <div className="flex items-center gap-2 text-xs text-[#64748b] pb-2 border-b border-[#2c2c2e]">
          <Link href="/" className="hover:text-white transition-colors">صفحه اصلی</Link>
          <ChevronRight className="w-3.5 h-3.5 rotate-180" />
          <Link href="/get-plan" className="hover:text-white transition-colors">دریافت برنامه</Link>
          <ChevronRight className="w-3.5 h-3.5 rotate-180" />
          <span className="text-[#ff6600] font-bold">پرونده فیزیولوژی و هدف‌گذاری</span>
        </div>

        {/* ۱. بنر سراسری حفظ کامل محرمانگی و حریم خصوصی (در تمامی مراحل نمایش داده می‌شود) */}
        <div className="flex items-start sm:items-center gap-3 p-4 rounded-xl bg-[#121b16] border border-emerald-500/30 text-emerald-400 text-xs shadow-md">
          <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5 sm:mt-0 text-emerald-400" />
          <div className="text-right leading-relaxed">
            <strong className="font-bold text-white ml-1">اطلاعات و تصاویر شما کاملاً محفوظ است:</strong>
            <span className="text-emerald-300/90">
              تمامی اطلاعات فردی، عادات غذایی و تصاویر ارسالی شما با پروتکل رمزنگاری پیشرفته نگهداری شده و منحصراً توسط شخص استاد احسان ناظری جهت آنالیز بدنی بررسی می‌گردد و تحت هیچ شرایطی ذخیره عمومی یا منتشر نخواهد شد.
            </span>
          </div>
        </div>

        {/* ۲. کادر مشخصات قهرمان و پکیج فعال */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#141414] border border-[#2c2c2e] flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff6600]/5 rounded-full blur-3xl pointer-events-none" />

          {/* قهرمان تایید شده */}
          <div className="flex items-center gap-4 text-right relative z-10">
            <div className="w-12 h-12 rounded-xl bg-[#ff6600] text-white flex items-center justify-center font-black text-lg shadow-lg shadow-[#ff6600]/20 flex-shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#e5e2e1]">{currentUser.full_name}</h2>
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>تایید هویت</span>
                </span>
              </div>
              <p className="text-xs text-[#64748b] mt-0.5">
                تکمیل پرسشنامه فیزیولوژی، آنالیز پاسچر و طراحی برنامه آنلاین
              </p>
            </div>
          </div>

          {/* پکیج */}
          <div className="flex items-center justify-between md:justify-end gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-[#2c2c2e] relative z-10">
            <div className="text-left">
              <span className="text-[11px] text-[#64748b] block">پکیج انتخابی</span>
              <span className="text-xs sm:text-sm font-bold text-[#e5e2e1] block">{currentPlanInfo.title}</span>
              <span className="text-xs font-black text-[#ff6600]">{currentPlanInfo.price}</span>
            </div>
            <Link
              href="/get-plan"
              className="px-3 py-1.5 rounded bg-[#1a1a1c] hover:bg-[#2c2c2e] text-[#e5e2e1] text-xs font-medium border border-[#2c2c2e] hover:border-[#ff6600]/40 transition-colors"
            >
              تغییر پکیج
            </Link>
          </div>
        </div>

        {/* ۳. نوار گام‌های چند مرحله‌ای (Stepper هوشمند) */}
        <div className="py-2">
          <div className={`grid gap-2 text-center ${totalSteps === 5 ? "grid-cols-5" : "grid-cols-4"}`}>
            {stepsList.map((s) => {
              const isCurrent = currentStep === s.step;
              const isPassed = currentStep > s.step;

              return (
                <div 
                  key={s.step}
                  className={`p-2.5 sm:p-3.5 rounded-xl border text-right sm:text-center transition-all duration-300 relative ${
                    isCurrent
                      ? "bg-[#181818] border-[#ff6600] text-[#ff6600] shadow-lg shadow-[#ff6600]/10"
                      : isPassed
                      ? "bg-[#141414] border-emerald-500/30 text-emerald-400"
                      : "bg-[#111111] border-[#222222] text-[#64748b]"
                  }`}
                >
                  <div className="flex items-center justify-between sm:justify-center gap-1.5">
                    <span className="text-xs font-extrabold">۰{s.step}</span>
                    {isPassed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <s.icon className={`w-4 h-4 ${isCurrent ? "text-[#ff6600]" : "text-[#64748b]"}`} />
                    )}
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold hidden sm:block mt-1.5 truncate leading-snug">
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ۴. بدنه اصلی فرم مرحله‌ای */}
        {isCompleted ? (
          <div className="p-10 sm:p-14 rounded-2xl bg-[#141414] border border-emerald-500/40 text-center space-y-6 animate-in fade-in">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-black text-[#e5e2e1]">پرونده فیزیولوژی و تصاویر شما با موفقیت ثبت شد!</h3>
              <p className="text-xs sm:text-sm text-[#64748b] max-w-lg mx-auto leading-relaxed">
                اطلاعات بیومتریک، عادات غذایی و تصاویر پاسچر شما مستقیماً در کارتابل استاد احسان ناظری قرار گرفت. وضعیت طراحی برنامه در داشبورد کاربری شما به‌روزرسانی خواهد شد.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/dashboard"
                className="px-10 py-4 rounded bg-[#ff6600] hover:bg-[#ff8532] text-white text-xs sm:text-sm font-bold transition-all shadow-xl shadow-[#ff6600]/30"
              >
                ورود به داشبورد و پیگیری پرونده
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleNextStep} className="p-6 sm:p-10 rounded-2xl bg-[#141414] border border-[#2c2c2e] shadow-2xl space-y-8">
            
            {/* ======================================================== */}
            {/* گام ۱: مشخصات فردی و فیزیکی (Physical Stats) */}
            {/* ======================================================== */}
            {currentStep === 1 && (
              <div className="space-y-8 text-right animate-in fade-in duration-300">
                <div className="border-b border-[#2c2c2e] pb-5">
                  <div className="flex items-center gap-2 text-[#ff6600] mb-1">
                    <Scale className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">آنالیز فیزیکی و بیومتریک</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#e5e2e1]">گام اول: مشخصات فیزیکی و بیومتریک شما</h3>
                  <p className="text-xs sm:text-sm text-[#64748b] mt-1.5 leading-relaxed">
                    دقت در وارد کردن سن، قد و وزن مبنای محاسبه شاخص توده بدنی (BMI) و تنظیم بار تمرینی است.
                  </p>
                </div>

                {/* انتخاب جنسیت */}
                <div className="space-y-3">
                  <label className="text-xs sm:text-sm font-bold text-[#e5e2e1] block">
                    ۱. جنسیت شما:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div
                      onClick={() => setFormData({ ...formData, gender: "male" })}
                      className={`p-5 rounded-xl border cursor-pointer transition-all duration-200 flex items-center justify-between ${
                        formData.gender === "male"
                          ? "bg-[#ff6600]/10 border-[#ff6600] shadow-lg shadow-[#ff6600]/10"
                          : "bg-[#161616] border-[#2c2c2e] hover:border-[#3a3a3c]"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-colors ${
                          formData.gender === "male" ? "bg-[#ff6600] text-white" : "bg-[#202020] text-[#64748b]"
                        }`}>
                          <User className="w-6 h-6" />
                        </div>
                        <div className="text-right">
                          <h4 className="text-sm sm:text-base font-bold text-[#e5e2e1]">آقا (مرد)</h4>
                          <p className="text-[11px] text-[#64748b] mt-0.5">طراحی بر پایه ترشح تستوسترون و ساختار عضلانی بالاتنه</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        formData.gender === "male" ? "border-[#ff6600] bg-[#ff6600]" : "border-[#3a3a3c]"
                      }`}>
                        {formData.gender === "male" && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                      </div>
                    </div>

                    <div
                      onClick={() => setFormData({ ...formData, gender: "female" })}
                      className={`p-5 rounded-xl border cursor-pointer transition-all duration-200 flex items-center justify-between ${
                        formData.gender === "female"
                          ? "bg-[#ff6600]/10 border-[#ff6600] shadow-lg shadow-[#ff6600]/10"
                          : "bg-[#161616] border-[#2c2c2e] hover:border-[#3a3a3c]"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-colors ${
                          formData.gender === "female" ? "bg-[#ff6600] text-white" : "bg-[#202020] text-[#64748b]"
                        }`}>
                          <User className="w-6 h-6" />
                        </div>
                        <div className="text-right">
                          <h4 className="text-sm sm:text-base font-bold text-[#e5e2e1]">بانو (زن)</h4>
                          <p className="text-[11px] text-[#64748b] mt-0.5">طراحی ویژه فرم‌دهی پایین‌تنه، شکم، پهلو و تعادل هورمونی</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        formData.gender === "female" ? "border-[#ff6600] bg-[#ff6600]" : "border-[#3a3a3c]"
                      }`}>
                        {formData.gender === "female" && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* کارت‌های سن، قد و وزن با اسلایدر */}
                <div className="space-y-3">
                  <label className="text-xs sm:text-sm font-bold text-[#e5e2e1] block">
                    ۲. مشخصات فیزیکی (سن، قد و وزن فعلی):
                  </label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* سن */}
                    <div className="p-5 rounded-xl bg-[#161616] border border-[#2c2c2e] space-y-3 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#e5e2e1]">سن شما</span>
                        <span className="text-[11px] text-[#64748b]">سال</span>
                      </div>

                      <div className="flex items-center justify-center gap-3 py-2">
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, age: Math.max(14, Number(prev.age) - 1) }))}
                          className="w-10 h-10 rounded-lg bg-[#202020] hover:bg-[#2c2c2e] text-lg font-bold text-[#e5e2e1] flex items-center justify-center active:scale-95 transition-all"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min={14}
                          max={90}
                          value={formData.age}
                          onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                          className="w-24 text-center text-3xl font-black text-[#ff6600] bg-transparent focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, age: Math.min(90, Number(prev.age) + 1) }))}
                          className="w-10 h-10 rounded-lg bg-[#202020] hover:bg-[#2c2c2e] text-lg font-bold text-[#e5e2e1] flex items-center justify-center active:scale-95 transition-all"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-[11px] text-center text-[#64748b] block">
                        {formData.age < 30 ? "دوران اوج پاسخ متابولیکی و رشد سریع" : "تمرکز بر پایداری، ریکاوری و سلامت مفاصل"}
                      </span>
                    </div>

                    {/* قد */}
                    <div className="p-5 rounded-xl bg-[#161616] border border-[#2c2c2e] space-y-3 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#e5e2e1]">قد ایستاده</span>
                        <span className="text-[11px] text-[#64748b]">سانتی‌متر (cm)</span>
                      </div>

                      <div className="flex items-center justify-center gap-2 py-2">
                        <input
                          type="number"
                          min={130}
                          max={230}
                          value={formData.height}
                          onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                          className="w-28 text-center text-3xl font-black text-[#ff6600] bg-transparent focus:outline-none"
                        />
                      </div>

                      <input
                        type="range"
                        min={140}
                        max={215}
                        value={formData.height}
                        onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
                        className="w-full accent-[#ff6600] cursor-pointer"
                      />

                      <div className="flex items-center justify-between text-[10px] text-[#64748b]">
                        <button type="button" onClick={() => setFormData(p => ({ ...p, height: p.height - 1 }))} className="hover:text-white">-۱ cm</button>
                        <span>تنظیم سریع با اسلایدر</span>
                        <button type="button" onClick={() => setFormData(p => ({ ...p, height: p.height + 1 }))} className="hover:text-white">+۱ cm</button>
                      </div>
                    </div>

                    {/* وزن */}
                    <div className="p-5 rounded-xl bg-[#161616] border border-[#2c2c2e] space-y-3 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#e5e2e1]">وزن ناشتا</span>
                        <span className="text-[11px] text-[#64748b]">کیلوگرم (kg)</span>
                      </div>

                      <div className="flex items-center justify-center gap-2 py-2">
                        <input
                          type="number"
                          step="0.5"
                          min={35}
                          max={200}
                          value={formData.weight}
                          onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                          className="w-28 text-center text-3xl font-black text-[#ff6600] bg-transparent focus:outline-none"
                        />
                      </div>

                      <input
                        type="range"
                        min={45}
                        max={145}
                        step="0.5"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                        className="w-full accent-[#ff6600] cursor-pointer"
                      />

                      <div className="flex items-center justify-between text-[10px] text-[#64748b]">
                        <button type="button" onClick={() => setFormData(p => ({ ...p, weight: Number((p.weight - 0.5).toFixed(1)) }))} className="hover:text-white">-۰.۵ kg</button>
                        <span>تنظیم دقیق وزن</span>
                        <button type="button" onClick={() => setFormData(p => ({ ...p, weight: Number((p.weight + 0.5).toFixed(1)) }))} className="hover:text-white">+۰.۵ kg</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* فیلد محاسبه خودکار شاخص توده بدنی (BMI) هنگام وارد کردن قد، وزن و سن */}
                {Number(formData.height) > 0 && Number(formData.weight) > 0 && Number(formData.age) > 0 && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#171717] to-[#141414] border border-[#ff6600]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-[#ff6600]/10 border border-[#ff6600]/20 flex items-center justify-center text-[#ff6600] flex-shrink-0">
                        <Scale className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-bold text-[#e5e2e1]">شاخص توده بدنی (BMI):</span>
                          <span className="text-xl sm:text-2xl font-black text-[#ff6600]">{biometrics.bmi}</span>
                          <span className="text-xs text-[#64748b]">kg/m²</span>
                        </div>
                        <p className="text-[11px] text-[#64748b] mt-0.5">
                          محاسبه خودکار بر مبنای قد {formData.height} سانتی‌متر و وزن {formData.weight} کیلوگرم
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <span className="text-xs text-[#64748b]">وضعیت وزنی:</span>
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-lg bg-black/40 border border-[#2c2c2e] ${biometrics.categoryColor}`}>
                        {biometrics.category}
                      </span>
                    </div>
                  </div>
                )}

                {/* سطح فعالیت روزمره */}
                <div className="space-y-3">
                  <label className="text-xs sm:text-sm font-bold text-[#e5e2e1] block">
                    ۳. میزان فعالیت بدنی روزمره (خارج از ساعات ورزش):
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { id: "sedentary", title: "کم‌تحرک و نشسته", desc: "کار دفتری، پشت‌میز، بدون تحرک فیزیکی خاص", icon: Activity },
                      { id: "light", title: "فعالیت سبک روزمره", desc: "پیاده‌روی کوتاه روزانه، کارهای سبک خانگی", icon: TrendingUp },
                      { id: "moderate", title: "فعالیت متوسط و پویا", desc: "تحرک روزانه معمول، ایستادن و راه‌رفتن متناوب", icon: Flame },
                      { id: "very_active", title: "بسیار پرتحرک و سنگین", desc: "شغل یدی سنگین یا راه‌رفتن مداوم در طول روز", icon: Zap },
                    ].map((act) => {
                      const isSelected = formData.activityLevel === act.id;
                      const Icon = act.icon;

                      return (
                        <div
                          key={act.id}
                          onClick={() => setFormData({ ...formData, activityLevel: act.id as ActivityLevel })}
                          className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 text-right space-y-2 flex flex-col justify-between ${
                            isSelected
                              ? "bg-[#ff6600]/10 border-[#ff6600] text-[#ff6600]"
                              : "bg-[#161616] border-[#2c2c2e] text-[#64748b] hover:border-[#3a3a3c] hover:text-[#e5e2e1]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <Icon className={`w-5 h-5 ${isSelected ? "text-[#ff6600]" : "text-[#64748b]"}`} />
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? "border-[#ff6600] bg-[#ff6600]" : "border-[#3a3a3c]"
                            }`}>
                              {isSelected && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                            </div>
                          </div>
                          <div>
                            <h5 className={`text-xs font-bold block ${isSelected ? "text-[#e5e2e1]" : "text-[#e5e2e1]/80"}`}>
                              {act.title}
                            </h5>
                            <p className="text-[10px] text-[#64748b] mt-1 leading-snug">
                              {act.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* ======================================================== */}
            {/* گام ۲: هدف و محیط تمرین (Goal & Training) */}
            {/* ======================================================== */}
            {currentStep === 2 && (
              <div className="space-y-6 text-right animate-in fade-in duration-300">
                <div className="border-b border-[#2c2c2e] pb-4">
                  <div className="flex items-center gap-2 text-[#ff6600] mb-1">
                    <Target className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">هدف‌گذاری و فضا</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#e5e2e1]">گام دوم: هدف اصلی و محیط تمرین شما</h3>
                  <p className="text-xs sm:text-sm text-[#64748b] mt-1">مشخص نمایید در این دوره هدف اصلی شما چیست و به چه امکاناتی دسترسی دارید.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-[#e5e2e1] mb-2 font-bold">هدف اصلی شما در این دوره</label>
                    <select
                      value={formData.primaryGoal}
                      onChange={(e) => setFormData({ ...formData, primaryGoal: e.target.value })}
                      className="w-full bg-[#1a1a1c] border border-[#282828] rounded-xl px-4 py-3.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                    >
                      <option value="hypertrophy">عضله‌سازی و افزایش حجم خالص (Hypertrophy)</option>
                      <option value="weight_loss">چربی‌سوزی و کاهش وزن پایدار (Fat Loss)</option>
                      <option value="recomp">فرم‌دهی و عضله‌سازی همزمان با چربی‌سوزی (Recomposition)</option>
                      <option value="strength">افزایش قدرت، توان انفجاری و آمادگی جسمانی</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#e5e2e1] mb-2 font-bold">محیط تمرینی شما</label>
                    <select
                      value={formData.trainingLocation}
                      onChange={(e) => setFormData({ ...formData, trainingLocation: e.target.value })}
                      className="w-full bg-[#1a1a1c] border border-[#282828] rounded-xl px-4 py-3.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                    >
                      <option value="gym">باشگاه بدنسازی مجهز (دستگاه‌ها و هالتر/دمبل)</option>
                      <option value="home">منزل (دمبل، کش تمرینی یا تمرین با وزن بدن)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#e5e2e1] mb-2 font-bold">سابقه تمرینات ورزشی</label>
                    <select
                      value={formData.experienceLevel}
                      onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                      className="w-full bg-[#1a1a1c] border border-[#282828] rounded-xl px-4 py-3.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                    >
                      <option value="beginner">مبتدی (کمتر از ۶ ماه یا شروع تازه)</option>
                      <option value="intermediate">متوسط (۶ ماه تا ۲ سال تمرین مستمر)</option>
                      <option value="advanced">پیشرفته (بیش از ۲ سال سابقه مداوم)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#e5e2e1] mb-2 font-bold">تعداد روزهای تمرین در هفته</label>
                    <select
                      value={formData.daysPerWeek}
                      onChange={(e) => setFormData({ ...formData, daysPerWeek: e.target.value })}
                      className="w-full bg-[#1a1a1c] border border-[#282828] rounded-xl px-4 py-3.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                    >
                      <option value="3">۳ روز در هفته (فول‌بادی یا بالاتنه/پایین‌تنه)</option>
                      <option value="4">۴ روز در هفته (سیستم پیشنهادی و بهینه)</option>
                      <option value="5">۵ روز در هفته (اسپلیت تخصصی عضلانی)</option>
                      <option value="6">۶ روز در هفته (سیستم Push/Pull/Legs)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[#e5e2e1] mb-2 font-bold">
                      سابقه آسیب‌دیدگی، درد مفصلی یا وضعیت خاص فیزیکی (اختیاری)
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: دیسک کمر خفیف، حساسیت زانو در اسکات عمیق، یا خیر کاملاً سالم"
                      value={formData.injuries}
                      onChange={(e) => setFormData({ ...formData, injuries: e.target.value })}
                      className="w-full bg-[#1a1a1c] border border-[#282828] rounded-xl px-4 py-3.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* گام ۳ (جدید): ارسال عکس‌های قدی از ۴ زاویه */}
            {/* ======================================================== */}
            {currentStep === 3 && (
              <div className="space-y-8 text-right animate-in fade-in duration-300">
                <div className="border-b border-[#2c2c2e] pb-5">
                  <div className="flex items-center gap-2 text-[#ff6600] mb-1">
                    <Camera className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">آنالیز ساختار بدنی و پاسچر</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#e5e2e1]">گام سوم: ارسال تصاویر قدی از ۴ جهت</h3>
                  <p className="text-xs sm:text-sm text-[#64748b] mt-1.5 leading-relaxed">
                    این تصاویر جهت بررسی ناهنجاری‌های قامتی (شانه نامتقارن، لوردوز کمری، زانوی ضربدری/پرانتزی) و تخمین درصد چربی توسط استاد احسان ناظری ضروری هستند.
                  </p>
                </div>

                {/* باکس برجسته راهنمای پوشش بانوان گرامی */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-[#1c1714] to-[#161616] border border-[#ff6600]/40 text-right space-y-2 shadow-lg">
                  <div className="flex items-center gap-2 text-[#ff6600]">
                    <HeartHandshake className="w-5 h-5 flex-shrink-0" />
                    <h4 className="text-sm font-bold text-[#e5e2e1]">راهنمای ویژه پوشش بانوان گرامی:</h4>
                  </div>
                  <p className="text-xs text-[#e5e2e1]/90 leading-relaxed">
                    بانوان محترم، <strong className="text-[#ff6600]">به هیچ عنوان نیازی به ارسال تصاویر بدون لباس نیست.</strong> استفاده از لباس ورزشی استاندارد و جذب (مانند تاپ ورزشی و لگ یا شلوارک فیت) که فرم انحنای ستون فقرات، راستای زانوها و تقارن کتف‌ها در آن مشخص باشد، برای بررسی بیومکانیکی مربی کاملاً استاندارد و مکفی است.
                  </p>
                </div>

                {/* راهنمای نحوه عکس‌برداری صحیح */}
                <div className="p-4 rounded-xl bg-[#161616] border border-[#2c2c2e] text-xs text-[#64748b] space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[#e5e2e1] font-bold">
                    <AlertCircle className="w-4 h-4 text-[#ff6600]" />
                    <span>نکات مهم هنگام ثبت عکس‌ها:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 pr-1 text-[11px] leading-relaxed">
                    <li>دوربین گوشی در ارتفاع سینه (حدود ۱ متر از زمین) و موازی با بدن قرار گیرد (نه از بالا یا پایین).</li>
                    <li>در فاصله ۲ الی ۳ متری بایستید تا کل قد از نوک سر تا کف پاها در کادر تصویر مشخص باشد.</li>
                    <li>نور محیط از روبرو باشد (پشت به پنجره یا منبع نور تند نایستید).</li>
                    <li>بدن در وضعیت طبیعی، بدون انقباض شدید یا ژست‌های قهرمانی قرار داشته باشد.</li>
                  </ul>
                </div>

                {/* ۴ باکس آپلود تصاویر از ۴ زاویه */}
                <div className="space-y-3">
                  <label className="text-xs sm:text-sm font-bold text-[#e5e2e1] block">
                    بارگذاری عکس تمام‌قد از ۴ جهت:
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { key: "front" as PhotoAngle, label: "عکس از روبرو", subtitle: "مشاهده تقارن سینه و شانه" },
                      { key: "back" as PhotoAngle, label: "عکس از پشت", subtitle: "بررسی ستون فقرات و کتف‌ها" },
                      { key: "right" as PhotoAngle, label: "عکس از پهلوی راست", subtitle: "بررسی قوس کمر و گردن" },
                      { key: "left" as PhotoAngle, label: "عکس از پهلوی چپ", subtitle: "تطبیق راستای زانو و لگن" },
                    ].map((item) => {
                      const photoUrl = formData.photos[item.key];

                      return (
                        <div 
                          key={item.key}
                          className="relative flex flex-col items-center justify-between p-4 rounded-xl bg-[#161616] border border-[#2c2c2e] hover:border-[#ff6600]/40 transition-all text-center space-y-3 min-h-[260px] group"
                        >
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-[#e5e2e1] block">{item.label}</span>
                            <span className="text-[10px] text-[#64748b] block">{item.subtitle}</span>
                          </div>

                          {photoUrl ? (
                            <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden border border-emerald-500/40 bg-black group-hover:shadow-lg">
                              <img 
                                src={photoUrl} 
                                alt={item.label} 
                                className="w-full h-full object-cover" 
                              />
                              <button
                                type="button"
                                onClick={() => removePhoto(item.key)}
                                className="absolute top-2 left-2 w-7 h-7 rounded-full bg-black/80 hover:bg-rose-600 text-white flex items-center justify-center transition-colors shadow-md"
                                title="حذف تصویر"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <div className="absolute bottom-2 inset-x-2 py-1 px-2 rounded bg-black/75 backdrop-blur-sm text-[10px] font-bold text-emerald-400 flex items-center justify-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>بارگذاری شد</span>
                              </div>
                            </div>
                          ) : (
                            <label className="w-full flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed border-[#303030] hover:border-[#ff6600] bg-[#111111] hover:bg-[#181818] cursor-pointer transition-all">
                              <div className="w-11 h-11 rounded-full bg-[#1a1a1c] flex items-center justify-center text-[#ff6600] group-hover:scale-110 transition-transform">
                                <Upload className="w-5 h-5" />
                              </div>
                              <span className="text-[11px] font-bold text-[#e5e2e1]">انتخاب عکس</span>
                              <span className="text-[9px] text-[#64748b]">فرمت JPG یا PNG</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handlePhotoUpload(item.key, e)}
                              />
                            </label>
                          )}

                          <span className="text-[10px] text-[#64748b]">
                            {photoUrl ? "جهت تغییر، عکس را حذف کنید" : "کلیک برای باز شدن گالری/دوربین"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* ======================================================== */}
            {/* گام ۴ (جدید): اطلاعات تغذیه‌ای و عادات بد غذایی (فقط در صورت انتخاب تغذیه یا VIP) */}
            {/* ======================================================== */}
            {isDietIncluded && currentStep === 4 && (
              <div className="space-y-8 text-right animate-in fade-in duration-300">
                <div className="border-b border-[#2c2c2e] pb-5">
                  <div className="flex items-center gap-2 text-[#ff6600] mb-1">
                    <Utensils className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">سفره غذایی و رفتار متابولیک</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#e5e2e1]">گام چهارم: عادات بد غذایی و آلرژی‌ها</h3>
                  <p className="text-xs sm:text-sm text-[#64748b] mt-1.5 leading-relaxed">
                    رژیم شما بر مبنای احترام به سفره خانواده ایرانی طراحی می‌شود؛ با مشخص کردن آلرژی‌ها و چالش‌های غذایی، رژیمی کاربردی و بدون گرسنگی دریافت خواهید کرد.
                  </p>
                </div>

                {/* ۱. عادات بد غذایی و چالش‌های روزمره */}
                <div className="space-y-3">
                  <label className="text-xs sm:text-sm font-bold text-[#e5e2e1] block">
                    ۱. عادات بد غذایی و چالش‌هایی که با آن درگیرید (یک یا چند مورد را انتخاب کنید):
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      "ریزه‌خواری مداوم بعد از شام و آخر شب",
                      "میل شدید به شیرینی، شکلات و قندهای ساده",
                      "پرخوری عصبی در زمان استرس و کار زیاد",
                      "حذف وعده صبحانه یا غذا خوردن با بی‌نظمی شدید",
                      "علاقه زیاد به فست‌فود، غذاهای سرخ‌کردنی و سس",
                      "نوشیدن بسیار کم آب در طول روز (کمتر از ۱.۵ لیتر)",
                      "تند تند غذا خوردن و عدم جویدن مناسب",
                      "احساس نفخ و هضم سنگین غذا در معده",
                      "افت ناگهانی انرژی و سرگیجه در طول روز",
                    ].map((habit) => {
                      const isSelected = formData.badHabits.includes(habit);

                      return (
                        <div
                          key={habit}
                          onClick={() => toggleBadHabit(habit)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 text-right flex items-center justify-between gap-3 ${
                            isSelected
                              ? "bg-[#ff6600]/10 border-[#ff6600] text-[#e5e2e1]"
                              : "bg-[#161616] border-[#2c2c2e] text-[#64748b] hover:border-[#3a3a3c] hover:text-[#e5e2e1]"
                          }`}
                        >
                          <span className="text-xs font-medium leading-relaxed">{habit}</span>
                          <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center ${
                            isSelected ? "border-[#ff6600] bg-[#ff6600]" : "border-[#3a3a3c]"
                          }`}>
                            {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* عادت بد دیگر */}
                  <input
                    type="text"
                    placeholder="سایر عادات یا چالش‌های غذایی که دارید را بنویسید (اختیاری)..."
                    value={formData.customBadHabits}
                    onChange={(e) => setFormData({ ...formData, customBadHabits: e.target.value })}
                    className="w-full bg-[#1a1a1c] border border-[#282828] rounded-xl px-4 py-3 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ff6600] mt-2"
                  />
                </div>

                {/* ۲. آلرژی‌ها و پرهیزهای غذایی */}
                <div className="space-y-3">
                  <label className="text-xs sm:text-sm font-bold text-[#e5e2e1] block">
                    ۲. حساسیت‌های گوارشی، آلرژی‌ها یا پرهیزهای رژیمی:
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    {[
                      "لاکتوز شیر",
                      "گلوتن گندم",
                      "تخم‌مرغ",
                      "بادام‌زمینی / مغزیجات",
                      "غذاهای دریایی / ماهی",
                      "گوشت قرمز",
                    ].map((allergy) => {
                      const isSelected = formData.allergies.includes(allergy);

                      return (
                        <div
                          key={allergy}
                          onClick={() => toggleAllergy(allergy)}
                          className={`p-3 rounded-xl border cursor-pointer text-center transition-all ${
                            isSelected
                              ? "bg-[#ff6600]/15 border-[#ff6600] text-[#ff6600] font-bold"
                              : "bg-[#161616] border-[#2c2c2e] text-[#64748b] hover:border-[#3a3a3c]"
                          }`}
                        >
                          <span className="text-xs block">{allergy}</span>
                        </div>
                      );
                    })}
                  </div>

                  <input
                    type="text"
                    placeholder="سایر حساسیت‌ها یا مواد غذایی که به هیچ عنوان نباید در برنامه باشند..."
                    value={formData.customAllergies}
                    onChange={(e) => setFormData({ ...formData, customAllergies: e.target.value })}
                    className="w-full bg-[#1a1a1c] border border-[#282828] rounded-xl px-4 py-3 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                  />
                </div>

              </div>
            )}

            {/* ======================================================== */}
            {/* گام نهایی: یادداشت، خلاصه پرونده و تایید نهایی */}
            {/* ======================================================== */}
            {currentStep === totalSteps && (
              <div className="space-y-6 text-right animate-in fade-in duration-300">
                <div className="border-b border-[#2c2c2e] pb-4">
                  <div className="flex items-center gap-2 text-[#ff6600] mb-1">
                    <FileText className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">بازبینی و ثبت نهایی</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#e5e2e1]">گام آخر: یادداشت اختصاصی و ثبت نهایی پرونده</h3>
                  <p className="text-xs sm:text-sm text-[#64748b] mt-1">هر توضیح تکمیلی درباره ساعات کاری، زمان تمرین یا انتظارات خاص خود از دوره را در این کادر بنویسید.</p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[#e5e2e1] mb-2 font-bold">
                      یادداشت اختصاصی برای استاد احسان ناظری (اختیاری):
                    </label>
                    <textarea
                      rows={4}
                      placeholder="توضیحات تکمیلی درباره ساعات خواب، شیفت‌های کاری، مسافرت‌های پیش‌رو، انگیزه‌ها و اهداف نهایی شما..."
                      value={formData.coachNotes}
                      onChange={(e) => setFormData({ ...formData, coachNotes: e.target.value })}
                      className="w-full bg-[#1a1a1c] border border-[#282828] rounded-xl p-4 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600] leading-relaxed"
                    />
                  </div>

                  {/* کارت جامع خلاصه پرونده قهرمان */}
                  <div className="p-6 rounded-2xl bg-[#161616] border border-[#2c2c2e] space-y-4">
                    <div className="flex items-center justify-between border-b border-[#2c2c2e] pb-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#ff6600]">
                        <ShieldCheck className="w-4 h-4" />
                        <span>خلاصه پرونده فیزیولوژی و هدف ثبت‌شده</span>
                      </div>
                      <span className="text-[11px] text-emerald-400 font-bold">آماده ارجاع به مربی</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-[#64748b]">
                      <div className="p-3 rounded-lg bg-[#121212] border border-[#202020]">
                        <span className="text-[10px] block mb-1">جنسیت و سن</span>
                        <strong className="text-[#e5e2e1]">{formData.gender === "male" ? "آقا" : "بانو"} - {formData.age} سال</strong>
                      </div>

                      <div className="p-3 rounded-lg bg-[#121212] border border-[#202020]">
                        <span className="text-[10px] block mb-1">قد و وزن ناشتا</span>
                        <strong className="text-[#e5e2e1]">{formData.height} cm / {formData.weight} kg</strong>
                      </div>

                      <div className="p-3 rounded-lg bg-[#121212] border border-[#202020]">
                        <span className="text-[10px] block mb-1">شاخص توده بدنی (BMI)</span>
                        <strong className="text-[#ff6600]">{biometrics.bmi} ({biometrics.category})</strong>
                      </div>

                      <div className="p-3 rounded-lg bg-[#121212] border border-[#202020]">
                        <span className="text-[10px] block mb-1">تصاویر قدی ۴ جهت</span>
                        <strong className="text-emerald-400">
                          {[formData.photos.front, formData.photos.back, formData.photos.right, formData.photos.left].filter(Boolean).length} از ۴ زاویه
                        </strong>
                      </div>

                      <div className="p-3 rounded-lg bg-[#121212] border border-[#202020]">
                        <span className="text-[10px] block mb-1">هدف اصلی دوره</span>
                        <strong className="text-[#e5e2e1]">
                          {formData.primaryGoal === "hypertrophy" ? "هایپرتروفی و حجم" : formData.primaryGoal === "weight_loss" ? "چربی‌سوزی" : "فرم‌دهی و قدرت"}
                        </strong>
                      </div>

                      <div className="p-3 rounded-lg bg-[#121212] border border-[#202020]">
                        <span className="text-[10px] block mb-1">محیط تمرین و روزها</span>
                        <strong className="text-[#e5e2e1]">{formData.trainingLocation === "gym" ? "باشگاه" : "منزل"} ({formData.daysPerWeek} روز)</strong>
                      </div>

                      {isDietIncluded && (
                        <>
                          <div className="p-3 rounded-lg bg-[#121212] border border-[#202020]">
                            <span className="text-[10px] block mb-1">عادات بد غذایی ثبت‌شده</span>
                            <strong className="text-[#e5e2e1]">{formData.badHabits.length} مورد مشخص شد</strong>
                          </div>

                          <div className="p-3 rounded-lg bg-[#121212] border border-[#202020]">
                            <span className="text-[10px] block mb-1">آلرژی‌ها و پرهیزها</span>
                            <strong className="text-[#e5e2e1]">{formData.allergies.length > 0 ? formData.allergies.join(", ") : "بدون پرهیز خاص"}</strong>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* دکمه‌های ناوبری فرم (قبلی / بعدی) */}
            <div className="pt-6 border-t border-[#2c2c2e] flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-6 py-3.5 rounded-xl bg-[#1a1a1c] hover:bg-[#2c2c2e] text-xs font-bold text-[#64748b] hover:text-[#e5e2e1] border border-[#2c2c2e] transition-all flex items-center gap-2"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>مرحله قبل</span>
                </button>
              ) : (
                <div />
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 sm:px-10 py-4 rounded-xl bg-[#ff6600] hover:bg-[#ff8532] text-white text-xs sm:text-sm font-bold transition-all shadow-xl shadow-[#ff6600]/25 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2.5"
              >
                <span>
                  {currentStep === totalSteps 
                    ? (isSubmitting ? "در حال ارسال به مربی..." : "تایید نهایی و تکمیل درخواست") 
                    : "ادامه به مرحله بعد"}
                </span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>

          </form>
        )}

      </div>

    </main>
  );
}

export default function PlanIntakePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#141414] text-white flex items-center justify-center">در حال بارگذاری...</div>}>
      <PlanIntakeContent />
    </Suspense>
  );
}
