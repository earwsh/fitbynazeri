# ۰۷ — فرانت‌اند

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind 4. همه‌ی صفحات کلاینت‌محور هستند و داده را با `fetch` از API می‌گیرند. پوشه: `frontend/src`.

> قبل از تغییر کد Next.js، `frontend/AGENTS.md` و راهنمای `node_modules/next/dist/docs/` را ببینید (API نسخه‌ی 16 با نسخه‌های قبلی فرق دارد).

## مسیرها (`src/app`)

| مسیر | فایل | توضیح |
| :--- | :--- | :--- |
| `/` | `page.tsx` | صفحه اصلی: Hero، About، Champions، Testimonials، BlogSection، ConsultationForm |
| `/about` | `about/page.tsx` | درباره |
| `/blog` | `blog/page.tsx` | آرشیو مقالات (`BlogArchiveClient`) |
| `/blog/[slug]` | `blog/[slug]/page.tsx` | مقاله + نظرات + FAQ |
| `/students` | `students/page.tsx` | لیست قهرمانان |
| `/students/[slug]` | `students/[slug]/page.tsx` | پروفایل قهرمان |
| `/contact` | `contact/page.tsx` | تماس |
| `/login` | `login/page.tsx` | ورود و ثبت‌نام |
| `/get-plan` | `get-plan/page.tsx` | انتخاب پکیج (از `/api/packages`) |
| `/get-plan/intake` | `get-plan/intake/page.tsx` | پرسشنامه و ثبت سفارش |
| `/dashboard` | `dashboard/page.tsx` | پنل مدیریت/کاربر (فایل بسیار بزرگ، ~۵۰۰KB) |

## داشبورد

یک صفحه‌ی واحد با state به نام `activeMenu` (پیش‌فرض `overview`) که بخش نمایش‌داده‌شده را تعیین می‌کند. نقش کاربر از `localStorage` خوانده می‌شود و منو را شکل می‌دهد.

| `activeMenu` | برای | کار |
| :--- | :--- | :--- |
| `overview` | همه | خلاصه |
| `plan-orders` | admin، superadmin | لیست سفارش‌ها و پرونده‌ها |
| `plan-builder` | admin، superadmin | ساخت/ویرایش برنامه تمرینی و غذایی یک سفارش و تغییر وضعیت |
| `my-workout`، `my-diet`، `my-plan` | student | دیدن برنامه تحویلی |
| `blog` | admin، superadmin | مدیریت مقاله، دسته، نظرات (ویرایشگر Tiptap) |
| `students` | admin، superadmin | مدیریت قهرمانان |
| `testimonials` | admin، superadmin | تأیید نظرات |
| `consultations` | admin، superadmin | درخواست‌های مشاوره |
| `media-library` | admin، superadmin | آپلود و SEO رسانه |
| `hero-cms`، `about-cms` | superadmin | ویرایش Hero و About |
| `packages-cms` | superadmin | مدیریت پکیج‌ها (`PackagesManager`) |
| `theme-colors` | superadmin | تنظیم رنگ تم |

> این جدول از شرط‌های `activeMenu === ...` در `dashboard/page.tsx` استخراج شده؛ اگر منو عوض شد به‌روز کنید. کنترل نقش در سمت کلاینت است و **امنیت واقعی نیست** (بک‌اند هنوز بیشتر مسیرها را نمی‌بندد؛ [10-known-issues.md](10-known-issues.md)).

## کامپوننت‌ها (`src/components`)

| کامپوننت | کار |
| :--- | :--- |
| `Header`، `Footer` | قالب سایت |
| `Hero`، `About`، `Champions`، `Testimonials`، `BlogSection` | بخش‌های صفحه اصلی (داده از CMS) |
| `ConsultationForm` | فرم مشاوره رایگان ← `POST /consultations` |
| `BmiCalculator` | ماشین‌حساب BMI |
| `BlogArchiveClient`، `BlogCommentsSection`، `BlogFaqAccordion` | نمایش مقالات، نظرات و FAQ |
| `TiptapArticleEditor`، `BlogSeoPanel`، `BlogFaqEditor`، `BlogCoverField` | ابزار نوشتن مقاله و SEO |
| `MediaPickerModal` | انتخاب/آپلود تصویر از کتابخانه رسانه |
| `PackagesManager` | CRUD پکیج‌ها (superadmin) |

## وضعیت سمت کلاینت (localStorage)

| کلید | محتوا |
| :--- | :--- |
| `nazeri_token` | JWT |
| `nazeri_user` | JSON کاربر (`id, full_name, email, phone, role, ...`) |

توکن در هدر `Authorization: Bearer <token>` فرستاده می‌شود (فعلاً فقط مسیرهای پکیج آن را اعتبارسنجی می‌کنند). خروج = پاک کردن این دو کلید.

## استایل و برند

رنگ، فونت (Yekan Bakh، Hanli، JetBrains Mono)، کامپوننت‌ها و قوانین لوگو در [../DESIGN.md](../DESIGN.md). استایل عمومی `src/app/globals.css`. جهت صفحه RTL و محتوا فارسی است.

## نکات توسعه

- آدرس API در بیشتر فایل‌ها hardcode است (`https://fitbynazeri.com/api`)؛ بهتر است یک ماژول `lib/api.ts` با `NEXT_PUBLIC_API_URL` ساخته شود.
- `dashboard/page.tsx` باید به کامپوننت‌های جدا شکسته شود.
- فایل‌های `public/*.svg` پیش‌فرض create-next-app هستند و استفاده نمی‌شوند.
