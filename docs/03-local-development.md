# ۰۳ — اجرای محلی

## پیش‌نیازها

| ابزار | نسخه | توضیح |
| :--- | :--- | :--- |
| Go | 1.25+ | طبق `backend/go.mod` |
| GCC / کامپایلر C | هر نسخه | **اجباری**؛ `go-sqlite3` نیاز به CGO دارد. در ویندوز MinGW-w64 (یا MSYS2) نصب کنید و `CGO_ENABLED=1` باشد |
| Node.js | 20+ (سرور از 22 استفاده می‌کند) | برای Next.js 16 |
| npm | همراه Node | |

## بک‌اند

```bash
cd backend
go mod download
go run .            # روی :8080 بالا می‌آید
```

- اولین اجرا فایل `nazeri_fitness.db` را کنار برنامه می‌سازد و seed می‌کند. مسیر دیتابیس و `./uploads` **نسبت به پوشه‌ای** است که برنامه در آن اجرا می‌شود؛ پس همیشه از داخل `backend/` اجرا کنید.
- پوشه‌ی `uploads/` را دستی بسازید: `mkdir uploads`.
- تست سلامت: `GET http://localhost:8080/api/health`
- `go run .` فایل `reset_password.go` را هم می‌بیند و چون هر دو `package main` هستند **خطای تکراری بودن `main` می‌دهد**. برای اجرا از `go run main.go` استفاده کنید یا `reset_password.go` را موقتاً خارج از پوشه بگذارید (راه بهتر: به `cmd/reset_password/` منتقل شود؛ [10-known-issues.md](10-known-issues.md)).

### ریست رمز یک کاربر

```bash
cd backend
go run reset_password.go
```

ایمیل و رمز جدید داخل خود فایل hardcode است؛ قبل از اجرا ویرایش کنید.

## فرانت‌اند

```bash
cd frontend
npm install
npm run dev         # http://localhost:3000
npm run build && npm start   # حالت production
npm run lint
```

### اتصال فرانت به بک‌اند محلی

کد فرانت به `https://fitbynazeri.com/api` وصل است، پس `npm run dev` بدون تغییر به **سرور production** می‌زند. برای کار محلی یکی از این‌ها:

1. در `frontend/src` جایگزینی سراسری `https://fitbynazeri.com` ← `http://localhost:8080` (موقت، کامیت نکنید).
2. (پیشنهادی برای آینده) آدرس را در یک ثابت/متغیر `NEXT_PUBLIC_API_URL` متمرکز کنید.

برای تصاویر هم URLهای ذخیره‌شده در دیتابیس به `https://fitbynazeri.com/uploads/...` اشاره دارند.

## حساب‌های نمونه (seed)

سه کاربر نمونه با نقش‌های superadmin، admin و student در `backend/database/database.go` تعریف شده‌اند (ایمیل‌ها `supervisor@`، `admin@` و `student@` با دامنه `nazeri.fit`). رمزها در همان فایل هستند. **روی سرور واقعی این رمزها باید عوض شده باشند**.
