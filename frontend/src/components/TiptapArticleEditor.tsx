"use client";

import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { TableKit } from "@tiptap/extension-table";
import { TextStyle, Color } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Youtube from "@tiptap/extension-youtube";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Heading2, Heading3, Heading4, Pilcrow,
  List, ListOrdered, Quote, Minus, AlignRight, AlignCenter, AlignLeft, AlignJustify,
  Link as LinkIcon, Unlink, Table as TableIcon, Undo2, Redo2, Eraser, Highlighter,
  Subscript as SubIcon, Superscript as SupIcon, Code2, Video, Sparkles, Image as ImageIcon, X,
} from "lucide-react";

interface TiptapArticleEditorProps {
  value: string;
  onChange: (content: string) => void;
  onOpenMediaPickerForEditor: () => void;
  insertedImageUrl?: string | null;
  onClearInsertedImage?: () => void;
}

export default function TiptapArticleEditor({
  value,
  onChange,
  onOpenMediaPickerForEditor,
  insertedImageUrl,
  onClearInsertedImage,
}: TiptapArticleEditorProps) {
  const lastEmitted = useRef(value);

  const editor = useEditor({
    immediatelyRender: false, // جلوگیری از ناهماهنگی SSR در Next.js
    extensions: [
      // target/rel به‌صورت پیش‌فرض خالی‌اند و فقط از مودال تنظیمات لینک ست می‌شوند
      StarterKit.configure({ link: { openOnClick: false, autolink: true, HTMLAttributes: { target: null, rel: null } } }),
      Image.configure({ HTMLAttributes: { alt: "تصویر مقاله آکادمی ناظری" } }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({
        placeholder: "متن و بدنه کامل مقاله را اینجا بنویسید (عناوین، پاراگراف‌ها، نکات تمرینی و تصاویر)...",
      }),
      TableKit.configure({ table: { resizable: false } }),
      TextStyle,
      Color,
      Highlight,
      Subscript,
      Superscript,
      Youtube.configure({ width: 640, height: 360, nocookie: true }),
    ],
    content: value,
    editorProps: {
      attributes: {
        dir: "rtl",
        class: "blog-content tiptap-area focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.isEmpty ? "" : editor.getHTML();
      lastEmitted.current = html;
      onChange(html);
    },
  });

  // وقتی مقاله دیگری برای ویرایش انتخاب می‌شود یا فرم ریست می‌شود، محتوا را همگام کن
  useEffect(() => {
    if (editor && value !== lastEmitted.current) {
      editor.commands.setContent(value || "", { emitUpdate: false });
      lastEmitted.current = value;
    }
  }, [value, editor]);

  // درج تصویر انتخاب‌شده از کتابخانه رسانه
  useEffect(() => {
    if (insertedImageUrl && editor) {
      editor
        .chain()
        .focus()
        .setImage({ src: insertedImageUrl, alt: "تصویر مقاله آکادمی ناظری" })
        .createParagraphNear()
        .run();
      onClearInsertedImage?.();
    }
  }, [insertedImageUrl, editor, onClearInsertedImage]);

  const active = useEditorState({
    editor,
    selector: ({ editor }) => {
      if (!editor) return null;
      return {
        bold: editor.isActive("bold"),
        italic: editor.isActive("italic"),
        underline: editor.isActive("underline"),
        strike: editor.isActive("strike"),
        h2: editor.isActive("heading", { level: 2 }),
        h3: editor.isActive("heading", { level: 3 }),
        h4: editor.isActive("heading", { level: 4 }),
        ul: editor.isActive("bulletList"),
        ol: editor.isActive("orderedList"),
        quote: editor.isActive("blockquote"),
        link: editor.isActive("link"),
        highlight: editor.isActive("highlight"),
        sub: editor.isActive("subscript"),
        sup: editor.isActive("superscript"),
        code: editor.isActive("codeBlock"),
        table: editor.isActive("table"),
        alignRight: editor.isActive({ textAlign: "right" }),
        alignCenter: editor.isActive({ textAlign: "center" }),
        alignLeft: editor.isActive({ textAlign: "left" }),
        alignJustify: editor.isActive({ textAlign: "justify" }),
        canUndo: editor.can().undo(),
        canRedo: editor.can().redo(),
      };
    },
  });

  const Btn = ({
    onClick, on, title, children, disabled,
  }: { onClick: () => void; on?: boolean; title: string; children: React.ReactNode; disabled?: boolean }) => (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`p-2 rounded transition-colors disabled:opacity-30 ${
        on ? "bg-[#ff6600] text-white" : "text-[#e5e2e1]/80 hover:bg-[#2c2c2e] hover:text-white"
      }`}
    >
      {children}
    </button>
  );
  const Sep = () => <span className="w-px h-5 bg-[#2c2c2e] mx-1" />;

  const [linkModal, setLinkModal] = useState<null | {
    url: string; text: string; hasSelection: boolean; isEdit: boolean;
    newTab: boolean; nofollow: boolean; sponsored: boolean; ugc: boolean;
  }>(null);

  const openLinkModal = () => {
    if (!editor) return;
    const attrs = editor.getAttributes("link");
    const isEdit = editor.isActive("link");
    const { from, to } = editor.state.selection;
    const rel: string = attrs.rel || "";
    setLinkModal({
      url: attrs.href || "",
      text: isEdit ? "" : editor.state.doc.textBetween(from, to, " "),
      hasSelection: isEdit || from !== to,
      isEdit,
      newTab: attrs.target === "_blank",
      nofollow: /\bnofollow\b/.test(rel),
      sponsored: /\bsponsored\b/.test(rel),
      ugc: /\bugc\b/.test(rel),
    });
  };

  const applyLink = () => {
    if (!editor || !linkModal) return;
    const raw = linkModal.url.trim();
    if (!raw) return;
    const href = /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(raw) ? raw : `https://${raw}`;
    const relParts = [
      linkModal.newTab ? "noopener" : "",
      linkModal.newTab ? "noreferrer" : "",
      linkModal.nofollow ? "nofollow" : "",
      linkModal.sponsored ? "sponsored" : "",
      linkModal.ugc ? "ugc" : "",
    ].filter(Boolean);
    const attrs = {
      href,
      target: linkModal.newTab ? "_blank" : null,
      rel: relParts.length ? relParts.join(" ") : null,
    };
    if (!linkModal.hasSelection) {
      const label = linkModal.text.trim() || href;
      editor.chain().focus().insertContent({ type: "text", text: label, marks: [{ type: "link", attrs }] }).run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink(attrs).run();
    }
    setLinkModal(null);
  };

  const removeLink = () => {
    editor?.chain().focus().extendMarkRange("link").unsetLink().run();
    setLinkModal(null);
  };

  const addYoutube = () => {
    if (!editor) return;
    const url = window.prompt("آدرس ویدیوی یوتیوب:");
    if (url) editor.chain().focus().setYoutubeVideo({ src: url.trim() }).run();
  };

  const a = active;

  return (
    <div className="space-y-2" dir="rtl">
      <div className="flex items-center justify-between bg-[#1e1e1e] p-2.5 rounded-t border border-b-0 border-[#2c2c2e]">
        <span className="text-xs font-bold text-[#e5e2e1] flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#ff6600]" />
          <span>ویرایشگر متن مقاله</span>
        </span>
        <button
          type="button"
          onClick={onOpenMediaPickerForEditor}
          className="px-3 py-1.5 rounded bg-[#ff6600] hover:bg-[#ff8532] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>درج تصویر از کتابخانه رسانه‌ها (Media Picker)</span>
        </button>
      </div>

      <div className="rounded-b overflow-hidden border border-[#2c2c2e] bg-[#141414]">
        {editor && a && (
          <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-[#2c2c2e] bg-[#1a1a1a] sticky top-0 z-10">
            <Btn title="بازگرداندن (Undo)" disabled={!a.canUndo} onClick={() => editor.chain().focus().undo().run()}><Undo2 className="w-4 h-4" /></Btn>
            <Btn title="از نو (Redo)" disabled={!a.canRedo} onClick={() => editor.chain().focus().redo().run()}><Redo2 className="w-4 h-4" /></Btn>
            <Sep />
            <Btn title="پاراگراف" on={editor.isActive("paragraph")} onClick={() => editor.chain().focus().setParagraph().run()}><Pilcrow className="w-4 h-4" /></Btn>
            <Btn title="عنوان ۲" on={a.h2} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className="w-4 h-4" /></Btn>
            <Btn title="عنوان ۳" on={a.h3} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 className="w-4 h-4" /></Btn>
            <Btn title="عنوان ۴" on={a.h4} onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}><Heading4 className="w-4 h-4" /></Btn>
            <Sep />
            <Btn title="درشت" on={a.bold} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="w-4 h-4" /></Btn>
            <Btn title="کج" on={a.italic} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="w-4 h-4" /></Btn>
            <Btn title="زیرخط" on={a.underline} onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon className="w-4 h-4" /></Btn>
            <Btn title="خط‌خورده" on={a.strike} onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough className="w-4 h-4" /></Btn>
            <Btn title="هایلایت" on={a.highlight} onClick={() => editor.chain().focus().toggleHighlight().run()}><Highlighter className="w-4 h-4" /></Btn>
            <Btn title="بالانویس" on={a.sup} onClick={() => editor.chain().focus().toggleSuperscript().run()}><SupIcon className="w-4 h-4" /></Btn>
            <Btn title="زیرنویس" on={a.sub} onClick={() => editor.chain().focus().toggleSubscript().run()}><SubIcon className="w-4 h-4" /></Btn>
            <label title="رنگ متن" className="p-1.5 rounded hover:bg-[#2c2c2e] cursor-pointer flex items-center" onMouseDown={(e) => e.stopPropagation()}>
              <input
                type="color"
                className="w-5 h-5 bg-transparent border-0 p-0 cursor-pointer"
                defaultValue="#e5e2e1"
                onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
              />
            </label>
            <Sep />
            <Btn title="لیست نقطه‌ای" on={a.ul} onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="w-4 h-4" /></Btn>
            <Btn title="لیست شماره‌دار" on={a.ol} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="w-4 h-4" /></Btn>
            <Btn title="نقل‌قول" on={a.quote} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote className="w-4 h-4" /></Btn>
            <Btn title="بلوک کد" on={a.code} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code2 className="w-4 h-4" /></Btn>
            <Btn title="خط جداکننده" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus className="w-4 h-4" /></Btn>
            <Sep />
            <Btn title="راست‌چین" on={a.alignRight} onClick={() => editor.chain().focus().setTextAlign("right").run()}><AlignRight className="w-4 h-4" /></Btn>
            <Btn title="وسط‌چین" on={a.alignCenter} onClick={() => editor.chain().focus().setTextAlign("center").run()}><AlignCenter className="w-4 h-4" /></Btn>
            <Btn title="چپ‌چین" on={a.alignLeft} onClick={() => editor.chain().focus().setTextAlign("left").run()}><AlignLeft className="w-4 h-4" /></Btn>
            <Btn title="تراز دوطرفه" on={a.alignJustify} onClick={() => editor.chain().focus().setTextAlign("justify").run()}><AlignJustify className="w-4 h-4" /></Btn>
            <Sep />
            <Btn title="درج/ویرایش لینک" on={a.link} onClick={openLinkModal}><LinkIcon className="w-4 h-4" /></Btn>
            <Btn title="حذف لینک" disabled={!a.link} onClick={() => editor.chain().focus().unsetLink().run()}><Unlink className="w-4 h-4" /></Btn>
            <Btn title="درج جدول ۳×۳" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><TableIcon className="w-4 h-4" /></Btn>
            <Btn title="ویدیوی یوتیوب" onClick={addYoutube}><Video className="w-4 h-4" /></Btn>
            <Btn title="پاک کردن قالب‌بندی" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}><Eraser className="w-4 h-4" /></Btn>
          </div>
        )}

        {editor && a?.table && (
          <div className="flex flex-wrap items-center gap-1.5 px-2 py-1.5 border-b border-[#2c2c2e] bg-[#181818] text-[11px]">
            <span className="text-[#64748b] font-bold ml-1">جدول:</span>
            {[
              ["ستون بعد", () => editor.chain().focus().addColumnAfter().run()],
              ["ستون قبل", () => editor.chain().focus().addColumnBefore().run()],
              ["حذف ستون", () => editor.chain().focus().deleteColumn().run()],
              ["سطر بعد", () => editor.chain().focus().addRowAfter().run()],
              ["سطر قبل", () => editor.chain().focus().addRowBefore().run()],
              ["حذف سطر", () => editor.chain().focus().deleteRow().run()],
              ["حذف جدول", () => editor.chain().focus().deleteTable().run()],
            ].map(([label, fn]) => (
              <button
                key={label as string}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={fn as () => void}
                className="px-2 py-1 rounded bg-[#141414] border border-[#2c2c2e] text-[#e5e2e1]/80 hover:border-[#ff6600] hover:text-white"
              >
                {label as string}
              </button>
            ))}
          </div>
        )}

        <div className="tiptap-wrapper min-h-[480px] max-h-[640px] overflow-y-auto p-4 sm:p-6">
          <EditorContent editor={editor} />
        </div>
      </div>

      {linkModal && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setLinkModal(null); }}
          onKeyDown={(e) => { if (e.key === "Escape") setLinkModal(null); }}
        >
          <div className="w-full max-w-md rounded-xl bg-[#1e1e1e] border border-[#2c2c2e] shadow-2xl" dir="rtl" role="dialog" aria-modal="true" aria-label="تنظیمات لینک">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#2c2c2e]">
              <h4 className="text-sm font-bold text-[#e5e2e1] flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-[#ff6600]" />
                <span>{linkModal.isEdit ? "ویرایش لینک" : "تنظیمات لینک"}</span>
              </h4>
              <button type="button" onClick={() => setLinkModal(null)} className="text-[#64748b] hover:text-white" aria-label="بستن"><X className="w-4 h-4" /></button>
            </div>

            <form
              className="p-5 space-y-4 text-xs"
              onSubmit={(e) => { e.preventDefault(); applyLink(); }}
            >
              <div>
                <label className="block font-bold text-[#e5e2e1] mb-1.5">آدرس لینک (URL)</label>
                <input
                  autoFocus
                  dir="ltr"
                  value={linkModal.url}
                  onChange={(e) => setLinkModal({ ...linkModal, url: e.target.value })}
                  placeholder="https://example.com یا /blog/slug"
                  className="w-full bg-[#141414] border border-[#2c2c2e] rounded px-3 py-2.5 text-[#e5e2e1] font-mono-tag focus:outline-none focus:border-[#ff6600]"
                />
              </div>

              {!linkModal.hasSelection && (
                <div>
                  <label className="block font-bold text-[#e5e2e1] mb-1.5">متن نمایشی لینک</label>
                  <input
                    value={linkModal.text}
                    onChange={(e) => setLinkModal({ ...linkModal, text: e.target.value })}
                    placeholder="متنی که کاربر می‌بیند (خالی = خود آدرس)"
                    className="w-full bg-[#141414] border border-[#2c2c2e] rounded px-3 py-2.5 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                  />
                </div>
              )}

              <div className="space-y-2.5 pt-1">
                {([
                  ["newTab", "باز شدن در تب جدید", "target=_blank همراه با noopener و noreferrer"],
                  ["nofollow", "نوفالو (nofollow)", "به موتورهای جستجو می‌گوید اعتبار صفحه را به این لینک منتقل نکنند"],
                  ["sponsored", "اسپانسری (sponsored)", "برای لینک‌های تبلیغاتی یا همکاری پولی"],
                  ["ugc", "محتوای کاربر (ugc)", "برای لینک‌هایی که کاربران گذاشته‌اند"],
                ] as const).map(([key, label, hint]) => (
                  <label key={key} className="flex items-start gap-2.5 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={linkModal[key]}
                      onChange={(e) => setLinkModal({ ...linkModal, [key]: e.target.checked })}
                      className="mt-0.5 accent-[#ff6600]"
                    />
                    <span>
                      <span className="block font-bold text-[#e5e2e1]">{label}</span>
                      <span className="block text-[10px] text-[#64748b] mt-0.5">{hint}</span>
                    </span>
                  </label>
                ))}
              </div>

              <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#2c2c2e]">
                <div>
                  {linkModal.isEdit && (
                    <button type="button" onClick={removeLink} className="px-3 py-2 rounded text-red-400 hover:bg-red-500/10 border border-red-500/30 font-bold">
                      حذف لینک
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setLinkModal(null)} className="px-4 py-2 rounded bg-[#141414] border border-[#2c2c2e] text-[#e5e2e1] font-bold">انصراف</button>
                  <button type="submit" disabled={!linkModal.url.trim()} className="px-5 py-2 rounded bg-[#ff6600] hover:bg-[#ff8532] disabled:opacity-40 text-white font-bold">
                    {linkModal.isEdit ? "ذخیره تغییرات" : "درج لینک"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
