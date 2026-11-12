# ۰۶ — مرجع API

پایه: `https://fitbynazeri.com/api` (محلی: `http://localhost:8080/api`). فایل‌های آپلودی: `GET /uploads/<file>`.
فرمت: JSON، پاسخ‌ها `{status: "success"|"error", message?, ...}`. پیام‌های خطا فارسی‌اند.

**ستون «احراز»:** در حال حاضر فقط ردیف‌های ✅ توسط سرور بررسی می‌شوند. باقی (`—`) هر کسی با دانستن آدرس می‌تواند صدا بزند؛ «پیشنهادی» نقشی است که باید اعمال شود. جزئیات در [10-known-issues.md](10-known-issues.md).

## سلامت و ورود

| متد | مسیر | احراز | توضیح |
| :--- | :--- | :--- | :--- |
| GET | `/health` | — | `{status:"healthy"}` |
| POST | `/auth/login` | — | بدنه `{email, password}` ← `{token, user}`؛ JWT با اعتبار ۷۲ ساعت |

## کاربران

| متد | مسیر | احراز | توضیح |
| :--- | :--- | :--- | :--- |
| GET | `/users` | — (پیشنهادی: admin+) | لیست کاربران |
| POST | `/users` | — (باید محدود شود) | ساخت کاربر؛ بدنه `{full_name,email,phone,password,role}`؛ رمز خالی ← پیش‌فرض در `auth.go` (تغییر دهید) |
| PUT | `/users/:id` | — (پیشنهادی: superadmin) | ویرایش از جمله `role` |
| DELETE | `/users/:id` | — (پیشنهادی: superadmin) | soft delete |

## وبلاگ

| متد | مسیر | احراز | توضیح |
| :--- | :--- | :--- | :--- |
| GET | `/blog-categories` | عمومی | |
| POST | `/blog-categories` | — (پیشنهادی: admin+) | |
| DELETE | `/blog-categories/:id` | — (پیشنهادی: admin+) | |
| GET | `/blog` | عمومی | لیست مقالات |
| GET | `/blog/:slug` | عمومی | |
| POST | `/blog` | — (پیشنهادی: admin+) | فیلدهای SEO و FAQ در بدنه |
| PUT | `/blog/:id` | — (پیشنهادی: admin+) | |
| DELETE | `/blog/:id` | — (پیشنهادی: admin+) | |

## نظرات وبلاگ

| متد | مسیر | احراز | توضیح |
| :--- | :--- | :--- | :--- |
| GET | `/blog-comments/post/:slug` | عمومی | فقط تأییدشده‌ها نمایش داده شوند |
| GET | `/blog-comments` | — (پیشنهادی: admin+) | همه‌ی نظرات برای پنل |
| POST | `/blog-comments` | عمومی | ثبت با وضعیت `pending` |
| PUT | `/blog-comments/:id/status` | — (پیشنهادی: admin+) | `pending/approved/rejected` |
| PUT | `/blog-comments/:id/reply` | — (پیشنهادی: admin+) | پاسخ مربی |
| DELETE | `/blog-comments/:id` | — (پیشنهادی: admin+) | |

## نظرات قهرمانان (Testimonials)

| متد | مسیر | احراز | توضیح |
| :--- | :--- | :--- | :--- |
| GET | `/testimonials/public` | عمومی | فقط `approved` |
| GET | `/testimonials` | — (پیشنهادی: admin+) | همه |
| POST | `/testimonials` | عمومی | ثبت با `pending` |
| PUT | `/testimonials/:id/status` | — (پیشنهادی: admin+) | |
| DELETE | `/testimonials/:id` | — (پیشنهادی: admin+) | |

## قهرمانان (StudentProfile)

