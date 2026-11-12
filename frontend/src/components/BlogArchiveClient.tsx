"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  Tag, 
  Calendar, 
  Clock, 
  Eye, 
  ArrowLeft, 
  Dumbbell, 
  Flame, 
  Sparkles,
  BookOpen,
  ChevronLeft
} from "lucide-react";

interface BlogArchiveClientProps {
  initialPosts: any[];
  categories: any[];
}

export default function BlogArchiveClient({ initialPosts, categories }: BlogArchiveClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      const matchesSearch = 
        post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCat = selectedCategory === "all" || post.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [initialPosts, searchQuery, selectedCategory]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-4 items-start w-full">
      
      {/* سمت راست: ستون محتوای اصلی و مقالات (8 ستون از 12 ستون) */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* نوار وضعیت و فیلتر فعال */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg bg-[#141414] border border-[#2c2c2e] text-xs">
          <div className="flex items-center gap-2 text-[#64748b]">
            <span>نمایش:</span>
            <span className="font-bold text-[#ff6600]">{filteredPosts.length}</span>
            <span>مقاله از مجموع {initialPosts.length}</span>
            {selectedCategory !== "all" && (
              <span className="px-2 py-0.5 rounded bg-[#ff6600]/15 border border-[#ff6600]/30 text-[#ff6600] font-bold">
                دسته‌بندی: {selectedCategory}
              </span>
            )}
          </div>

          {(selectedCategory !== "all" || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="text-[#ff6600] hover:underline text-xs font-bold"
            >
              پاکسازی فیلترها
            </button>
          )}
        </div>

        {filteredPosts.length === 0 ? (
          <div className="p-16 rounded-lg bg-[#141414] border border-[#2c2c2e] text-center space-y-3">
            <BookOpen className="w-10 h-10 text-[#64748b] mx-auto" />
            <h3 className="text-base font-bold text-[#e5e2e1]">مقاله‌ای یافت نشد</h3>
            <p className="text-xs text-[#64748b] max-w-sm mx-auto leading-relaxed">
              با جستجوی فعلی مقاله‌ای پیدا نشد. لطفاً کلمه کلیدی دیگری وارد کنید یا فیلتر دسته‌بندی را تغییر دهید.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPosts.map((post: any) => (
              <article
                key={post.id}
                className="rounded-lg bg-[#141414] border border-[#2c2c2e] hover:border-[#ff6600]/60 overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:shadow-2xl hover:shadow-[#ff6600]/10 text-right"
              >
                {/* Image Frame */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#141414] flex-shrink-0">
                  <img
                    src={post.image_url || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop"}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter contrast-110 brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-80" />

                  {/* Category Pill */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-sm bg-black/85 backdrop-blur-md border border-[#2c2c2e] text-[10px] font-bold text-[#ff6600]">
                    {post.category}
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  
                  <div className="flex items-center justify-between text-[11px] text-[#64748b]">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#ff6600]" />
                      <span>{post.created_at ? new Date(post.created_at).toLocaleDateString("fa-IR") : "شهریور ۱۴۰۴"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{post.read_time || "۵ دقیقه مطالعه"}</span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <h3 className="text-base sm:text-lg font-bold text-[#e5e2e1] group-hover:text-[#ff6600] transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed text-justify line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#2c2c2e]">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="w-full py-2.5 rounded-sm bg-[#1e1e1e] hover:bg-[#ff6600] text-[#e5e2e1] hover:text-white border border-[#2c2c2e] hover:border-[#ff6600] text-xs font-bold transition-all flex items-center justify-center gap-2 group/btn shadow-sm"
                    >
                      <Eye className="w-4 h-4 text-[#ff6600] group-hover/btn:text-white transition-colors" />
                      <span>مشاهده و مطالعه مقاله</span>
                      <ArrowLeft className="w-4 h-4 group-hover/btn:-translate-x-1 transition-transform mr-1" />
                    </Link>
                  </div>

                </div>
              </article>
            ))}
          </div>
        )}

      </div>

      {/* سمت چپ: سایدبار اختصاصی وبلاگ (4 ستون از 12 ستون) */}
      <aside className="lg:col-span-4 space-y-6 sticky top-28">
        
        {/* ۱. باکس جستجو */}
        <div className="p-6 rounded-lg bg-[#141414] border border-[#2c2c2e] space-y-3">
          <h4 className="text-sm font-bold text-[#e5e2e1] flex items-center gap-2">
            <Search className="w-4 h-4 text-[#ff6600]" />
            <span>جستجو در مقالات</span>
          </h4>
          <div className="relative">
            <input
              type="text"
              placeholder="کلمه کلیدی، عنوان یا برچسب..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1a1a1c] border border-[#2c2c2e] rounded px-4 py-2.5 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-3 top-2.5 text-xs text-[#64748b] hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* ۲. باکس دسته‌بندی‌ها */}
        <div className="p-6 rounded-lg bg-[#141414] border border-[#2c2c2e] space-y-4">
          <h4 className="text-sm font-bold text-[#e5e2e1] flex items-center gap-2 pb-3 border-b border-[#2c2c2e]">
            <Tag className="w-4 h-4 text-[#ff6600]" />
            <span>دسته‌بندی‌های تخصصی</span>
          </h4>

          <div className="space-y-1.5">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded text-xs transition-all ${
                selectedCategory === "all"
                  ? "bg-[#ff6600] text-white font-bold shadow-md shadow-[#ff6600]/30"
                  : "bg-[#1a1a1c]/60 text-[#e5e2e1]/80 hover:bg-[#1e1e1e] hover:text-white"
              }`}
            >
              <span>همه مقالات</span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-mono-tag ${
                selectedCategory === "all" ? "bg-black/30 text-white" : "bg-[#2c2c2e] text-[#64748b]"
              }`}>
                {initialPosts.length}
              </span>
            </button>

            {categories.map((cat: any) => {
              const count = initialPosts.filter((p) => p.category === cat.name).length;
              const isSelected = selectedCategory === cat.name;

              return (
                <button
                  key={cat.id || cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded text-xs transition-all ${
                    isSelected
                      ? "bg-[#ff6600] text-white font-bold shadow-md shadow-[#ff6600]/30"
                      : "bg-[#1a1a1c]/60 text-[#e5e2e1]/80 hover:bg-[#1e1e1e] hover:text-white"
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-mono-tag flex-shrink-0 ${
                    isSelected ? "bg-black/30 text-white" : "bg-[#2c2c2e] text-[#64748b]"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ۳. باکس CTA اختصاصی مشاوره و برنامه (معکوس رنگی جذاب نارنجی و مشکی) */}
        <div className="p-6 rounded-lg bg-[#ff6600] text-black space-y-4 shadow-2xl relative overflow-hidden group">
          <div className="space-y-2 text-right">
            <h4 className="text-lg font-black text-black leading-snug">
              نیاز به برنامه تمرین و تغذیه اختصاصی دارید؟
            </h4>
            <p className="text-xs font-bold text-black/85 leading-relaxed">
              طراحی اختصاصی با آنالیز فرم بدنی و بیومکانیک حرکتی توسط مربی احسان ناظری
            </p>
          </div>

          <Link
            href="/login?redirect=/get-plan"
            className="w-full py-3.5 rounded bg-black text-white hover:bg-[#1a1a1a] text-xs font-bold transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group/cta"
          >
            <span>دریافت برنامه اختصاصی</span>
            <ChevronLeft className="w-4 h-4 group-hover/cta:-translate-x-1 transition-transform" />
          </Link>
        </div>

      </aside>

    </div>
  );
}
