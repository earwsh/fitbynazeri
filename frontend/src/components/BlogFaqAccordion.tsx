"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export type PublicFaqItem = { question: string; answer: string };

export default function BlogFaqAccordion({ title, items }: { title?: string; items: PublicFaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  if (!items.length) return null;

  return (
    <section className="space-y-4 text-right" aria-labelledby="blog-faq-title">
      <h2 id="blog-faq-title" className="text-xl sm:text-2xl font-bold text-[#e5e2e1] flex items-center gap-3">
        <HelpCircle className="w-6 h-6 text-[#ff6600]" />
        <span>{title?.trim() || "سوالات متداول"}</span>
      </h2>

      <div className="space-y-3">
        {items.map((it, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              className={`rounded-lg border transition-colors ${isOpen ? "border-[#ff6600]/50 bg-[#161616]" : "border-[#2c2c2e] bg-[#141414] hover:border-[#ff6600]/30"}`}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`blog-faq-panel-${i}`}
                id={`blog-faq-btn-${i}`}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-right"
              >
                <span className={`text-sm sm:text-base font-bold leading-relaxed ${isOpen ? "text-[#ff6600]" : "text-[#e5e2e1]"}`}>{it.question}</span>
                <ChevronDown className={`w-5 h-5 flex-shrink-0 text-[#ff6600] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
              </button>
              <div
                id={`blog-faq-panel-${i}`}
                role="region"
                aria-labelledby={`blog-faq-btn-${i}`}
                className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm text-[#e5e2e1]/85 leading-loose text-justify whitespace-pre-line">{it.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
