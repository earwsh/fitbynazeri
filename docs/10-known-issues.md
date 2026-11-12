# ۱۰ — مشکلات شناخته‌شده و کارهای باقی‌مانده

اولویت: 🔴 امنیتی/فوری، 🟠 مهم، 🟡 بهبود. این فهرست از بررسی کد (تا 2026-11-12) به‌دست آمده است.

## 🔴 امنیت

1. **اکثر endpointهای مدیریتی بدون احراز هویت‌اند.** فقط `POST/PUT/DELETE /packages` توکن را چک می‌کنند. بقیه (حذف/ساخت/ویرایش کاربر، تغییر نقش، حذف مقاله، SEO، سفارش‌ها، رسانه، لیست کاربران) برای هر کسی باز است. کنترل نقش فقط در UI است. ← middleware `RequireAuth` و `RequireRole` ([08-auth-and-roles.md](08-auth-and-roles.md)).
2. **افزایش سطح دسترسی:** `POST /users` بدنه‌ی `role` را می‌پذیرد؛ هر کسی می‌تواند حساب `superadmin` بسازد. نقش در ثبت‌نام عمومی باید همیشه `student` باشد.
3. **افشای داده‌ی شخصی (IDOR):** `GET /plan-orders/user/:email` و `GET /plan-orders` اطلاعات بدنی، عکس و وضعیت سلامت کاربران را بدون احراز برمی‌گردانند. `GET /consultations` شماره تلفن‌ها را می‌دهد. `coach_notes` محرمانه‌ی قهرمانان در `/students` عمومی است.
4. **JWT secret داخل کد** (`controllers/auth.go`). ← متغیر محیطی `JWT_SECRET` و تعویض کلید. رمزهای حساب‌های seed و رمز پیش‌فرض ساخت کاربر هم در کد است.
5. **آپلود:** بدون احراز و بدون فهرست سفید دقیق نوع/اندازه (نام فایل کاربر در مسیر ذخیره می‌آید). ← احراز + اعتبارسنجی MIME/پسوند + پاکسازی نام.
6. **CORS = `*`** ← فقط دامنه‌ی خودتان.
7. **پورت 8080** باز به اینترنت است؛ nginx باید تنها ورودی باشد.
8. نبود rate limit برای ورود و ثبت‌نام.
9. اگر ریپو public است: IP سرور (`deploy.ps1`) و رمزهای seed قابل مشاهده‌اند؛ ریپو private بماند یا آن‌ها پاک شوند.

## 🟠 فنی و کسب‌وکار

1. **پرداخت واقعی وجود ندارد**؛ سفارش مستقیم `paid` ثبت می‌شود ([09-business-flows.md](09-business-flows.md)).
2. **`backend/reset_password.go` و `main.go` هر دو `package main`** در یک پوشه‌اند؛ `go build .` خطای `main redeclared` می‌دهد. ← انتقال به `backend/cmd/reset_password/`.
3. **آدرس API و دامنه hardcode** در فرانت (`https://fitbynazeri.com`) و در بک‌اند برای URL آپلودها. ← `NEXT_PUBLIC_API_URL` و `PUBLIC_BASE_URL`. اجرای محلی فعلاً به سرور production می‌زند.
4. **`deploy.ps1` داده را پاک می‌کند** (`rm -rf /opt/nazeri`) و با رمز SSH فرض شده؛ ← استقرار با git + کلید SSH و بدون حذف دیتابیس/uploads ([04-deployment.md](04-deployment.md)).
5. پیام لاگ `main.go` می‌گوید «listening on https://fitbynazeri.com» در حالی که روی `:8080` گوش می‌دهد.
6. دیتابیس SQLite تک‌فایل است؛ برای رشد/چند نمونه به PostgreSQL مهاجرت کنید (`pgx` در go.mod هست ولی استفاده نمی‌شود).
7. `PlanOrder.price` رشته است؛ برای گزارش مالی مناسب نیست.
8. `BlogPost.category` نام است نه کلید خارجی.
9. بک‌آپ خودکار و مانیتورینگ تأیید نشده‌اند.
10. گواهی SSL و پیکربندی واقعی nginx (`/api`، `/uploads`) در مستندات تأیید نشده؛ [04-deployment.md](04-deployment.md).
11. تست خودکار (unit/e2e) وجود ندارد.

## 🟡 کیفیت کد

- `controllers/auth.go` (~1400 خط) باید به فایل‌های جدا (users، blog، comments، media، orders، ...) تقسیم شود.
- `frontend/src/app/dashboard/page.tsx` (~۵۰۰KB) باید به کامپوننت و فایل‌های جدا شکسته شود.
- `ioutil` منسوخ است (`os.ReadDir`)؛ بخش‌های `go.mod` که `// indirect` هستند ولی مستقیم استفاده می‌شوند را با `go mod tidy` مرتب کنید.
- فایل‌های `public/*.svg` اضافی.
- CRLF/LF: چند فایل هشدار تبدیل خط دارند؛ یک `.gitattributes` اضافه کنید.

## ترتیب پیشنهادی انجام

1. 🔴 ۱، ۲، ۴ (middleware نقش، نقش در ثبت‌نام، JWT secret)
2. 🔴 ۳، ۵، ۷
3. 🟠 ۱ (پرداخت)، ۳ (کانفیگ)، ۴ (استقرار)
4. بقیه
