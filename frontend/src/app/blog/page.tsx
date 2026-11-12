import Link from "next/link";
import { 
  BookOpen, 
  ChevronRight
} from "lucide-react";
import Header from "@/components/Header";
import BlogArchiveClient from "@/components/BlogArchiveClient";

async function getBlogPosts() {
  try {
    const res = await fetch("https://fitbynazeri.com/api/blog", {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.posts || [];
  } catch (e) {
    return [];
  }
}

async function getBlogCategories() {
  try {
    const res = await fetch("https://fitbynazeri.com/api/blog-categories", {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.categories || [];
  } catch (e) {
    return [];
  }
}

export default async function BlogArchivePage() {
  const posts = await getBlogPosts();
  const categories = await getBlogCategories();

  return (
    <main className="min-h-screen bg-[#141414] text-[#e5e2e1] flex flex-col selection:bg-[#ff6600] selection:text-white pb-24" dir="rtl">
      
      {/* Header */}
      <Header />

      {/* Main Full Width Container */}
      <div className="w-full px-6 sm:px-10 lg:px-16 pt-28 sm:pt-36">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#64748b] pb-6 border-b border-[#2c2c2e]">
          <Link href="/" className="hover:text-white transition-colors">صفحه اصلی</Link>
          <ChevronRight className="w-3.5 h-3.5 rotate-180" />
          <span className="text-[#ff6600] font-bold">وبلاگ و مقالات تخصصی</span>
        </div>

        {/* Page Header */}
        <div className="py-8 sm:py-10 text-right space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#e5e2e1] leading-tight">
            وبلاگ و <span className="text-[#ff6600]">دانش تخصصی فیتنس و بدنسازی</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#64748b] leading-relaxed max-w-2xl font-medium">
            مجموعه مقالات علمی و کاربردی در حوزه فیزیولوژی ورزشی، هایپرتروفی، چربی‌سوزی، تغذیه و بیومکانیک حرکتی
          </p>
        </div>

        {/* Interactive Client Component with Right Content & Left Sidebar */}
        <BlogArchiveClient initialPosts={posts} categories={categories} />

      </div>

    </main>
  );
}

