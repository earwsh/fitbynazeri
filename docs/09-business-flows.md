# ۰۹ — جریان‌های کسب‌وکار

## ۱. دریافت برنامه (سفارش)

```
کاربر ─► /get-plan (انتخاب پکیج از GET /api/packages)
      ─► ورود/ثبت‌نام (/login)  [localStorage: nazeri_user, nazeri_token]
      ─► /get-plan/intake (پرسشنامه)
      ─► POST /api/plan-orders
            └ سرور عنوان/نوع/قیمت/مدت را از PlanPackage (slug فعال) می‌خواند
            └ payment_status = "paid" (!)    status = "reviewing"
            └ estimated_delivery = "۲۴ الی ۴۸ ساعت کاری"
مربی ─► داشبورد › plan-orders / plan-builder
      ─► PUT /api/plan-orders/:id  (status: preparing → ready، متن/فایل برنامه، admin_feedback)
کاربر ─► داشبورد › my-workout / my-diet / my-plan
      ─► GET /api/plan-orders/user/:email
```

وضعیت‌ها:

| `status` | معنی |
| :--- | :--- |
| `reviewing` | پرسشنامه دریافت شد و مربی در حال بررسی است |
| `preparing` | برنامه در حال تدوین است |
| `ready` | برنامه آماده و در داشبورد کاربر فعال است |
| `completed` | پایان دوره |

> **درگاه پرداخت وجود ندارد.** کد سفارش را مستقیم با `payment_status = "paid"` ثبت می‌کند («فرض پرداخت موفق»). اتصال به درگاه (مثلاً زرین‌پال) و تغییر مقدار اولیه به `pending` تا تأیید پرداخت، کار مهم باقی‌مانده است.

قیمت‌ها به تومان‌اند و در `PlanOrder.price` به‌صورت رشته‌ی فرمت‌شده ذخیره می‌شوند (`FormatToman`).

## ۲. نظرات مقاله

`POST /blog-comments` ← `pending` ← مربی در پنل `approved`/`rejected` می‌کند و می‌تواند پاسخ (`reply`) بنویسد ← فقط `approved`ها باید به عموم نشان داده شوند.

## ۳. نظرات قهرمانان (صفحه اصلی)

`POST /testimonials` ← `pending` ← تأیید در داشبورد › testimonials ← `GET /testimonials/public` فقط `approved`.

## ۴. درخواست مشاوره

فرم صفحه اصلی/تماس ← `POST /consultations` (`pending`) ← مربی تماس می‌گیرد و وضعیت را `contacted`/`completed` می‌کند و یادداشت می‌نویسد.

## ۵. مدیریت محتوای سایت

- Hero و About: `PUT /hero-slides/:id`، `PUT /about-section` (فقط یک رکورد About).
- SEO سایت: `PUT /seo`.
- مقالات: Tiptap + پنل SEO (کلمه کلیدی، meta، FAQ ساختاریافته).
- رسانه: آپلود ← تغییر اندازه/فشرده‌سازی خودکار ← ثبت `MediaFile` ← انتخاب در `MediaPickerModal`.

## ۶. پکیج‌ها

سوپروایزر پکیج جدید (قیمت، مدت، ویژگی‌ها، نشان «پرطرفدار») می‌سازد. `slug` پکیج‌های سه‌گانه‌ی پیش‌فرض `workout`، `diet`، `combo` است و پکیج‌های جدید `pkg-<id>`. پکیج غیرفعال قابل سفارش نیست.
