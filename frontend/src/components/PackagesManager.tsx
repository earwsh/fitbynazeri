"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Save, X, Star } from "lucide-react";

const API = "https://fitbynazeri.com/api";

type Pkg = {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  kind: "workout" | "diet" | "combo";
  duration_months: number;
  price: number;
  old_price: number;
  badge: string;
  popular: boolean;
  features: string; // JSON array
  btn_text: string;
  is_active: boolean;
  sort_order: number;
};

const KIND_LABELS: Record<string, string> = {
  workout: "فقط تمرین",
  diet: "فقط تغذیه",
  combo: "تمرین + تغذیه",
};

const emptyForm = {
  title: "",
  subtitle: "",
  kind: "combo" as Pkg["kind"],
  duration_months: 1,
  price: 0,
  old_price: 0,
  badge: "",
  popular: false,
  featuresText: "",
  btn_text: "",
  is_active: true,
  sort_order: 0,
};

const fa = (n: number) => n.toLocaleString("fa-IR");

function parseFeatures(s: string): string[] {
  try {
    const a = JSON.parse(s);
    return Array.isArray(a) ? a : [];
  } catch {
    return [];
  }
}

export default function PackagesManager() {
  const [packages, setPackages] = useState<Pkg[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("nazeri_token") || ""}`,
  });

  const load = () => {
    fetch(`${API}/packages?all=1`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => {
        if (d.status === "success") setPackages(d.packages || []);
        else setError(d.message || "خطا در دریافت پکیج‌ها");
      })
      .catch(() => setError("ارتباط با سرور برقرار نشد"));
  };

  useEffect(load, []);

  const openNew = () => {
    setEditingId(null);
    setForm({ ...emptyForm, sort_order: packages.length + 1 });
    setError("");
    setShowForm(true);
  };

  const openEdit = (p: Pkg) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      subtitle: p.subtitle,
      kind: p.kind,
      duration_months: p.duration_months,
      price: p.price,
      old_price: p.old_price,
      badge: p.badge,
      popular: p.popular,
      featuresText: parseFeatures(p.features).join("\n"),
      btn_text: p.btn_text,
      is_active: p.is_active,
      sort_order: p.sort_order,
    });
    setError("");
    setShowForm(true);
  };

  const save = async () => {
    setBusy(true);
    setError("");
    const { featuresText, ...rest } = form;
    const body = {
      ...rest,
      duration_months: Number(form.duration_months),
      price: Number(form.price),
      old_price: Number(form.old_price),
      sort_order: Number(form.sort_order),
      features: featuresText.split("\n").map((s) => s.trim()).filter(Boolean),
    };
    try {
      const res = await fetch(editingId ? `${API}/packages/${editingId}` : `${API}/packages`, {
        method: editingId ? "PUT" : "POST",
        headers: authHeaders(),
        body: JSON.stringify(body),
      });
      const d = await res.json();
      if (!res.ok) {
        setError(d.message || "خطا در ذخیره پکیج");
      } else {
        setShowForm(false);
        load();
      }
    } catch {
      setError("ارتباط با سرور برقرار نشد");
    }
    setBusy(false);
  };

  const remove = async (p: Pkg) => {
    if (!confirm(`پکیج «${p.title}» حذف شود؟`)) return;
    const res = await fetch(`${API}/packages/${p.id}`, { method: "DELETE", headers: authHeaders() });
    const d = await res.json();
    if (d.deactivated) alert(d.message);
    load();
  };

  const toggleActive = async (p: Pkg) => {
    await fetch(`${API}/packages/${p.id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ ...p, features: parseFeatures(p.features), is_active: !p.is_active }),
    });
    load();
  };

  const inputCls = "w-full px-3 py-2.5 rounded bg-[#141414] border border-[#2c2c2e] text-xs text-[#e5e2e1] focus:border-[#ff6600] outline-none";
  const labelCls = "text-[11px] font-bold text-[#64748b] mb-1.5 block";

  return (
    <div className="mt-8 space-y-6 w-full pb-12" dir="rtl">
      <div className="p-4 rounded-lg bg-[#1e1e1e] border border-[#2c2c2e] flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-[#e5e2e1]">مدیریت پکیج‌ها و تعرفه‌ها</h3>
          <p className="text-[11px] text-[#64748b] mt-1">هر تعداد پکیج با مدت (ماه) و قیمت دلخواه تعریف کنید؛ پکیج‌های فعال در صفحه «دریافت برنامه» نمایش داده می‌شوند.</p>
        </div>
        <button onClick={openNew} className="px-4 py-2.5 rounded bg-[#ff6600] hover:bg-[#ff8532] text-white text-xs font-bold flex items-center gap-2 whitespace-nowrap">
          <Plus className="w-4 h-4" />
          <span>پکیج جدید</span>
        </button>
      </div>

      {error && !showForm && <div className="p-3 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs">{error}</div>}

      {showForm && (
        <div className="p-6 rounded-lg bg-[#1e1e1e] border border-[#ff6600]/40 space-y-5">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-[#e5e2e1]">{editingId ? "ویرایش پکیج" : "ساخت پکیج جدید"}</h4>
            <button onClick={() => setShowForm(false)} className="text-[#64748b] hover:text-white"><X className="w-4 h-4" /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>عنوان پکیج *</label>
              <input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>زیرعنوان</label>
              <input className={inputCls} value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>نوع برنامه *</label>
              <select className={inputCls} value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value as Pkg["kind"] })}>
                <option value="workout">فقط تمرین</option>
                <option value="diet">فقط تغذیه</option>
                <option value="combo">تمرین + تغذیه</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>مدت پکیج (ماه) *</label>
              <input type="number" min={1} className={inputCls} value={form.duration_months} onChange={(e) => setForm({ ...form, duration_months: Number(e.target.value) })} />
            </div>
            <div>
              <label className={labelCls}>قیمت (تومان) *</label>
              <input type="number" min={0} className={inputCls} dir="ltr" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            </div>
            <div>
              <label className={labelCls}>قیمت قبل از تخفیف (اختیاری)</label>
              <input type="number" min={0} className={inputCls} dir="ltr" value={form.old_price} onChange={(e) => setForm({ ...form, old_price: Number(e.target.value) })} />
            </div>
            <div>
              <label className={labelCls}>برچسب (مثلا: پیشنهاد ویژه)</label>
              <input className={inputCls} value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>متن دکمه</label>
              <input className={inputCls} value={form.btn_text} onChange={(e) => setForm({ ...form, btn_text: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>ترتیب نمایش</label>
              <input type="number" className={inputCls} value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
            </div>
            <div className="flex items-end gap-6 pb-1">
              <label className="flex items-center gap-2 text-xs text-[#e5e2e1] cursor-pointer">
                <input type="checkbox" checked={form.popular} onChange={(e) => setForm({ ...form, popular: e.target.checked })} />
                <span>پرطرفدار (کارت برجسته)</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-[#e5e2e1] cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                <span>فعال</span>
              </label>
            </div>
          </div>

          <div>
            <label className={labelCls}>ویژگی‌ها (هر خط یک مورد)</label>
            <textarea rows={6} className={inputCls} value={form.featuresText} onChange={(e) => setForm({ ...form, featuresText: e.target.value })} />
          </div>

          {error && <div className="p-3 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs">{error}</div>}

          <div className="flex gap-3">
            <button disabled={busy} onClick={save} className="px-5 py-2.5 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2">
              <Save className="w-4 h-4" />
              <span>{busy ? "در حال ذخیره..." : "ذخیره پکیج"}</span>
            </button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded bg-[#141414] border border-[#2c2c2e] text-[#e5e2e1] text-xs font-bold">انصراف</button>
          </div>
        </div>
      )}

      <div className="rounded-lg bg-[#1e1e1e] border border-[#2c2c2e] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#161616] text-[#64748b] border-b border-[#2c2c2e]">
              <tr>
                <th className="p-4 font-bold">پکیج</th>
                <th className="p-4 font-bold">نوع</th>
                <th className="p-4 font-bold">مدت</th>
                <th className="p-4 font-bold">قیمت (تومان)</th>
                <th className="p-4 font-bold">وضعیت</th>
                <th className="p-4 font-bold text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2c2c2e]">
              {packages.map((p) => (
                <tr key={p.id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="p-4 font-bold text-[#e5e2e1]">
                    <span className="flex items-center gap-2">
                      {p.popular && <Star className="w-3.5 h-3.5 text-[#ff6600] fill-[#ff6600]" />}
                      {p.title}
                    </span>
                  </td>
                  <td className="p-4 text-[#e5e2e1]/80">{KIND_LABELS[p.kind]}</td>
                  <td className="p-4 text-[#ff6600] font-bold">{fa(p.duration_months)} ماه</td>
                  <td className="p-4 text-[#e5e2e1]">{fa(p.price)}</td>
                  <td className="p-4">
                    <button onClick={() => toggleActive(p)} className={`px-2.5 py-1 rounded border text-[11px] font-bold ${p.is_active ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400" : "bg-[#141414] border-[#2c2c2e] text-[#64748b]"}`}>
                      {p.is_active ? "فعال" : "غیرفعال"}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => openEdit(p)} className="p-2 rounded bg-[#141414] border border-[#2c2c2e] hover:border-[#ff6600] text-[#e5e2e1]" title="ویرایش"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => remove(p)} className="p-2 rounded bg-[#141414] border border-[#2c2c2e] hover:border-red-500 text-red-400" title="حذف"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {packages.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-[#64748b]">هنوز پکیجی تعریف نشده است.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
