"use client";

import { useState, useEffect } from "react";
import { 
  MessageSquare, 
  Send, 
  Star, 
  User, 
  CheckCircle2, 
  Clock,
  Sparkles,
  ShieldCheck,
  CornerDownLeft
} from "lucide-react";

interface BlogCommentsSectionProps {
  postSlug: string;
  postTitle: string;
}

export default function BlogCommentsSection({ postSlug, postTitle }: BlogCommentsSectionProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fetch approved comments for this specific blog post
  const fetchComments = () => {
    fetch(`https://fitbynazeri.com/api/blog-comments/post/${postSlug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success" && data.comments) {
          setComments(data.comments);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchComments();
  }, [postSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !commentText) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("https://fitbynazeri.com/api/blog-comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_slug: postSlug,
          post_title: postTitle,
          full_name: fullName,
          email: email,
          comment: commentText,
          rating: rating,
        }),
      });

      if (res.ok) {
        setIsSubmitted(true);
        setFullName("");
        setEmail("");
        setCommentText("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pt-8 border-t border-[#2c2c2e] w-full text-right">
      
      {/* عنوان بخش دیدگاه‌ها */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-[#e5e2e1] flex items-center gap-2.5">
          <MessageSquare className="w-5 h-5 text-[#ff6600]" />
          <span>دیدگاه‌ها و پرسش‌های کاربران</span>
        </h3>
        <span className="text-xs text-[#64748b]">
          {comments.length} دیدگاه تایید شده
        </span>
      </div>

      {/* فرم ارسال دیدگاه جدید */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-lg bg-[#141414] border border-[#2c2c2e] space-y-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#2c2c2e]">
          <span className="text-sm font-bold text-[#e5e2e1] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#ff6600]" />
            <span>ثبت دیدگاه یا پرسش درباره این مقاله</span>
          </span>

          {/* Rating selector */}
          <div className="flex items-center gap-1.5" dir="ltr">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-0.5 hover:scale-110 transition-transform"
                title={`${star} ستاره`}
              >
                <Star
                  className={`w-4 h-4 ${
                    star <= rating ? "text-[#ff6600] fill-[#ff6600]" : "text-[#3a3a3c]"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {isSubmitted ? (
          <div className="p-5 rounded bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <div>
              <span className="font-bold block">دیدگاه شما با موفقیت ثبت شد!</span>
              <span className="text-emerald-400/80 mt-0.5 block">دیدگاه پس از بررسی و تایید توسط مربی در سایت نمایش داده خواهد شد.</span>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#e5e2e1] mb-1.5">نام و نام خانوادگی شما *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: پوریا کریمی"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#1a1a1c] border border-[#2c2c2e] rounded px-4 py-2.5 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#e5e2e1] mb-1.5">ایمیل شما (اختیاری جهت اطلاع از پاسخ)</label>
                <input
                  type="email"
                  placeholder="example@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1a1a1c] border border-[#2c2c2e] rounded px-4 py-2.5 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#e5e2e1] mb-1.5">متن دیدگاه یا سوال فنی شما *</label>
              <textarea
                rows={4}
                required
                placeholder="نظر، سوال یا تجربه خود را درباره مباحث این مقاله بنویسید..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full bg-[#1a1a1c] border border-[#2c2c2e] rounded px-4 py-2.5 text-xs text-[#e5e2e1] focus:outline-none focus:border-[#ff6600] leading-relaxed"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 rounded bg-[#ff6600] hover:bg-[#ff8532] text-white text-xs font-bold transition-all shadow-md shadow-[#ff6600]/30 hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "در حال ثبت..." : "ارسال دیدگاه"}</span>
              </button>
            </div>
          </>
        )}
      </form>

      {/* لیست دیدگاه‌های تایید شده مقاله */}
      <div className="space-y-4 pt-2">
        {comments.length === 0 ? (
          <div className="p-8 text-center rounded-lg bg-[#141414] border border-[#2c2c2e] text-xs text-[#64748b]">
            اولین نفری باشید که برای این مقاله دیدگاه ثبت می‌کند.
          </div>
        ) : (
          comments.map((item: any) => (
            <div
              key={item.id}
              className="p-5 sm:p-6 rounded-lg bg-[#141414] border border-[#2c2c2e] hover:border-[#ff6600]/30 transition-all space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#1e1e1e] border border-[#2c2c2e] flex items-center justify-center text-[#ff6600] font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#e5e2e1]">{item.full_name}</h4>
                    <span className="text-[10px] text-[#64748b]">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString("fa-IR") : "به‌تازگی"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[#ff6600]" dir="ltr">
                  {[...Array(item.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-[#ff6600]" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-[#e5e2e1]/85 leading-relaxed bg-[#1a1a1c]/60 p-3.5 rounded border border-[#2c2c2e] text-justify">
                {item.comment}
              </p>

              {/* پاسخ مربی / ادمین به دیدگاه */}
              {item.reply && (
                <div className="mr-4 sm:mr-6 p-4 rounded-lg bg-[#161616] border-r-2 border-r-[#ff6600] border-y border-l border-[#2c2c2e] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#ff6600]">
                      <ShieldCheck className="w-4 h-4" />
                      <span>پاسخ {item.reply_author || "استاد احسان ناظری"}</span>
                    </div>
                    {item.reply_created_at && (
                      <span className="text-[10px] text-[#64748b]">
                        {new Date(item.reply_created_at).toLocaleDateString("fa-IR")}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#e5e2e1] leading-relaxed text-justify">
                    {item.reply}
                  </p>
                </div>
              )}

            </div>
          ))
        )}
      </div>

    </div>
  );
}
