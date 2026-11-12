"use client";

import { Plus, Trash2, ChevronUp, ChevronDown, HelpCircle } from "lucide-react";

export type FaqItem = { question: string; answer: string };

export function parseFaqItems(raw: string | undefined | null): FaqItem[] {
  if (!raw) return [];
  try {
    const a = JSON.parse(raw);
    if (!Array.isArray(a)) return [];
    return a.map((x: any) => ({ question: String(x?.question ?? ""), answer: String(x?.answer ?? "") }));
  } catch {
    return [];
  }
}

interface BlogFaqEditorProps {
  title: string;
  items: FaqItem[];
  onTitleChange: (v: string) => void;
  onItemsChange: (items: FaqItem[]) => void;
}

export default function BlogFaqEditor({ title, items, onTitleChange, onItemsChange }: BlogFaqEditorProps) {
  const update = (i: number, patch: Partial<FaqItem>) =>
    onItemsChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onItemsChange(next);
  };

  const input = "w-full bg-[#141414] border border-[#2c2c2e] rounded px-4 py-2.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]";

  return (
    <div className="p-5 rounded bg-[#141414] border border-[#2c2c2e] space-y-4 text-xs text-right">
      <div className="flex items-center justify-between gap-3">
        <label className="font-bold text-[#e5e2e1] flex items-center gap-2 text-sm">
          <HelpCircle className="w-4 h-4 text-[#ff6600]" />
          <span>سوالات متداول (FAQ)</span>
        </label>
        <button
          type="button"
          onClick={() => onItemsChange([...items, { question: "", answer: "" }])}
          className="px-3 py-2 rounded bg-[#ff6600] hover:bg-[#ff8532] text-white font-bold flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>افزودن سوال</span>
        </button>
      </div>

      <p className="text-[11px] text-[#64748b] leading-relaxed">
        این بخش به‌صورت آکاردئونی زیر متن مقاله نمایش داده می‌شود و برای گوگل هم به‌صورت داده ساختاریافته FAQ ثبت می‌شود.
      </p>

      <div>
        <label className="block font-medium text-[#e5e2e1] mb-1.5">تیتر بخش</label>
        <input
          className={input}
          placeholder="مثال: سوالات متداول درباره تمرین سینه"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </div>

      {items.length === 0 && (
        <div className="p-5 rounded border border-dashed border-[#2c2c2e] text-center text-[#64748b]">
          هنوز سوالی اضافه نشده است. اگر سوالی وارد نکنید، بخش FAQ در مقاله نمایش داده نمی‌شود.
        </div>
      )}

      <div className="space-y-3">
        {items.map((it, i) => (
          <div key={i} className="p-4 rounded bg-[#1a1a1c] border border-[#2c2c2e] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono-tag text-[11px] text-[#ff6600] font-bold">سوال {(i + 1).toLocaleString("fa-IR")}</span>
              <div className="flex items-center gap-1">
                <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="p-1.5 rounded hover:bg-[#2c2c2e] text-[#e5e2e1]/70 disabled:opacity-30" aria-label="انتقال به بالا"><ChevronUp className="w-4 h-4" /></button>
                <button type="button" disabled={i === items.length - 1} onClick={() => move(i, 1)} className="p-1.5 rounded hover:bg-[#2c2c2e] text-[#e5e2e1]/70 disabled:opacity-30" aria-label="انتقال به پایین"><ChevronDown className="w-4 h-4" /></button>
                <button type="button" onClick={() => onItemsChange(items.filter((_, idx) => idx !== i))} className="p-1.5 rounded hover:bg-red-500/10 text-red-400" aria-label="حذف سوال"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <input
              className={input}
              placeholder="متن سوال"
              value={it.question}
              onChange={(e) => update(i, { question: e.target.value })}
            />
            <textarea
              rows={3}
              className={`${input} leading-relaxed`}
              placeholder="پاسخ"
              value={it.answer}
              onChange={(e) => update(i, { answer: e.target.value })}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
