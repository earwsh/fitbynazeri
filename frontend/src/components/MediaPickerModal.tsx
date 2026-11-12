"use client";

import { useState, useEffect } from "react";
import { 
  Upload, 
  Image as ImageIcon, 
  Video, 
  File, 
  Check, 
  X, 
  Loader2, 
  Save, 
  Edit3, 
  CheckCircle2
} from "lucide-react";

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  currentUrl?: string;
}

export default function MediaPickerModal({ isOpen, onClose, onSelect, currentUrl }: MediaModalProps) {
  const [activeTab, setActiveTab] = useState<"library" | "upload">("library");
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  // SEO Edit Form State for selected image
  const [seoForm, setSeoForm] = useState({
    file_name: "",
    alt_text: "",
    title: "",
    caption: "",
  });
  const [seoUpdating, setSeoUpdating] = useState(false);
  const [seoSavedMsg, setSeoSavedMsg] = useState(false);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://fitbynazeri.com/api/media");
      const data = await res.json();
      if (data.status === "success" && data.media) {
        setMediaList(data.media);
        if (data.media.length > 0) {
          const match = data.media.find((m: any) => m.file_url === currentUrl) || data.media[0];
          setSelectedItem(match);
          setSeoForm({
            file_name: match.file_name || "",
            alt_text: match.alt_text || "",
            title: match.title || "",
            caption: match.caption || "",
          });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMedia();
    }
  }, [isOpen, currentUrl]);

  const handleSelectItem = (item: any) => {
    setSelectedItem(item);
    setSeoForm({
      file_name: item.file_name || "",
      alt_text: item.alt_text || "",
      title: item.title || "",
      caption: item.caption || "",
    });
  };

  const handleSaveMediaSEO = async () => {
    if (!selectedItem) return;
    setSeoUpdating(true);
    try {
      const res = await fetch(`https://fitbynazeri.com/api/media/${selectedItem.id}/seo`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(seoForm),
      });
      const data = await res.json();
      if (res.ok && data.media) {
        setSeoSavedMsg(true);
        setSelectedItem(data.media);
        setMediaList((prev) =>
          prev.map((m) => (m.id === selectedItem.id ? data.media : m))
        );
        setTimeout(() => setSeoSavedMsg(false), 2500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSeoUpdating(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const res = await fetch("https://fitbynazeri.com/api/media/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.media) {
        setSelectedItem(data.media);
        setSeoForm({
          file_name: data.media.file_name || "",
          alt_text: data.media.alt_text || "",
          title: data.media.title || "",
          caption: data.media.caption || "",
        });
        await fetchMedia();
        setActiveTab("library");
      }
    } catch (e) {
      console.error("Upload failed", e);
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 animate-in fade-in" dir="rtl">
      
      {/* Modal Container */}
      <div className="w-full max-w-6xl bg-[#1e1e1e] border border-[#2c2c2e] rounded-lg shadow-2xl flex flex-col h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#2c2c2e] flex items-center justify-between bg-[#161616]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#ff6600] flex items-center justify-center text-white shadow-md shadow-[#ff6600]/25">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#e5e2e1]">مدیریت و انتخاب رسانه</h2>
              <p className="text-xs text-[#64748b]">انتخاب از آرشیو، آپلود تصویر و تنظیم اطلاعات سئو</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded bg-[#141414] text-[#64748b] hover:text-white border border-[#2c2c2e] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs Switcher */}
        <div className="flex border-b border-[#2c2c2e] px-6 bg-[#141414]">
          <button
            onClick={() => setActiveTab("library")}
            className={`py-3.5 px-5 text-xs font-bold border-b-2 transition-all ${
              activeTab === "library"
                ? "border-[#ff6600] text-[#ff6600]"
                : "border-transparent text-[#64748b] hover:text-[#e5e2e1]"
            }`}
          >
            آرشیو تصاویر ({mediaList.length})
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`py-3.5 px-5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "upload"
                ? "border-[#ff6600] text-[#ff6600]"
                : "border-transparent text-[#64748b] hover:text-[#e5e2e1]"
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>آپلود تصویر جدید</span>
          </button>
        </div>

        {/* Modal Body: Split 2-Column on Desktop */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          
          {/* Main Content Area */}
          <div className="flex-1 p-5 overflow-y-auto min-h-[300px]">
            
            {/* Tab 1: Library Grid */}
            {activeTab === "library" && (
              <div>
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-64 gap-3 text-xs text-[#64748b]">
                    <Loader2 className="w-7 h-7 animate-spin text-[#ff6600]" />
                    <span>در حال بارگذاری تصاویر...</span>
                  </div>
                ) : mediaList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
                    <ImageIcon className="w-12 h-12 text-[#3a3a3c]" />
                    <p className="text-xs text-[#64748b]">هنوز تصویری آپلود نشده است.</p>
                    <button
                      onClick={() => setActiveTab("upload")}
                      className="px-5 py-2.5 rounded bg-[#ff6600] text-white text-xs font-bold shadow-md shadow-[#ff6600]/25"
                    >
                      آپلود اولین تصویر
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
                    {mediaList.map((m) => {
                      const isSelected = selectedItem?.id === m.id;
                      return (
                        <div
                          key={m.id}
                          onClick={() => handleSelectItem(m)}
                          className={`relative group rounded-md border overflow-hidden cursor-pointer aspect-video bg-[#141414] transition-all ${
                            isSelected
                              ? "border-[#ff6600] ring-2 ring-[#ff6600]/60 shadow-lg shadow-[#ff6600]/20"
                              : "border-[#2c2c2e] hover:border-[#64748b]"
                          }`}
                        >
                          <img
                            src={m.file_url}
                            alt={m.alt_text || m.file_name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />

                          {/* Selected Checkmark */}
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#ff6600] text-white flex items-center justify-center shadow-md">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          )}
                          
                          {/* File Name info bar */}
                          <div className="absolute bottom-0 inset-x-0 bg-black/85 backdrop-blur-xs p-1.5 text-[10px] text-[#e5e2e1] truncate px-2">
                            {m.file_name}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Upload Area */}
            {activeTab === "upload" && (
              <div className="flex flex-col items-center justify-center h-full min-h-[350px] border-2 border-dashed border-[#2c2c2e] rounded-lg p-8 text-center hover:border-[#ff6600]/60 transition-colors bg-[#141414]/50">
                {uploading ? (
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-[#ff6600]" />
                    <div className="space-y-1">
                      <p className="text-sm text-[#e5e2e1] font-bold">در حال پردازش و ذخیره تصویر...</p>
                      <p className="text-xs text-[#64748b]">لطفاً چند لحظه صبر کنید</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 max-w-md">
                    <div className="w-14 h-14 rounded-full bg-[#1a1a1c] border border-[#2c2c2e] flex items-center justify-center text-[#ff6600] mx-auto shadow-inner">
                      <Upload className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-[#e5e2e1]">تصویر مورد نظر را انتخاب یا اینجا رها کنید</p>
                      <p className="text-xs text-[#64748b] mt-1.5 leading-relaxed">
                        پشتیبانی از انواع فرمت‌های تصویری استاندارد وب
                      </p>
                    </div>
                    <label className="inline-block mt-3 px-6 py-3 rounded bg-[#ff6600] hover:bg-[#ff8532] text-white text-xs font-bold cursor-pointer transition-all shadow-lg shadow-[#ff6600]/30 hover:scale-105 active:scale-95">
                      <span>انتخاب تصویر از کامپیوتر</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Left Column: Image SEO & Metadata Inspector */}
          <div className="w-full md:w-80 lg:w-96 border-t md:border-t-0 md:border-r border-[#2c2c2e] bg-[#161616] p-5 overflow-y-auto flex flex-col justify-between">
            {selectedItem ? (
              <div className="space-y-4 text-xs">
                
                <div className="flex items-center justify-between pb-2 border-b border-[#2c2c2e]">
                  <span className="font-bold text-[#e5e2e1] flex items-center gap-2">
                    <Edit3 className="w-3.5 h-3.5 text-[#ff6600]" />
                    <span>مشخصات و سئو تصویر</span>
                  </span>
                </div>

                {/* Preview Thumbnail with dimensions & size */}
                <div className="rounded border border-[#2c2c2e] overflow-hidden bg-[#141414] aspect-video relative group">
                  <img src={selectedItem.file_url} alt={selectedItem.alt_text} className="w-full h-full object-cover" />
                  <div className="absolute top-1.5 left-1.5 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono-tag text-[#e5e2e1]">
                    {selectedItem.width > 0 ? `${selectedItem.width}×${selectedItem.height}` : "HD"}
                  </div>
                  <div className="absolute bottom-1.5 left-1.5 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono-tag text-[#64748b]">
                    {(selectedItem.file_size / 1024).toFixed(1)} KB
                  </div>
                </div>

                {/* Form Fields for Image SEO */}
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-medium text-[#e5e2e1] mb-1">
                      متن جایگزین (Alt Text) <span className="text-[#ff6600]">*</span>
                    </label>
                    <input
                      type="text"
                      value={seoForm.alt_text}
                      onChange={(e) => setSeoForm({ ...seoForm, alt_text: e.target.value })}
                      placeholder="توضیح تصویر برای موتورهای جستجو"
                      className="w-full bg-[#1a1a1c] border border-[#2c2c2e] rounded px-3 py-2 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#e5e2e1] mb-1">عنوان تصویر (Title)</label>
                    <input
                      type="text"
                      value={seoForm.title}
                      onChange={(e) => setSeoForm({ ...seoForm, title: e.target.value })}
                      placeholder="عنوان تصویر"
                      className="w-full bg-[#1a1a1c] border border-[#2c2c2e] rounded px-3 py-2 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#e5e2e1] mb-1">نام فایل (File Name)</label>
                    <input
                      type="text"
                      value={seoForm.file_name}
                      onChange={(e) => setSeoForm({ ...seoForm, file_name: e.target.value })}
                      dir="ltr"
                      className="w-full bg-[#1a1a1c] border border-[#2c2c2e] rounded px-3 py-2 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600] text-left text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#e5e2e1] mb-1">توضیح کوتاه</label>
                    <textarea
                      rows={2}
                      value={seoForm.caption}
                      onChange={(e) => setSeoForm({ ...seoForm, caption: e.target.value })}
                      placeholder="توضیح تکمیلی"
                      className="w-full bg-[#1a1a1c] border border-[#2c2c2e] rounded px-3 py-2 text-[#e5e2e1] focus:outline-none focus:border-[#ff6600]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveMediaSEO}
                    disabled={seoUpdating}
                    className="w-full py-2 rounded bg-[#2c2c2e] hover:bg-[#3a3a3c] text-[#e5e2e1] text-xs font-bold transition-all flex items-center justify-center gap-2 border border-[#3a3a3c]"
                  >
                    {seoUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 text-[#ff6600]" />}
                    <span>ذخیره اطلاعات تصویر</span>
                  </button>

                  {seoSavedMsg && (
                    <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-[11px] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>اطلاعات تصویر با موفقیت ذخیره شد</span>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-xs text-[#64748b] gap-2">
                <ImageIcon className="w-8 h-8 text-[#3a3a3c]" />
                <span>یک تصویر را برای مشاهده و ویرایش انتخاب کنید</span>
              </div>
            )}

            {/* Direct Confirmation Action */}
            <div className="pt-4 mt-4 border-t border-[#2c2c2e]">
              <button
                disabled={!selectedItem}
                onClick={() => {
                  if (selectedItem) {
                    onSelect(selectedItem.file_url);
                    onClose();
                  }
                }}
                className="w-full py-3 rounded bg-[#ff6600] hover:bg-[#ff8532] disabled:opacity-50 text-white text-xs font-bold transition-all shadow-lg shadow-[#ff6600]/30"
              >
                تایید و اعمال این تصویر
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
