# ۰۵ — دیتابیس

SQLite، فایل `backend/nazeri_fitness.db`. جدول‌ها با GORM `AutoMigrate` ساخته می‌شوند (`database.ConnectDB`). تعریف همه‌ی مدل‌ها: `backend/models/user.go`.

## جدول‌ها

| مدل | کاربرد | فیلدهای مهم |
| :--- | :--- | :--- |
| `User` | حساب کاربری | `email` و `phone` یکتا، `password` (bcrypt، در JSON نمی‌آید)، `role`، `is_active`، soft delete |
| `BlogCategory` | دسته‌بندی مقاله | `slug` یکتا، `name` |
| `BlogPost` | مقاله | `slug` یکتا، `content` (HTML)، `category` (نام، نه ID)، `tags` (جداشده با کاما)، `meta_title`، `meta_description`، `focus_keyword`، `image_alt`، `faq_title`، `faq_items` (آرایه JSON از `{question, answer}`)، `is_published` |
| `BlogComment` | نظر روی مقاله | `post_slug`، `status` (pending/approved/rejected)، `reply`، `reply_author`، `reply_created_at` |
| `Testimonial` | نظر قهرمانان برای صفحه اصلی | `rating`، `result`، `status` (pending/approved/rejected) |
| `StudentProfile` | پرونده و صفحه عمومی قهرمان | `slug` یکتا، وزن اولیه/فعلی/هدف، قد، سن، چربی، `medals`، `bio`، `coach_notes` (محرمانه)، `status` (active/completed/paused)، `is_champion` |
| `SiteSEO` | تنظیمات SEO سایت | عنوان، توضیح، کلمات کلیدی، canonical، `robots_index`، `schema_json`، Google Analytics |
| `HeroSlide` | اسلایدهای Hero | `order_index`، عنوان + هایلایت، دکمه‌ها، `image_url`، `is_active` |
| `AboutSection` | بخش درباره (یک رکورد) | متن، اطلاعات مربی، ۴ کارت، دکمه |
| `ConsultationRequest` | درخواست مشاوره | `full_name`، `phone`، `topic`، `status` (pending/contacted/completed)، `notes` |
| `MediaFile` | کتابخانه رسانه | `file_url`، `file_type` (image/video/document)، `alt_text`، `title`، `caption`، ابعاد، `is_optimized` |
| `PlanPackage` | پکیج‌های قابل خرید | `slug` یکتا، `kind` (workout/diet/combo)، `duration_months`، `price` (تومان، عدد)، `old_price`، `features` (آرایه JSON رشته)، `popular`، `is_active`، `sort_order` |
| `PlanOrder` | سفارش + پرسشنامه + برنامه تحویلی | بخش‌های زیر |

### `PlanOrder` (مهم‌ترین جدول)

- **شناسه کاربر:** `user_id`، `user_email` (با حروف کوچک)، `user_name`، `user_phone`.
- **پکیج:** `package_slug`، `package_type`، `package_title`، `price` (**رشته**‌ی فرمت‌شده مثل «۱,۵۹۰,۰۰۰ تومان»)، `duration_months`.
- **وضعیت:** `payment_status` (`pending`/`paid`) و `status` (`reviewing` ← `preparing` ← `ready` ← `completed`).
- **پرسشنامه:** سن، جنسیت، قد، وزن، سطح فعالیت، هدف، محل تمرین، سطح تجربه، روز در هفته، آسیب‌ها، محدودیت غذایی، تعداد وعده، مکمل‌ها، `photos_json`.
- **خروجی مربی:** `workout_plan_content`، `diet_plan_content` (متن/JSON)، `workout_plan_file`، `diet_plan_file` (لینک)، `admin_feedback`، `estimated_delivery`، `coach_notes`.

## Seed (هنگام اولین بالا آمدن)

اگر داده نباشد ساخته می‌شود: ۳ کاربر نمونه (superadmin/admin/student)، تنظیمات SEO پیش‌فرض، اسلایدهای Hero، بخش درباره، قهرمانان و نظرات نمونه، مقالات و دسته‌ها، و ۳ پکیج (`workout`، `diet`، `combo`، قیمت‌ها 950,000 / 950,000 / 1,590,000 تومان). پکیج‌ها فقط وقتی جدول خالی باشد seed می‌شوند.

`syncUploadsFolder()` هم هر بار فایل‌های داخل `./uploads` را که رکورد `MediaFile` ندارند ثبت می‌کند.

## نکات

- `BlogPost.category` نام دسته را نگه می‌دارد، نه کلید خارجی. تغییر نام دسته مقاله‌ها را جدا می‌کند.
- `PlanOrder.price` رشته است؛ برای گزارش مالی باید از `package_slug` و جدول `PlanPackage` استفاده کرد یا ساختار را به عدد تغییر داد.
- هیچ ایندکس یا کلید خارجی صریح بین `PlanOrder.user_id` و `User` تعریف نشده است.
- بک‌آپ: [04-deployment.md](04-deployment.md). فایل دیتابیس در گیت نیست.