| متد | مسیر | احراز | توضیح |
| :--- | :--- | :--- | :--- |
| GET | `/students` | عمومی/ادمین | شامل `coach_notes` محرمانه؛ باید برای عموم فیلتر شود |
| GET | `/students/:slug` | عمومی | صفحه‌ی عمومی قهرمان |
| POST | `/students` | — (پیشنهادی: admin+) | |
| PUT | `/students/:id` | — (پیشنهادی: admin+) | |
| DELETE | `/students/:id` | — (پیشنهادی: admin+) | |

## CMS و SEO

| متد | مسیر | احراز | توضیح |
| :--- | :--- | :--- | :--- |
| GET / PUT | `/seo` | GET عمومی؛ PUT بدون احراز (پیشنهادی: superadmin) | تنظیمات SEO سایت |
| GET | `/hero-slides` | عمومی | |
| PUT | `/hero-slides/:id` | — (پیشنهادی: superadmin) | |
| GET / PUT | `/about-section` | GET عمومی؛ PUT بدون احراز | |

## مشاوره

| متد | مسیر | احراز | توضیح |
| :--- | :--- | :--- | :--- |
| GET | `/consultations` | — (پیشنهادی: admin+) | شامل شماره تلفن افراد |
| POST | `/consultations` | عمومی | `{full_name, phone, topic}` |
| PUT | `/consultations/:id/status` | — (پیشنهادی: admin+) | `pending/contacted/completed` + `notes` |

## رسانه

| متد | مسیر | احراز | توضیح |
| :--- | :--- | :--- | :--- |
| GET | `/media` | — | لیست |
| POST | `/media/upload` | — (باید محدود شود) | `multipart/form-data` با فیلد `file`. jpg/jpeg/png/webp: کوچک‌سازی به عرض 1920 و JPEG کیفیت 82. mp4/webm/mov: ویدیو. سقف 50MB |
| PUT | `/media/:id/seo` | — | alt، title، caption |
| DELETE | `/media/:id` | — (پیشنهادی: admin+) | رکورد را حذف می‌کند |

## پکیج‌ها

| متد | مسیر | احراز | توضیح |
| :--- | :--- | :--- | :--- |
| GET | `/packages` | عمومی | فعال‌ها؛ superadmin با توکن، غیرفعال‌ها را هم می‌بیند |
| GET | `/packages/:slug` | عمومی | |
| POST | `/packages` | ✅ superadmin | |
| PUT | `/packages/:id` | ✅ superadmin | |
| DELETE | `/packages/:id` | ✅ superadmin | |

بدنه‌ی پکیج: `title, subtitle, kind(workout|diet|combo), duration_months, price, old_price, badge, popular, features[], btn_text, is_active, sort_order`.

## سفارش‌ها و برنامه‌ها (PlanOrder)

| متد | مسیر | احراز | توضیح |
| :--- | :--- | :--- | :--- |
| POST | `/plan-orders` | — (پیشنهادی: کاربر واردشده) | ثبت پرسشنامه و سفارش. با `package_slug` عنوان/نوع/قیمت/مدت **از دیتابیس** گرفته می‌شود نه از ورودی |
| GET | `/plan-orders/user/:email` | — (باید فقط صاحب ایمیل یا admin) | سفارش‌های یک کاربر. **IDOR:** هر کس با دانستن ایمیل داده را می‌بیند |
| GET | `/plan-orders` | — (پیشنهادی: admin+) | همه‌ی سفارش‌ها |
| PUT | `/plan-orders/:id` | — (پیشنهادی: admin+) | ویرایش وضعیت، برنامه تمرینی/غذایی، بازخورد (فقط فیلدهای غیرخالی اعمال می‌شود) |
| DELETE | `/plan-orders/:id` | — (پیشنهادی: superadmin) | |

## نمونه

```bash
# ورود
curl -X POST https://fitbynazeri.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"<email>","password":"<password>"}'

# ساخت پکیج (superadmin)
curl -X POST https://fitbynazeri.com/api/packages \
  -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -d '{"title":"...","kind":"combo","duration_months":3,"price":3900000,"features":["..."],"is_active":true}'
```
