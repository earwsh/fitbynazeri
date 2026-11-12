# مستندات پروژه Fit by Nazeri

این پوشه همه‌ی اطلاعاتی را دارد که یک برنامه‌نویس (یا ابزار هوش مصنوعی) برای فهمیدن، اجرا، توسعه و استقرار پروژه لازم دارد.

> آخرین بررسی مستندات بر اساس کد: 2026-11-12. اگر کد عوض شد، فایل مربوطه را هم به‌روز کنید.

## فهرست

| فایل | محتوا |
| :--- | :--- |
| [01-overview.md](01-overview.md) | پروژه چیست، چه امکاناتی دارد، پشته‌ی فنی |
| [02-architecture.md](02-architecture.md) | ساختار پوشه‌ها و معماری کلی |
| [03-local-development.md](03-local-development.md) | نصب و اجرای محلی |
| [04-deployment.md](04-deployment.md) | استقرار روی سرور، pm2، nginx، بک‌آپ |
| [05-database.md](05-database.md) | مدل‌های دیتابیس و seed |
| [06-api-reference.md](06-api-reference.md) | همه‌ی endpointهای API |
| [07-frontend.md](07-frontend.md) | صفحات، داشبورد، کامیپوننت‌ها |
| [08-auth-and-roles.md](08-auth-and-roles.md) | ورود، JWT، نقش‌ها |
| [09-business-flows.md](09-business-flows.md) | جریان‌های کسب‌وکار (سفارش برنامه، نظرات، ...) |
| [10-known-issues.md](10-known-issues.md) | مشکلات شناخته‌شده و کارهای باقی‌مانده (امنیتی هم) |
| [../DESIGN.md](../DESIGN.md) | سیستم دیزاین و هویت بصری (رنگ، فونت، کامپوننت) |

## شروع سریع

```bash
# بک‌اند (پورت 8080)
cd backend && go run .

# فرانت‌اند (پورت 3000)
cd frontend && npm install && npm run dev
```

جزئیات و پیش‌نیازها در [03-local-development.md](03-local-development.md).

## قبل از هر کاری بخوانید

1. [10-known-issues.md](10-known-issues.md): بیشتر endpointهای مدیریتی بدون احراز هویت‌اند و باید قبل از کار جدی اصلاح شوند.
2. `frontend/AGENTS.md`: نسخه‌ی Next.js این پروژه (16) با نسخه‌های قدیمی فرق دارد. قبل از نوشتن کد، راهنمای داخل `node_modules/next/dist/docs/` را ببینید.
