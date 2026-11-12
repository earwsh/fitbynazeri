"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Star, 
  Quote, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  UserCheck,
  MessageSquarePlus,
  X,
  Send,
  User,
  Sparkles
} from "lucide-react";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Testimonials() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalRating, setModalRating] = useState(5);
  const [modalForm, setModalForm] = useState({
    fullName: "",
    course: "پکیج جامع VIP بدنسازی و تغذیه",
    result: "",
    comment: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);

  // Fetch approved testimonials from Go API
  const fetchReviews = () => {
    fetch("https://fitbynazeri.com/api/testimonials/public")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success" && data.testimonials && data.testimonials.length > 0) {
          setReviews(data.testimonials);
        } else {
          // Fallback initial reviews if empty
          setReviews([
            {
              id: 1,
              full_name: "علیرضا معتمدی",
              role_title: "قهرمان دوره VIP کاهش وزن",
              rating: 5,
              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
              comment: "بعد از سال‌ها رژیم‌های سخت و خسته‌کننده، با برنامه استاد ناظری بدون هیچ گرسنگی ۱۶ کیلوگرم در ۴ ماه کم کردم. مهم‌ترین نکته، آنالیز هفتگی دقیق و پشتیبانی بی‌نظیرشون بود.",
              result: "کاهش ۱۶ کیلوگرم چربی در ۴ ماه",
              course: "پکیج جامع VIP + رژیم منعطف",
            },
            {
              id: 2,
              full_name: "سارا ابراهیمی",
              role_title: "قهرمان دوره فرم‌دهی بانوان",
              rating: 5,
              avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop",
              comment: "بهترین تجربه‌ای که از مربیگری آنلاین داشتم. برنامه‌ها کاملاً متناسب با ساختار بدنی و وسایل باشگاه من چیده شده بود و فرم‌گیری عضلاتم بعد از ۲ ماه فوق‌العاده محسوس شد.",
              result: "افزایش حجم خالص و فرم‌دهی کامل",
              course: "پکیج ۶ ماهه فیتنس بانوان",
            },
            {
              id: 3,
              full_name: "پویا کریمی",
              role_title: "قهرمان دوره مسابقات",
              rating: 5,
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
              comment: "علم تمرین و بیومکانیک استاد ناظری در سطح جهانیه. تمام آسیب‌های قدیمی کتف و زانوی من در حین تمرین اصلاح شد و با بهترین آمادگی روی استیج مسابقات رفتم.",
              result: "کسب مدال طلای فیزیک استانی",
              course: "دوره اختصاصی آمادگی مسابقات",
            },
          ]);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("https://fitbynazeri.com/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: modalForm.fullName,
          role_title: "قهرمان آکادمی ناظری",
          course: modalForm.course,
          result: modalForm.result,
          comment: modalForm.comment,
          rating: modalRating,
        }),
      });
      if (res.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setIsModalOpen(false);
          setModalForm({ fullName: "", course: "پکیج جامع VIP بدنسازی و تغذیه", result: "", comment: "" });
        }, 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  // Generate dynamic Schema.org JSON-LD Structured Data for Google SEO Review & AggregateRating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1) 
    : "5.0";

  const reviewsJsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsClub",
    "name": "آکادمی فیتنس و مربیگری احسان ناظری",
    "url": "https://nazeri.fit",
    "image": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop",
    "description": "طراحی علمی و اختصاصی برنامه‌های تمرینی، رژیم غذایی و آماده‌سازی مسابقات با مربیگری احسان ناظری",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": averageRating,
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": reviews.length.toString(),
      "reviewCount": reviews.length.toString(),
    },
    "review": reviews.map((rev) => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": rev.full_name,
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": (rev.rating || 5).toString(),
        "bestRating": "5",
        "worstRating": "1",
      },
      "reviewBody": rev.comment,
      "itemReviewed": {
        "@type": "Service",
        "name": rev.course || "پکیج اختصاصی فیتنس و تغذیه ناظری",
      },
    })),
  };

  return (
    <section id="testimonials" className="relative w-full py-20 sm:py-28 bg-[#0d0d0d] text-[#e5e2e1] border-t border-[#2c2c2e] overflow-hidden">
      
      {/* Schema.org Structured Data (JSON-LD) for Search Engine Rich Snippets & Star Ratings */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsJsonLd) }}
      />

      {/* Full Width Container matching Header & Hero */}
      <div className="w-full px-6 sm:px-10 lg:px-16 relative z-10">
        
        {/* Section Header without Subtitle */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-10 sm:pb-12 border-b border-[#2c2c2e]">
          <div className="text-right">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#e5e2e1] leading-tight">
              تجربه و نظرات <span className="text-[#ff6600]">قهرمانان آکادمی</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Custom Navigation buttons */}
            <div className="flex items-center gap-2" dir="ltr">
              <button
                id="testi-swiper-left"
                className="w-10 h-10 rounded-sm bg-[#1e1e1e] hover:bg-[#ff6600] text-[#e5e2e1] hover:text-white border border-[#2c2c2e] flex items-center justify-center transition-all shadow-sm group"
                aria-label="Slide Left"
              >
                <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
              <button
                id="testi-swiper-right"
                className="w-10 h-10 rounded-sm bg-[#1e1e1e] hover:bg-[#ff6600] text-[#e5e2e1] hover:text-white border border-[#2c2c2e] flex items-center justify-center transition-all shadow-sm group"
                aria-label="Slide Right"
              >
                <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>

            {/* Submit Review Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-[#ff6600] hover:bg-[#ff8532] text-white text-xs font-bold transition-all shadow-md shadow-[#ff6600]/25 hover:scale-105 active:scale-95"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>ثبت دیدگاه قهرمان</span>
            </button>
          </div>
        </div>

        {/* Swiper Slider of Testimonials */}
        <div className="pt-10 w-full overflow-hidden">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation={{
              nextEl: "#testi-swiper-left",
              prevEl: "#testi-swiper-right",
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
              1280: { slidesPerView: 3, spaceBetween: 24 },
            }}
            className="w-full overflow-hidden pb-6"
          >
            {reviews.map((item) => (
              <SwiperSlide key={item.id} className="h-auto pb-2">
                <div className="p-6 sm:p-7 rounded-lg bg-[#141414] border border-[#2c2c2e] hover:border-[#ff6600]/50 transition-all duration-300 flex flex-col justify-between h-[360px] text-right group shadow-lg shadow-black/40 hover:shadow-[#ff6600]/10">
                  
                  {/* Top: Avatar, Name, Rating & Quote */}
                  <div className="space-y-4">
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#2c2c2e] group-hover:border-[#ff6600] transition-colors bg-[#1e1e1e] flex-shrink-0">
                          <img src={item.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"} alt={item.full_name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-[#e5e2e1] group-hover:text-[#ff6600] transition-colors">
                            {item.full_name}
                          </h3>
                          <div className="text-[11px] text-[#64748b] flex items-center gap-1.5 mt-0.5">
                            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{item.role_title || "قهرمان آکادمی"}</span>
                          </div>
                        </div>
                      </div>

                      <Quote className="w-7 h-7 text-[#2c2c2e] group-hover:text-[#ff6600]/30 transition-colors" />
                    </div>

                    {/* Stars */}
                    <div className="flex items-center gap-1 text-[#ff6600]">
                      {[...Array(item.rating || 5)].map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-[#ff6600]" />
                      ))}
                    </div>

                    {/* Comment Text with text-justify */}
                    <p className="text-xs text-[#e5e2e1]/85 leading-relaxed line-clamp-4 text-justify">
                      {item.comment}
                    </p>

                  </div>

                  {/* Bottom: Result Badge & Course Pill */}
                  <div className="pt-4 border-t border-[#2c2c2e] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 truncate">
                      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{item.result || "دوره فیتنس و ترنسفورمیشن"}</span>
                    </div>

                    <span className="text-[10px] text-[#64748b] bg-[#1a1a1c] px-2 py-1 rounded-sm border border-[#2c2c2e] truncate">
                      {item.course || "پکیج جامع VIP"}
                    </span>
                  </div>

                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

      </div>

      {/* Review Submission Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in" dir="rtl">
          <div className="w-full max-w-lg bg-[#161616] border border-[#2c2c2e] rounded-lg shadow-2xl p-6 sm:p-8 relative">
            
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 left-5 p-1.5 rounded-sm bg-[#1e1e1e] text-[#64748b] hover:text-white border border-[#2c2c2e] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="border-b border-[#2c2c2e] pb-4 mb-5 text-right">
              <h3 className="text-lg font-bold text-[#e5e2e1] flex items-center gap-2">
                <MessageSquarePlus className="w-5 h-5 text-[#ff6600]" />
                <span>ثبت تجربه و نظر قهرمانان آکادمی</span>
              </h3>
              <p className="text-xs text-[#64748b] mt-1">دیدگاه شما پس از بررسی و تایید مربی در صفحه اصلی سایت نمایش داده می‌شود</p>
            </div>

            {isSubmitted ? (
              <div className="p-8 rounded bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-emerald-400">دیدگاه شما ثبت شد و در انتظار تایید است!</h4>
                <p className="text-xs text-[#e5e2e1]/80">پس از بررسی و تایید توسط مربی در سایت قرار خواهد گرفت.</p>
              </div>
            ) : (
              <form onSubmit={handleModalSubmit} className="space-y-4 text-right text-xs">
                
                {/* Rating Stars Selection */}
                <div>
                  <label className="block font-medium text-[#e5e2e1] mb-2">امتیاز شما به کیفیت برنامه و مربیگری</label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setModalRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= modalRating ? "fill-[#ff6600] text-[#ff6600]" : "text-[#3a3a3c]"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-[#ff6600] mr-2">({modalRating} از ۵ ستاره)</span>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block font-medium text-[#e5e2e1] mb-1.5">نام و نام خانوادگی *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: رضا احمدی"
                    value={modalForm.fullName}
                    onChange={(e) => setModalForm({ ...modalForm, fullName: e.target.value })}
                    className="w-full bg-[#141414] border border-[#2c2c2e] rounded px-3.5 py-2.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                  />
                </div>

                {/* Course Selection */}
                <div>
                  <label className="block font-medium text-[#e5e2e1] mb-1.5">دوره / پکیج ثبت‌نامی</label>
                  <select
                    value={modalForm.course}
                    onChange={(e) => setModalForm({ ...modalForm, course: e.target.value })}
                    className="w-full bg-[#141414] border border-[#2c2c2e] rounded px-3.5 py-2.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                  >
                    <option value="پکیج جامع VIP بدنسازی و تغذیه">پکیج جامع VIP بدنسازی و تغذیه</option>
                    <option value="دوره تخصصی کاهش وزن و لاغری">دوره تخصصی کاهش وزن و لاغری</option>
                    <option value="پکیج افزایش حجم و عضله‌سازی">پکیج افزایش حجم و عضله‌سازی</option>
                    <option value="دوره فیتنس و فرم‌دهی بانوان">دوره فیتنس و فرم‌دهی بانوان</option>
                    <option value="دوره اختصاصی آمادگی مسابقات">دوره اختصاصی آمادگی مسابقات</option>
                  </select>
                </div>

                {/* Result */}
                <div>
                  <label className="block font-medium text-[#e5e2e1] mb-1.5">نتیجه شاخص شما (مثال: کاهش ۱۰ کیلوگرم در ۳ ماه)</label>
                  <input
                    type="text"
                    placeholder="مثال: کاهش ۱۲ کیلوگرم چربی و کاهش ۸ سانتی‌متر دور کمر"
                    value={modalForm.result}
                    onChange={(e) => setModalForm({ ...modalForm, result: e.target.value })}
                    className="w-full bg-[#141414] border border-[#2c2c2e] rounded px-3.5 py-2.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                  />
                </div>

                {/* Comment Text */}
                <div>
                  <label className="block font-medium text-[#e5e2e1] mb-1.5">متن نظر و تجربه شما *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="تجربه خود از اجرای برنامه تمرینی، رژیم غذایی و پشتیبانی مربی را بنویسید..."
                    value={modalForm.comment}
                    onChange={(e) => setModalForm({ ...modalForm, comment: e.target.value })}
                    className="w-full bg-[#141414] border border-[#2c2c2e] rounded px-3.5 py-2.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600] leading-relaxed"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded bg-[#ff6600] hover:bg-[#ff8532] text-white font-bold transition-all shadow-md shadow-[#ff6600]/30 flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <span>در حال ثبت نظر...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>ارسال و ثبت دیدگاه</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </section>
  );
}
