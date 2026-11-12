"use client";

import { useState } from "react";
import { ImagePlus, Replace, Trash2, Link2 } from "lucide-react";

interface BlogCoverFieldProps {
  imageUrl: string;
  imageAlt: string;
  onImageUrlChange: (v: string) => void;
  onImageAltChange: (v: string) => void;
  onOpenMediaPicker: () => void;
}

export default function BlogCoverField({
  imageUrl,
  imageAlt,
  onImageUrlChange,
  onImageAltChange,
  onOpenMediaPicker,
}: BlogCoverFieldProps) {
  const [showUrl, setShowUrl] = useState(false);
  const [broken, setBroken] = useState(false);

  const input = "w-full bg-[#141414] border border-[#2c2c2e] rounded px-4 py-2.5 text-[#e5e2e1] text-xs focus:outline-none focus:border-[#ff6600]";

  return (
    <div className="p-5 rounded bg-[#141414] border border-[#2c2c2e] space-y-4 text-right">
      <div className="flex items-center justify-between gap-3">
        <label className="font-bold text-[#e5e2e1] text-sm">تصویر کاور مقاله</label>
        <span className="text-[11px] text-[#64748b]">نسبت پیشنهادی ۱۶:۹ (مثلا ۱۲۸۰×۷۲۰)</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* پیش‌نمایش */}
        <div className="lg:col-span-3">
          {imageUrl && !broken ? (
            <div className="relative group aspect-video rounded-lg overflow-hidden border border-[#2c2c2e] bg-[#0f0f0f]">
              <img
                src={imageUrl}
                alt={imageAlt || "پیش‌نمایش کاور"}
                onError={() => setBroken(true)}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={onOpenMediaPicker}
                  className="px-4 py-2 rounded bg-[#ff6600] hover:bg-[#ff8532] text-white text-xs font-bold flex items-center gap-2"
                >
                  <Replace className="w-4 h-4" />
                  <span>تغییر تصویر</span>
                </button>
                <button
                  type="button"
                  onClick={() => { onImageUrlChange(""); setBroken(false); }}
                  className="px-4 py-2 rounded bg-black/70 hover:bg-red-600 text-white text-xs font-bold flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>حذف</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenMediaPicker}
              className="w-full aspect-video rounded-lg border-2 border-dashed border-[#2c2c2e] hover:border-[#ff6600] bg-[#161616] flex flex-col items-center justify-center gap-3 text-[#64748b] hover:text-[#e5e2e1] transition-colors"
            >
              <ImagePlus className="w-9 h-9 text-[#ff6600]" />
              <span className="text-sm font-bold">{broken ? "بارگذاری تصویر ناموفق بود؛ تصویر دیگری انتخاب کنید" : "انتخاب تصویر کاور از کتابخانه رسانه"}</span>
              <span className="text-[11px]">یا آدرس تصویر را به‌صورت دستی وارد کنید</span>
            </button>
          )}
        </div>

        {/* تنظیمات */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#e5e2e1] mb-1.5">متن جایگزین تصویر (Alt)</label>
            <input
              className={input}
              placeholder="توضیح کوتاه از محتوای تصویر"
              value={imageAlt}
              onChange={(e) => onImageAltChange(e.target.value)}
            />
            <p className="text-[10px] text-[#64748b] mt-1.5 leading-relaxed">برای سئو و دسترسی‌پذیری؛ اگر خالی باشد عنوان مقاله استفاده می‌شود.</p>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowUrl((v) => !v)}
              className="text-[11px] text-[#ff6600] hover:underline flex items-center gap-1.5"
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>{showUrl ? "پنهان کردن آدرس دستی" : "وارد کردن آدرس دستی تصویر"}</span>
            </button>
            {showUrl && (
              <input
                dir="ltr"
                className={`${input} font-mono-tag mt-2`}
                placeholder="https://..."
                value={imageUrl}
                onChange={(e) => { onImageUrlChange(e.target.value); setBroken(false); }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
