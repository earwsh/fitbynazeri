"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldAlert, CheckCircle2, Dumbbell } from "lucide-react";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/dashboard";

  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("https://fitbynazeri.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "اطلاعات ورود نادرست است");
      }

      setResult(data);
      if (typeof window !== "undefined") {
        localStorage.setItem("nazeri_user", JSON.stringify(data.user));
        localStorage.setItem("nazeri_token", data.token);
        setTimeout(() => {
          router.push(redirectTarget);
        }, 800);
      }
    } catch (err: any) {
      setError(err.message || "خطا در اتصال به سرور");
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("https://fitbynazeri.com/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: name,
          email,
          phone,
          password,
          role: "student",
          is_active: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "خطا در ایجاد حساب کاربری");
      }

      // Auto login after signup
      const loginRes = await fetch("https://fitbynazeri.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const loginData = await loginRes.json();

      if (loginRes.ok && loginData.token) {
        if (typeof window !== "undefined") {
          localStorage.setItem("nazeri_user", JSON.stringify(loginData.user));
          localStorage.setItem("nazeri_token", loginData.token);
        }
      }

      setResult({ user: data.user });
      setTimeout(() => {
        router.push(redirectTarget);
      }, 800);
    } catch (err: any) {
      setError(err.message || "خطا در برقراری ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mt-16 md:mt-0">
      
      {/* تب‌های جابه‌جایی ورود و ثبت‌نام */}
      <div className="flex border-b border-[#3a3a3c] mb-8">
        <button 
          type="button"
          onClick={() => {
            setActiveTab("login");
            setError(null);
            setResult(null);
          }}
          className={`flex-1 py-4 text-center text-sm font-bold tracking-wider transition-colors duration-200 border-b-2 ${
            activeTab === "login" 
              ? "text-[#ff6600] border-[#ff6600]" 
              : "text-[#e3bfb1] border-transparent hover:text-[#e5e2e1]"
          }`}
        >
          ورود به حساب
        </button>
        <button 
          type="button"
          onClick={() => {
            setActiveTab("signup");
            setError(null);
            setResult(null);
          }}
          className={`flex-1 py-4 text-center text-sm font-bold tracking-wider transition-colors duration-200 border-b-2 ${
            activeTab === "signup" 
              ? "text-[#ff6600] border-[#ff6600]" 
              : "text-[#e3bfb1] border-transparent hover:text-[#e5e2e1]"
          }`}
        >
          ثبت‌نام جدید
        </button>
      </div>

      {/* فرم ورود */}
      {activeTab === "login" && (
        <form onSubmit={handleLoginSubmit} className="space-y-6">
          <div className="space-y-2 text-right">
            <label className="block text-xs font-medium text-[#e3bfb1]" htmlFor="email-login">
              آدرس ایمیل
            </label>
            <input 
              id="email-login"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com" 
              required
              dir="ltr"
              className="w-full bg-[#141414] text-[#e5e2e1] text-sm rounded border border-[#3a3a3c] px-4 py-3 focus:outline-none focus:border-[#ff6600] focus:ring-1 focus:ring-[#ff6600] transition-all duration-200 placeholder-[#e3bfb1]/40 text-left"
            />
          </div>

          <div className="space-y-2 text-right">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-medium text-[#e3bfb1]" htmlFor="password-login">
                کلمه عبور
              </label>
            </div>
            <input 
              id="password-login"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              required
              dir="ltr"
              className="w-full bg-[#141414] text-[#e5e2e1] text-sm rounded border border-[#3a3a3c] px-4 py-3 focus:outline-none focus:border-[#ff6600] focus:ring-1 focus:ring-[#ff6600] transition-all duration-200 placeholder-[#e3bfb1]/40 text-left"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#ff6600] hover:bg-[#ff8532] text-white text-sm font-bold py-4 rounded transition-all duration-200 shadow-[0_0_15px_rgba(255, 102, 0,0.25)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? "در حال ورود..." : "ورود به سامانه"}
          </button>
        </form>
      )}

      {/* فرم ثبت نام جدید */}
      {activeTab === "signup" && (
        <form onSubmit={handleSignupSubmit} className="space-y-5">
          <div className="space-y-2 text-right">
            <label className="block text-xs font-medium text-[#e3bfb1]" htmlFor="name-signup">
              نام و نام خانوادگی
            </label>
            <input 
              id="name-signup"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: علی احمدی" 
              required
              className="w-full bg-[#141414] text-[#e5e2e1] text-sm rounded border border-[#3a3a3c] px-4 py-3 focus:outline-none focus:border-[#ff6600] focus:ring-1 focus:ring-[#ff6600] transition-all duration-200 placeholder-[#e3bfb1]/40"
            />
          </div>

          <div className="space-y-2 text-right">
            <label className="block text-xs font-medium text-[#e3bfb1]" htmlFor="phone-signup">
              شماره موبایل
            </label>
            <input 
              id="phone-signup"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="09123456789" 
              dir="ltr"
              className="w-full bg-[#141414] text-[#e5e2e1] text-sm rounded border border-[#3a3a3c] px-4 py-3 focus:outline-none focus:border-[#ff6600] focus:ring-1 focus:ring-[#ff6600] transition-all duration-200 placeholder-[#e3bfb1]/40 text-left"
            />
          </div>

          <div className="space-y-2 text-right">
            <label className="block text-xs font-medium text-[#e3bfb1]" htmlFor="email-signup">
              آدرس ایمیل
            </label>
            <input 
              id="email-signup"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com" 
              required
              dir="ltr"
              className="w-full bg-[#141414] text-[#e5e2e1] text-sm rounded border border-[#3a3a3c] px-4 py-3 focus:outline-none focus:border-[#ff6600] focus:ring-1 focus:ring-[#ff6600] transition-all duration-200 placeholder-[#e3bfb1]/40 text-left"
            />
          </div>

          <div className="space-y-2 text-right">
            <label className="block text-xs font-medium text-[#e3bfb1]" htmlFor="password-signup">
              کلمه عبور
            </label>
            <input 
              id="password-signup"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="حداقل ۶ کاراکتر" 
              required
              dir="ltr"
              className="w-full bg-[#141414] text-[#e5e2e1] text-sm rounded border border-[#3a3a3c] px-4 py-3 focus:outline-none focus:border-[#ff6600] focus:ring-1 focus:ring-[#ff6600] transition-all duration-200 text-left"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#ff6600] hover:bg-[#ff8532] text-white text-sm font-bold py-4 rounded transition-all duration-200 shadow-[0_0_15px_rgba(255, 102, 0,0.25)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? "در حال ایجاد حساب..." : "ثبت‌نام و ادامه"}
          </button>
        </form>
      )}

      {/* پیام‌های وضعیت لاگین */}
      {error && (
        <div className="mt-4 p-3 rounded bg-[#ffb4ab]/10 border border-[#ffb4ab]/30 flex items-center gap-2 text-xs text-[#ffb4ab]">
          <ShieldAlert className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="mt-4 p-3.5 rounded bg-[#141414] border border-emerald-500/40 space-y-1 text-xs text-emerald-400">
          <div className="flex items-center gap-1.5 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>عملیات موفقیت‌آمیز! در حال انتقال...</span>
          </div>
        </div>
      )}

    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="bg-[#141414] text-[#e5e2e1] min-h-screen flex flex-col md:flex-row antialiased selection:bg-[#ff6600] selection:text-white" dir="rtl">
      
      {/* سمت راست: کانتینر فرم احراز هویت */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 bg-[#0e0e0e] relative overflow-y-auto min-h-screen">
        
        {/* هدر برند در حالت موبایل */}
        <div className="absolute top-6 right-6 md:hidden">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#ff6600] flex items-center justify-center text-white">
              <Dumbbell className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-[#ff6600]">آکادمی ناظری</span>
          </Link>
        </div>

        <Suspense fallback={<div className="text-xs text-[#64748b]">در حال بارگذاری...</div>}>
          <LoginFormContent />
        </Suspense>

      </div>

      {/* سمت چپ: تصویر و متون انگیزشی برند */}
      <div className="hidden md:flex w-full md:w-1/2 relative bg-[#0e0e0e]">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center" 
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop')` 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-black/40 to-black/60" />
        
        <div className="relative z-10 p-12 flex flex-col justify-between h-full w-full text-right">
          <Link href="/" className="flex items-center gap-3 w-fit group">
            <div className="w-10 h-10 rounded bg-[#ff6600] flex items-center justify-center text-white font-black shadow-lg shadow-[#ff6600]/30 group-hover:scale-105 transition-transform duration-200">
              <Dumbbell className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-2xl font-bold text-[#ffe0cc] tracking-tight">
              آکادمی ناظری
            </span>
          </Link>
          
          <div className="max-w-md pb-16 space-y-4">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
              به آینده‌ی تناسب اندام و مربیگری هوشمند خوش آمدید.
            </h1>
            <p className="text-base lg:text-lg text-[#e3bfb1] leading-relaxed">
              طراحی اختصاصی برنامه‌های تمرینی و رژیم غذایی با بالاترین دقت علمی و نظارت هوشمند.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
