# ۰۲ — معماری

## ساختار ریپو

```
fitbynazeri/
├── backend/                  # API به زبان Go
│   ├── main.go               # راه‌اندازی Fiber، middleware، تعریف همه‌ی routeها
│   ├── controllers/
│   │   ├── auth.go           # ورود، کاربران، وبلاگ، نظرات، قهرمانان، SEO، CMS، رسانه، سفارش‌ها (فایل بزرگ، ~1400 خط)
│   │   └── packages.go       # پکیج‌ها + middleware RequireSuperAdmin
│   ├── models/user.go        # همه‌ی مدل‌های GORM
│   ├── database/database.go  # اتصال SQLite، AutoMigrate، seed، همگام‌سازی uploads
│   ├── reset_password.go     # ابزار جدا برای ریست رمز (package main دوم؛ فقط با go run این فایل)
│   ├── nazeri_fitness.db     # دیتابیس (در گیت نیست)
│   └── uploads/              # فایل‌های آپلودی (در گیت نیست)
├── frontend/                 # Next.js
│   └── src/
│       ├── app/              # صفحات (App Router)
│       └── components/       # کامپوننت‌های مشترک
├── docs/                     # این مستندات
├── DESIGN.md                 # سیستم دیزاین برند
├── deploy.ps1                # اسکریپت استقرار (PowerShell)
└── logo stroke orange.png
```

## جریان کلی

```
مرورگر ──► nginx :80 ──► Next.js :3000 (pm2: nazeri-web)
   │
   └─ fetch("https://fitbynazeri.com/api/...") ──► Go Fiber :8080 (pm2: nazeri-api) ──► SQLite
                                                      └─ /uploads  (فایل استاتیک)
```

- فرانت و بک‌اند دو پروسه‌ی مستقل‌اند؛ ارتباط فقط از طریق HTTP/JSON.
- فرانت آدرس API را **hardcode** کرده است (`https://fitbynazeri.com/api/...` در تقریباً همه‌ی فایل‌هایی که fetch دارند). متغیر محیطی یا فایل کانفیگ مرکزی وجود ندارد. برای اجرای محلی راهنمای [03-local-development.md](03-local-development.md) را ببینید.
- آدرس عمومی فایل‌های آپلودی هم داخل کد Go ثابت است: `https://fitbynazeri.com/uploads/<name>` (`UploadMedia` و `syncUploadsFolder`).
- کل منطق بک‌اند بدون لایه‌ی service است؛ controllerها مستقیم با `database.DB` (GORM) کار می‌کنند.
- پاسخ‌های API معمولاً `{ "status": "success" | "error", "message": "...", ... }` هستند؛ پیام‌ها فارسی‌اند.

## نکات معماری

- **CORS:** `AllowOrigins: "*"`، متدها GET/POST/PUT/DELETE/OPTIONS.
- **حد آپلود:** BodyLimit برابر 50MB در Fiber (nginx در `deploy.ps1` روی 100MB).
- **Migration:** فقط `AutoMigrate` موقع بالا آمدن؛ ابزار migration جدا نیست.
- **Seed:** هنگام استارت اگر داده نباشد، کاربران نمونه، SEO، اسلایدها، درباره، قهرمانان، نظرات، مقالات و پکیج‌ها ساخته می‌شوند (`database.go`).
- **Soft delete:** فقط `User` فیلد `DeletedAt` دارد؛ بقیه‌ی مدل‌ها حذف واقعی می‌شوند.
