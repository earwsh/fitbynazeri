"use client";

import { useMemo } from "react";
import { Search, CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";

export const SITE_ORIGIN = "https://fitbynazeri.com";

type Level = "good" | "warn" | "bad" | "info";
type Check = { level: Level; text: string };

interface BlogSeoPanelProps {
  form: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image_url: string;
    image_alt: string;
    meta_title: string;
    meta_description: string;
    focus_keyword: string;
  };
  onChange: (patch: Record<string, string>) => void;
}

const stripHtml = (html: string) =>
  html.replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

function analyze(f: BlogSeoPanelProps["form"]): Check[] {
  const checks: Check[] = [];
  const add = (level: Level, text: string) => checks.push({ level, text });

  const effTitle = (f.meta_title || f.title).trim();
  const effDesc = (f.meta_description || f.excerpt).trim();
  const kw = f.focus_keyword.trim().toLowerCase();
  const text = stripHtml(f.content);
  const words = text ? text.split(" ").length : 0;
  const slug = f.slug.trim();

  // عنوان سئو
  if (!effTitle) add("bad", "عنوان سئو خالی است.");
  else if (effTitle.length > 60) add("warn", `عنوان سئو ${effTitle.length} نویسه است؛ بیش از ۶۰ نویسه در نتایج گوگل بریده می‌شود.`);
  else if (effTitle.length < 30) add("warn", `عنوان سئو کوتاه است (${effTitle.length} نویسه)؛ بین ۳۰ تا ۶۰ نویسه ایده‌آل است.`);
  else add("good", `طول عنوان سئو مناسب است (${effTitle.length} نویسه).`);

  // توضیحات متا
  if (!f.meta_description.trim() && !f.excerpt.trim()) add("bad", "توضیحات متا و چکیده هر دو خالی‌اند؛ گوگل خودش متن دلخواه برمی‌دارد.");
  else if (!f.meta_description.trim()) add("info", "توضیحات متا خالی است و از «چکیده مقاله» استفاده می‌شود.");
  if (effDesc) {
    if (effDesc.length > 160) add("warn", `توضیحات متا ${effDesc.length} نویسه است؛ بیش از ۱۶۰ نویسه بریده می‌شود.`);
    else if (effDesc.length < 70) add("warn", `توضیحات متا کوتاه است (${effDesc.length} نویسه)؛ بین ۷۰ تا ۱۶۰ نویسه ایده‌آل است.`);
    else add("good", `طول توضیحات متا مناسب است (${effDesc.length} نویسه).`);
  }

  // اسلاگ
  if (!slug) add("bad", "اسلاگ خالی است.");
  else {
    if (slug.length > 75) add("bad", `اسلاگ بسیار طولانی است (${slug.length} نویسه)؛ ترجیحا کمتر از ۶۰ نویسه.`);
    else if (slug.length > 60) add("warn", `اسلاگ طولانی است (${slug.length} نویسه)؛ ترجیحا کمتر از ۶۰ نویسه.`);
    else add("good", `طول اسلاگ مناسب است (${slug.length} نویسه).`);
    if (/[؀-ۿ]/.test(slug)) add("warn", "اسلاگ حروف فارسی دارد؛ در لینک‌های کپی‌شده به رشته‌های طولانی تبدیل می‌شود. اسلاگ انگلیسی کوتاه بهتر است.");
    if (/[A-Z_\s]/.test(slug)) add("warn", "اسلاگ حروف بزرگ، فاصله یا زیرخط دارد؛ فقط حروف کوچک و خط تیره (-) پیشنهاد می‌شود.");
    const stop = slug.split("-").filter(Boolean).length;
    if (stop > 8) add("warn", `اسلاگ ${stop} بخش دارد؛ کوتاه‌تر و متمرکزتر بنویسید.`);
  }

  // کلمه کلیدی
  if (!kw) add("info", "کلمه کلیدی اصلی را وارد کنید تا حضور آن در عنوان، اسلاگ، توضیحات و متن بررسی شود.");
  else {
    const inSlug = slug.toLowerCase().replace(/-/g, " ").includes(kw.replace(/-/g, " "));
    (effTitle.toLowerCase().includes(kw) ? add("good", "کلمه کلیدی در عنوان سئو هست.") : add("warn", "کلمه کلیدی در عنوان سئو نیست."));
    (effDesc.toLowerCase().includes(kw) ? add("good", "کلمه کلیدی در توضیحات متا هست.") : add("warn", "کلمه کلیدی در توضیحات متا نیست."));
    (inSlug ? add("good", "کلمه کلیدی در اسلاگ هست.") : add("warn", "کلمه کلیدی در اسلاگ نیست."));
    const firstPara = text.slice(0, 300).toLowerCase();
    (firstPara.includes(kw) ? add("good", "کلمه کلیدی در ابتدای متن هست.") : add("warn", "کلمه کلیدی در ۳۰۰ نویسه اول متن نیامده است."));
    const count = text.toLowerCase().split(kw).length - 1;
    if (words > 0) {
      const density = (count * kw.split(/\s+/).length * 100) / words;
      if (count === 0) add("bad", "کلمه کلیدی در متن مقاله پیدا نشد.");
      else if (density > 3) add("warn", `تراکم کلمه کلیدی بالاست (${density.toFixed(1)}٪)؛ ممکن است اسپم به نظر برسد.`);
      else add("good", `کلمه کلیدی ${count} بار در متن آمده (تراکم ${density.toFixed(1)}٪).`);
    }
  }

  // محتوا
  if (words < 300) add("warn", `متن مقاله کوتاه است (${words} کلمه)؛ حداقل ۳۰۰ کلمه توصیه می‌شود.`);
  else add("good", `طول متن مناسب است (${words} کلمه).`);

  if (typeof DOMParser !== "undefined" && f.content) {
    const doc = new DOMParser().parseFromString(f.content, "text/html");
    if (doc.querySelectorAll("h2").length === 0) add("warn", "هیچ تیتر ۲ (H2) در متن نیست؛ ساختار تیترها به خوانایی و سئو کمک می‌کند.");
    if (doc.querySelectorAll("h1").length > 0) add("warn", "داخل متن تیتر ۱ (H1) هست؛ H1 صفحه همان عنوان مقاله است، در متن از H2 و H3 استفاده کنید.");
    const imgs = [...doc.querySelectorAll("img")];
    const noAlt = imgs.filter((i) => !(i.getAttribute("alt") || "").trim()).length;
    if (imgs.length && noAlt) add("warn", `${noAlt} تصویر داخل متن متن جایگزین (alt) ندارد.`);
    const links = [...doc.querySelectorAll("a[href]")];
    const internal = links.filter((a) => /^(\/|#)/.test(a.getAttribute("href") || "") || (a.getAttribute("href") || "").includes("fitbynazeri.com")).length;
    if (links.length === 0) add("info", "هیچ لینکی در متن نیست؛ لینک داخلی به مقالات مرتبط به سئو کمک می‌کند.");
    else if (internal === 0) add("info", "لینک داخلی به صفحات سایت ندارید.");
    else add("good", `${internal} لینک داخلی در متن هست.`);
  }

  // کاور
  if (!f.image_url.trim()) add("bad", "تصویر کاور انتخاب نشده است.");
  else if (!f.image_alt.trim()) add("warn", "متن جایگزین (alt) تصویر کاور خالی است؛ عنوان مقاله جایگزین می‌شود.");
  else add("good", "تصویر کاور و متن جایگزین آن تنظیم شده‌اند.");

  return checks;
}

const levelStyle: Record<Level, { icon: any; cls: string }> = {
  good: { icon: CheckCircle2, cls: "text-emerald-400" },
  warn: { icon: AlertTriangle, cls: "text-amber-400" },
  bad: { icon: XCircle, cls: "text-red-400" },
  info: { icon: Info, cls: "text-sky-400" },
};

function Meter({ value, min, max, hardMax }: { value: number; min: number; max: number; hardMax: number }) {
  const pct = Math.min(100, (value / hardMax) * 100);
  const color = value === 0 ? "bg-[#2c2c2e]" : value > max ? "bg-red-500" : value < min ? "bg-amber-500" : "bg-emerald-500";
  return (
    <div className="h-1 rounded bg-[#2c2c2e] overflow-hidden mt-1.5">
      <div className={`h-full ${color} transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function BlogSeoPanel({ form, onChange }: BlogSeoPanelProps) {
  const checks = useMemo(() => analyze(form), [form]);
  const bad = checks.filter((c) => c.level === "bad").length;
  const warn = checks.filter((c) => c.level === "warn").length;

  const effTitle = (form.meta_title || form.title || "عنوان مقاله").trim();
  const effDesc = (form.meta_description || form.excerpt || "توضیحات متا در این قسمت نمایش داده می‌شود.").trim();
  const url = `${SITE_ORIGIN}/blog/${form.slug || "slug"}`;

  const input = "w-full bg-[#141414] border border-[#2c2c2e] rounded px-4 py-2.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]";

  return (
    <div className="p-5 rounded bg-[#141414] border border-[#2c2c2e] space-y-5 text-xs text-right">
      <div className="flex items-center justify-between gap-3">
        <label className="font-bold text-[#e5e2e1] flex items-center gap-2 text-sm">
          <Search className="w-4 h-4 text-[#ff6600]" />
          <span>تنظیمات و بررسی سئو</span>
        </label>
        <span className={`px-2.5 py-1 rounded text-[11px] font-bold border ${
          bad ? "bg-red-500/10 border-red-500/30 text-red-400" : warn ? "bg-amber-500/10 border-amber-500/30 text-amber-400" : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
        }`}>
          {bad ? `${bad} مشکل مهم` : warn ? `${warn} هشدار` : "سئو مناسب است"}
        </span>
      </div>

      {/* پیش‌نمایش گوگل */}
      <div className="rounded-lg bg-white p-4 text-left" dir="ltr">
        <div className="text-[12px] text-[#202124] truncate">{url}</div>
        <div className="text-[18px] leading-snug text-[#1a0dab] mt-0.5 line-clamp-1" dir="rtl" style={{ textAlign: "right" }}>{effTitle}</div>
        <div className="text-[13px] leading-snug text-[#4d5156] mt-1 line-clamp-2" dir="rtl" style={{ textAlign: "right" }}>{effDesc}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="lg:col-span-2">
          <label className="block font-medium text-[#e5e2e1] mb-1.5">کلمه کلیدی اصلی (Focus Keyword)</label>
          <input
            className={input}
            placeholder="مثال: تمرین سینه"
            value={form.focus_keyword}
            onChange={(e) => onChange({ focus_keyword: e.target.value })}
          />
        </div>

        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-1.5">
            <label className="font-medium text-[#e5e2e1]">عنوان سئو (Meta Title)</label>
            <span className="text-[10px] text-[#64748b]">{(form.meta_title || form.title).length} / ۶۰</span>
          </div>
          <input
            className={input}
            placeholder={form.title || "اگر خالی باشد از عنوان مقاله استفاده می‌شود"}
            value={form.meta_title}
            onChange={(e) => onChange({ meta_title: e.target.value })}
          />
          <Meter value={(form.meta_title || form.title).length} min={30} max={60} hardMax={80} />
        </div>

        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-1.5">
            <label className="font-medium text-[#e5e2e1]">توضیحات متا (Meta Description)</label>
            <span className="text-[10px] text-[#64748b]">{(form.meta_description || form.excerpt).length} / ۱۶۰</span>
          </div>
          <textarea
            rows={3}
            className={`${input} leading-relaxed`}
            placeholder={form.excerpt || "اگر خالی باشد از چکیده مقاله استفاده می‌شود"}
            value={form.meta_description}
            onChange={(e) => onChange({ meta_description: e.target.value })}
          />
          <Meter value={(form.meta_description || form.excerpt).length} min={70} max={160} hardMax={200} />
        </div>
      </div>

      <ul className="space-y-1.5 pt-1">
        {checks.map((c, i) => {
          const S = levelStyle[c.level];
          return (
            <li key={i} className={`flex items-start gap-2 leading-relaxed ${S.cls}`}>
              <S.icon className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <span className="text-[#e5e2e1]/85">{c.text}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
