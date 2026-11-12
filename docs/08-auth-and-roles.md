# ۰۸ — احراز هویت و نقش‌ها

## نقش‌ها (`models.Role`)

| مقدار | معنی | دسترسی در UI |
| :--- | :--- | :--- |
| `superadmin` | سوپروایزر / مدیر فنی و سئو | همه‌چیز: پکیج‌ها، Hero/About، رنگ تم، SEO، کاربران |
| `admin` | مربی ارشد | سفارش‌ها و ساخت برنامه، وبلاگ، قهرمانان، نظرات، مشاوره، رسانه |
| `student` | شاگرد/کاربر عادی | دریافت برنامه و دیدن برنامه تحویلی خودش |

## ورود

1. `POST /api/auth/login` با `{email, password}`.
2. بک‌اند کاربر را با ایمیل پیدا می‌کند و با bcrypt رمز را مقایسه می‌کند.
3. JWT با الگوریتم HS256 و claimهای `user_id`، `role`، `exp` (۷۲ ساعت) برمی‌گردد، همراه شیء `user`.
4. فرانت `nazeri_token` و `nazeri_user` را در `localStorage` ذخیره می‌کند.

ثبت‌نام عمومی: صفحه‌ی `/login` از `POST /api/users` استفاده می‌کند (نقش پیش‌فرض `student`).

## اعتبارسنجی توکن در بک‌اند

فقط `RequireSuperAdmin` (`controllers/packages.go`) دارد: هدر `Authorization: Bearer <jwt>` را می‌خواند، امضا و الگوریتم را بررسی می‌کند و `role == superadmin` را می‌طلبد. برای `GET /packages` هم همین تابع به‌صورت اختیاری صدا زده می‌شود تا superadmin پکیج‌های غیرفعال را ببیند.

هیچ middleware عمومی برای `admin` یا کاربر واردشده وجود ندارد.

## secret و رمزها

- کلید امضای JWT داخل کد (`controllers/auth.go`، متغیر `JwtSecret`) ثابت است. هر کسی که ریپو را ببیند می‌تواند توکن معتبر بسازد. **باید به متغیر محیطی منتقل و کلید فعلی عوض شود.**
- رمز پیش‌فرض کاربران ساخته‌شده بدون رمز و رمز حساب‌های seed در کد هستند؛ حتماً عوض شوند.
- ریست رمز: `backend/reset_password.go` ([03-local-development.md](03-local-development.md)).

## طراحی پیشنهادی (هنوز پیاده نشده)

- middleware `RequireAuth` (JWT معتبر) و `RequireRole("admin","superadmin")` روی گروه‌های مدیریتی در `main.go`.
- `plan-orders/user/:email` ← استخراج کاربر از توکن و حذف پارامتر ایمیل.
- `JWT_SECRET` از env و ریست همه‌ی توکن‌ها.
- محدودیت نرخ (rate limit) روی `/auth/login` و `/users`.
